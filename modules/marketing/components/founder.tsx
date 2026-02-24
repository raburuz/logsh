import { config } from "@/modules/shared/config"
import Image from "next/image"

export const Founder = () => {
  return (
    <div className="relative mt-16 max-w-xl md:min-w-xl mx-auto border border-gray-900/20 rounded-lg p-8 py-10 bg-gray-900/10">
      <div className="mb-6 flex flex-row items-center gap-6">
        <div className="overflow-hidden w-14 aspect-[0.75/1] rounded-sm rotate-2 border-[3px] border-gray-400">
          <Image 
            alt="Photo of logsh.co founder" 
            src="/founder.png" 
            width={100} 
            height={100} 
            className="h-full w-full object-cover" 
          />

        </div>
        <div className="flex flex-col">
          <span className="block text-lg font-semibold text-green-400">About.</span>
          <h2 className="text-3xl font-bold text-white mb-4">Hi, It's Jean 👋🏻</h2>
        </div>
      </div>
      
      <div className="mt-3 flex flex-col text-base space-y-6 text-zinc-400">
        <p>
          I&apos;m the founder of <span className="text-white font-bold">{config.app.name}</span>, a tool that watches your app and tells you when something breaks.
        </p>

        <p>
          I built Logsh.co because I was tired of finding out my app was broken from angry users instead of getting a heads up. 
          I needed something simple and cheap that just worked - no headaches, no crazy prices just pura vida.
        </p>

        <p>
          I couldn't find it, so I made it. Logsh.co is the tool I wish I had when I started: easy to use, does what it says, 
          and anyone can afford it.
        </p>
      </div>
    </div>
  )
}


/* 

overflow: hidden; width: 21%; aspect-ratio: 0.75 / 1; border-radius: 2px; transform: rotate(2deg); border-width: 3px; border-color: rgb(156, 163, 175);
*/