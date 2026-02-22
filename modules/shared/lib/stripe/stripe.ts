import Stripe from "stripe"
import { stripe } from "@better-auth/stripe"
import { db } from "@/modules/db";
import { sendToLogsh } from "@/modules/shared/lib/logsh";
import { config } from "../../config";
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
      // Called when a subscription is successfully created via checkout
      await resetSubscriptionUsage({ subscription: { id: data.subscription.id, referenceId: data.subscription.referenceId } });
      await sendToLogsh({
        workspace: "logsh_subscriptions",
        event: "subscription.created",
        description: "A new subscription has been created in Stripe",
        notify: true,
        icon: "🟢",
        metadata: {
          provider: "stripe",
          url: "https://dashboard.stripe.com/subscriptions",
          userId: data.subscription.referenceId,
          subscriptionId: data.subscription.id,
        }
      })
    },
    onSubscriptionUpdate: async (data) => {
      // Called when a subscription is updated
      await resetSubscriptionUsage({ subscription: { id: data.subscription.id, referenceId: data.subscription.referenceId } });
      await sendToLogsh({
        workspace: "logsh_subscriptions",
        event: "subscription.updated",
        description: "A subscription has been updated in Stripe",
        notify: true,
        icon: "🔵",
        metadata: {
          provider: "stripe",
          url: "https://dashboard.stripe.com/subscriptions",
          userId: data.subscription.referenceId,
          subscriptionId: data.subscription.id,
        }
      })
    },

    onSubscriptionCancel : async (data) => {
      // Called when a subscription is canceled
      await resetSubscriptionUsage({ subscription: { id: data.subscription.id, referenceId: data.subscription.referenceId } });
      await sendToLogsh({
        workspace: "logsh_subscriptions",
        event: "subscription.canceled",
        description: "A subscription has been canceled in Stripe",
        notify: true,
        icon: "🔴",
        metadata: {
          provider: "stripe",
          url: "https://dashboard.stripe.com/subscriptions",
          userId: data.subscription.referenceId,
          subscriptionId: data.subscription.id,
        }
      })
    },
    onSubscriptionDeleted: async (data) => {
      // Called when a subscription is deleted
      await resetSubscriptionUsage({ subscription: { id: data.subscription.id, referenceId: data.subscription.referenceId } });
      await sendToLogsh({
        workspace: "logsh_subscriptions",
        event: "subscription.deleted",
        description: "A subscription has been deleted in Stripe",
        notify: true,
        icon: "⚫",
        metadata: {
          provider: "stripe",
          url: "https://dashboard.stripe.com/subscriptions",
          userId: data.subscription.referenceId,
          subscriptionId: data.subscription.id,
        }
      })
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
    await sendToLogsh({
      workspace: 'stripe_error',
      event: 'reset_usage_failed',
      description: `Failed to reset usage for subscription ${data.subscription.id} and user ${data.subscription.referenceId}`,
      icon: '❌',
      metadata: {
        userId: data.subscription.referenceId,
        subscriptionId: data.subscription.id,
        error: (error as Error).message,
      }
    })
  }
}