import Link from "next/link";
import { Button } from "@/components/ui/button"
import { getServerSideUser } from "@/modules/auth/actions/auth"

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
            <Link href="/auth/login">Start tracking </Link>
          </Button>
        )
      }
      <span className="text-zinc-600 text-xs">No charge today • Cancel anytime</span>
      <p className="pt-4 text-xs">Our <span className="font-bold text-green-500">first 10 early customers get 25,000 events</span> for just $3/month</p>
      <span className="text-xs text-orange-400">-( 10 left )-</span>
    </div>
  )
}


export const ActionBanner = () => {
  return (
    <div className="p-2 text-center border-b border-white/10">
      <div className="max-w-4xl mx-auto flex flex-row items-center justify-center gap-2">
        <p className="text-xs">Save big as an early customer: <span className="font-bold text-green-500">25,000 events</span> for just $3/month for the first <span className="text-orange-400">10</span></p>
      </div>
    </div>
  )
}