import Link from "next/link";
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react";
import { getServerSideUser } from "@/modules/shared/lib/auth/middlewares/user";

export const ActionButton = async () => {

  const user = await getServerSideUser();

  return (
    <div className="flex flex-col items-center">
      {
        user ? (
          <Button className="w-fit mb-2" asChild>
            <Link href="/pricing">Go to Dashboard</Link>
          </Button>
        ) : (
          <Button className="w-fit mb-2" asChild>
            <Link href="/auth">Start tracking </Link>
          </Button>
        )
      }
      <span className="text-zinc-400 font-semibold text-xs">No charge today • Cancel anytime</span>
      <p className="pt-4 text-xs"><span className="font-bold text-green-500">Get 25,000 events</span> now for just <span className="text-blue-500 font-bold">$10/month</span></p>
    </div>
  )
}


export const ActionBanner = async () => {

  const user = await getServerSideUser();

  return (
    <Link href={user ? "/pricing" : "/auth"} className="fixed top-0 cursor-pointer z-30">
      <div className="w-full p-2 px-4 mt-1 text-center border border-zinc-900/30 bg-zinc-900 rounded-full">
        <div className="max-w-4xl mx-auto flex flex-row items-center justify-center gap-2">
          <p className="text-[11px] sm:text-xs">Save big as an early customer: <span className="font-bold text-green-500">25,000 events</span> now for just <span className="text-blue-500 font-bold">$10/month</span></p>
          <ArrowRight className="w-3 h-3"/>
        </div>
      </div>
    </Link>
  )
}