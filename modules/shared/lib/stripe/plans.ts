import { isProduction } from "@/modules/shared/utils/constraint";
import { IPlan } from "./interface";

export const defaultPlan: IPlan = {
  isFree: true,
  name: "Free",
  description: "For testing and small projects.",
  interval: {
    monthly: {
      stripePriceId: "",
      amount: 0,
    },
    yearly: {
      stripePriceId: "",
      amount: 0,
    }
  },
  features: [],
  limits: {
    events: 0,
    eventsRetentionDays: 0,
    eventPerSecond: 0,
  },
  freeTrialDays: 0,
  callToAction: "",
};

export const plans: IPlan[] = [
  {
    isFree: false,
    name: "Basic",
    description: "For side projects and experimentation.",
    interval: {
      monthly: {
        stripePriceId: isProduction ? "price_1T3h0KLJAtHe4i9XHpjbRGDZ" : "price_1Sw52yLJAtHe4i9X2WQNEbDl",
        amount: 10,
      },
      yearly: {
        stripePriceId: isProduction ? "price_1T3h5DLJAtHe4i9XUlIWrcaT" : "price_1Sw52yLJAtHe4i9X2WQNEbDl",
        amount: 100,
        discount: {
          text: "Save $20 with annual billing",
        }
      }
    },
    features: [
      "Unlimited workspaces",
      "25,000 events / month",
      "7-day event retention",
      "Basic support"
    ],
    limits: {
      events: 25_000,
      eventsRetentionDays: 7,
      eventPerSecond: 100,
    },
    freeTrialDays: 14,
    callToAction: "Start 14-day free trial",
  },
  {
    isFree: false,
    name: "Pro",
    isRecommended: true,
    description: "For growing teams that need full visibility.",
    interval: {
      monthly: {
        stripePriceId: isProduction ? "price_1T3hUFLJAtHe4i9XVXruZ2U5" : "price_1Sw52yLJAtHe4i9X2WQNEbDl",
        amount: 19,
      },
      yearly: {
        stripePriceId: isProduction ? "price_1T3hUZLJAtHe4i9XN2mts5vz" : "price_1Sw52yLJAtHe4i9X2WQNEbDl",
        amount: 190,
        discount: {
          text: "Save $38 with annual billing",
        }
      }
    },
    features: [
      "Unlimited workspaces",
      "100,000 events / month",
      "Unlimited API keys",
      "90-day event retention",
      "Push notifications",
      "Priority support"
    ],
    limits: {
      events: 100_000,
      eventsRetentionDays: 90,
      eventPerSecond: 1000,
    },
    freeTrialDays: 14,
    callToAction: "Start 14-day free trial",
  },
  {
    isFree: false,
    name: "Scale",
    description: "For high-volume products at any stage.",
    interval: {
      monthly: {
        stripePriceId: isProduction ? "price_1T3hV7LJAtHe4i9XB0PcIK09" : "price_1Sw52yLJAtHe4i9X2WQNEbDl",
        amount: 79,
      },
      yearly: {
        stripePriceId: isProduction ? "price_1T3hVWLJAtHe4i9XUOgP1k5F" : "price_1Sw52yLJAtHe4i9X2WQNEbDl",
        amount: 790,
        discount: {
          text: "Save $158 with annual billing",
        }
      }
    },
    features: [
      "Unlimited workspaces",
      "1,000,000 events / month",
      "Unlimited API keys",
      "365-day event retention",
      "Push notifications",
      "Dedicated support"
    ],
    limits: {
      events: 1_000_000,
      eventsRetentionDays: 365,
      eventPerSecond: 5000,
    },
    freeTrialDays: 14,
    callToAction: "Start 14-day free trial",
  },
  
]

//https://www.better-auth.com/docs/plugins/stripe#subscription-management
export const planListToBetterAuthPlans = () => {
  return plans
  .filter( plan => !plan.isFree )
  .map( plan => {
    //https://www.better-auth.com/docs/plugins/stripe#plan-configuration
    return {
      name: plan.name,
      priceId: plan.interval.monthly.stripePriceId,
      annualDiscountPriceId: plan.interval.yearly.stripePriceId,
      limits: plan.limits,
      freeTrial: plan.freeTrialDays ? {
        days: plan.freeTrialDays,
      } : undefined
    }
  })
};


export const findPlanByName = ( name?: string ) => {

  if (name) {
    const plan = plans.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (plan) return plan;
  }

  //This could break the code when there is no free plan, we need to return something
  return plans.find( p => p.isFree ) || defaultPlan;
}