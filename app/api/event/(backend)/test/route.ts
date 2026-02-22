import z from "zod";
import { db } from "@/modules/db";
import { workspaceValidator } from "@/modules/feed/lib/zod";
import { zodValidator } from "@/modules/shared/lib/zod/zod";
import { withUser } from "@/modules/shared/lib/auth/middlewares/user";
import { sendNotificationToWorkspaceMembers } from "@/modules/push/server";
import { publishEvent } from "@/modules/shared/lib/pub-sub";

//Create Event
export const POST = withUser( async ({ request, user }) => {

  const { body } = await zodValidator({ 
    body: await request.json() 
  }, {
    body: z.strictObject({
      workspace: workspaceValidator.name,
    })
  });
  
  const event = await db.event.create({
    query: {
      where: {
        project: 'default',
        workspace: body.workspace,
        userId: user.id,
      },
      data: {
        event: "user.signup.test",
        description: "New user registered",
        icon: "🎉",
        metadata: {
          user_id: "test_12345",
          plan: "pro"
        },  
      },
    },
    options: {
      consumeEventUsage: false,
    }
  });
  
  // Publish event to Redis SSE channel
  await publishEvent({
    userId: user.id,
    workspaceId: event.workspaceId,
    event: {
      id: event.id,
      event: "user.signup.test",
      description: "New user registered",
      icon: "🎉",
      metadata: {
        user_id: "test_12345",
        plan: "pro"
      },        
      createdAt: event.createdAt.toISOString(),
    },
  })
  
  // Send push notifications to workspace members
  await sendNotificationToWorkspaceMembers(
    event.projectId,
    {
      type: 'event',
      data: {
        event: "user.signup.test",
        description: "New user registered",
      }
    }
  )
  
  return {}
   
}, {
  httpStatusCode: 201,
})
