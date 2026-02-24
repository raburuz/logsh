import { config } from "@/modules/shared/config";
import { Pricing } from "@/modules/payment/components/plans";
import { ActionBanner, ActionButton } from "@/modules/marketing/components/action";
import { Testimonial } from "@/modules/marketing/components/testimonial";
import { HowItWorks } from "@/modules/marketing/components/how-it-works";
import { Comparison } from "@/modules/marketing/components/comparison";
import { Founder } from "@/modules/marketing/components/founder";
import { AppDemo } from "@/modules/marketing/components/demo";
import LightRays from "@/modules/marketing/components/stream";
import { CTA } from "@/modules/marketing/components/cta";
import { seo } from "@/modules/shared/utils/seo";
import { Faq } from "@/modules/marketing/components/faq";
import { APIIntegrationShowcase } from "@/modules/marketing/components/http";

export const metadata = seo();

export default function Home() {

  return (
    <>
     <ActionBanner/>
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={1}
          lightSpread={0.5}
          rayLength={3}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0}
          distortion={0}
          className="custom-rays"
          pulsating={false}
          fadeDistance={1}
          saturation={1}
      />
        <div className='absolute bottom-0 w-full h-28 bg-linear-to-t from-black to-transparent'></div>
      </div>
      <main className="flex w-full flex-1 flex-col items-center sm:px-4 md:px-16 sm:items-start">
        {/* Content */}
        <div className="relative py-28 w-full flex flex-col gap-7 mb-20">
          <span className="z-10 text-2xl font-bold text-white text-center lowercase">{config.app.name}</span>
          <h1 className="z-10 text-3xl md:text-5xl mx-auto max-w-xl md:max-w-3xl font-bold text-white text-center leading-tight">
            From{' '}
            <span className="bg-linear-to-r from-white via-zinc-400 to-zinc-400/30 text-transparent bg-clip-text">blind spots</span>{' '}
            to{' '}
            <span className="underline underline-offset-8 text-green-400">full visibility</span>{' '}
            across your apps
          </h1>
          <p className="z-10 text-zinc-100 text-center max-w-2xl mx-auto">
            Your apps shouldn&apos;t fail silently. Get <span className="text-white font-bold">real-time visibility and alerts</span> for everything you run, all in one place.
          </p>
          <div className="z-10 self-center">
            <ActionButton />
          </div>
        </div>
        <AppDemo/>
        <Testimonial/>
        <HowItWorks/>
        <Comparison/>
        <APIIntegrationShowcase/>
        <Pricing />
        <Faq/>
        <CTA/>
        <Founder/>
      </main>
    </>
  );
}
