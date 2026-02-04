import { redirect } from "next/navigation";
import { getServerSideUser } from "@/modules/auth/actions/auth";
import { Profile } from "@/modules/auth/components/profile";
import { Subscription } from "@/modules/payment/components/subscription";

export default async function Page() {

  const user = await getServerSideUser();
  
  if(!user) return redirect("/auth");

  return (
    <>
      <div className="w-full flex-1 pt-10 space-y-10">
        <Profile/>
        <Subscription/>
      </div>
    
    </>
  )
}