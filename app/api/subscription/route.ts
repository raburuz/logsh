import { getAuthenticatedUser } from "@/modules/auth/actions/auth";
import { db } from "@/modules/db"
import { routeHandler } from "@/modules/shared/utils/handler"

export async function GET(){

  return routeHandler( async () => {

    const user = await getAuthenticatedUser();

    const subscription = await db.subscription.get({by: { userId: user.id }});

    return subscription;

  })
}