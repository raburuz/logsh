import { toast } from "sonner";
import { IEvents } from "../interface";

export const useEventApi = () => {

  const sse = async () => {

    try {
      const response = await fetch('/api/event/sse', {
        method: 'GET',
        headers: {
          'Content-Type': 'text/event-stream',
        },
        }
      );

      if(!response.ok){
        throw new Error('Failed to connect to SSE endpoint');
      }
  
      return response.body?.getReader();
      
    } catch (error) {
      console.log('Error connecting to SSE endpoint:', error);
      return null;
    }


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

      const resp = await response.json();
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      return resp.data;
      
    } catch (error) {
      
      console.log('Error fetching events:', error);
      return {
        events: [],
        nextCursor: undefined,
      }
    }

  }
  const sendTestEvent = async ( data :{ body: { workspace: string } }  ): Promise<{}> => {

    try {
      const response = await fetch(`/api/event/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data.body),
      });

      const resp = await response.json();
      
      if (!response.ok) {
        throw new Error('Failed to send event to API');
      }
      
      toast.success('Event sent successfully!');

      return resp.data;
      
    } catch (error) {
      
      console.log('Error sending event to API:', error);
      return {}
    }

  }


  return {
    getEvents,
    sse,
    sendTestEvent
  }

}