import { withUser } from "@/modules/shared/lib/auth/middlewares/user";
import { ApiHttpError } from "@/modules/shared/lib/error";
import { sendToLogsh } from "@/modules/shared/lib/logsh";
import { zodValidator } from "@/modules/shared/lib/zod/zod";
import { RateLimit } from "@/modules/shared/lib/redis/rate-limit";
import { getClientIp } from "@/modules/shared/lib/ip";
import { db } from "@/modules/db";
import { feedBackSchema } from "@/modules/shared/lib/zod/schemas/feedback";

export const POST = withUser( async ({ user, request } ) => {

  const { body } = await zodValidator({ body: await request.json() }, {
    body : feedBackSchema
  });

  const susbcription = await db.subscription.get_usable_subscription({
    by: { userId: user.id },
  })

  const response = await sendToLogsh({
    workspace: 'logsh_feedback',
    event: 'user_feedback',
    description: `Feedback from user ${user.id}`,
    icon: '💬',
    notify: true,
    metadata: {
      userId: user.id,
      content: body.content,
      plan: susbcription ? susbcription.plan : 'free',
    }
  })

  if(!response.success){
    throw new ApiHttpError({
      name: 'application_error',
      message: response.error ? response.error : `Failed to send feedback. If the problem persists, please contact support.`
    })
  }

  return {}

}, {
  httpStatusCode: 201,
  onBeforeHandle: async () => {
    const ip = await getClientIp();

    await RateLimit.fixedWindow(
      `feedback:${ip}`,
      {
      redisKeyPrefix: "feedback",
      maxRequests: 5,
      windowSizeSeg: 60,
      blockDurationSeg: 60,
    })
  }
})