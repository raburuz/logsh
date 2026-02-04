"use client"

import { useContext } from "react";
import { ISubscription } from "../interface";
import { SubscriptionContext } from "../service";

export const useSubscriptionApi = () => {

  const getSubscription = async (): Promise<ISubscription> => {

    const response = await fetch('/api/subscription', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch subscription data');
    }

    const resp = await response.json();
    
    return resp.data;

  }

  return {
    getSubscription
  }
  
}


export const useSubscription = () => {

  const subscriptionContext = useContext(SubscriptionContext);

  if (!subscriptionContext) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }

  return subscriptionContext;

};