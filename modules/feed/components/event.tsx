"use client";

import { ChevronRight, Settings } from 'lucide-react';
import { nicePastDate } from '@/modules/shared/lib/date';
import { cn } from '@/lib/utils';
import { IEvent } from '../interface';
import { dominantColorFromEmoji } from '@/modules/shared/utils/dominatColorFromEmoji';

export const EventItem = ({ event, isSelected, onSelect }: { event: IEvent, isSelected: boolean, onSelect: () => void }) => {

  const time = nicePastDate(event.createdAt) || 'Unknown time';
  const isNew = time === 'now';

  const emojiColor = dominantColorFromEmoji(event.icon);
  const eventColor = emojiColor ? emojiColor.hex : '#888888';

  return (
    <>
      <button
      type='button'
      onClick={onSelect}
      className={cn(
        "mb-0.5 group relative flex w-full items-center gap-3.5 rounded-lg border px-3.5 py-3 text-left transition-all duration-200",
        isNew
          ? "border-green-800/10 bg-green-800/5 hover:bg-green-800/10"
          : "border-transparent hover:border-zinc-900 hover:bg-zinc-900/5"
      )}
      style={{
        borderColor: isSelected ?eventColor + "4D" : undefined, // 4D is 30% opacity in hex
        backgroundColor: isSelected ?eventColor + "0D" : undefined, // 0D is 5% opacity in hex
      }}
      aria-label={`View ${event.event} details`}
    >
      {/* Left accent line for selected */}
      {isSelected && (
        <span 
          className="absolute left-0 top-2.5 bottom-2.5 w-0.5 rounded-full"
          style={{
            backgroundColor:eventColor
          }}
         />
      )}

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
          isSelected
            ? "bg-white text-black"
            : isNew
              ? "bg-primary/10 text-primary"
              : "bg-accent text-muted-foreground group-hover:text-foreground"
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
              "truncate text-[13px] font-medium",
              isSelected ? "text-white" : "text-white/90"
            )}
          >
            {event.event}
          </span>
          {isNew && (
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
            </span>
          )}
        </div>
        <p className="truncate text-[11px] leading-relaxed text-muted-foreground">
          {event.description}
        </p>
      </div>

      {/* Time */}
      <div className="flex shrink-0 items-center gap-1.5">
        <span
          className={cn(
            "font-mono text-[11px] tabular-nums",
            isNew ? "font-medium text-green-500" : "text-zinc-500"
          )}
        >
          {time}
        </span>
        <ChevronRight
          className={cn(
            "h-3 w-3 transition-all duration-200",
            isSelected
              ? "text-zinc-600 translate-x-0.5"
              : "text-zinc-700 group-hover:text-zinc-600 "
          )}
        />
      </div>
    </button>
    </>
  );
};