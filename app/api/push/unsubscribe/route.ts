import z from "zod";
import { db } from "@/modules/db"
import { getAuthenticatedUser } from "@/modules/auth/actions/auth";
import { deviceIdZodSchema } from "@/modules/push/utils/device";
import { zodValidator } from "@/modules/shared/lib/zod";
import { routeHandler } from "@/modules/shared/utils/handler"

export async function POST( request: Request ){

  return routeHandler( async () => {

    const user = await getAuthenticatedUser();

    const { body } = await zodValidator(
      {
        body: await request.json(),
      },
      {
        body: z.object({
          deviceId: deviceIdZodSchema,
        })
      }
    ); 

    const subscription = await db.pushSubscription.delete_by_device({ 
      where: { userId: user.id, deviceId: body.deviceId } 
    });

    return subscription;

  })
}