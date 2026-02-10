"use client"

import { create } from 'zustand'
import { useEvent } from './event';
import { IWorkspace } from '@/modules/feed/interface';
import { useWorkspaceApi } from '@/modules/feed/hook/useWorkspace';

interface IWorkspaceState {
  isLoading: boolean;
  list: IWorkspace[];
  selected: string;
}

interface IWorkspaceActions {
  setList: ( workspaces: IWorkspace[] ) => void;
  setSelected: ( workspaceId: string ) => void;
  setIsLoading: ( isLoading: boolean ) => void;
  clean: () => void;
}

export const useWorkspaceStore = create<IWorkspaceState & IWorkspaceActions>( ( set ) => ({
  isLoading: true,
  list: [],
  selected: "",
  setList: ( workspaces: IWorkspace[] ) => set( { list: workspaces } ),
  setSelected: ( workspaceId: string ) => set( { selected: workspaceId } ),
  setIsLoading: ( isLoading: boolean ) => set( { isLoading } ),
  clean: () => set( { isLoading: true, list: [], selected: "" } ),
}))

export const useWorkspace = () => {
  
  const workspaces = useWorkspaceStore( ( state ) => state );
  const api = useWorkspaceApi();
  const event = useEvent();

  const fetchWorkspaces = async () => {
    workspaces.setIsLoading(true);
    const list = await api.getWorkspaces();
    workspaces.setList( list );
    if( list.length > 0 ) {
      const id = list[0].id;
      workspaces.setList(list);
      workspaces.setSelected(id);
      event.fetchEvents(id);
    } else {
      console.log(event.list)
      console.log(event.realTimeList)
      console.log(event.list[0]?.length === 0 && event.realTimeList.length === 0)
      event.clean();
    }
    workspaces.setIsLoading(false);
  };

  const deleteWorkspaceById = async ( workspaceId: string ) => {

    workspaces.setList( workspaces.list.filter( w => w.id !== workspaceId ) );

    workspaces.setSelected("");
    // Optimistic UI update
    if( workspaces.selected === workspaceId ) {

      if( workspaces.list.length > 1){
        const firstWorkspaceId = workspaces.list[0].id;
        workspaces.setSelected(firstWorkspaceId);
        event.clean();
        event.fetchEvents(firstWorkspaceId);
      }

      if( workspaces.list.length === 0 ){
        event.clean();
      }
    }

    await api.deleteWorkspace( workspaceId );
  };

  const selectWorkspaceById = ( workspaceId: string ) => {
    workspaces.setSelected( workspaceId );
    event.clean();
    event.fetchEvents( workspaceId );
  }

  const createWorkspace = async ( name: string ) => {
    await api.createWorkspace( name );
    await fetchWorkspaces();
  };

  return {
    list: workspaces.list,
    selected: workspaces.selected,
    isLoading: workspaces.isLoading,
    selectWorkspaceById,
    deleteWorkspaceById,
    fetchWorkspaces,
    createWorkspace,
    clean: workspaces.clean,
  }
}