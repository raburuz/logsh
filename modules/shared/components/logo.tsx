import { cn } from "@/lib/utils"
import { Activity } from "lucide-react"

export const Logo = (props: { className?: string }) => {
  return (
    <div className="p-2">
      <Activity className={cn("w-4 h-4", props.className)}/>
    </div>
  )
}
