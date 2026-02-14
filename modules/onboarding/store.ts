"use client"

import { create } from 'zustand'
import { authClient } from '../auth/lib/client';

interface IPrice {
  plan: string;
  isAnnual: boolean;
}

interface IOnboardingState {
  workspace: string;
  price?: IPrice;
}

interface IOnboardingActions {
  setWorkspace: (v: string) => void;
  setPrice: (v: IPrice) => void;
  getPrice: () => IPrice | undefined;
  getWorkspace: () => string;
}

export const useOnboardingStore = create<IOnboardingState & IOnboardingActions>( 
  ( set, get ) => ({
    workspace: "",
    price: undefined,
    setWorkspace: (v: string) => set({ workspace: v.trim() }),
    setPrice: (v: IPrice) => set({ price: v }),
    getPrice: () => get().price,
    getWorkspace: () => get().workspace,
  })
)

export const useOnboardingData = () => {

  const store = useOnboardingStore( store => store );

  const markUserAsOnboarded  = async () => {
    await authClient.updateUser({ isOnboarded: true });
  }

  return {
    workspace: store.workspace,
    price: store.price,
    setWorkspace: store.setWorkspace,
    setPrice: store.setPrice,
    getWorkspace: store.getWorkspace,
    getPrice: store.getPrice,
    markUserAsOnboarded,
  }

}