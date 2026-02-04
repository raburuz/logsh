import { eq, lte, sql } from "drizzle-orm"
import { db } from "../db"
import { apiKeyTokenBucket, apiUsage } from "../schemas/app"
import { AppError } from "@/modules/shared/lib/error"
import { dayjs } from "@/modules/shared/lib/date"

export const apiQuery = {

  get_or_create_usage :  async (
    queryData: {
      data: { userId: string }
    },
  ) => {
    const { data } = queryData;
    let usage = await apiQuery.get_usage( { by: { userId: data.userId } } );

    if(!usage){
      usage = await apiQuery.create_usage( { data: { userId: data.userId } } );
    }

    return usage;
  },

  get_usage: async ( 
    queryData: { by: { userId: string } }
   ) => {
    const { by } = queryData;
    const response = await db
    .select({
      id: apiUsage.id,
      events: apiUsage.events,
      renewAt: apiUsage.renewAt
    })
    .from(apiUsage)
    .where(
      eq(apiUsage.userId, by.userId)
    )

    return response.at(0)
  },

  create_usage : async ( 
    queryData: { data: { userId: string } }
  ) => {

    const now = dayjs()
    const nextMonth = now.add(1, 'month')
    .set('minute', 0)
    .set('second', 0)
    .set('millisecond', 0);

    const { data } = queryData;
    const response = await db
    .insert(apiUsage)
    .values({
      userId: data.userId, 
      renewAt: nextMonth.toDate(),
    })
    .returning({ 
      id: apiUsage.id, 
      events: apiUsage.events, 
      renewAt: apiUsage.renewAt 
    });

    return response.at(0)
  },

  increment_usage: async ( { by, increment }: { by: { userId: string }, increment: { event: { add: number } }}) => {
    await db
    .update(apiUsage)
    .set({
      events: sql`${apiUsage.events} + ${increment.event.add}`
    })
    .where(
      eq(apiUsage.userId, by.userId)
    )
  },

  // Our cron job will update the usage based in our renewal date
  update_renewal_date_to_next_month: async ({ by }: { by: { userId: string } }) => {
    
    const now = dayjs()
    const nextMonth = now.add(1, 'month')
    .set('minute', 0)
    .set('second', 0)
    .set('millisecond', 0);
    
    await db
    .update(apiUsage)
    .set({
      renewAt: nextMonth.toDate(),
    })
    .where(
      eq(apiUsage.userId, by.userId)
    )

  },

  reset_usage: async () => {

    const now = dayjs()
    const nextMonth = now.add(1, 'month')
    .set('minute', 0)
    .set('second', 0)
    .set('millisecond', 0);

    await db
    .update(apiUsage)
    .set({
      events: 0,
      renewAt: nextMonth.toDate(),
    })
    .where(
      lte(apiUsage.renewAt, now.toDate()),
    )
  },

  create_bucket: async ( 
    queryData: { 
      by: { apiKeyId: string },
      data: {
        capacity: number, 
        refillAmount: number, 
        refillInterval: number 
      }
    } 
  ) => {

    const { by, data } = queryData;

    await db
    .insert(apiKeyTokenBucket)
    .values({
      apiKeyId: by.apiKeyId,
      capacity: data.capacity, 
      remaining: data.capacity, 
      refillAmount: data.refillAmount, 
      refillInterval: data.refillInterval, 
      lastRefillAt: dayjs().toDate(),
    });
  },

  rate_limit: async ( apiKeyId: string ) => 
    await apiRestrictions.check_bucket({ apiKeyId })

} 

export const apiRestrictions = {
  check_bucket: async ( where: { apiKeyId: string }  ) => {

    const transaction = await db.transaction( async (tx) => {

      const [ bucket ] = await tx.select({
        capacity: apiKeyTokenBucket.capacity,
        remaining: apiKeyTokenBucket.remaining,
        refillAmount: apiKeyTokenBucket.refillAmount,
        refillInterval: apiKeyTokenBucket.refillInterval,
        lastRefillAt: apiKeyTokenBucket.lastRefillAt,
      })
      .from(apiKeyTokenBucket)
      .where( eq(apiKeyTokenBucket.apiKeyId, where.apiKeyId))
      .limit(1);

      if(!bucket) throw new AppError('not_found', 'API key not found');

      const now = dayjs();
      const lastRefill = dayjs(bucket.lastRefillAt);

      // 2. Calculate how many tokens should be refilled
      const elapsedMs = now.diff(lastRefill, "millisecond");
      const intervalsPassed = Math.floor(elapsedMs / bucket.refillInterval);
      
      let newRemaining = bucket.remaining;

      if (intervalsPassed > 0) {
        newRemaining = Math.min(
          bucket.capacity,
          newRemaining + intervalsPassed * bucket.refillAmount
        );
      }

      // 3. Check if a token is available
      if (newRemaining <= 0) {
        return { allowed: false, remaining: 0 };
      }

      // 4. Consume one token
      newRemaining -= 1;

      // 5. Save updated bucket state
      await tx
        .update(apiKeyTokenBucket)
        .set({
          remaining: newRemaining,
          lastRefillAt:
            intervalsPassed > 0
              ? lastRefill.add(intervalsPassed * bucket.refillInterval, "millisecond").toDate()
              : bucket.lastRefillAt,
        })
        .where(eq(apiKeyTokenBucket.apiKeyId, where.apiKeyId));

      return { allowed: true, remaining: newRemaining };

    })

    if( !transaction.allowed ) {
      throw new AppError(
        'rate_limit_exceeded',
        'You have exceeded your API rate limit. Please upgrade your plan to continue using the API.'
      );
    } 
  }
}