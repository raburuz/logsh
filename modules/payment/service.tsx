import { createContext, useEffect, useState } from "react";
import { ISubscription } from "./interface";
import { useSubscriptionApi } from "./hooks/useSubscription";

interface ISubscriptionContext {
  subscription: ISubscription | null;
}

export const SubscriptionContext = createContext<ISubscriptionContext | null>(null);


export const SubscriptionService = ( { children }: { children: React.ReactNode } ) => {

  const [subscription, setSubscription] = useState<ISubscription | null>(null);

  const api = useSubscriptionApi();

  useEffect(() => {    
    fetchSubscription();
  }, [])
  
  const fetchSubscription = async () => {
    try {
      const data = await api.getSubscription();
      setSubscription(data);
    } catch (error) {
      
      setSubscription(null);
    }
  }

  return (
    <SubscriptionContext.Provider value={{
      subscription
    }}>
      {children}
    </SubscriptionContext.Provider>
  )


}