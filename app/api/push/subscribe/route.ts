import z from "zod";
import { db } from "@/modules/db"
import { getAuthenticatedUser } from "@/modules/auth/actions/auth";
import { zodValidator } from "@/modules/shared/lib/zod";
import { routeHandler } from "@/modules/shared/utils/handler"

export async function POST( request: Request ){

  return routeHandler( async () => {

    const user = await getAuthenticatedUser();

    const { body } = await zodValidator({
      body: await request.json()
    },
    {
      body: z.object({
        endpoint: z.string().trim().min(1, 'endpoint is required'),
        keys: z.object({
          auth: z.string().trim().min(1, 'key.auth is required'),
          p256dh: z.string().trim().min(1, 'key.p256dh is required'),
        })
      })
    }
  )

   await db.pushSubscription.create_or_update( user.id, { deviceId: '', endpoint: body.endpoint, keys: body.keys } );
    
    return {}

  })
}