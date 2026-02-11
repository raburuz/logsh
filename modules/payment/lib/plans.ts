import { IPlan } from "../interface";

export const plans: IPlan[] = [
  {
    isFree: false,
    type: 'recurring',
    id: "price_1",
    name: "Basic",
    amount: 10,
    currency: "USD",
    stripePriceId: "price_1Sw52yLJAtHe4i9X2WQNEbDl",
    interval: "month",
    features: [
      "Unlimited Workspaces",
      "25,000 events per month",
      "Support"
    ],
    limits: {
      events: 25_000,
      eventsRetentionDays: 7,
    },
    discount:{
      isActive: true,
      couponId: "fMXODZw0",
      text: "Perfect for small apps",
      amount: 7,
      porcentage: 30,
    },
    trial: {
      isActive: true,
      days: 14,
    },
    callToAction: "Start 14-day free trial",
    footer: "$0.00 due today. No card required."
  },
  {
    isRecommended: true,
    isFree: false,
    type: 'recurring',
    id: "price_2",
    name: "Pro",
    amount: 16,
    currency: "USD",
    stripePriceId: "price_2_pro",
    interval: "month",
    features: [
      "Unlimited Workspaces",
      "50,000 events per month",
      "Priority support",
    ],
    limits: {
      events: 50_000,
      eventsRetentionDays: 90,
    },
    discount: {
      isActive: true,
      couponId: "first10",
      text: "Perfect for growing apps",
      amount: 12,
      porcentage: 25,
    },
    callToAction: "Start 14-day free trial",
    footer: "$0.00 due today. No card required."
  },
  {
    isFree: false,
    type: 'recurring',
    id: "price_3",
    name: "Master",
    amount: 30,
    currency: "USD",
    stripePriceId: "price_3_master",
    interval: "month",
    features: [
      "Unlimited Workspaces",
      "150,000 events per month",
      "Priority support",
    ],
    limits: {
      events: 150_000,
      eventsRetentionDays: 365,
    },
    discount:{
      isActive: true,
      couponId: "first10",
      text: "Best value for scaling apps",
      amount: 27,
      porcentage: 10,
    },
    callToAction: "Start 14-day free trial",
    footer: "$0.00 due today. No card required."
  },
  //Most be the default plan
  {
    isFree: true,
    type: 'recurring',
    id: "price_0",
    name: "None",
    amount: 0,
    currency: "USD",
    stripePriceId: "price_0_free",
    interval: "month",
    features: [
    ],
    limits: {
      events: 0,
      eventsRetentionDays: 0,
    },
    callToAction: "Start 14-day free trial",
  },
]

//https://www.better-auth.com/docs/plugins/stripe#subscription-management
export const planListToBetterAuthPlans = () => {
  return plans
  .filter( plan => !plan.isFree )
  .map( plan => {
    return {
      name: plan.name,
      priceId: plan.stripePriceId,
      limits: plan.limits,
      freeTrial: plan.trial?.isActive ? {
        days: plan.trial.days
      } : undefined,
    }
  })
};


export const findPlanByName = ( name?: string ) => {

  if (name) {
    const plan = plans.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (plan) return plan;
  }

  return plans.find( p => p.isFree )!;
}