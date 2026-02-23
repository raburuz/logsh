import { Faq } from "@/modules/marketing/components/faq";
import { Testimonial } from "@/modules/marketing/components/testimonial";
import { Pricing } from "@/modules/payment/components/plans";
import { seo } from "@/modules/shared/utils/seo";

export const metadata = seo({
  title: "logsh.co - Pricing Plans",
  description: "Explore our flexible pricing plans designed to fit your needs. Get real-time visibility and alerts for your apps with One Day.",
})

export default function PricingPage() {

  return (
    <>
    <main className="flex w-full flex-1 flex-col items-center px-2 sm:px-4 md:px-16 sm:items-start">
      <Pricing />
      <Faq/>
      <Testimonial/>
    </main>
    </>
  );
}
