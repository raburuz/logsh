"use client"

import { create } from 'zustand'
import { useEvent } from './event';
import { IProject } from '@/modules/feed/interface';
import { useProjectApi } from '@/modules/feed/hook/use-project-api';

interface IProjectState {
  project: IProject;
  isLoading: boolean;
  selectedWorkspaceId: string;
}

interface IProjectActions {
  setProject: ( project: IProject ) => void;
  setSelectedWorkspaceId: ( workspaceId: string ) => void;
  setIsLoading: ( isLoading: boolean ) => void;
  clean: () => void;
  getProject: () => IProject;
}

export const useProjectStore = create<IProjectState & IProjectActions>( ( set, get ) => ({
  isLoading: true,
  project: {
    id: '',
    name: '',
    workspaces: {
      list: [],
    },
  },
  selectedWorkspaceId: "",
  setProject: ( project: IProject ) => set( { project } ),
  setSelectedWorkspaceId: ( workspaceId: string ) => set( { selectedWorkspaceId: workspaceId } ),
  setIsLoading: ( isLoading: boolean ) => set( { isLoading } ),
  clean: () => set( { isLoading: true, project: { id: '', name: '', workspaces: { list: [] } }, selectedWorkspaceId: "" } ),
  getProject: () => get().project,
}))

export const useProject= () => {
  
  const project = useProjectStore( ( state ) => state );
  const api = useProjectApi();
  const event = useEvent();

  // Fetch project data and handle workspace selection logic
  const fetchProject = async () => {
    project.setIsLoading(true);
    const data = await api.getProject();
    project.setProject( data );
    const list = data.workspaces.list;

    if( list.length > 0 ) {
      const id = list[0].id;

      // If the currently selected workspace is still valid, keep it selected. Otherwise, select the first workspace in the list.
      if(id === project.selectedWorkspaceId ) {
        project.setIsLoading(false);
        return;
      }
      // Select the first workspace by default
      project.setProject(data);
      project.setSelectedWorkspaceId(id);
      event.fetchEvents(id);
    } else {
      event.clean();
    }
    project.setIsLoading(false);
  };

  const deleteWorkspaceById = async ( workspaceId: string ) => {

    // Optimistic UI update to remove the deleted workspace from the list without refetching the entire project
    project.setProject({
      ...project.getProject(),
      workspaces: {
        list: project.getProject().workspaces.list.filter( w => w.id !== workspaceId )
      }
    });
    
    // If the deleted workspace is currently selected, we need to update the selection and clear events
    if( project.selectedWorkspaceId === workspaceId ) {
      
      project.setSelectedWorkspaceId("");
      const wklist = project.getProject().workspaces.list;

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
    project.setSelectedWorkspaceId( workspaceId );
    event.clean();
    await event.fetchEvents( workspaceId );
  }

  const createWorkspace = async ( name: string, data?: { shadowEffect: 'update_workspace_list' } ) => {
    const newWorkspace = await api.createWorkspace( name );
    if( data?.shadowEffect === 'update_workspace_list' ) {
      // Optimistic UI update to add the new workspace to the list without refetching the entire project
      project.setProject({
        ...project.getProject(),
        workspaces: {
          list: [
            ...project.getProject().workspaces.list,
            newWorkspace,
          ]
        }
      });
    }
  };

  return {
    isLoading: project.isLoading,
    project: project.project,
    selectedWorkspaceId: project.selectedWorkspaceId,
    selectWorkspaceById,
    deleteWorkspaceById,
    fetchProject,
    createWorkspace,
    clean: project.clean,
  }
}