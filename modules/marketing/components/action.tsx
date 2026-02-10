import Link from "next/link";
import { Button } from "@/components/ui/button"
import { getServerSideUser } from "@/modules/auth/actions/auth"
import { isSelfHosted } from "@/modules/shared/utils/self-hosted";
import { ArrowRight } from "lucide-react";

export const ActionButton = async () => {

  const user = await getServerSideUser();

  return (
    <div className="flex flex-col items-center">
      {
        user ? (
          <Button className="w-fit mb-2" asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        ) : (
          <Button className="w-fit mb-2" asChild>
            <Link href="/auth">Start tracking </Link>
          </Button>
        )
      }
      <span className="text-zinc-400 font-semibold text-xs">No charge today • Cancel anytime</span>
      <p className="pt-4 text-xs"><span className="font-bold text-green-500">Get 25,000 events</span> now for just <span className="text-blue-500 font-bold">$7/month</span></p>
      {/* <span className="text-xs text-blue-400">-( 10 left )-</span> */}
    </div>
  )
}


export const ActionBanner = () => {

  if(isSelfHosted) return null

  return (
    <div className="sticky top-0 p-2 text-center border-b border-zinc-900/20 bg-black z-50">
      <div className="max-w-4xl mx-auto flex flex-row items-center justify-center gap-2">
        <p className="text-xs">Save big as an early customer: <span className="font-bold text-green-500">25,000 events</span> now for just <span className="text-blue-500 font-bold">$7/month</span></p>
        <ArrowRight className="w-3 h-3"/>
      </div>
    </div>
  )
}