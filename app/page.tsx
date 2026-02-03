import { ApiKeys } from "@/modules/api-key/components/api-keys";
import { Feed } from "@/modules/event/components/feed";
import { Workspaces } from "@/modules/workspace/components/workspaces";
import { config } from "@/modules/shared/config";
import { Plans } from "@/modules/payment/components/plans";
import { ActionButton } from "@/modules/marketing/components/action";
import { Testimonial } from "@/modules/marketing/components/testimonial";
import { HowItWorks } from "@/modules/marketing/components/how-it-works";
import Comparison from "@/modules/marketing/components/comparison";

export default function Home() {
  return (
    <main className="flex w-full flex-1 flex-col items-center px-2 sm:px-4 md:px-16 sm:items-start">
      {/* Content */}
      <div className="py-28 w-full flex flex-col gap-7 mb-20">
        <span className="text-2xl font-bold text-white text-center">{config.app.name}</span>
        <h1 className="text-3xl md:text-5xl mx-auto max-w-xl md:max-w-3xl font-bold text-white text-center leading-tight">
          From{' '}
          <span className="bg-linear-to-r from-white via-zinc-400 to-zinc-400/30 text-transparent bg-clip-text">blind spots</span>{' '}
          to{' '}
          <span className="underline underline-offset-8 text-green-400">full visibility</span>{' '}
          across your apps
        </h1>
        <p className="text-zinc-300 text-center max-w-2xl mx-auto">
          Your apps shouldn&apos;t fail silently. Get <span className="text-white font-bold">real-time visibility and alerts</span> for everything you run, all in one place.
        </p>
        <div className="self-center">
          <ActionButton />
        </div>
      </div>
      {/* Feed component */}
      <ApiKeys/>
      <Workspaces />
      <Feed />
      <Testimonial/>
      <HowItWorks/>
      <Comparison/>
      <Plans />
    </main>
  );
}
