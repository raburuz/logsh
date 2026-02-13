
export interface ISubscription {
  plan: IPlan; 
  usage: ISubscriptionUsage;
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
  isRecommended?: boolean;
  isFree: boolean;
  type: 'recurring' | 'one-time';
  id: string;
  name: string;
  amount: number;
  currency: string;
  stripePriceId: string;
  interval: 'month' | 'year' | "one-time";
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
  },
  footer?: string;
}
export interface ISubscriptionUsage {
  id: string;
  events: number;
  renewAt: Date;
}