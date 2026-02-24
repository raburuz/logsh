export interface IEvent {
  id: string;
  event: string;
  description: string | null;
  icon: string | null;
  createdAt: Date;
  metadata: Record<string, any> | null;
}

export interface IEvents{
  events: IEvent[];
  nextCursor?: {
    id: string;
    createdAt: Date;
  };
}

export interface IEventSse {
  userId: string;
  workspaceId: string;
  event: IEvent;
}

export interface IWorkspace {
  id: string;
  name: string;
}

export interface IProject {
  id: string;
  name: string;
  workspaces: {
    list: IWorkspace[];
  };
}