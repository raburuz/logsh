import { ApiKeys } from "@/modules/api-key/components/api-keys";
import { Feed } from "@/modules/feed/components/feed";
import { Testimonial } from "@/modules/marketing/components/testimonial";

export default function Home() {
  return (
    <main className="flex w-full flex-1 flex-col items-center px-2 sm:px-4 md:px-16 py-20 sm:items-start">
        <ApiKeys/>
        <Feed/> 
        <Testimonial/>
    </main>
  );
}
