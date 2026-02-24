import z from "zod";
import { zodValidator } from "@/modules/shared/lib/zod/zod";
import { withUser } from "@/modules/shared/lib/auth/middlewares/user";
import { db } from "@/modules/db";
import { IEvent } from "@/modules/feed/interface";
import { maskEventIfBlocked } from "@/modules/shared/lib/events";

export const POST = withUser( async ({ request, user }) => {

  const data = await request.json();
  
  const { body } = await zodValidator({
    body: data,
  }, {
    body: z.strictObject({
      take: z.union([z.literal(20), z.literal(30), z.literal(50)]).default(50),
      entityId: z.uuid({ message: "entityId is not a valid uuid" }),
      nextCursor: z.object({
        createdAt: z.coerce.date({ error: 'nextCursor.createdAt has a invalid date format' }),
        id: z.uuid({ message: "nextCursor.id is not a valid uuid" }),
      }).optional()
    })
  });
  
  const events = await db.event.list({
    entity: {
      table: "workspace",
      id: body.entityId,
    },
    nextCursor: body.nextCursor, 
    query: {
      // Incremement by 1 to check if there's more data to fetch
      take: (body.take + 1),
    },
    userId: user.id
  });

  const subscription = await db.subscription.get_usable_subscription({ by: { userId: user.id } });

  let blockEventData = false;

  if( subscription ){
    blockEventData = subscription.usage.events >= (subscription.limits.monthlyEventQuota * subscription.limits.softLimitThreshold);
  }
  
  // Determine if there's a next page of data
  const haveNextPage = events.length > body.take;
  
  let items = haveNextPage
    ? events.slice(0, body.take)
    : events;

  if(blockEventData){
    items = items.map ( event => {
      return maskEventIfBlocked(event, blockEventData);
    })
  }
  
  const lastEvent = items.at(-1);
  
  return {
    events: items,
    nextCursor: haveNextPage && lastEvent ? {
      id:lastEvent.id,
      createdAt: lastEvent.createdAt.toISOString(),
    } : undefined,
  } 
  
})
