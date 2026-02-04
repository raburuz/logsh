import { Ellipsis } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IWorkspace } from "../interface"
import { useWorkspace } from "@/modules/shared/store/workspace";

export function Settings( props: IWorkspace ) {

  const { deleteWorkspaceById } = useWorkspace();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="p-1 hover:border hover:border-white/10 rounded-xl">
          <Ellipsis className="w-3 h-3"/>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40 bg-black text-white/80 border-white/10" align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Settings</DropdownMenuLabel>
          <DropdownMenuItem 
            className="hover:bg-transparent focus:bg-transparent cursor-pointer text-red-700 hover:text-red-600"
            onClick={() => deleteWorkspaceById(props.id)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
