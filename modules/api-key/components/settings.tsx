import { Ellipsis } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useApiKey } from "@/modules/shared/store/api-key";
import { IApiKey } from "../interface";

export function Settings( props: IApiKey ) {

  const { deleteApiKeyById } = useApiKey();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="p-1 hover:border hover:border-zinc-900/20 rounded-xl">
          <Ellipsis className="w-3 h-3"/>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40 bg-black text-white/80 border-zinc-900/20" align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs">Settings</DropdownMenuLabel>
          <DropdownMenuItem 
            className="hover:bg-transparent focus:bg-transparent cursor-pointer text-red-700 hover:text-red-600 focus:text-red-600 text-xs"
            onClick={() => deleteApiKeyById(props.id)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
