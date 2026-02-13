import { eq } from "drizzle-orm";
import { subscription } from "../schemas/auth"
import { db } from "../db"
import { findPlanByName } from "@/modules/payment/lib/plans";
import { apiQuery } from "./api";

export const subscriptionQuery = {

  get: async ( { by } : { by: { userId: string }}) => {

    const response = await db
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

    const usage = await apiQuery.get_or_create_usage({ data : { userId: by.userId } });
    
    const sub  = response.find(
      sub => sub.status === 'active' || sub.status === "trialing"
    )

    const plan = findPlanByName(sub?.plan);

    return {
      subscription: sub,
      plan,
      usage,
    }
  },
}