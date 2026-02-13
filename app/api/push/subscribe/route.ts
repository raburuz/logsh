import z from "zod";
import { NextRequest, userAgent } from "next/server";
import { db } from "@/modules/db"
import { getAuthenticatedUser } from "@/modules/auth/actions/auth";
import { zodValidator } from "@/modules/shared/lib/zod";
import { routeHandler } from "@/modules/shared/utils/handler"
import { deviceIdZodSchema } from "@/modules/push/utils/device";
import { pushNotificationStatus } from "@/modules/db/queries/push";

export async function POST( request: NextRequest ){

  return routeHandler( async () => {

    const user = await getAuthenticatedUser();

    const { body } = await zodValidator({
      body: await request.json()
    },
    {
      body: z.object({
        deviceId: deviceIdZodSchema,
        endpoint: z.string().trim().min(1, 'endpoint is required'),
        keys: z.object({
          auth: z.string().trim().min(1, 'key.auth is required'),
          p256dh: z.string().trim().min(1, 'key.p256dh is required'),
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
      endpoint: body.endpoint, 
      keys: body.keys,
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
}