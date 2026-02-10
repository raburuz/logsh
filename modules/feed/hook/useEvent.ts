import { IEvents } from "../interface";

export const useEventApi = () => {

  const sse = async () => {

    const response = await fetch('/api/event/sse', {
      method: 'GET',
      headers: {
        'Content-Type': 'text/event-stream',
      },
      }
    );

    return response.body?.getReader();

  }

  const getEvents = async ( data: { entityId: string, nextCursor:IEvents['nextCursor']  }  ): Promise<IEvents> => {

    try {
      const response = await fetch(`/api/event/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const resp = await response.json();
      
      return resp.data;
      
    } catch (error) {
      
      console.log('Error fetching events:', error);
      return {
        events: [],
        nextCursor: undefined,
      }
    }

  }


  return {
    getEvents,
    sse,
  }

}