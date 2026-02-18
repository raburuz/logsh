import Stripe from "stripe"
import { stripe } from "@better-auth/stripe"
import { db } from "@/modules/db";
import { logsh } from "@/modules/shared/lib/logsh";
import { config } from "../../shared/config";
import { findPlanByName, planListToBetterAuthPlans } from "./plans";

export const stripeClient = new Stripe( 
  process.env.STRIPE_SECRET_KEY ?? '', 
  {
    apiVersion: "2026-01-28.clover",
    appInfo: {
      name: config.app.name,
      version: config.app.version,
    }
  }
);

//Documentation https://www.better-auth.com/docs/plugins/stripe
export const stripePlugin = stripe({
  stripeClient,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? '',
  createCustomerOnSignUp: true,
  subscription: {
    enabled: true,
    plans: planListToBetterAuthPlans(),
    getCheckoutSessionParams(data, ctx) {

      data.plan.annualDiscountLookupKey

      const coupon = findPlanByName(data.plan.name)?.couponId;
      //https://docs.stripe.com/billing/subscriptions/coupons
      const discounts = coupon ? [{ coupon }] : undefined;

      return {
        params: {
          //allow_promotion_codes: true,
          tax_id_collection: {
            enabled: true
          },
          billing_address_collection: "required",
          payment_method_types: ["card", "paypal", "link"],
          discounts,
          // Dont ask for payment method if the plan has a free trial (perfect for freemium plans)
          payment_method_collection: "if_required"
        }
      }
    },  
    onSubscriptionComplete: async ( data ) => {
      //This happends when the user pay a sub for the first time or when a trial end and the user is converted to a paid sub
      await resetSubscriptionUsage({ subscription: { id: data.subscription.id, referenceId: data.subscription.referenceId } });
    },
    onSubscriptionUpdate: async (data) => {
      //This can happend when the user change plan or when the subscription is renewed
      await resetSubscriptionUsage({ subscription: { id: data.subscription.id, referenceId: data.subscription.referenceId } });
    },

    onSubscriptionCancel : async (data) => {
      // This can happend when the user cancel the sub or when the sub is cancelled by Stripe because of payment failure for example
      await resetSubscriptionUsage({ subscription: { id: data.subscription.id, referenceId: data.subscription.referenceId } });
    },

    onSubscriptionDeleted: async (data) => {
      // This can happend when the subscription is deleted, either by the user or by Stripe
      await resetSubscriptionUsage({ subscription: { id: data.subscription.id, referenceId: data.subscription.referenceId } });
    }
  },
});

export const resetSubscriptionUsage = async ( data: { subscription: { id: string, referenceId: string } } ) => {
  try {
    await db.subscription.reset_usage({
      by: {
        subscriptionId: data.subscription.id,
        userId: data.subscription.referenceId,
      }
    })
  } catch (error) {
    await logsh({
      workspace: 'stripe_error',
      event: 'reset_usage_failed',
      description: `Failed to reset usage for subscription ${data.subscription.id} and user ${data.subscription.referenceId}`,
      color: '#ff0000',
    })
  }
}