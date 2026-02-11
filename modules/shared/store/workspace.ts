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
  getList: () => IWorkspace[];
}

export const useWorkspaceStore = create<IWorkspaceState & IWorkspaceActions>( ( set, get ) => ({
  isLoading: true,
  list: [],
  selected: "",
  setList: ( workspaces: IWorkspace[] ) => set( { list: workspaces } ),
  setSelected: ( workspaceId: string ) => set( { selected: workspaceId } ),
  setIsLoading: ( isLoading: boolean ) => set( { isLoading } ),
  clean: () => set( { isLoading: true, list: [], selected: "" } ),
  getList: () => get().list,
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
      event.clean();
    }
    workspaces.setIsLoading(false);
  };

  const deleteWorkspaceById = async ( workspaceId: string ) => {

    // Optimistic UI update
    workspaces.setList( workspaces.list.filter( w => w.id !== workspaceId ) );
    
    // If the deleted workspace is currently selected, we need to update the selection and clear events
    if( workspaces.selected === workspaceId ) {
      
      workspaces.setSelected("");
      const wklist = workspaces.getList();

      // If there are other workspaces available, select the first one and fetch its events
      if( wklist.length >= 1){
        // Select the first workspace in the list (after deletion)
        const firstWorkspaceId = wklist[0].id;
        // Update the selected workspace and fetch events for it
        await selectWorkspaceById( firstWorkspaceId );
      } else {
        // No workspaces left, just clear the selection and events
        event.clean();
      }
    }

    await api.deleteWorkspace( workspaceId );
  };

  const selectWorkspaceById = async ( workspaceId: string ) => {
    workspaces.setSelected( workspaceId );
    event.clean();
    await event.fetchEvents( workspaceId );
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