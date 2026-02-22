import { db } from "@/modules/db"
import { withUser } from "@/modules/shared/lib/auth/middlewares/user"

export const GET = withUser( async ({ user, request }) => {

  const devices = await db.pushSubscription.device_list({ userId: user.id });
  
  return {
    list: devices
  };

})