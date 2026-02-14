// hooks/usePushNotifications.ts
'use client';

import { usePushStore } from '../store';


export const usePushNotification = () => {

  const pushNotification = usePushStore( ( state ) => state );

  return {
    deviceId: pushNotification.deviceId,
    devices: pushNotification.devices,
    error: pushNotification.error,
    permission: pushNotification.permission,
    isCreatingSubscription: pushNotification.isCreatingSubscription,
    //Actions
    checkPermission: pushNotification.checkPermission,

    //Subscription
    subscribe: pushNotification.subscribe,
    fetchSubscriptions: pushNotification.fetchSubscriptions,

    //Service Worker
    registerSW: pushNotification.registerSW,

    //Device
    registerDevice: pushNotification.registerDevice,
  }
};