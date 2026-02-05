import Link from "next/link"
import { config } from "../config"
import { getServerSideUser } from "@/modules/auth/actions/auth"
import { Logout } from "@/modules/auth/components/logout";

export const Nav = async () => {

  const user = await getServerSideUser();

  //No authenticated user nav
  if( !user ) {
    return (
      <div className="py-10 w-full flex flex-row justify-between items-center gap-10">
      <Link href={"/"} >
        <span className="font-bold">{config.app.name}</span>
      </Link>
      <nav>
        <ul className="flex flex-row items-center gap-4 text-sm">
          <li className="cursor-pointer font-medium text-white/80 hover:text-white transition">
            <Link href={"/"}>Home</Link>
          </li>
          <span className="text-white/80">·</span>
          <li className="cursor-pointer font-medium text-white/80 hover:text-white transition">
            <Link href={"/#pricing"}>Pricing</Link>
          </li>
          <span className="text-white/80">·</span>
          <li className="cursor-pointer font-medium text-white/80 hover:text-white transition">
            <Link href={"/docs/get-started"}>Docs</Link>
          </li>
          <span className="text-white/80">·</span>
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
        <span className="font-bold">{config.app.name}</span>
      </Link>
      <nav>
        <ul className="flex flex-row items-center gap-4 text-sm">
          <li className="cursor-pointer font-medium text-white/80 hover:text-white transition">
            <Link href={"/dashboard"}>Dashboard</Link>
          </li>
          <span className="text-white/80">·</span>
          <li className="cursor-pointer font-medium text-white/80 hover:text-white transition">
            <Link href={"/docs/get-started"} target="_blank">Docs</Link>
          </li>
          <span className="text-white/80">·</span>
          <li className="cursor-pointer font-medium text-white/80 hover:text-white transition">
            <Link href={"/dashboard/profile"}>Profile</Link>
          </li>
          <span className="text-white/80">·</span>
          <Logout/>
        </ul>
      </nav>
    </div>
  )
}
