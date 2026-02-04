"use client"
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { niceDate } from "@/modules/shared/lib/date";
import { CreateApiKeyForm } from "../forms/create"
import { useFetchApiKeys } from "../hooks/useApi";
import { IApiKeyItem } from "../interfaces";

export const ApiKeys = () => {

  const { apiKeys, isLoading } = useFetchApiKeys();
  const [viewAll, setViewAll] = useState(false);

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="flex flex-row justify-between items-center gap-6">
        <h2 className="text-white/60 text-sm">Api keys</h2>
        <div className="flex flex-row items-center justify-start gap-4">
          <CreateApiKeyForm/>
          <span>·</span>
          <Link href="docs/get-started" target="_blank" rel="noreferrer" className="text-white/60 text-sm">Documentation</Link>
          <span>·</span>
          <p className="text-white/60 text-sm cursor-pointer" onClick={() => setViewAll(!viewAll)}>{viewAll ? 'View less' : 'View all'}</p>
        </div>
      </div>
      <div className="flex flex-col gap-10">
        <div className={
          viewAll ?
          "flex flex-row justify-start items-center gap-3 overflow-x-hidden flex-wrap"
          :
          "flex flex-row justify-start items-center gap-3 overflow-x-hidden"
        }>

          {
            isLoading && apiKeys.length === 0 && [1,2,3,4].map( _ => (<SkeletonApiKeyItem key={_} />))
          }

          {
            apiKeys.map((apiKey) => (<ApiKeyItem key={apiKey.id} apiKey={apiKey} />))
          }

          {
            !isLoading && apiKeys.length === 0 && (
              <NoApiKeys />
            )
          }

        </div>
          {
            viewAll && apiKeys.length > 3 && (
              <Button onClick={() => setViewAll(false)} className="self-center" size={"xs"}>View less</Button>
            )
          }
      </div>
    </div>
  )
}


const ApiKeyItem = ({ apiKey }: { apiKey: IApiKeyItem }) => {
  return (
    <div className="snap-start shrink-0">
      <div className="relative border border-zinc-900 p-8 rounded-xl min-w-40 flex flex-col gap-2.5">
        <span className="text-sm font-bold">{apiKey.name}</span>
        <p className="font-mono text-xs">{apiKey.key}<span className="text-xs text-white/60">...</span> </p>
        <span className="-mt-1 text-white/60 text-[10px]">Created at. {niceDate(apiKey.createdAt)}</span>
        <div className="absolute top-0 right-0 bg-green-800 text-green-200 px-2 py-1 rounded-bl-lg rounded-tr-lg text-xs font-mono">
          <span className="text-[10px] font-bold subpixel-antialiased">Active</span>
        </div>
      </div>
    </div>
  )
}

const SkeletonApiKeyItem = () => {
  return (
    <div className="snap-start shrink-0">
      <div className="relative border border-zinc-900 p-8 rounded-xl min-w-40 flex flex-col gap-1 animate-pulse">

        <div className="h-4 w-24 bg-zinc-800 rounded-md"></div>
        <div className="h-3 w-32 bg-zinc-800 rounded-md mt-2"></div>
        <div className="h-3 w-20 bg-zinc-800 rounded-md mt-2"></div>
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