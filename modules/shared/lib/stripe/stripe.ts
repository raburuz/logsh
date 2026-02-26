import Stripe from "stripe"
import { stripe } from "@better-auth/stripe"
import { db } from "@/modules/db";
import { sendToLogsh } from "@/modules/shared/lib/logsh";
import { config } from "../../config";
import { findPlanByName, planListToBetterAuthPlans } from "./plans";
import { sendEmail } from "../resend";
import TrialWillEndEmail from "@/emails/trial-will-end";

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
          payment_method_types: ["card", "link"],
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
  onEvent: async ( event ) => {
    // Called on any Stripe event, you can use this to log all events or trigger other actions
    switch(event.type) {

      // Trial will end reminder and refund events are important to track as they impact revenue, so we log them in Logsh with high visibility
      case "customer.subscription.trial_will_end" : {
        const subscription = event.data.object as Stripe.Subscription;

        const stripeCustomerId = subscription.customer as string;

        // Retrieve the user from our database using the Stripe customer ID
        try {
          const user = await db.user.find_by_stripe_customer_id(stripeCustomerId);

          if(!user){
            await sendToLogsh({
              workspace: "stripe_error",
              event: "user_not_found_for_subscription_trial_will_end",
              description: "A subscription trial will end event was received from Stripe, but no user was found with the corresponding Stripe customer ID",
              icon: "❌",
              notify: true,
              metadata: {
                provider: "stripe",
                url: "https://dashboard.stripe.com/subscriptions",
                stripeCustomerId,
                subscriptionId: subscription.id,
              }
            })

            return;
          }

          await sendEmail({
            to: user.email,
            from: config.email.author,
            subject: `Don't lose your events: Your ${config.app.name.toLowerCase()} trial ends soon!`,
            react: TrialWillEndEmail({
              userName: user.name || "there!",
              companyName: config.app.name.toLowerCase(),
              upgradeUrl: `${config.app.url}/pricing`,
            })
          })
  
          //Send event to Logsh
          await sendToLogsh({
            workspace: "logsh_subscriptions",
            event: "subscription.trial_will_end",
            description: "A subscription trial is about to end in Stripe",
            notify: true,
            icon: "⏰",
            metadata: {
              provider: "stripe",
              url: "https://dashboard.stripe.com/subscriptions",
              userId: subscription.metadata.userId,
              subscriptionId: subscription.id,
            }
          })
        } catch (error) {
          console.log(error);
        }

      }

      case "refund.created" : {
        const refund = event.data.object as Stripe.Refund;

        //Send event to Logsh
        await sendToLogsh({
          workspace: "logsh_payments",
          event: "refund.created",
          description: "A refund has been created in Stripe",
          notify: true,
          icon: "💸",
          metadata: {
            provider: "stripe",
            url: "https://dashboard.stripe.com/refunds",
            userId: refund.metadata?.userId,
            refundId: refund.id,
          }
        })
      }

      case "radar.early_fraud_warning.created" : {
        const fraudWarning = event.data.object as Stripe.Radar.EarlyFraudWarning;
        //Send event to Logsh
        await sendToLogsh({
          workspace: "logsh_payments",
          event: "radar.early_fraud_warning.created",
          description: "An early fraud warning has been created in Stripe",
          notify: true,
          icon: "⚠️",
          metadata: {
            provider: "stripe",
            url: "https://dashboard.stripe.com/radar/early_fraud_warnings",
            actionable: fraudWarning.actionable,
            fraudWarningId: fraudWarning.id,
            fraudType: fraudWarning.fraud_type,
          }
        })
      }

    }
  } 
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