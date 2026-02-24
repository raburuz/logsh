// hooks/usePushNotifications.ts
'use client';

import { toast } from 'sonner';
import { PushSubscription, PushSubscriptionDevice } from '../interface';

export const usePushNotificationApi = () => {

  const subscribe = async (
    data: {
      deviceId: string;
      subscription: PushSubscription;
    }
  ) => {

    try {
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const resp = await response.json();

      if (!response.ok) {
        toast.error( resp.message || "Failed to subscribe to push notifications");
        console.log("Failed to subscribe to push notifications on server", resp.error);
      }

      toast.success('Subscribed to push notifications successfully');
      return resp.data;

    } catch (error) {
      console.log("Failed to subscribe to push notifications on server", error);
      return {}
    }

  }

  const unsubscribe = async ( data: { deviceId: string } ) => {
    try {
      const response = await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deviceId: data.deviceId,
        }),
      });
       const resp = await response.json();

      if (!response.ok) {
        toast.error( resp.message || "Failed to unsubscribe from push notifications");
        console.log("Failed to unsubscribe from push notifications on server", resp.error);
      }

      toast.warning('Unsubscribed from push notifications');

      return resp.data;

    } catch (error) {
      console.log("Failed to unsubscribe from push notifications on server", error);
      return {}
    }
      
  }

  const fetchSubscribedDevices = async (): Promise<{ list: PushSubscriptionDevice[] }> => {
    try {
      const response = await fetch('/api/push/subscription', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const resp = await response.json();

      if (!response.ok) {
        toast.error( resp.message || "Failed to fetch devices");
        console.log("Failed to fetch devices on server", resp.error);
      }

      return resp.data;

    } catch (error) {
      console.log("Failed to fetch devices on server", error);
      return { list: [] };
    }
  }

  return {
    subscribe,
    unsubscribe,
    fetchSubscribedDevices,
  }

}
