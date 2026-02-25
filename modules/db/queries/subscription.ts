import { eq, sql } from "drizzle-orm";
import { subscription } from "../schemas/auth"
import { db } from "../db"
import { findPlanByName } from "@/modules/shared/lib/stripe/plans";
import { subscriptionUsage } from "../schemas/app";
import { DbTransaction } from "../interface";
import { dayjs } from "@/modules/shared/lib/date";
import { ApiHttpError } from "@/modules/shared/lib/error";

export const subscriptionQuery = {

  create_usage : async ( 
    props: { data: { subscriptionId: string } },
    options?: { tx?: DbTransaction }
  ) => {

    const { tx } = options || {};
    const dbToUse = tx ? tx : db;

    const { data } = props;
    const response = await dbToUse
    .insert(subscriptionUsage)
    .values({
      subscriptionId: data.subscriptionId, 
      events: 0,
    })
    .returning({ 
      id: subscriptionUsage.id, 
      events: subscriptionUsage.events, 
      lastEventAt: subscriptionUsage.lastEventAt, 
      lastResetAt: subscriptionUsage.lastResetAt,
    });

    const newUsage = response.at(0);

    return newUsage;
  },

  create_usage_or_throw: async ( 
    props: { data: { subscriptionId: string } },
    options?: { tx?: DbTransaction }
  ) => {

    const usage = await subscriptionQuery.create_usage(props, options);

    if(!usage) {
      throw new ApiHttpError({
        name: 'application_error',
        message: 'Failed to create subscription usage record. Please try again later.',
      })
    }

    return usage;

  },

  get_or_create_usage :  async (
    props: {
      data: { subscriptionId: string },
      options?: { tx?: DbTransaction }
    },
  ) => {
    const { data, options } = props;
    const { subscriptionId } = data;
    const { tx } = options || {};
    const dbToUse = tx ? tx : db;

    const resp = await dbToUse
    .select({
      id: subscriptionUsage.id,
      events: subscriptionUsage.events, 
      lastEventAt: subscriptionUsage.lastEventAt, 
      lastResetAt: subscriptionUsage.lastResetAt,
    })
    .from(subscriptionUsage)
    .where(
      eq(subscriptionUsage.subscriptionId, subscriptionId)
    )

    let usage = resp.at(0); 

    if(!usage) {
      usage = await subscriptionQuery.create_usage_or_throw({ 
        data: { subscriptionId }
      }, options );
    }

    return usage;
  },
  update_usage: async ( 
    { by, data }: { 
        by: { subscriptionId: string }, 
        data: { event: { quantity: number, action: 'add' | 'subtract' } }
      },
    options?: {
      tx?: DbTransaction
    }
  ) => {
  
    const { tx } = options ?? {};
    const dbToUse = tx ?? db;
    const now = dayjs();

    const operator = data.event.action === 'add' ? sql`+` : sql`-`;
      
    await dbToUse
    .update(subscriptionUsage)
    .set({
      events: sql`${subscriptionUsage.events} ${operator} ${data.event.quantity}`,
      lastEventAt: now.toDate(),
    })
    .where(
      eq(subscriptionUsage.subscriptionId, by.subscriptionId)
    )

  },

  reset_usage : async (
    props: { 
      by: { 
        subscriptionId: string,
        userId: string,
      } 
    }
  ) => {

    const { subscriptionId, userId } = props.by;

    if (subscriptionId) {
      await subscriptionQuery.reset_usage_by_subscription({
        by: { subscriptionId },
      });
      return;
    }

    if (userId) {
      await subscriptionQuery.reset_usage_by_user({
        by: { userId },
      });
      return;
    }
  },

  reset_usage_by_subscription: async (
    { by }: { by: { subscriptionId: string } },
    options?: { tx?: DbTransaction }
  ) => {
    const now = dayjs();
    const { tx } = options ?? {};
    const dbToUse = tx ?? db;

    await dbToUse
    .update(subscriptionUsage)
    .set({
      events: 0,
      lastResetAt: now.toDate(),
    })
    .where(
      eq(subscriptionUsage.subscriptionId, by.subscriptionId)
    )
  },

  reset_usage_by_user: async (
    { by }: { by: { userId: string } }
  ) => {
    const sub = await subscriptionQuery.get_usable_subscription({ by: { userId: by.userId } });

    if (!sub) {
      return;
    }

    await subscriptionQuery.reset_usage_by_subscription({
      by: { subscriptionId: sub.id }
    });
  },

  // Usable subscription means that the user has an active or trialing subscription
  get_usable_subscription: async ( { by } : { by: { userId: string }}) => {

    const res = await db.transaction( async (tx) => {

      const subs = await tx
      .select({
        id: subscription.id,
        plan: subscription.plan,
        status: subscription.status,
        stripeCustomerId: subscription.stripeCustomerId,
        stripeSubscriptionId: subscription.stripeSubscriptionId,
        periodEnd: subscription.periodEnd,
      })
      .from(subscription)
      .where(
        eq(subscription.referenceId, by.userId)
      );

      const sub = subs?.find(
        sub => 
          sub.status === 'active' || 
          sub.status === "trialing"
      )

      if(!sub){
        return null;
      }

      const usage = await subscriptionQuery.get_or_create_usage({
        data: { subscriptionId: sub.id },
        options: { tx }
      });
  
      const plan = findPlanByName(sub.plan);

      return {
        id: sub.id,
        plan: plan.name,
        usage: usage,
        limits: plan.limits,
        status: sub.status,
        stripeCustomerId: sub.stripeCustomerId,
        stripeSubscriptionId: sub.stripeSubscriptionId,
        periodEnd: sub.periodEnd,
      }

    })

    return res;
  },
}