"use client";

// store/usePushStore.ts
import { create } from 'zustand';
import {
  hasRequiredLibs,
  urlBase64ToUint8Array,
} from './utils/utils';
import { toast } from 'sonner';
import { PushSubscriptionDevice } from './interface';
import { deviceIdZodSchema, generateDeviceId } from './utils/device';

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
const deviceIdKey = "deviceId";

interface PushStoreState {
  deviceId: string; //current device ID
  devices: PushSubscriptionDevice[]
  permission: string;
  isCreatingSubscription: boolean;
  subscription: {
    endpoint: string;
    keys: {
      auth: string;
      p256dh: string;
    };
  } | null;
  error: {
    message: string;
    suggestedAction?: string;
  } | null;

}
interface PushStoreActions {
  //Permission
  checkPermission: () => void;

  //Subscription
  subscribe: () => Promise<void>;
  createPushSubscription: () => Promise<void>;
  unsubscribe: () => Promise<void>;

  //Service Worker
  registerDevice: () => void;
  registerSW: () => Promise<void>;
  fetchSubscriptions: () => Promise<void>;

}

export const usePushStore = create<PushStoreState & PushStoreActions>( ( set, get ) => ({
  deviceId: "",
  devices: [],
  subscription: null,
  isSupported: true,
  isCreatingSubscription: false,
  permission: "",
  error: null,
  registerDevice: () => {
    
    let existingDeviceId = localStorage.getItem(deviceIdKey);

    if(!existingDeviceId) {
      console.log("No existing device ID found, generating a new one.");
      existingDeviceId = generateDeviceId();
    }

    if (!deviceIdZodSchema.safeParse(existingDeviceId).success){
      console.warn("Existing device ID is invalid, generating a new one.");
      existingDeviceId = generateDeviceId();
    }
    
    localStorage.setItem(deviceIdKey, existingDeviceId);
    set({ deviceId: existingDeviceId });
   
  },
  registerSW: async () => {
    try {
      await navigator.serviceWorker.register('/sw.js',{
        scope: '/',
        updateViaCache: 'none',
      });
      console.log("Service worker registered successfully");
      
    } catch (error) {
      console.log("Service worker registration failed", error);
      set({ error: { message: "Service worker registration failed" } });
      return;
    }
  },
  subscribe: async () => {

    const store = get();

    console.log("Initializing push notification subscription...");

    if(!vapidPublicKey) {
      console.log("VAPID public key is required for push notifications");
      set({ error: { 
        message: "VAPID public key is required for push notifications",
        suggestedAction: "Contact support to resolve this issue."
      } });
      return;
    }

    if ( !hasRequiredLibs() ) {
      console.warn("Push notification libraries are not supported in this browser.");
      set({
        error: { 
          message: "Push notification libraries are not supported in this browser.", 
          suggestedAction: "Please update to a modern browser to enable this feature."
        } 
      });
      toast.error("Your browser does not support push notifications. Please update to a modern browser to enable this feature.");
      return;
    }

    try {

      const registration = await navigator.serviceWorker.ready;

      if (!registration){
        console.log("Service worker registration not found");
        set({ error: { message: "Service worker registration not found" } });
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      console.log("Service worker registered and push subscription created", subscription);

      set({ 
        subscription: {
          endpoint: subscription.endpoint,
          keys: {
            auth: subscription.toJSON().keys?.auth || '',
            p256dh: subscription.toJSON().keys?.p256dh || '',
          }
        }
      });
      
      store.createPushSubscription();

    } catch (error) {
      console.log("Failed to subscribe to push notifications", error);
      set({ error: { 
        message: "Failed to subscribe to push notifications", 
        suggestedAction: "Please check your network connection and try again." } });
    }
  },
  checkPermission: () => {
    const permission = Notification.permission;
    set({ permission });
  },

  createPushSubscription: async () => {
    const store = get();

    set({ isCreatingSubscription: true });

    if (store.permission === 'denied') {
      set({ error: { 
        message: "Cannot subscribe because notification permission is denied", 
        suggestedAction: "Please enable notifications in your browser settings to subscribe." 
      } });
      toast.warning("Please enable notifications in your browser settings to subscribe.");
      set({ isCreatingSubscription: false });
      return;
    }

    if(!store.subscription) {
      console.log("No push subscription available to send to server");
      set({ error: { message: "No push subscription available to send to server" } });
      set({ isCreatingSubscription: false });
      return;
    }

    const subscriptionData = {
      ...store.subscription,
      deviceId: store.deviceId,
    }

    try {
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscriptionData),
      });

      set({ error: null });
      toast.success("You can now receive push notifications!");
      console.log('Successfully subscribed to push notifications on server');
      store.fetchSubscriptions();

    } catch (error) {
      set({ error: { 
        message: "Failed to subscribe on server", 
        suggestedAction: "Please try again later or contact support." 
      } });
    }
    set({ isCreatingSubscription: false });
  },

  fetchSubscriptions: async () => {
    try {
      const response = await fetch('/api/push/subscription');
      const resp = await response.json();
      const data = resp.data as PushSubscriptionDevice[];
      set({ devices: data });
    } catch (error) {
      console.log("Failed to fetch subscriptions from server", error);
    }
  },
  unsubscribe: async () => {
    const store = get();
    try {
      await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deviceId: store.deviceId,
        }),
      });

      set({ error: null });
      toast.success("You have successfully unsubscribed from push notifications");
      console.log('Successfully unsubscribed from push notifications on server');
      store.fetchSubscriptions();

    } catch (error) {
      set({ error: { 
        message: "Failed to unsubscribe on server", 
        suggestedAction: "Please try again later or contact support." 
      } });
    }
  }

}));