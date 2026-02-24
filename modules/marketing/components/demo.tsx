"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { nicePastDate } from '@/modules/shared/lib/date';
import { eventTemplates, IEventDemo } from '../data/event';
import { cn } from '@/lib/utils';
import { Activity, ChevronRight, Terminal } from 'lucide-react';
import { config } from '@/modules/shared/config';
import { ScrambleText } from '@/modules/shared/components/scramble-text';
import { dominantColorFromEmoji } from '@/modules/shared/utils/dominatColorFromEmoji';

const workspaces = eventTemplates.map(e => e.workspace).filter((v, i, a) => a.indexOf(v) === i); // Unique workspaces

// Fake data generator with workspace
const generateFakeEvent = (workspace: string) => {
  const workspaceEvents = eventTemplates.filter(e => e.workspace === workspace);
  const randomEvent = workspaceEvents[Math.floor(Math.random() * workspaceEvents.length)];
  
  return {
    id: crypto.randomUUID().slice(0, 6),
    name: randomEvent.name,
    description: randomEvent.description,
    icon: randomEvent.icon,
    createdAt: new Date().toISOString(),
    workspaceId: workspace
  };
};

export const AppDemo = () => {
  const [countEvent, setCountEvent] = useState(0)
  const [selectedWorkspace, setSelectedWorkspace] = useState(workspaces[0]);
  const [rtEvents, setRtEvents] = useState<any[]>([]);
  const [active, setActive] = useState('');

  // Simulate real-time events arriving every 3 seconds for selected workspace
  useEffect(() => {
    // Clear events when workspace changes
    setRtEvents([]);

    const time = setTimeout(() => {
      const newEvent = generateFakeEvent(selectedWorkspace);
      setRtEvents(prev => [{ event: newEvent }, ...prev.slice(0, 8)]); // Keep only latest 9 events
      setCountEvent(prev => prev + 1);
    }, 500); // Initial event after 1 second

    const interval = setInterval(() => {
      const newEvent = generateFakeEvent(selectedWorkspace);
      setRtEvents(prev => [{ event: newEvent }, ...prev.slice(0, 8)]); // Keep only latest 9 events
      setCountEvent(prev => prev + 1);
      
    }, 3000);

    return () =>{
      clearInterval(interval);
      clearTimeout(time);
    }
  }, [selectedWorkspace]);

  useEffect(() => {
    setCountEvent(0);
    setActive(selectedWorkspace);
  }, [selectedWorkspace])
  

  const renderItems = () => {
  
    
    if (rtEvents.length === 0) {
      return (
        <>
          {
            [1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="snap-start shrink-0 flex flex-row items-center gap-6">
                <div className="h-2 w-10 bg-zinc-800 rounded-md mt-2"></div>
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
      <div className='relative mt-6 h-120 overflow-hidden pb-8 px-2 rounded-xl'>
        <div className="pt-8 flex items-center gap-3 mb-6">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Activity stream
          </h2>
          <div className="flex-1 h-px bg-border" />
          <span className="text-[11px] font-mono text-muted-foreground/60 tabular-nums">
            {countEvent} new events
          </span>
        </div>
        <div className="relative space-y-3 transition-all delay-100 divide-y divide-border">
          {/* FEED */}
          <motion.div layout>
            <AnimatePresence initial={true} mode='sync'>
              {renderItems()}
            </AnimatePresence>
          </motion.div>
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
            <span>Made by: Jean Ramirez</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const EventItem = ({ event, isAnimated }: { event: IEventDemo & { createdAt: string; id: string }; isAnimated: boolean }) => {

  const time = nicePastDate(event.createdAt) || 'Unknown time';

  const eventColor = dominantColorFromEmoji(event.icon)?.hex || '#888888';

  return (
    <motion.div
      key={event.id}
      initial={isAnimated ? { opacity: 0, y: -50, scale: 0.9 } : false}
      animate={
        isAnimated
          ? {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                duration: 0.18,
                //ease: "easeOut",
              },
            }
          : false
      }
      layout="position"
    >
      <button
      type='button'
      className={cn(
        "mb-0.5 group relative flex w-full items-center gap-3.5 rounded-lg px-3.5 py-3 text-left transition-all duration-200",
      )}
      aria-label={`View ${event.name} details`}
    >

      {/* Hash ID */}
      <span 
        className="hidden w-14 shrink-0 text-right font-mono text-[10px] tabular-nums text-muted-foreground/60 sm:block"
        style={{
          color:eventColor + "99" // 60% opacity in hex
        }}
      >
        #{event.id.slice(0, 6)}
      </span>

      {/* Icon EMOJISSSS*/}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors",
        )}
        style={{
          backgroundColor: eventColor + "1A", // 1A is 10% opacity, 0A is 5% opacity
          color: eventColor
        }}
      >
        { event.icon }
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "truncate text-[13px] font-medium text-white/90",
            )}
          >
            {event.name}
          </span>
        </div>
        <p className="truncate text-[11px] leading-relaxed text-muted-foreground">
          {event.description}
        </p>
      </div>

      {/* Time */}
      <div className="flex shrink-0 items-center gap-1.5">
        <span
          className={cn(
            "font-mono text-[11px] tabular-nums text-green-500",
          )}
        >
          {time}
        </span>
        <ChevronRight
          className={cn(
            "h-3 w-3 transition-all duration-200",
          )}
        />
      </div>
    </button>
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
