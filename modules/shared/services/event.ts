import z from "zod";
import * as emoji from "node-emoji";
import { db } from "@/modules/db"
import { cacheKey, getCache, setCache } from "../lib/cache";
import { RateLimit } from "../lib/rate-limit";
import { zodValidator } from "../lib/zod";
import { workspaceValidator } from "@/modules/feed/lib/zod";
import { AppError } from "../lib/error";
import { sendNotificationToWorkspaceMembers } from "@/modules/push/server";
import { publishEvent } from "../lib/pub-sub";

interface ISubscriptionCache {
  subscriptionId: string;
  eventUsage: number;
  eventLimit: number;
  eventPerSecond: number;
}

const schema = {
  body: z.strictObject({
    event: z.string().trim().min(1, "Event name is required").max(150, "Event name must be 150 characters or less"),
    description: z.string().trim().min(1, "Description can not be a empty string")
    .max(250, "Description must be 250 characters or less").optional().default(""),
    color: z.string().trim().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Color must be a valid hex code").optional().default("#ffffff"),
    //https://www.npmjs.com/package/node-emoji
    icon: z.string()
      .trim()
      .optional()
      .default("🔥") 
      .refine((val) => {
        const result = emoji.find(val);
        return !!result
      }, {
        message: "Icon must be a valid emoji",
      }),
    workspace: workspaceValidator.name,
    notify: z.boolean().optional().default(false),
  })
}

export const eventService = {

  subscription: async ( userId: string ): Promise<ISubscriptionCache> => {
    const cache = await getCache<ISubscriptionCache>(cacheKey.subscription(userId));
    
    if(cache.status) {
      return cache.value;
    } else {
      const subscription = await db.subscription.get_usable_subscription({ by: { userId } });

      if( !subscription ) throw new AppError(
        'bad_request', 
        'Your current plan does not allow you to create events. Please upgrade to a paid plan to access this feature.'
      );

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
      throw new AppError(
        'rate_limit_exceeded', 
        'You have reached the maximum number of monthly events. Please upgrade your plan to create more events.'
      );
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

    const { body } = await zodValidator({ body: bodyRequest }, schema );

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
          color: body.color,
          icon: body.icon,
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
    await publishEvent({
      userId: userId,
      workspaceId: event.workspaceId,
      event: {
        id: event.id,
        event: body.event,
        description: body.description,
        color: body.color,
        icon: body.icon,
        createdAt: event.createdAt.toISOString(),
      },
    })

    if(body.notify){
      // Send push notifications to workspace members
      await sendNotificationToWorkspaceMembers(
        event.projectId,
        {
          type: 'event',
          data: {
            event: "user.signup.test",
            description: "New user registered",
          }
        }
      )
    }

  } 
}