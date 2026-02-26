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
import { Logo } from "./logo";

export const Nav = async () => {

  const user = await getServerSideUser();

  //No authenticated user nav
  if( !user ) {
    return (
      <div className="py-10 w-full flex flex-row justify-between items-center gap-10">
        <Link href={"/"} className="flex flex-row items-center">
          <Logo/>
          <span className="font-bold text-sm lowercase">{config.app.name}</span>
        </Link>
        <nav>
          <div className="flex flex-row items-center gap-4 text-xs">
            <div className="cursor-pointer font-medium text-white/80 hover:text-white transition">
              <Link href={"/"}>Home</Link>
            </div>
            <span className="text-zinc-900">/</span>
            <div className="cursor-pointer font-medium text-white/80 hover:text-white transition">
              <Link href={"/pricing"}>Pricing</Link>
            </div>
            <span className="text-zinc-900">/</span>
            <div className="cursor-pointer font-medium text-white/80 hover:text-white transition">
              <Link href={"/docs/get-started"}>Docs</Link>
            </div>
            <span className="text-zinc-900">/</span>
            <div className="cursor-pointer font-medium text-white/80 hover:text-white transition">
              <Link href={"/auth"}>Login</Link>
            </div>
          </div>
        </nav>
      </div>
    )
  }

  return (
    <div className="py-10 w-full flex flex-row justify-between items-center gap-10">
      <Link href={"/dashboard"} className="flex flex-row items-center">
        <Logo/>
        <span className="font-bold text-sm lowercase">{config.app.name}</span>
      </Link>
      <>
      {/* Phone */}
      <NavPhone/>
      {/* Desktop */}
        <nav className="hidden sm:flex">
          <div className="flex flex-row items-center gap-4 text-xs">
            <div className="cursor-pointer font-medium text-white/80 hover:text-white transition">
              <Link href={"/dashboard"}>Dashboard</Link>
            </div>
            <span className="text-zinc-900">/</span>
            <div className="cursor-pointer font-medium text-white/80 hover:text-white transition">
              <Link href={"/docs/get-started"} target="_blank">Docs</Link>
            </div>
            <span className="text-zinc-900">/</span>
            <div className="cursor-pointer font-medium text-white/80 hover:text-white transition">
              <Link href={"/pricing"}>Pricing</Link>
            </div>
            <span className="text-zinc-900">/</span>
            <div className="cursor-pointer font-medium text-white/80 hover:text-white transition">
              <Link href={"/profile"}>Account</Link>
            </div>
            <span className="text-zinc-900">/</span>
            <Logout/>
          </div>
        </nav>
      </>
    </div>
  )
}


export const NavPhone = async () => {
  return (
    <>
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="sm:hidden cursor-pointer p-2 rounded-full">
          <CircleUser className="w-5 h-5 text-zinc-300 hover:text-zinc-100 transition"/>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-2 sm:hidden">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <span className="text-zinc-500">My Account</span>
          </DropdownMenuLabel>
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
          <Logout className="w-full bg-transparent flex justify-start text-sm capitalize h-8"/>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
    </>
  )
}