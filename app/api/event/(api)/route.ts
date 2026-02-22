import { eventService } from "@/modules/shared/services/event";
import { withApi } from "@/modules/shared/lib/auth/middlewares/api";

export const GET = withApi( async ({ api, request }) => {
  await eventService.createViaAPI({
    apikeyId: api.id,
    userId: api.userId,
    request,
  })

  return {}
},{
  httpStatusCode: 201,
});