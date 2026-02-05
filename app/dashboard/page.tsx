import { ApiKeys } from "@/modules/api-key/components/api-keys";
import { EventList } from "@/modules/event/components/event";
import { Workspaces } from "@/modules/workspace/components/workspaces";
import { Testimonial } from "@/modules/marketing/components/testimonial";

export default function Home() {
  return (
    <main className="flex w-full flex-1 flex-col items-center px-2 sm:px-4 md:px-16 py-20 sm:items-start">
        <ApiKeys/>
        <Workspaces />
        <EventList />
        <Testimonial/>
    </main>
  );
}
