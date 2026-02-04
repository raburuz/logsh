"use client";

import { useContext } from "react";
import { IApiKeyItem } from "../interfaces";
import { ApiContext } from "../service";

export const useApi = () => {

  const createApiKey = async ( name: string ): Promise<{ key: string; }> => {

    try {
      const response =  await fetch('/api/api-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create API key');
      }
      const resp = await response.json();
      
      return resp.data; 
      
    } catch (error) {

      console.log(error);
      return { key: '' };
      
    }

  }

  const getApiKeys = async ():  Promise<IApiKeyItem[]> => {
    try {
      const response = await fetch('/api/api-key', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }); 
      
      if (!response.ok) {
        throw new Error('Failed to create API key');
      }
      const resp = await response.json();
      
      return resp.data; 

    } catch (error) {
      console.log(error);
      return [];
    }
  }

  return {
    createApiKey,
    getApiKeys
  };
}


// Need to create a context to share state between components
export const useFetchApiKeys = () => {

  const context = useContext(ApiContext);

  if (!context) {
    throw new Error("useFetchApiKeys must be used within an ApiService");
  }

  return context;
} 