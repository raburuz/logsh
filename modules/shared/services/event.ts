import { db } from "@/modules/db"
import { cacheKey, getCache, setCache } from "../lib/cache";
import { RateLimit } from "../lib/rate-limit";
import { zodValidator } from "../lib/zod/zod";
import { ApiHttpError } from "../lib/error";
import { sendNotificationToWorkspaceMembers } from "@/modules/push/server";
import { publishEvent } from "../lib/pub-sub";
import { eventApiCreationSchema } from "../lib/zod/schemas/event";

interface ISubscriptionCache {
  subscriptionId: string;
  eventUsage: number;
  eventLimit: number;
  eventPerSecond: number;
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
        eventUsage: subscription.usage?.events ?? 0,
        eventLimit: subscription.limits.events,
        eventPerSecond: subscription.limits.eventPerSecond,
        subscriptionId: subscription.id,
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

    if( subscription.eventUsage >= subscription.eventLimit ) {
      throw new ApiHttpError({
        name: 'rate_limit_exceeded',
        message: 'You have reached the maximum number of monthly events. Please upgrade your plan to create more events.',
        details: 'Your current subscription plan allows a maximum of ' + subscription.eventLimit + ' events per month. Please upgrade to a higher-tier plan to increase this limit and continue creating events.',
      });
    }

    // Apply rate limit using token bucket algorithm
    await RateLimit.bucket(
      `subscription_${subscription.subscriptionId}`, 
      {
        refillAmount: subscription.eventPerSecond,
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
      3600, // 1 hour in seconds
    )

    // Publish event to Redis SSE channel
    publishEvent({
      userId: userId,
      workspaceId: event.workspaceId,
      event: {
        id: event.id,
        event: body.event,
        description: body.description,
        icon: body.icon,
        createdAt: event.createdAt.toISOString(),
        metadata: body.metadata,
      },
    })

    if(body.notify){
      // Send push notifications to workspace members
      sendNotificationToWorkspaceMembers(
        event.projectId,
        {
          type: 'event',
          data: {
            event: body.event,
            description: `${body.icon} ${body.description}`,
          }
        }
      )
    }

  } 
}