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

export function WKSettings( 
  props: {
    trigger: React.ReactNode,
    workspace: IWorkspace
  }
){

  const { deleteWorkspaceById } = useWorkspace();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {props.trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40 bg-black text-white/80 border border-zinc-900/20" align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs">
            <span className="font-semibold uppercase">{props.workspace?.name}{' '}</span> 
            <span>Settings</span>
          </DropdownMenuLabel>
          <DropdownMenuItem 
            className="hover:bg-transparent focus:bg-transparent cursor-pointer text-red-700 hover:text-red-600 focus:text-red-600 text-xs"
            onClick={() => deleteWorkspaceById(props.workspace?.id || '')}
          >
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
