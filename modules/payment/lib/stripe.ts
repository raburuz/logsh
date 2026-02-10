import Stripe from "stripe"
import { stripe } from "@better-auth/stripe"
import { config } from "../../shared/config";
import { findPlanByName, planListToBetterAuthPlans } from "./plans";

export const stripeClient = new Stripe( 
  process.env.STRIPE_SECRET_KEY ?? '', 
  {
    apiVersion: "2025-12-15.clover",
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

      const coupon = findPlanByName(data.plan.name).discount?.couponId;
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
      //This happends when the user pay a sub for the first time
      const userId = data.subscription.referenceId; 
      /* try {
        await db.api.update_renewal_date_to_next_month({
          by: { 
            userId,
          },
        })
      } catch (error) {
        console.log(`Something went wrong. Cannot update renewal date for user: ${userId}, error ${error}`)
      } */
    },
    onSubscriptionUpdate: async (data) => {
      //Updates are prorated by default for better auth, so we continue normally 
    },

    onSubscriptionCancel : async (data) => {
      //Conserve the renewal date
    },

    onSubscriptionDeleted: async (data) => {
      //Conserve the renewal date
    },
  },
});