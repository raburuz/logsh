import z from "zod";
import { userAgent } from "next/server";
import { db } from "@/modules/db"
import { zodValidator } from "@/modules/shared/lib/zod/zod";
import { withUser } from "@/modules/shared/lib/auth/middlewares/user"
import { deviceIdZodSchema } from "@/modules/push/utils/device";
import { pushNotificationStatus } from "@/modules/db/queries/push";

export const POST = withUser ( async ({ user, request }) => {

  const { body } = await zodValidator({
      body: await request.json()
    },
    {
      body: z.object({
        deviceId: deviceIdZodSchema,
        subscription: z.object({
          endpoint: z.string().trim().min(1, 'endpoint is required'),
          keys: z.object({
            auth: z.string().trim().min(1, 'key.auth is required'),
            p256dh: z.string().trim().min(1, 'key.p256dh is required'),
          })
        })
      })
    }
  )
  
  const agent = userAgent(request);
  
  const device = agent.device.type || 'desktop';
  const os = agent.os.name || 'unknown';
  const browser = agent.browser.name || 'unknown';
  
  await db.pushSubscription.create_or_update( user.id, { 
    deviceId: body.deviceId, 
    endpoint: body.subscription.endpoint, 
    keys: body.subscription.keys,
    deviceInfo: {
      userAgent: agent.ua || '',
      device,
      platform: os,
      browser,
    },
    status: pushNotificationStatus.ACTIVE,
  });
  
  return {}

})