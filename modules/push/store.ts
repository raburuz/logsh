"use client";

// store/usePushStore.ts
import { create } from 'zustand';

interface PushStoreState {
  browserPermission: NotificationPermission;
  currentDeviceId: string;
  devices: any[];
}
interface PushStoreActions {
  setBrowserPermission: ( permission: NotificationPermission ) => void;
  setCurrentDeviceId: ( deviceId: string ) => void;
  setDevices: ( devices: any[] ) => void;
  getDeviceId: () => string;
}

export const usePushStore = create<PushStoreState & PushStoreActions>( ( set, get ) => ({
  browserPermission: "default",
  currentDeviceId: "",
  devices: [],
  setBrowserPermission: ( permission: NotificationPermission ) => set({ browserPermission: permission }),
  setCurrentDeviceId: ( deviceId: string ) => set({ currentDeviceId: deviceId }),
  setDevices: ( devices: any[] ) => set({ devices }),
  getDeviceId: () => get().currentDeviceId,

}));