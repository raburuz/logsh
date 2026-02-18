"use client"

import { create } from 'zustand'
import { useSubscriptionApi } from '@/modules/payment/hooks/use-subscription';
import { ISubscription } from '@/modules/payment/interface';
import { toast } from 'sonner';

interface ISubscriptionState {
  subscription: ISubscription | null;
}

interface ISubscriptionActions {
  setSubscription: ( subscription: ISubscription | null ) => void;
  clean: () => void;
  getSubscription: () => ISubscription | null;
}

export const useSubscriptionStore = create<ISubscriptionState & ISubscriptionActions>( ( set, get ) => ({
  subscription: null,
  setSubscription: ( subscription: ISubscription | null ) => set( { subscription } ),
  clean: () => set( { subscription: null } ),
  getSubscription: () => get().subscription,
}))

export const useSubscription = () => {
  
  const subscriptions = useSubscriptionStore( ( state ) => state );
  const api = useSubscriptionApi();
  
  const fetchSubscription = async () => {
    const data = await api.getSubscription();
    subscriptions.setSubscription(data);
  }

  const checkout = async ( props: { planName: string, isAnnual: boolean } ) => {

    if(subscriptions.getSubscription()?.plan === props.planName){
      toast.warning('You are already on this plan.');
      return;
    } 

    const data = await api.checkout( props );
    if (data?.url) {
      // Open the checkout URL in a new tab
      window.open(data.url, "_blank", 'noopener,noreferrer');
    }

  }

  return {
    subscription: subscriptions.subscription,
    getSubscription: subscriptions.getSubscription,
    checkout,
    fetchSubscription,
    clean: subscriptions.clean,
  }
}