import { getServerSideUser } from "../actions/auth"
import PushNotificationButton from "@/modules/push/components/push-notification";

export const Profile = async () => {

  const user = await getServerSideUser();

  return (
    <div className="flex flex-col gap-4">

      <h1 className="text-white font-bold text-2xl">Profile</h1>
      <div className="space-y-1">
        <h3 className="font-medium">Name</h3>
        <p className="text-white/50">{user?.name}</p>
      </div>
      <div className="space-y-1">
        <h3 className="font-medium">Email</h3>
        <p className="text-white/50">{user?.email}</p>
      </div>
      <PushNotificationButton/>
    </div>
  )
}
