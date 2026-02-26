import { ApiService } from "@/modules/shared/services/api";
import { withApi } from "@/modules/shared/lib/auth/middlewares/api";

export const POST = withApi( async ({ api, request }) => {

  const service = new ApiService({ 
    userId: api.userId,
    hasUnlimitedAccess: api.hasUnlimitedAccess,
  });

  await service.createEvent({ request });

  return {}
},{
  httpStatusCode: 201,
});