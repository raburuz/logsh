"use client"

import { IEvent, IEvents, IEventSse } from '@/modules/event/interface';
import { create } from 'zustand'
import { useEventApi } from '@/modules/event/hook/useEvent';
interface IEventState {
  list: IEvent[][];
  realTimeList: IEventSse[];
  cursor: IEvents['nextCursor'];
  isLoading: boolean;
}

interface IEventActions {
  setList: ( events: IEvent[] ) => void;
  pushRealTimeEvent: ( event: IEventSse ) => void;
  clean: () => void;
  setCursor: ( cursor: IEvents['nextCursor'] ) => void;
  setIsLoading: ( isLoading: boolean ) => void;
}

export const useEventStore = create<IEventState & IEventActions>( ( set ) => ({
  list: [],
  realTimeList: [],
  cursor: undefined,
  isLoading: true,
  setList: ( events: IEvent[] ) => set( (state) => ({ list: [ ...state.list, events ] }) ),
  pushRealTimeEvent: ( event: IEventSse ) => set( (state) =>  ({ realTimeList: [ event, ...state.realTimeList ] }) ),
  clean: () => set( { list: [], realTimeList: [], cursor: undefined, isLoading: false } ),
  setCursor: ( cursor: IEvents['nextCursor'] ) => set( { cursor } ),
  setIsLoading: ( isLoading: boolean ) => set( { isLoading } ),
}))

export const useEvent = () => {
  
  const event = useEventStore( state => state );
  const api = useEventApi();

  const delay = ( ms: number ) => new Promise( resolve => setTimeout( resolve, ms ) );

  const fetchEvents = async ( entityId: string ) => {
    event.setIsLoading(true);
    
    const events = await api.getEvents( { entityId, nextCursor: event.cursor } );
    
    await delay( 500 );

    event.setList( events.events );
    event.setCursor( events.nextCursor );
    event.setIsLoading(false);
  };

  const fetchStream = async () => {

    const reader = await api.sse();

    if(reader){

      const decoder = new TextDecoder();

      while(true){
        
        const { done, value } = await reader.read();
        if (done) {
          console.log('SSE stream closed');
          break;
        }
        
        const buffer = decoder.decode(value, { stream: true } );

        const lines = buffer.split('\n\n');

        const [ eventLine, payloadLine ] = lines[0].split('\n');
        const [, type ] = eventLine.split(':');
        const [, payload ] = payloadLine.split(': ');
          

        if(type.trim() !== 'event') continue;
  
        try {
          const eventData: IEventSse = JSON.parse(payload);
          // Append new SSE event to the list
          event.pushRealTimeEvent( eventData );
        } catch (error) {
            console.error('Error parsing SSE event data:', error);
        } 
        
      }

    }

  }
 
  return {
    list: event.list,
    realTimeList: event.realTimeList,
    cursor: event.cursor,
    isLoading: event.isLoading,
    clean: event.clean,
    fetchEvents,
    fetchStream,
  }

}