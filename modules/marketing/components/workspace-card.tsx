import { config } from "@/modules/shared/config";

export function WorkspaceCard() {
  return (
    <div className="p-px max-w-md mx-auto bg-linear-to-b from-stone-800 to-transparent rounded-t-lg shadow-2xl">
      <div className="bg-linear-to-b from-black to-transparent p-6 rounded-t-lg">
        <h4 className="text-white font-medium mb-4">New Workspace</h4>
        <p className="text-white/50 text-sm mt-1 mb-4">Create a new workspace to monitor your applications effectively.</p>
        
        {/* Field 1 */}
        <div className="mb-4">
          <label className="text-white/80 text-xs mb-1 block">Name</label>
          <div className="bg-black border border-zinc-900/20 rounded-md p-3 mt-2">
            <p className="text-white/80 text-sm pointer-events-none select-none">
              {config.app.name} Monitoring Workspace
            </p>
          </div>
        </div>

        {/* Platforms */}
        <div className="w-full mt-6 flex justify-end">
          {/* Confetti */}
          <button className="bg-zinc-900 text-white px-4 py-2 rounded-md text-sm hover:bg-zinc-800 cursor-pointer">Create</button>
        </div>
      </div>
    </div>
  )
}
