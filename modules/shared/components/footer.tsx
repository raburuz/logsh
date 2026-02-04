import Link from "next/link"
import { config } from "../config"

export const Footer = () => {
  return (
    <footer className="pt-10 w-full flex flex-col sm:flex-row justify-start items-start gap-20 border-t border-white/10 mt-20 pb-10">
      <div className=" w-full flex flex-col justify-start items-start gap-2 ">
        <span className="font-bold text-lg">{config.app.name}</span>
        <div className="mt-5 space-y-1">
          <p className="text-sm text-white/50">Monitoring for all your apps</p>
          <p className="text-sm text-white/50">Handcrafted in{' '} 
            <span className="text-blue-600 font-bold">Co</span>
            <span className="text-white font-bold">st</span>
            <span className="text-red-600 font-bold">a R</span>
            <span className="text-white font-bold">ic</span>
            <span className="text-blue-600 font-bold">a.</span>
           ☕🇨🇷</p>
          <p className="mt-5 text-sm text-white/50">Built with coffee, dedication, and pura vida nights by Jean Ramirez</p>
          
          <p className="mt-4 text-sm text-white/50">
            Copyright &copy; {new Date().getFullYear()} - All rights reserved.
          </p>
        </div>
      </div>
      <div>
        <span className="text-md font-bold text-white/40">Links</span>
        <div className="space-y-1 mt-2 flex flex-col">
          <Link className="text-sm text-white/50" href="/">Home</Link>
          <Link className="text-sm text-white/50" href="/auth">Login</Link>
          <Link className="text-sm text-white/50" href="/#pricing">Pricing</Link>
          <Link className="text-sm text-white/50" href="/docs/get-started">Documentation</Link>
        </div>
      </div>
    </footer>
  )
}
