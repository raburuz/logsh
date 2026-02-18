import { toast } from 'sonner';
import { IProject, IWorkspace } from "../interface";

export const useProjectApi = () => {

  const getProject = async (): Promise<IProject> => {

    try {
        const response = await fetch('/api/project', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const resp = await response.json();

      if (!response.ok) {
        throw new Error(resp.message || 'Failed to fetch project');
      }
      
      return resp.data;
    } catch (error) {
      console.log('Error fetching project:', error);
      return { id: '', name: '', workspaces: { list: [] } };
    }
  }

  const createWorkspace = async ( name: string ): Promise<IWorkspace> => {
    try {
      const response = await fetch('/api/workspace', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    const resp = await response.json();

    if (!response.ok) {
      //const errorData = await response.json();
      throw new Error(resp.message || 'Failed to create workspace');
    }

    toast.success('Workspace created successfully');
    
    return resp.data;
  } catch (error) {
    
      toast.error(error instanceof Error ? error.message : 'Failed to create workspace');
      console.log('Error creating workspace:', error);
      return { id: '', name: '' };
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

    const resp = await response.json();

    if (!response.ok) {
      throw new Error('Failed to fetch workspaces');
    }
    
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
    getProject,
    createWorkspace,
    getWorkspaceById,
    deleteWorkspace,
  }

}