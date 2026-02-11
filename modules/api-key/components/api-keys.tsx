"use client"
import { useState } from "react";
import Link from "next/link";
import { KeyRound } from "lucide-react";
import { niceDate } from "@/modules/shared/lib/date";
import { useApiKey } from "@/modules/shared/store/api-key";
import { ScrambleText } from "@/modules/shared/components/scramble-text";
import { CreateApiKeyForm } from "../forms/create"
import { IApiKey } from "../interface";
import { Settings } from "./settings";
import { cn } from "@/lib/utils";

export const ApiKeys = () => {

  const { list, isLoading } = useApiKey();
  const [viewAll, setViewAll] = useState(false);

  return (
    <div className="w-full flex flex-col gap-5">
      
      <div className="flex items-center gap-3 mb-10">
        {/* Animated logo */}
        <div className="relative group">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-card border border-border transition-all duration-300 group-hover:border-muted-foreground/30">
            <KeyRound
              className="h-5 w-5 text-foreground transition-transform duration-300 group-hover:scale-110"
              strokeWidth={1.5}
            />
          </div>
          {/* Ring pulse on hover */}
          <div className="absolute inset-0 rounded-xl border border-foreground/5 scale-100 opacity-0 group-hover:scale-[1.35] group-hover:opacity-100 transition-all duration-700 pointer-events-none" />
        </div>
        <div>
          <div className="text-lg font-medium text-foreground leading-none tracking-tight">
            <ScrambleText text="Api Keys" delay={0} />
          </div>
          <ScrambleText 
            text="Manage your API keys, view usage, and monitor activity all in one place." 
            delay={0} 
            className="text-xs text-muted-foreground mt-1"
          />
        </div>
      <div/>
          
    </div>

    <div className="flex items-center justify-end gap-3 mb-6 text-xs">
      <CreateApiKeyForm
        trigger={<span className='text-zinc-300 cursor-pointer'>New api-key</span>}
      />
      <span className='text-zinc-900'>/</span>
      <Link href="/docs/get-started" target="_blank" rel="noreferrer" className="text-zinc-300 cursor-pointer">Documentation</Link>
      <span className='text-zinc-900'>/</span>
      <span className='text-zinc-300 cursor-pointer' onClick={()=>{ setViewAll(!viewAll) }}>
        { viewAll ? "Hide rest" : "View all" }
      </span>
    </div>

    <div className="flex flex-col gap-10">
      <div className={cn("flex flex-row justify-start items-center gap-3 overflow-x-hidden", viewAll ? "flex-wrap" : "flex-nowrap")}>

        {
          isLoading && list.length === 0 && [1,2,3,4].map( _ => (<SkeletonApiKeyItem key={_} />))
        }

        {
          list.map((apiKey) => (<ApiKeyItem key={apiKey.id} apiKey={apiKey} />))
        }

        {
          !isLoading && list.length === 0 && (
            <NoApiKeys />
          )
        }

      </div>
    </div>
  </div>
  )
}


const ApiKeyItem = ({ apiKey }: { apiKey: IApiKey }) => {
  return (
    <div className="relative snap-start shrink-0">
      <div className="min-h-28 border border-zinc-900/10 border-b-zinc-900/30 border-r-zinc-900/30 p-8 rounded-xl min-w-40 flex flex-col gap-2.5">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold">{apiKey.name}</span>
          <span className='text-zinc-900'>/</span>
          <p className="font-mono text-zinc-400">{apiKey.apiKey}<span className="text-[6px] text-zinc-400">...</span> </p>
        </div>
        <span className="-mt-1 text-zinc-600 text-[10px]">{niceDate(apiKey.createdAt)}</span>
      </div>
      <div className="absolute top-2 right-2">
        <Settings {...apiKey} />  
      </div>
    </div>
  )
}

const SkeletonApiKeyItem = () => {
  return (
    <div className="snap-start shrink-0">
      <div className="h-28 border border-zinc-900/10 border-b-zinc-900/30 border-r-zinc-900/30 p-8 rounded-xl min-w-40 flex flex-col gap-1 animate-pulse">
        <div className="h-3 w-32 bg-zinc-800 rounded-md mt-2"></div>
        <div className="h-2 w-24 bg-zinc-800 rounded-md"></div>
      </div>
    </div>
  )
}

const NoApiKeys = () => {
  return (
    <div className="w-full py-10 flex flex-col items-center justify-center gap-4">
      <span className="text-white/60 text-sm">No API keys found. Create one to get started.</span>
    </div>
  )
}