import { db } from "@/modules/db"
import { IEvent } from "@/modules/feed/interface";
import { sendNotificationToWorkspaceMembers } from "@/modules/push/server";
import { RateLimit } from "../lib/redis/rate-limit";
import { zodValidator } from "../lib/zod/zod";
import { ApiHttpError } from "../lib/error";
import { eventApiCreationSchema } from "../lib/zod/schemas/event";
import { maskEventIfBlocked } from "../lib/events";
import { publishEvent } from "../lib/redis/pub-sub";

export class ApiService {

  user: {
    id: string,
    hasUnlimitedAccess: boolean,
    subscriptionId?: string;
  };
  isSoftLimitExceeded: boolean = false;

  constructor( data: { userId: string, hasUnlimitedAccess: boolean } ){
    this.user = {
      id: data.userId,
      hasUnlimitedAccess: data.hasUnlimitedAccess,
    };
  }

  protected withLimitedApiAccess = async () => {
   
    const subs = await db.subscription.get_usable_subscription({ by: { userId: this.user.id } });

    if( !subs ) throw new ApiHttpError({
      name: 'bad_request',
      message: 'Your current plan does not allow you to create events. Please upgrade to a paid plan to access this feature.',
      details: 'No active subscription found for this user. Please subscribe to a plan that includes event creation to use this feature.',
    });

    const subscription = {
      subscriptionId: subs.id,
      eventUsage: subs.usage.events,
      monthlyEventQuota: subs.limits.monthlyEventQuota,
      rateLimitPerSecond: subs.limits.rateLimitPerSecond,
      softLimitThreshold: subs.limits.softLimitThreshold,
      hardLimitThreshold: subs.limits.hardLimitThreshold,
    }

    const isHardLimitExceeded = subscription.eventUsage >= (subscription.monthlyEventQuota * subscription.hardLimitThreshold);
    const isSoftLimitExceeded = subscription.eventUsage >= (subscription.monthlyEventQuota * subscription.softLimitThreshold);

    // Check if user has reached monthly event quota considering soft and hard limits
    if( isHardLimitExceeded ) {
      throw new ApiHttpError({
        name: 'rate_limit_exceeded',
        message: 'You have reached the maximum number of monthly events. Please upgrade your plan to create more events.',
        details: 'Your current subscription plan allows a maximum of ' + subscription.monthlyEventQuota + ' events per month. Please upgrade to a higher-tier plan to increase this limit and continue creating events.',
      });
    }

    // Apply rate limit using token bucket algorithm
    await RateLimit.bucket(
      `id:${subscription.subscriptionId}`, 
      {
        refillAmount: subscription.rateLimitPerSecond,
        refillIntervalSeg: 1,
        tokensPerRequest: 1,
        redisKeyPrefix: 'subscription',
      }
    );

    this.user.subscriptionId = subscription.subscriptionId;
    this.isSoftLimitExceeded = isSoftLimitExceeded;
    
  }

  createEvent = async ( data: { request: Request }) => {

    const { request } = data;

    if(!this.user.hasUnlimitedAccess){
      await this.withLimitedApiAccess();
    }

    const { body } = await zodValidator({ body: await request.json() }, { body: eventApiCreationSchema });

    const EVENT_QUANTITY_CONSUMED = 1;

    const event = await db.event.create({
      query: {
        where: {
          project: 'default',
          workspace: body.workspace,
          userId: this.user.id,
        },
        data: {
          event: body.event,
          description: body.description,
          icon: body.icon,
          metadata: body.metadata,
        },
      }, 
      options: {
        consumeEventUsage: this.user.subscriptionId ? {
          where: {
            subscriptionId: this.user.subscriptionId,
          },
          query: {
            quantity: EVENT_QUANTITY_CONSUMED,
          }
        }: false,
      },
    });

    const newEvent = {
      id: event.id,
      event: body.event,
      description: body.description,
      icon: body.icon,
      createdAt: event.createdAt,
      metadata: body.metadata,
    } satisfies IEvent;

    this.sendEvent({
      event: { ...newEvent, userId: this.user.id, projectId: event.projectId, workspaceId: event.workspaceId },
      mustBeHidden: this.isSoftLimitExceeded,
      mustSendNotification: body.notify,
    })

  }
  
  protected sendEvent = async (data: { event: IEvent & { userId: string, projectId: string, workspaceId: string }, mustBeHidden: boolean, mustSendNotification: boolean }) => {

    const { event, mustBeHidden, mustSendNotification } = data;
    
    const maskedEvent = maskEventIfBlocked(event, mustBeHidden);
  
    // Publish event to Redis SSE channel
    publishEvent({
      userId: event.userId,
      workspaceId: event.workspaceId,
      event: maskedEvent,
    })
  
    if(mustSendNotification){
      // Send push notifications to workspace members
      sendNotificationToWorkspaceMembers(
        event.projectId,
        {
          type: 'event',
          data: {
            event: `${maskedEvent.icon} ${maskedEvent.event}`,
            description: maskedEvent.description ?? '',
          }
        }
      )
    }
  }
}