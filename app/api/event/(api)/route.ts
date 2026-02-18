import { NextRequest } from "next/server";
import { apiRouteHandler } from "@/modules/shared/utils/handler";
import { apiAuthentication } from "@/modules/auth/lib/api";
import { eventService } from "@/modules/shared/services/event";
import { RateLimit } from "@/modules/shared/lib/rate-limit";
import { getClientIp } from "@/modules/shared/lib/ip";

//Create Event
export async function POST( request : NextRequest ) {

  return apiRouteHandler( async () => {

    // Apply global rate limit based on client IP to prevent abuse of the API endpoint
    const ip = await getClientIp();

    await RateLimit.bucket(`global_api:${ip}`, {
      refillAmount: 10000,
      refillIntervalSeg: 1,
      tokensPerRequest: 1,
      blockDurationSeg: 2,
      redisKeyPrefix: 'global',
    })

    // Authenticate API request and get the associated API key
    const api = await apiAuthentication();

    await eventService.createViaAPI({
      apikeyId: api.id,
      userId: api.userId,
      request,
    })

    return {}
     
  });
  
}
