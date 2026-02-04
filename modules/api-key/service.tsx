"use client";

import { createContext, useState } from "react";
import { IApiKeyItem } from "./interfaces";
import { useApi } from "./hooks/useApi";

interface IApiContext {
  apiKeys: IApiKeyItem[];
  refetch: () => Promise<void>;
  fetchApiKeys: () => Promise<void>;
  isLoading: boolean;
}

export const ApiContext = createContext<IApiContext | null>(null);

export const ApiService = ( { children }: { children: React.ReactNode } ) => {

    const api = useApi();
    const [isLoading, setIsLoading] = useState(true);
    const [apiKeys, setApiKeys] = useState<IApiKeyItem[]>([]);
  
    const fetchApiKeys = async () => {
      setApiKeys([]);
      const data = await api.getApiKeys();
      setApiKeys(data); 
      setIsLoading(false);
    };
  
    // Function to refetch api keys
    const refetch = async () => {
      await fetchApiKeys();
    };

  return (
    <ApiContext.Provider value={{ 
      apiKeys, 
      refetch,
      isLoading,
      fetchApiKeys,
    }}>
      {children}
    </ApiContext.Provider>
  )
  
}
