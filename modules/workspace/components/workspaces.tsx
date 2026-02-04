"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/modules/shared/store/workspace";
import { CreateWorkspaceForm } from "../form/create"
import { Settings } from "./settings";
import { IWorkspace } from "../interface";

export const Workspaces = () => {  

  const workspace = useWorkspace();
  const [viewAll, setViewAll] = useState(false);

  return (
    <div className="w-full mt-10 flex flex-col gap-5">
      <div className="flex flex-row justify-between items-center gap-6">
        <h2 className="text-white/60 text-sm">Workspaces</h2>
        <div className="flex flex-row gap-4 items-center justify-between">
          <CreateWorkspaceForm />
          <span>·</span>
          <span className="text-white/60 text-sm cursor-pointer" onClick={() => setViewAll(!viewAll)}>
            {viewAll ? 'View less' : 'View all'}
          </span>
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
            workspace.isLoading && [1,2,3,4].map( _ => (<SkeletonWorkspaceItem key={_} />))
          }

          {
            !workspace.isLoading && workspace.list.length === 0 && (<NoWorkspaces />)
          }

          {
            workspace.list.map((workspace) => <WorkspaceItem key={workspace.id} workspace={workspace} />)
          }

        </div>
        {
          viewAll && workspace.list.length > 3 && (
            <Button onClick={() => setViewAll(false)} className="self-center" size={"xs"}>View less</Button>
          )
        }
      </div>
    </div>
  )
}


const WorkspaceItem = ({ workspace }: { workspace: IWorkspace }) => {

  const { selected, selectWorkspaceById } = useWorkspace();

  return (
    <div className="snap-start shrink-0 relative">
      <div 
        className={`border p-6 rounded-2xl min-w-40 flex flex-col gap-1 cursor-pointer hover:border-green-500/30 transition-all delay-100  ${selected === workspace.id ? "border-green-500/15 bg-green-500/10" : "border-zinc-900"}`}  
        onClick={() => {
          if( selected === workspace.id ) return;
          selectWorkspaceById(workspace.id)
        }}
      >
        <span className="text-sm font-bold text-center">{workspace.name}</span>
      </div>
      <div className="z-50 absolute top-2 right-2">
        <Settings  {...workspace} />
      </div>
    </div>
  )
}

const NoWorkspaces = () => {
  return (
    <div className="w-full py-10 flex flex-col items-center justify-center gap-4">
      <span className="text-white/60 text-sm">No workspaces found. Create one to get started.</span>
    </div>
  )
}

const SkeletonWorkspaceItem = () => {
  return (
    <div className="snap-start shrink-0">
      <div className="relative border border-zinc-900 py-6 px-4 rounded-2xl min-w-40 flex flex-col gap-1 animate-pulse">
        <div className="h-3 w-32 bg-zinc-800 rounded-md mt-2"></div>
      </div>
    </div>
  )
}