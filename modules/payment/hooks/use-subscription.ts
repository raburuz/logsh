"use client"

import { ISubscription } from "../../shared/lib/stripe/interface";

export const useSubscriptionApi = () => {

  const getSubscription = async (): Promise<ISubscription | null> => {

    try {
      
      const response = await fetch('/api/subscription', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const resp = await response.json();
      
      if (!response.ok) {
        throw new Error('Failed to fetch subscription data');
      }
      
      return resp.data;
      
    } catch (error) {
      console.log("Error fetching subscription:", error);
      return null;
    }

  }

  const checkout = async ( data: { planName: string, isAnnual: boolean } ): Promise<{ url: string } | undefined> => {

    try {
      
      const response = await fetch('/api/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( data ),
      });
  
      const resp = await response.json();
  
      if (!response.ok) {
        throw new Error('Failed to update subscription data');
      }

      return resp.data;

    } catch (error) {
      console.log("Error updating subscription:", error);
      return undefined;
    }

  }

  return {
    getSubscription,
    checkout,
  }
  
}