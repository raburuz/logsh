'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { usePushStore } from '../store';
import { config } from '@/modules/shared/config';
import { deviceIdZodSchema, generateDeviceId } from '../utils/device';
import { hasRequiredLibs, urlBase64ToUint8Array } from '../utils/utils';
import { PushSubscription } from '../interface';
import { usePushNotificationApi } from './use-push-notification-api';


export const usePushNotification = () => {

  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
  const deviceIdKey = `${config.app.name}_device_id`.toLowerCase();
  const pushNotification = usePushStore( ( state ) => state );
  const api = usePushNotificationApi();
  
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isFetchingDevices, setIsFetchingDevices] = useState(false);

  const checkBrowserPermission = async () => {
    try {
      const permission = Notification.permission;
      pushNotification.setBrowserPermission(permission);
    } catch (error) {
      console.log("Failed to request notification permission", error);
    }
  }

  const registerServiceWorker = async () => {
    try {
      await navigator.serviceWorker.register('/sw.js',{
        scope: '/',
        updateViaCache: 'none',
      });
      console.log("Service worker registered successfully");
      
    } catch (error) {
      console.log("Service worker registration failed", error);  
      return;
    }
  }

  const registerDevice = async () => {
    
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
    pushNotification.setCurrentDeviceId(existingDeviceId);

  }

  const subscribe = async (data?: { shadowEffect: 'get_device_list'  }) => {

    setIsSubscribing(true);

    console.log("Initializing push notification subscription...");

    if(!vapidPublicKey) {
      console.log("VAPID public key is required for push notifications");
      setIsSubscribing(false);
      return;
    }

    if ( !hasRequiredLibs() ) {
      console.log("Push notification libraries are not supported in this browser.");
      toast.error("Your browser does not support push notifications. Please update to a modern browser to enable this feature.");
      setIsSubscribing(false);
      return;
    }

    let subs: PushSubscription | null = null;

    try {

      const registration = await navigator.serviceWorker.ready;

      if (!registration){
        console.log("Service worker registration not found");
        setIsSubscribing(false);
        return;
      }

      const previous = await registration.pushManager.getSubscription();

      if(previous) {
        // If there's an existing subscription, we need to unsubscribe it before creating a new one to ensure we get a fresh subscription object with the updated keys.
        await unsubscribe( pushNotification.getDeviceId() );
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      console.log("Service worker registered and push subscription created", subscription);
      
      subs = {
        endpoint: subscription.endpoint,
        expirationTime: subscription.expirationTime,
        keys: {
          auth: subscription.toJSON().keys?.auth || '',
          p256dh: subscription.toJSON().keys?.p256dh || '',
        }
      }
      
    } catch (error) {
      toast.error("Failed to subscribe to push notifications. Please allow notifications and try again.");
      console.log("Failed to subscribe to push notifications", error);
      setIsSubscribing(false);
      return;
    }

    if(!subs){
      console.log("Push subscription object is null");
      setIsSubscribing(false);
      return;
    }

    await api.subscribe({
      deviceId: pushNotification.getDeviceId(),
      subscription: subs,
    });

    if(data?.shadowEffect === 'get_device_list') {
      await fetchSubscribedDevices();
    }

    setIsSubscribing(false);
  }

  const unsubscribe = async ( deviceId: string ) => {

    if(!deviceId) {
      console.log("No device ID found for unsubscription");
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;

       if (!registration){
        console.log("Service worker registration not found");
        return;
      }

      const subscription = await registration.pushManager.getSubscription();

      if(subscription) {
        await subscription.unsubscribe();
        console.log("Successfully unsubscribed from push notifications on client");
      } 
      
    } catch (error) {
      console.log("Failed to unsubscribe from push notifications", error);
    }

    pushNotification.setDevices( pushNotification.devices.filter( device => device.deviceId !== deviceId ) );
    await api.unsubscribe({ deviceId });

  }

  const fetchSubscribedDevices = async () => {
    setIsFetchingDevices(true);
    const data = await api.fetchSubscribedDevices();
    pushNotification.setDevices(data.list);
    setIsFetchingDevices(false);
  }

  return {
    browserPermission: pushNotification.browserPermission,
    devices: pushNotification.devices,
    deviceId: pushNotification.currentDeviceId,
    checkBrowserPermission,
    registerServiceWorker,
    registerDevice,
    subscribe,
    unsubscribe,
    fetchSubscribedDevices,
    isCreatingSubscription: isSubscribing,
    isFetchingDevices,
    getCurrentDeviceId: pushNotification.getDeviceId,
  }
};