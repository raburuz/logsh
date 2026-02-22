"use client"

import { create } from 'zustand'
import { authClient } from '@/modules/shared/lib/auth/client';

interface IPrice {
  plan: string;
  isAnnual: boolean;
}

interface IOnboardingState {
  hasPushPermission: boolean;
  workspace: string;
  price?: IPrice;
}

interface IOnboardingActions {
  setWorkspace: (v: string) => void;
  setPrice: (v: IPrice) => void;
  setHasPushPermission: (v: boolean) => void;
  getPrice: () => IPrice | undefined;
  getWorkspace: () => string;
  getHasPushPermission: () => boolean;
}

export const useOnboardingStore = create<IOnboardingState & IOnboardingActions>( 
  ( set, get ) => ({
    hasPushPermission: false,
    workspace: "",
    price: undefined,
    setWorkspace: (v: string) => set({ workspace: v }),
    setPrice: (v: IPrice) => set({ price: v }),
    setHasPushPermission: (v: boolean) => set({ hasPushPermission: v }),
    getPrice: () => get().price,
    getWorkspace: () => get().workspace,
    getHasPushPermission: () => get().hasPushPermission,
  })
)

export const useOnboardingData = () => {

  const store = useOnboardingStore( store => store );

  const markUserAsOnboarded  = async () => {
    await authClient.updateUser({ isOnboarded: true });
  }

  return {
    hasPushPermission: store.hasPushPermission,
    workspace: store.workspace,
    price: store.price,
    setWorkspace: store.setWorkspace,
    setPrice: store.setPrice,
    setHasPushPermission: store.setHasPushPermission,
    getWorkspace: store.getWorkspace,
    getPrice: store.getPrice,
    getHasPushPermission: store.getHasPushPermission,
    markUserAsOnboarded,
  }

}