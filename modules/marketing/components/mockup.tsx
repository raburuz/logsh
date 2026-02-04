"use client"
import { config } from "@/modules/shared/config"
import { Menu, Wifi, Signal, Battery } from "lucide-react"

export function PhoneMockup( props : { children: React.ReactNode } ) {
  return (
    <div className="relative mx-auto w-[320px] rotate-3">
      {/* Phone Frame */}
      <div className="relative rounded-[50px] bg-[#1a1a1a] p-3 shadow-2xl">
        {/* Inner bezel */}
        <div className="relative overflow-hidden rounded-[38px] bg-[#2a2a2a] p-0.5]">
          {/* Screen */}
          <div className="relative overflow-hidden rounded-[36px] bg-black text-white">
            {/* Dynamic Island */}
            <div className="absolute left-1/2 top-3 z-20 h-7 w-25 border border-white/5 -translate-x-1/2 rounded-full bg-black" />
            
            {/* Status Bar */}
            <div className="relative flex items-center justify-between px-6 pb-2 pt-4">
              <span className="text-sm font-semibold text-white">6:30</span>
              <div className="w-25" /> {/* Spacer for dynamic island */}
              <div className="flex items-center gap-1">
                <Signal className="h-4 w-4 text-white" />
                <Wifi className="h-4 w-4 text-white" />
                <Battery className="h-4 w-4 text-white" />
              </div>
            </div>

            {/* App Header */}
            <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
              <div className="flex items-center gap-3">
                <Menu className="h-5 w-5 text-white" />
                <span className="text-lg font-medium text-white">{config.app.name}</span>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4 p-4 min-h-[30rem]">
              {props.children}
            </div>

            {/* Bottom padding for home indicator area */}
            <div className="h-6" />
          </div>
        </div>
      </div>

      {/* Side buttons - Volume */}
      <div className="absolute left-[-3px] top-[100px] h-[30px] w-[3px] rounded-l-sm bg-[#2a2a2a]" />
      <div className="absolute left-[-3px] top-[140px] h-[55px] w-[3px] rounded-l-sm bg-[#2a2a2a]" />
      <div className="absolute left-[-3px] top-[200px] h-[55px] w-[3px] rounded-l-sm bg-[#2a2a2a]" />
      
      {/* Side button - Power */}
      <div className="absolute right-[-3px] top-[150px] h-[70px] w-[3px] rounded-r-sm bg-[#2a2a2a]" />
    </div>
  )
}


export const WindowMockup = (props: { children: React.ReactNode }) => {
  return (
    <div className="relative mx-auto w-full max-w-3xl rounded-lg bg-[#1a1a1a] p-px shadow-2xl">
      {/* Inner bezel */}
      <div className="relative overflow-hidden rounded-md bg-[#2a2a2a] p-0.5]">
        {/* Screen */}
        <div className="relative overflow-hidden rounded-sm bg-black text-white">
          {/* Title Bar */}
          <div className="flex items-center gap-3 border-b border-white/5 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
            </div>
            <span className="text-base font-medium text-white">{config.app.name}</span>
          </div>
          {/* Content */}
          <div className="p-4 min-h-[20rem]">
            {/* Placeholder for content */}
            {/** Add your content here **/}
            {
              props.children
            }
          </div>
        </div>
      </div>
    </div>
  )
};