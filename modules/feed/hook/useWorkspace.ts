import { toast } from 'sonner';
import { IWorkspace } from "../interface";

export const useWorkspaceApi = () => {


  const getWorkspaces = async (): Promise<IWorkspace[]> => {

    try {
        const response = await fetch('/api/workspace', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch workspaces');
      }

      const resp = await response.json();
      
      return resp.data;
    } catch (error) {
      console.log('Error fetching workspaces:', error);
      return [];
    }
  }

  const createWorkspace = async ( name: string ): Promise<void> => {
    try {
      const response = await fetch('/api/workspace', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      //const errorData = await response.json();
      throw new Error('Failed to create workspace');
    }
    
    return;
  } catch (error) {
    
      toast.error(error instanceof Error ? error.message : 'Failed to create workspace');
      console.log('Error creating workspace:', error);
      return;
    }
  }

  const getWorkspaceById = async ( workspaceId: string ): Promise<IWorkspace | null> => {

    try {
      const response = await fetch(`/api/workspace/${workspaceId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch workspaces');
    }
    
    const resp = await response.json();
    
    return resp.data;
  } catch (error) {
    console.log('Error fetching workspace by ID:', error);
    return null;
    }
    
  }

  const deleteWorkspace = async ( workspaceId: string ): Promise<void> => {
    try {
      const response = await fetch(`/api/workspace/${workspaceId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete workspace');
    }
    return;
    } catch (error) {
      console.log('Error deleting workspace:', error);
      return;
    }
  }

  return {
    createWorkspace,
    getWorkspaces,
    getWorkspaceById,
    deleteWorkspace,
  }

}