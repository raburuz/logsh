import Link from "next/link"
import { config } from "../config"
import { Logout } from "@/modules/auth/components/logout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CircleUser } from "lucide-react";
import { getServerSideUser } from "../lib/auth/middlewares/user";

export const Nav = async () => {

  const user = await getServerSideUser();

  //No authenticated user nav
  if( !user ) {
    return (
      <div className="py-10 w-full flex flex-row justify-between items-center gap-10">
      <Link href={"/"} >
        <span className="font-bold text-sm lowercase">{config.app.name}</span>
      </Link>
      <nav>
        <ul className="flex flex-row items-center gap-4 text-xs">
          <li className="cursor-pointer font-medium text-white/80 hover:text-white transition">
            <Link href={"/"}>Home</Link>
          </li>
          <span className="text-zinc-900">/</span>
          <li className="cursor-pointer font-medium text-white/80 hover:text-white transition">
            <Link href={"/pricing"}>Pricing</Link>
          </li>
          <span className="text-zinc-900">/</span>
          <li className="cursor-pointer font-medium text-white/80 hover:text-white transition">
            <Link href={"/docs/get-started"}>Docs</Link>
          </li>
          <span className="text-zinc-900">/</span>
          <li className="cursor-pointer font-medium text-white/80 hover:text-white transition">
            <Link href={"/auth"}>Login</Link>
          </li>
        </ul>
      </nav>
    </div>
    )
  }

  return (
    <div className="py-10 w-full flex flex-row justify-between items-center gap-10">
      <Link href={"/dashboard"} >
        <span className="font-bold text-sm lowercase">{config.app.name}</span>
      </Link>
      <>
      {/* Phone */}
      <NavPhone/>
      {/* Desktop */}
        <nav className="hidden sm:flex">
          <ul className="flex flex-row items-center gap-4 text-xs">
            <li className="cursor-pointer font-medium text-white/80 hover:text-white transition">
              <Link href={"/dashboard"}>Dashboard</Link>
            </li>
            <span className="text-zinc-900">/</span>
            <li className="cursor-pointer font-medium text-white/80 hover:text-white transition">
              <Link href={"/docs/get-started"} target="_blank">Docs</Link>
            </li>
            <span className="text-zinc-900">/</span>
            <li className="cursor-pointer font-medium text-white/80 hover:text-white transition">
              <Link href={"/pricing"}>Pricing</Link>
            </li>
            <span className="text-zinc-900">/</span>
            <li className="cursor-pointer font-medium text-white/80 hover:text-white transition">
              <Link href={"/profile"}>Account</Link>
            </li>
            <span className="text-zinc-900">/</span>
            <Logout/>
          </ul>
        </nav>
      </>
    </div>
  )
}


export const NavPhone = async () => {
  return (
    <>
      <DropdownMenu>
      <DropdownMenuTrigger asChild className="sm:hidden">
        <CircleUser className="cursor-pointer w-5 h-5 text-zinc-300 hover:text-white transition"/>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-2 sm:hidden">
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <>
            <Link href={"/profile"}>
              <DropdownMenuItem>Account</DropdownMenuItem>
            </Link>
          </>
          <>
            <Link href={"/pricing"}>
              <DropdownMenuItem>Pricing</DropdownMenuItem>
            </Link>
          </>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuSeparator />
          <>
            <Link href={"/dashboard"}>
              <DropdownMenuItem>Dashboard</DropdownMenuItem>
            </Link>
          </>
          <>
            <Link href={"/docs/get-started"} target="_blank">
              <DropdownMenuItem>Docs</DropdownMenuItem>
            </Link>
          </>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuSeparator />
          <Logout className="w-full bg-transparent flex justify-start"/>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
    </>
  )
}