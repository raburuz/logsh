export interface IEvent {
  id: string;
  event: string;
  createdAt: string;
  description: string;
  icon: string;
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