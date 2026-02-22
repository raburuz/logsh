
export interface ISubscription {
  id: string;
  plan: string;
  status: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  periodEnd: Date | null;
  limits: IPlan['limits'];
  usage: ISubscriptionUsage;
}

export type Interval = 'monthly' | 'yearly';

export interface IPlan {
  isRecommended?: boolean;
  isFree: boolean;
  name: string;
  description: string;
  interval: {
    [key in Interval]: {
      stripePriceId: string;
      amount: number;
      discount?: {
        text: string;
        amount: number;
        percentage: number;
      };
    }
  }
  features: string[];
  limits: {
    events: number;
    eventsRetentionDays: number;
    eventPerSecond: number;
  };
  callToAction: string;
  freeTrialDays?: number;
  couponId?: string;
}
export interface ISubscriptionUsage {
  id: string;
  events: number;
  lastEventAt: Date;
  lastResetAt: Date;
}