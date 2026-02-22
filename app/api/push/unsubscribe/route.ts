import z from "zod";
import { db } from "@/modules/db"
import { deviceIdZodSchema } from "@/modules/push/utils/device";
import { zodValidator } from "@/modules/shared/lib/zod/zod";
import { withUser } from "@/modules/shared/lib/auth/middlewares/user"

export const POST = withUser( async ({ user, request }) => {

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