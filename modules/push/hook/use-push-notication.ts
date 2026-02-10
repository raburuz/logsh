// hooks/usePushNotifications.ts
'use client';

import { usePushStore } from '../store';


export const usePushNotification = () => {

  const pushNotification = usePushStore( ( state ) => state );

  return {
    error: pushNotification.error,
    permission: pushNotification.permission,
    subscribe: pushNotification.subscribe,
    registerSW: pushNotification.registerSW,
  }
};