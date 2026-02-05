"use client"

import { create } from 'zustand'
import { useSubscriptionApi } from '@/modules/payment/hooks/useSubscription';
import { ISubscription } from '@/modules/payment/interface';

interface ISubscriptionState {
  subscription?: ISubscription;
}

interface ISubscriptionActions {
  setSubscription: ( subscription: ISubscription ) => void;
  clean: () => void;
}

export const useSubscriptionStore = create<ISubscriptionState & ISubscriptionActions>( ( set ) => ({
  subscription: undefined,
  setSubscription: ( subscription: ISubscription ) => set( { subscription } ),
  clean: () => set( { subscription: undefined } ),
 }))

export const useSubscription = () => {
  
  const subscriptions = useSubscriptionStore( ( state ) => state );
  const api = useSubscriptionApi();
  
  const fetchSubscription = async () => {
    try {
      const data = await api.getSubscription();
      subscriptions.setSubscription(data);
    } catch (error) {
      subscriptions.setSubscription(null as any);
    }
  }

  return {
    subscription: subscriptions.subscription,
    fetchSubscription,
    clean: subscriptions.clean,
  }
}