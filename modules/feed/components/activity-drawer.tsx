"use client"

import { useState, useEffect } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  Hash,
  Clock,
  Terminal,
  Copy,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { IEvent } from "../interface"
import { nicePastDate } from "@/modules/shared/lib/date"
import { dominantColorFromEmoji } from "@/modules/shared/utils/dominatColorFromEmoji"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { config } from "@/modules/shared/config"

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 rounded-md border border-zinc-900/60 bg-zinc-900/30 px-2 py-1 text-[10px] font-mono text-zinc-500 transition-all hover:border-white/30 hover:text-zinc-300"
    >
      <Hash className="h-2.5 w-2.5" />
      {text}
      {copied ? (
        <Check className="ml-0.5 h-2.5 w-2.5 text-zinc-300" />
      ) : (
        <Copy className="ml-0.5 h-2.5 w-2.5 opacity-40" />
      )}
    </button>
  )
}

export function ActivityDrawer({
  event,
  open,
  onOpenChange,
}: {
  event: IEvent | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [animateIn, setAnimateIn] = useState(false);

  const time = event?.createdAt ? nicePastDate(event.createdAt) : 'Unknown time';

  useEffect(() => {
    console.log("Event changed in drawer:", event);
    if (open) {
      const timer = setTimeout(() => setAnimateIn(true), 50)
      return () => clearTimeout(timer)
    }
    setAnimateIn(false)
  }, [open, event?.id])

  if (!event) return null

  const detailEntries = Object.entries(event.metadata).filter(
    ([, v]) => v !== undefined
  ) as [string, string][]

  const color = dominantColorFromEmoji(event.icon || "❓")?.hex ?? "#ffffff";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="scanline-effect border-l border-zinc-400/10 bg-background w-full overflow-hidden p-0 sm:max-w-105"
      >
        <div className="flex h-full flex-col overflow-y-auto">
          {/* Header */}
          <SheetHeader className="gap-0 border-b border-zinc-900/60 p-0">
            {/* Colored top bar */}
            <div className="h-0.5 w-full bg-linear-to-r from-transparent via-zinc-300/60 to-transparent" />

            <div className="px-5 pt-5 pb-4">
              {/* Icon + Title */}
              <div className="flex items-start gap-3.5">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all duration-300"
                  style={{
                    backgroundColor: color + "1A",
                  }}
                >
                 {event.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <SheetTitle className="flex items-center gap-2 text-[15px] text-zinc-300 font-sans">
                    <span className="truncate">{event.event}</span>
                  </SheetTitle>
                  <SheetDescription className="mt-0.5 text-xs text-zinc-500">
                    {event.description}
                  </SheetDescription>
                </div>
              </div>

              {/* Meta row */}
              <div
                className={cn(
                  "mt-3.5 flex items-center gap-2.5 transition-all duration-300 delay-75",
                  animateIn ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                )}
              >
                <CopyButton text={event.id.slice(0, 6)} />
                <span className="flex items-center gap-1 text-[10px] text-zinc-500">
                  <Clock className="h-2.5 w-2.5" />
                  {time}
                </span>
              </div>
            </div>
          </SheetHeader>

          {/* Body content */}
          <div className="flex flex-1 flex-col gap-0 px-5 py-5">
            {/* Properties */}
            <div
              className={cn(
                "transition-all duration-300 delay-100",
                animateIn ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              )}
            >
              <div className="mb-2.5 flex items-center gap-2">
                <Terminal className="h-3 w-3 text-zinc-300/50" />
                <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-500">
                  Event metadata
                </span>
                <span className="flex-1 border-t border-dashed border-zinc-900/60" />
              </div>

              <div className="rounded-lg border border-zinc-900/60 overflow-hidden">
                {detailEntries.map(([key, value], i) => {
                  return (
                    <div
                      key={key}
                      className={cn(
                        "flex items-center gap-3 px-3.5 py-2.5",
                        i % 2 === 0 ? "bg-zinc-900/30" : "bg-transparent",
                        i < detailEntries.length - 1 && "border-b border-zinc-900/60/50"
                      )}
                    >
                      <Hash className="h-3 w-3 shrink-0 text-zinc-300/40" />
                      <span className="w-32 shrink-0 text-[11px] text-zinc-500">
                        {key}
                      </span>
                      <span className="flex-1 text-[11px] text-zinc-300/80 text-ellipsis overflow-hidden">
                        {JSON.stringify(value)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Raw event log */}
            <div
              className={cn(
                "mt-5 transition-all duration-300 delay-200",
                animateIn ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              )}
            >
              <div className="mb-2.5 flex items-center gap-2">
                <Terminal className="h-3 w-3 text-zinc-300/50" />
                <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-500">
                  Raw Payload
                </span>
                <span className="flex-1 border-t border-dashed border-zinc-900/60" />
              </div>

              <div className="relative rounded-lg border border-zinc-900/60 bg-zinc-900/30">
                {/* File tab */}
                <div className="flex items-center border-b border-zinc-900/60 px-3 py-1.5">
                  <span className="text-[10px] text-zinc-500">event.json</span>
                </div>
                <ScrollArea>
                  <pre className="p-3 text-[10px] leading-[1.7] text-zinc-500 overflow-x-hidden">
                    <code>
                      <span className="text-zinc-500/50">{"{"}</span>
                      {"\n"}
                      {"  "}<span className="text-zinc-300/70">{'"id"'}</span>
                      <span className="text-zinc-500/50">:</span>{" "}
                      <span className="text-zinc-300/80">{`"#${event.id}"`}</span>,{"\n"}
                      {"  "}<span className="text-zinc-300/70">{'"event"'}</span>
                      <span className="text-zinc-500/50">:</span>{" "}
                      <span className="text-zinc-300/80">{`"${event.event}"`}</span>,{"\n"}
                      {"  "}<span className="text-zinc-300/70">{'"description"'}</span>
                      <span className="text-zinc-500/50">:</span>{" "}
                      <span className="text-zinc-300/80">{`"${event.description}"`}</span>,{"\n"}
                      {"  "}<span className="text-zinc-300/70">{'"timestamp"'}</span>
                      <span className="text-zinc-500/50">:</span>{" "}
                      <span className="text-zinc-300/80">{`"${event.createdAt}"`}</span>,{"\n"}
                      {detailEntries.map(([k, v], i) => (
                        <span key={k+v+i}>
                          {"  "}<span className="text-zinc-300/70">{`"${k}"`}</span>
                          <span className="text-zinc-500/50">:</span>{" "}
                          <span className="text-zinc-300/80">{`"${v}"`}</span>
                          {i < detailEntries.length - 1 ? "," : ""}
                          {"\n"}
                        </span>
                      ))}
                      <span className="text-zinc-500/50">{"}"}</span>
                    </code>
                  </pre>
                  <ScrollBar orientation="horizontal"/> 
                </ScrollArea>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto border-t border-zinc-900/60 px-5 py-3">
            <div className="flex items-center justify-between text-[9px] uppercase tracking-widest text-zinc-500/40">
              <span>SYS.MONITOR</span>
              <div className="flex items-center gap-1.5">
                <span>{config.app.name}</span>
                <span>/</span>
                <span>Stream Active</span>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
