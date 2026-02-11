"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ChevronRight, Settings, Terminal } from 'lucide-react';
import { niceDate } from '@/modules/shared/lib/date';
import { cn } from '@/lib/utils';
import { config } from '@/modules/shared/config';
import { useWorkspace } from '@/modules/shared/store/workspace';
import { useEvent } from '@/modules/shared/store/event';
import { ScrambleText } from '@/modules/shared/components/scramble-text';
import { CreateWorkspaceForm } from '../form/create';
import { WKSettings } from './settings';
import { Button } from '@/components/ui/button';
import Link from 'next/link';


export const Feed = () => {
  const workspace = useWorkspace();
  const event = useEvent();
  const [viewAllWorkspace, setViewAllWorkspace] = useState(false);

  const rtEvents = event.realTimeList.filter( e => e.workspaceId === workspace.selected );

  const loadNextEvents = async () => {
    await event.fetchEvents( workspace.selected );
  }

  const renderItems = () => {
  
    if( !event.isLoading && (!event.list[0] || event.list[0].length === 0) && rtEvents.length === 0) return <NoEvents />;
   
    return (
      <>
        <AnimatePresence initial={true} mode="wait" >  
          { rtEvents.map((event) => <EventItem key={event.event.id} event={event.event} isAnimated={true} />) }
        </AnimatePresence>
        <AnimatePresence initial={false} mode="wait" >
          { event.list.map((event) => event.map((item) => <EventItem key={item.id} event={item} isAnimated={false} />)) }
        </AnimatePresence>
        {
          event.isLoading && [1, 2, 3, 4, 5].map((index) => (
            <div key={index} className="snap-start shrink-0">
              <div className="w-full relative px-4 py-5 flex flex-col gap-1 animate-pulse rounded-r-xl">
                <div className="h-2 w-32 bg-zinc-800 rounded-md mt-2"></div>
                <div className="h-2 w-52 bg-zinc-800 rounded-md mt-2"></div>
              </div>
            </div>
          ))
        }
      </>
    );
  };

  return (
    <section className='w-full z-20 mb-8 pt-10'>
      {/* Section header */}
         <div className="flex items-center gap-2 mb-8 text-[11px] font-mono text-muted-foreground/50">
            <Terminal className="h-3 w-3" strokeWidth={1.5} />
            <span className="uppercase">sys.monitor</span>
            <span className="text-muted-foreground/20">{"/"}</span>
            <span className="uppercase text-green-500">{workspace.list.filter(wk => wk.id === workspace.selected)[0]?.name}</span>
            {
              workspace.selected && (
                <>
                  <ChevronRight className="h-3 w-3 text-muted-foreground/30" />
                  <WKSettings
                    trigger={<Settings className="w-3 h-3 text-blue-500"/>}
                    workspace={workspace.list.filter(wk => wk.id === workspace.selected)[0]}
                  />
                </>
              )
            }
          <div className="flex-1" />
          <span className="text-muted-foreground/30">v1.0.0</span>
        </div>
      <div className="flex items-center gap-3 mb-10">
        {/* Animated logo */}
        <div className="relative group">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-card border border-border transition-all duration-300 group-hover:border-muted-foreground/30">
            <Activity
              className="h-5 w-5 text-foreground transition-transform duration-300 group-hover:scale-110"
              strokeWidth={1.5}
            />
          </div>
          {/* Ring pulse on hover */}
          <div className="absolute inset-0 rounded-xl border border-foreground/5 scale-100 opacity-0 group-hover:scale-[1.35] group-hover:opacity-100 transition-all duration-700 pointer-events-none" />
        </div>
        <div>
          <div className="text-lg font-medium text-foreground leading-none tracking-tight">
            <ScrambleText text="Dashboard" delay={0} />
          </div>
          <ScrambleText 
            text="Real-time activity monitoring." 
            delay={0} 
            className="text-xs text-muted-foreground mt-1"
          />
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[10px] font-mono text-emerald-400/80 uppercase tracking-wider">
            Live
          </span>
        </div>
      </div>

      {/* Workspace Settings */}
      <div className="flex items-center justify-end gap-3 mb-6 text-xs">
          <CreateWorkspaceForm
            trigger={<span className='text-zinc-300 cursor-pointer'>New workspace</span>}
          />
          <span className='text-zinc-900'>/</span>
          <span className='text-zinc-300 cursor-pointer' onClick={()=>{ setViewAllWorkspace(!viewAllWorkspace) }}>
            { viewAllWorkspace ? "Hide rest" : "View all" }
          </span>
      </div>

      {/* Workspace Tabs */}
      <nav 
        className={cn("flex items-center gap-1 overflow-x-hidden pt-2 pb-6", viewAllWorkspace ? "flex-wrap" : "flex-nowrap")} 
        role="tablist"
      >
        {
          workspace.isLoading && [1,2,3,4].map( _ => <div key={_} className="-mt-2 w-20 px-3 h-4 py-1.5 bg-zinc-800 rounded-md animate-pulse" />)
        }
        {
          !workspace.isLoading && workspace.list.length === 0 && (<NoWorkspaces />)
        }
        { 
          workspace.list.map((wk, index) => (
            <div key={wk.id}>
              <div
                role="tab"
                aria-selected={workspace.selected === wk.id}
                onClick={() => {
                  if(workspace.selected === wk.id) return;
                  workspace.selectWorkspaceById(wk.id);
                }}
                className={cn(
                  "relative min-h-4 shrink-0 px-3 text-sm transition-all duration-200 flex items-center gap-2 text-nowrap cursor-pointer",
                  workspace.selected === wk.id
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground/70"
                )}
              >
                <span>{wk.name}</span>
                <span
                  className={cn(
                    "text-[9px] font-mono px-1 py-0.5 rounded border transition-all duration-200",
                    workspace.selected === wk.id
                      ? "border-muted-foreground/20 text-muted-foreground/50 "
                      : "border-transparent text-muted-foreground/25 group-hover:border-muted-foreground/15"
                  )}
                >
                  {index + 1}
                </span>
              </div>
            </div>
          ))
        }
      </nav>
      {/* Event List */}
      <div className='mt-6 pb-8 min-h-120 px-2 rounded-xl backdrop-blur-2xl'>
        <div className="pt-8 flex items-center gap-3 mb-6">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Activity Stream
          </h2>
          <div className="flex-1 h-px bg-border" />
          <span className="text-[11px] font-mono text-muted-foreground/60 tabular-nums">
            {rtEvents.length} new events
          </span>
        </div>
        <div className="relative space-y-3 transition-all delay-100 divide-y divide-border">
          {/* FEED */}
          {renderItems()}
          {
            event.list.length === 0 && rtEvents.length === 0 && event.isLoading && (
              <div className='absolute bottom-0 w-full h-28 bg-linear-to-t from-black to-transparent z-10'></div>
            )
          }
        </div>
        {
          event.cursor && (
            <div className="grid place-content-center pt-10">
              <span role='button' className='underline hover:text-white font-semibold text-sm cursor-pointer' onClick={loadNextEvents}>Show more</span>
            </div>
          )
        }
      </div>
      {/* Footer status */}
      <div className="mt-12 pt-6 border-t border-border/50">
        <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground/30 uppercase tracking-wider">
          <span>End of stream</span>
          <div className="flex items-center gap-3">
            <span>{config.app.name}</span>
            <span className="text-muted-foreground/15">|</span>
            <span>Runtime: Edge</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const EventItem = ({ event, isAnimated }: { event: any; isAnimated: boolean }) => {

  const time = niceDate(event.createdAt) || 'Unknown time';

  return (
    <motion.div
      key={event.id}
      layoutId={event.id}
      initial={isAnimated ? { opacity: 0, y: -50, scale: 0.8 } : false}
      animate={
        isAnimated
          ? {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                type: 'spring',
                stiffness: 400,
                damping: 30,
                mass: 1,
              },
            }
          : false
      }
      layout="preserve-aspect"
    >
      <div className="flex items-start justify-between gap-4 py-4 group">
        <div className="flex items-start gap-6 min-w-0">
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full border border-zinc-950/50"
              style={{ backgroundColor: event.color }}
              aria-hidden="true"
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">
                {event.event}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5 truncate">
                {event.description}
              </p>
            </div>
          </div>
          {/* Time / Live indicator */}
          <div className="flex items-center gap-2 shrink-0">
            {
              time === 'now' && (<LiveDot />)
            }
            <span
              className={ cn('text-xs tabular-nums font-mono', time === 'now' ? 'text-emerald-400/80' : 'text-muted-foreground/60') }
            >
              {time}
            </span>
          </div>
      </div>
    </motion.div>
  );
};

const LiveDot = () => {
  return (
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
    </span>
  )
}

const NoEvents = () => {
  return (
    <div className="w-full py-10 flex flex-col items-center justify-center gap-4">
      <span className="text-white/60 text-sm">No events found.</span>
      <span className="text-white/60 text-xs">Start performing actions in your workspace to see events here.</span>
      <Button asChild size={"xs"} >
        <Link href="/docs/get-started" target="_blank" rel="noreferrer">Documentation</Link>
      </Button>
    </div>
  )
}

const NoWorkspaces = () => {
  return (
    <div className="w-full py-6 flex flex-col items-center justify-center gap-4">
      <span className="text-white/60 text-sm">No workspaces found.</span>
      <CreateWorkspaceForm
        trigger={<Button size={"xs"}>Create one to get started.</Button>}
      />
    </div>
  )
}