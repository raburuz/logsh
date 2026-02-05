"use client"

import { ISubscription } from "../interface";

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