import { config } from "@/modules/shared/config"
import Image from "next/image"

export const Testimonial = () => {
  return (
    <div className="my-10 max-w-md mx-auto flex flex-col items-center gap-2">
      <blockquote className="text-zinc-500 text-center">
        "{config.app.name} was created as a robust solution to track real-time events across all my apps. This approach has allowed me to take action on my apps' events instantly and reliability."
      </blockquote>
      <div className="mt-5 flex flex-row gap-1.5">
        <Image src="/founder.png" alt="Jean Ramirez" width={50} height={50} className="border border-zinc-900 rounded-full w-10 h-10 object-contain" />
        <p className="mt-2 ml-0.5 text-sm text-zinc-300">Jean Ramirez, {config.app.name} founder.</p>
      </div>

    </div>
  )
}
