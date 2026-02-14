import { Testimonial } from "@/modules/marketing/components/testimonial";
import { Pricing } from "@/modules/payment/components/plans";

export default function PricingPage() {

  return (
    <>
    <main className="flex w-full flex-1 flex-col items-center px-2 sm:px-4 md:px-16 sm:items-start">
      <Pricing />
      <Testimonial/>
    </main>
    </>
  );
}
