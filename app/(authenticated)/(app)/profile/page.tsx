import { redirect } from "next/navigation";
import { Profile } from "@/modules/auth/components/profile";
import { Subscription } from "@/modules/payment/components/subscription";
import PushNotificationButton from "@/modules/push/components/push-notification";
import { getServerSideUser } from "@/modules/shared/lib/auth/middlewares/user";
import { Community } from "@/modules/shared/components/community";
import { InstallPrompt } from "@/modules/shared/components/install-prompt";

export default async function Page() {

  const user = await getServerSideUser();
  
  if(!user) return redirect("/auth");

  return (
    <>
      <div className="w-full flex-1 pt-10 space-y-10">
        <Profile/>
        <PushNotificationButton/>
        <Subscription/>
        <InstallPrompt/>
        <Community/>
      </div>
    
    </>
  )
}