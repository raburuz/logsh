"use client";

import { IApiKey } from "../interface";

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

  const getApiKeys = async ():  Promise<IApiKey[]> => {
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

  const deleteApiKeyById = async ( id: string ): Promise<void> => {
    try {
      const response = await fetch(`/api/api-key/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete API key');
      }
    } catch (error) {
      console.log(error);
    }
  }

  return {
    createApiKey,
    getApiKeys,
    deleteApiKeyById
  };
}