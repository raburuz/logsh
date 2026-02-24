import Link from "next/link"
import { config } from "../config"
import { getServerSideUser } from "../lib/auth/middlewares/user";
import { Logo } from "./logo";

export const Footer = async () => {

  const user = await getServerSideUser();

  if(user) return (
    <footer className="py-10 grid place-content-center w-full">
      <span className="text-sm text-zinc-500 lowercase">{config.app.name}</span>
    </footer>
  );

  return (
    <footer className="mt-36">
      <div className="pt-10 w-full flex flex-col sm:flex-row justify-start items-start gap-20 pb-6">
        <div className=" w-full flex flex-col justify-start items-start gap-2 ">
         <Link href={"/"} className="flex flex-row items-center ">
            <Logo className="w-5 h-5"/>
            <span className="font-bold text-xl lowercase">{config.app.name}</span>
          </Link>
          <div className="mt-5 space-y-1">
            <p className="max-w-[70%] text-sm text-zinc-500">Your app is trying to tell you something. We help you hear it.</p>
            <p className="mt-5 text-sm text-zinc-500 order-2 lg:order-1">Built with coffee, dedication, and pura vida nights by Jean Ramirez</p>
            <p className="text-sm text-zinc-500">Handcrafted in{' '} 
              <span className="text-blue-600 font-bold">Co</span>
              <span className="text-white font-bold">st</span>
              <span className="text-red-600 font-bold">a R</span>
              <span className="text-white font-bold">ic</span>
              <span className="text-blue-600 font-bold">a.</span>
              ☕🇨🇷
            </p>
          </div>
        </div>
        <div>
          <span className="text-md font-bold text-zinc-300">Product</span>
          <div className="space-y-2 mt-2 flex flex-col">
            <Link className="text-sm text-zinc-500 hover:text-zinc-300" href="/" target="_blank">Home</Link> 
            <Link className="text-sm text-zinc-500 hover:text-zinc-300" href="/pricing" target="_blank">Pricing</Link>
            <Link className="text-sm text-zinc-500 hover:text-zinc-300" href="/auth" target="_blank">Sign in</Link>
          </div>
        </div>
        <div>
          <span className="text-md font-bold text-zinc-300">Resources</span>
          <div className="space-y-2 mt-2 flex flex-col">
            <Link className="text-sm text-zinc-500 hover:text-zinc-300" href="/docs/get-started" target="_blank">Documentation</Link>
          </div>
        </div>
      </div>
      <div className="mt-8 flex flex-col justify-between gap-4 border-t border-zinc-900/30 py-8 text-xs font-medium text-zinc-500 md:flex-row md:items-center md:text-left">
        <p className="order-2 lg:order-1">Copyright &copy; {new Date().getFullYear()} - All rights reserved.</p>
        <ul className="order-1 flex flex-col gap-2 md:order-2 md:flex-row">
          <li className="hover:text-zinc-100"><a href="#"> Terms and Conditions</a></li>
          <li className="hover:text-zinc-100"><a href="#"> Privacy Policy</a></li>
        </ul>
      </div>
      <LogshCo/>
    </footer>
  )
}


export default function LogshCo() {
  return (
    <div className="text-zinc-100 mt-2 w-full select-none">
      <svg
        width="1570"
        height="190"
        viewBox="0 0 1570 293"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full"
        aria-label="logsh.co"
      >
        <text
          x="50%"
          y="200"
          fontSize="140"
          fontWeight="700"
          fill="url(#paint0_linear_logsh)"
          fontFamily="system-ui, -apple-system, sans-serif"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          logsh.co
        </text>

        <defs>
          <linearGradient
            id="paint0_linear_logsh"
            x1="742.5"
            y1="0"
            x2="742.5"
            y2="218.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="currentColor" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}