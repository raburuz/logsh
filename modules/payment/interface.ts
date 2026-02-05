
export interface ISubscription {
  plan: IPlan; 
  subscription: {
    id: string;
    plan: string;
    status: string | null;
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
    periodEnd: Date | null;
  } | undefined;
}

export interface IPlan {
  isFree: boolean;
  id: string;
  name: string;
  amount: number;
  currency: string;
  stripePriceId: string;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    events: number;
    eventsRetentionDays: number;
  };
  callToAction: string;
  discount?: {
    isActive: boolean;
    couponId: string;
    text: string;
    amount: number;
    porcentage: number;
  };
  trial?: {
    isActive: boolean;
    days: number;
  }
}