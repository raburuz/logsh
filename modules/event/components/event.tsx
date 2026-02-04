"use client"

import { Button } from "@/components/ui/button"
import { niceDate } from "@/modules/shared/lib/date"
import { useEvent } from "@/modules/shared/store/event"
import { useWorkspace } from "@/modules/shared/store/workspace"
import { Refresh } from "./refresh"
import { IEvent } from "../interface"

export const EventList = () => {

  const event = useEvent();
  const workspace = useWorkspace();

  const rtEvents = event.realTimeList.filter( e => e.workspaceId === workspace.selected );

  const loadNextEvents = async () => {
    
  }

  const renderItems = () => {

    if(event.isLoading) return [1,2,3,4,5].map((index) => <SkeletonEventItem key={index} />);

    if( (!event.list[0] || event.list[0].length === 0) && rtEvents.length === 0) return <NoEvents />;

    return (
      <>
        { rtEvents.map((event) => <EventItem key={event.event.id} {...event.event} />) }
        { event.list.map((event) => event.map((item) => <EventItem key={item.id} {...item} />)) }
      </>
    )

  }

  return (
    <div className="w-full my-10 p-6 border border-zinc-900 rounded-2xl bg-black backdrop-blur-md flex flex-col gap-4">
      <div className="mb-2">
        <div className="flex justify-between items-center">
          <span className="font-bold text-white">Monitoring feed</span>
          <Refresh/>
        </div>
      </div>
      <div className="space-y-3 transition-all delay-100">

        { renderItems() }

      </div>
      {
        event.cursor && (
          <div className="grid place-content-center">
            <Button onClick={loadNextEvents}>Load 50 events more</Button>
          </div>
        )
      }
    </div>
  )
}


const EventItem = ( event: IEvent ) => {
  return (
    <div className="w-full relative border-l-4 px-6 border-zinc-900 bg-zinc-900/10 py-5 flex items-center justify-between rounded-r-xl">
      <div>
        <h3 className="font-bold first-letter:uppercase text-sm text-zinc-400">{event.event}</h3>
        <p className="mt-2 text-white text-xs">{event.description}</p>
      </div>
      <div className="self-start">
        <span className="pt-0.5 block text-white/60 text-[10px] whitespace-nowrap">{niceDate(event.createdAt)}</span>
      </div>
    </div>
  )
}

const SkeletonEventItem = () => {
  return (
    <div className="snap-start shrink-0">
      <div className="w-full relative border-l-4 px-4 border-zinc-900/30 bg-zinc-900/5 py-5 flex flex-col gap-1 animate-pulse rounded-r-xl">
        <div className="h-3 w-32 bg-zinc-800 rounded-md mt-2"></div>
        <div className="h-3 w-52 bg-zinc-800 rounded-md mt-2"></div>
      </div>
    </div>
  )
}

const NoEvents = () => {
  return (
    <div className="w-full py-10 flex flex-col items-center justify-center gap-4">
      <span className="text-white/60 text-sm">No events found.</span>
      <span className="text-white/60 text-xs">Start performing actions in your workspace to see events here.</span>
    </div>
  )
}