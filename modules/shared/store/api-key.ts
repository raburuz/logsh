"use client"

import { create } from 'zustand'
import { IApiKey } from '@/modules/api-key/interface';
import { useApi } from '@/modules/api-key/hooks/useApiKeyApi';
import { authClient } from '@/modules/auth/lib/client';

interface IApiKeyState {
  list: IApiKey[];
  newApiKey: string;
  isLoading: boolean;
}

interface IApiKeyActions {
  setList: ( list: IApiKey[] ) => void;
  setNewApiKey: ( newApiKey: string ) => void;
  setIsLoading: ( isLoading: boolean ) => void;
  clean: () => void;
}

export const useApiKeyStore = create<IApiKeyState & IApiKeyActions>( ( set ) => ({
  list: [],
  newApiKey: "",
  isLoading: true,
  setList: ( list: IApiKey[] ) => set( { list } ),
  setNewApiKey: ( newApiKey: string ) => set( { newApiKey } ),
  setIsLoading: ( isLoading: boolean ) => set( { isLoading } ),
  clean: () => set( { list: [], newApiKey: "", isLoading: true } ),
}))

export const useApiKey= () => {
  
  const apiKey = useApiKeyStore( ( state ) => state );
  const api = useApi();
  
  const fetchApikeys = async () => {
    const data = await api.getApiKeys();
    apiKey.setList(data); 
    apiKey.setIsLoading(false);
  };
  
  const deleteApiKeyById = async ( apiKeyId: string ) => {
    await authClient.apiKey.delete({
      keyId: apiKeyId
    });
    apiKey.setList( apiKey.list.filter( ( key ) => key.id !== apiKeyId ) );
  };

  const createApiKey = async ( name: string ) => {
    const newApiKey = await api.createApiKey(name);
    apiKey.setNewApiKey(newApiKey.key);
  };

  const resetNewApiKey = () => {
    apiKey.setNewApiKey("");
  };

  return {
    list: apiKey.list,
    isLoading: apiKey.isLoading,
    newApiKey: apiKey.newApiKey,
    fetchApikeys,
    createApiKey,
    resetNewApiKey,
    deleteApiKeyById,
    clean: apiKey.clean,
  }
}