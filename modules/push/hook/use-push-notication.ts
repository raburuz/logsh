// hooks/usePushNotifications.ts
'use client';

import { useEffect } from 'react';
import { usePushStore } from '../store';


export const usePushNotification = () => {

  const pushNotification = usePushStore( ( state ) => state );

  useEffect(() => {
    pushNotification.checkPermission();
    pushNotification.fetchSubscriptions();
  }, [])
  

  return {
    deviceId: pushNotification.deviceId,
    devices: pushNotification.devices,
    error: pushNotification.error,
    permission: pushNotification.permission,
    isCreatingSubscription: pushNotification.isCreatingSubscription,
    subscribe: pushNotification.subscribe,
    registerSW: pushNotification.registerSW,
    registerDevice: pushNotification.registerDevice,
  }
};