import { db } from "@/modules/db"
import { cacheKey, getCache, setCache } from "../lib/redis/cache";
import { RateLimit } from "../lib/redis/rate-limit";
import { zodValidator } from "../lib/zod/zod";
import { ApiHttpError } from "../lib/error";
import { sendNotificationToWorkspaceMembers } from "@/modules/push/server";
import { eventApiCreationSchema } from "../lib/zod/schemas/event";
import { maskEventIfBlocked } from "../lib/events";
import { IEvent } from "@/modules/feed/interface";
import { publishEvent } from "../lib/redis/pub-sub";

interface ISubscriptionCache {
  subscriptionId: string;
  eventUsage: number;
  monthlyEventQuota: number;
  rateLimitPerSecond: number;
  softLimitThreshold: number;
  hardLimitThreshold: number;
}

export const eventService = {

  subscription: async ( userId: string ): Promise<ISubscriptionCache> => {
    const cache = await getCache<ISubscriptionCache>(cacheKey.subscription(userId));
    
    if(cache.status) {
      return cache.value;
    } else {
      const subscription = await db.subscription.get_usable_subscription({ by: { userId } });

      if( !subscription ) throw new ApiHttpError({
        name: 'bad_request',
        message: 'Your current plan does not allow you to create events. Please upgrade to a paid plan to access this feature.',
        details: 'No active subscription found for this user. Please subscribe to a plan that includes event creation to use this feature.',
      });

      return {
        subscriptionId: subscription.id,
        eventUsage: subscription.usage?.events ?? 0,
        monthlyEventQuota: subscription.limits.monthlyEventQuota,
        rateLimitPerSecond: subscription.limits.rateLimitPerSecond,
        softLimitThreshold: subscription.limits.softLimitThreshold,
        hardLimitThreshold: subscription.limits.hardLimitThreshold,
      }
    }
  },

  createViaAPI: async ( data: {
    apikeyId: string,
    userId: string,
    request: Request,
  }) => {

    const { request, userId } = data;

    const subscription = await eventService.subscription(userId);

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

    const bodyRequest = await request.json();

    const { body } = await zodValidator({ body: bodyRequest }, { body: eventApiCreationSchema });

    const EVENT_QUANTITY_CONSUMED = 1;

    const event = await db.event.create({
      query: {
        where: {
          project: 'default',
          workspace: body.workspace,
          userId: userId,
        },
        data: {
          event: body.event,
          description: body.description,
          icon: body.icon,
          metadata: body.metadata,
        },
      }, 
      options: {
        consumeEventUsage: {
          where: {
            subscriptionId: subscription.subscriptionId,
          },
          query: {
            quantity: EVENT_QUANTITY_CONSUMED,
          }
        },
      },
    });

    const newSubscriptionCache: ISubscriptionCache = {
      ...subscription,
      eventUsage: subscription.eventUsage + EVENT_QUANTITY_CONSUMED,
    }

    setCache(
      cacheKey.subscription(userId),
      JSON.stringify(newSubscriptionCache),
      300, // 5 minutes in seconds
    )

    const newEvent = {
      id: event.id,
      event: body.event,
      description: body.description,
      icon: body.icon,
      createdAt: event.createdAt,
      metadata: body.metadata,
    } satisfies IEvent;

    
    const maskedEvent = maskEventIfBlocked(newEvent, isSoftLimitExceeded);

    // Publish event to Redis SSE channel
    publishEvent({
      userId: userId,
      workspaceId: event.workspaceId,
      event: maskedEvent,
    })

    if(body.notify){
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