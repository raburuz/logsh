import { db } from "@/modules/db"
import { getAuthenticatedUser } from "@/modules/auth/actions/auth";
import { routeHandler } from "@/modules/shared/utils/handler"

export async function GET(){

  return routeHandler( async () => {

    const user = await getAuthenticatedUser();

    const devices = await db.pushSubscription.device_list({ userId: user.id });
    
    return devices;

  })
}