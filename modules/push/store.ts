"use client";

// store/usePushStore.ts
import { create } from 'zustand';
import { PushSubscriptionDevice } from './interface';

interface PushStoreState {
  browserPermission: NotificationPermission;
  currentDeviceId: string;
  devices: PushSubscriptionDevice[];
}
interface PushStoreActions {
  setBrowserPermission: ( permission: NotificationPermission ) => void;
  setCurrentDeviceId: ( deviceId: string ) => void;
  setDevices: ( devices: PushSubscriptionDevice[] ) => void;
  getDeviceId: () => string;
}

export const usePushStore = create<PushStoreState & PushStoreActions>( ( set, get ) => ({
  browserPermission: "default",
  currentDeviceId: "",
  devices: [],
  setBrowserPermission: ( permission: NotificationPermission ) => set({ browserPermission: permission }),
  setCurrentDeviceId: ( deviceId: string ) => set({ currentDeviceId: deviceId }),
  setDevices: ( devices: PushSubscriptionDevice[] ) => set({ devices }),
  getDeviceId: () => get().currentDeviceId,

}));