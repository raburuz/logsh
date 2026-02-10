"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { niceDate } from '@/modules/shared/lib/date';
import { eventTemplates } from '../data';
import { cn } from '@/lib/utils';
import { Activity, Hash, Terminal } from 'lucide-react';
import { config } from '@/modules/shared/config';
import { ScrambleText } from '@/modules/shared/components/scramble-text';

const workspaces = eventTemplates.map(e => e.workspace).filter((v, i, a) => a.indexOf(v) === i); // Unique workspaces

// Fake data generator with workspace
const generateFakeEvent = (workspace: string) => {
  const workspaceEvents = eventTemplates.filter(e => e.workspace === workspace);
  const randomEvent = workspaceEvents[Math.floor(Math.random() * workspaceEvents.length)];
  
  return {
    id: `event-${Date.now()}-${Math.random()}`,
    event: randomEvent.name,
    description: randomEvent.description,
    color: randomEvent.color,
    createdAt: new Date().toISOString(),
    workspaceId: workspace
  };
};

export const EventList = () => {
  const [selectedWorkspace, setSelectedWorkspace] = useState(workspaces[0]);
  const [rtEvents, setRtEvents] = useState<any[]>([]);
  const [active, setActive] = useState('');

  // Simulate real-time events arriving every 3 seconds for selected workspace
  useEffect(() => {
    // Clear events when workspace changes
    setRtEvents([]);

    const time = setTimeout(() => {
      const newEvent = generateFakeEvent(selectedWorkspace);
      setRtEvents(prev => [{ event: newEvent }, ...prev]);
    }, 500); // Initial event after 1 second

    const interval = setInterval(() => {
      const newEvent = generateFakeEvent(selectedWorkspace);
      setRtEvents(prev => [{ event: newEvent }, ...prev]);
      
    }, 3000);

    return () =>{
      clearInterval(interval);
      clearTimeout(time);
    }
  }, [selectedWorkspace]);

  useEffect(() => {
    setActive(selectedWorkspace);
  }, [selectedWorkspace])
  

  const renderItems = () => {
  
    
    if (rtEvents.length === 0) {
      return (
        <>
          {
            [1, 2, 3, 4, 5].map((index) => (
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
    }

    return (
      <>
        {rtEvents.map((item, index) => (
          <EventItem key={item.event.id} event={item.event} isAnimated={true} />
        ))}
      </>
    );
  };

  return (
    <section className='w-full z-20 mb-8'>
      {/* Section header */}
         <div className="flex items-center gap-2 mb-8 text-[11px] font-mono text-muted-foreground/50">
          <Terminal className="h-3 w-3" strokeWidth={1.5} />
          <span className="uppercase">sys.monitor</span>
          <span className="text-muted-foreground/20">{"/"}</span>
          <span className="uppercase text-muted-foreground/60">{active}</span>
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
              <ScrambleText text="Dashboard" delay={100} />
            </div>
            <p className="text-xs text-muted-foreground/60 mt-1.5 font-mono">
              Real-time activity monitoring
            </p>
          </div>
          <div className="flex-1" />
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.05] px-2.5 py-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[10px] font-mono text-emerald-400/80 uppercase tracking-wider">
                Live
              </span>
            </div>
          </div>
      {/* Workspace Tabs */}
      <nav className="flex items-center gap-1 overflow-x-hidden pt-2 pb-6" role="tablist">
        {workspaces.map((workspace, index) => (
          <div key={workspace} className='relative'>
            <button
              key={workspace}
              role="tab"
              aria-selected={selectedWorkspace === workspace}
              onClick={() => {
                setSelectedWorkspace(workspace);
              }}
              className={cn(
                "relative shrink-0 px-3 py-1.5 text-sm transition-all duration-200 flex items-center gap-2",
                selectedWorkspace === workspace
                ? "text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground/70"
              )}
            >
              {workspace}
              <span
                className={cn(
                  "text-[9px] font-mono px-1 py-0.5 rounded border transition-all duration-200",
                  active === workspace
                    ? "border-muted-foreground/20 text-muted-foreground/50 "
                    : "border-transparent text-muted-foreground/25 group-hover:border-muted-foreground/15"
                )}
              >
                {index + 1}
              </span>
            </button>
          </div>
        ))}
      </nav>
      {/* Event List */}
      <div className='mt-6 h-120 overflow-hidden pb-8 px-2 rounded-xl backdrop-blur-2xl'>
        <div className="pt-8 flex items-center gap-3 mb-6">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Activity stream
          </h2>
          <div className="flex-1 h-px bg-border" />
          <span className="text-[11px] font-mono text-muted-foreground/60 tabular-nums">
            {rtEvents.length} new events
          </span>
        </div>
        <div className="relative space-y-3 transition-all delay-100 divide-y divide-border">
          {/* FEED */}
          <AnimatePresence initial={true} mode="wait">
            {renderItems()}
          </AnimatePresence>
        </div>
        <div className='absolute bottom-0 w-full h-28 bg-linear-to-t from-black to-transparent z-10'></div>
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
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
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
            <LiveDot />
            <span
              className='text-xs tabular-nums font-mono text-green-400'
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
