// types/push-notifications.ts
export interface PushSubscription {
  endpoint: string;
  expirationTime: number | null;
  keys: {
    auth: string;
    p256dh: string;
  };
}

export type PushNotification = {
  type: 'event';
  data: {
    event: string;
    description?: string;
    body?: string;
  };
}