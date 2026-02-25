import z from "zod";
import { db } from "@/modules/db";
import { workspaceValidator } from "@/modules/feed/lib/zod";
import { zodValidator } from "@/modules/shared/lib/zod/zod";
import { withUser } from "@/modules/shared/lib/auth/middlewares/user";
import { sendNotificationToWorkspaceMembers } from "@/modules/push/server";
import { IEvent } from "@/modules/feed/interface";
import { publishEvent } from "@/modules/shared/lib/redis/pub-sub";

//Create Event
export const POST = withUser( async ({ request, user }) => {

  const { body } = await zodValidator({ 
    body: await request.json() 
  }, {
    body: z.strictObject({
      workspace: workspaceValidator.name,
    })
  });

  const exampleEventData = {
    id: "",
    event: "user.signup.test",
    description: "New user registered",
    icon: "🎉",
    metadata: {
      user_id: "test_12345",
      plan: "pro"
    },
    createdAt: new Date(),
  } satisfies IEvent; 
  
  const event = await db.event.create({
    query: {
      where: {
        project: 'default',
        workspace: body.workspace,
        userId: user.id,
      },
      data: {
        event: exampleEventData.event,
        description: exampleEventData.description,
        icon: exampleEventData.icon,
        metadata: exampleEventData.metadata,
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
      event: exampleEventData.event,
      description: exampleEventData.description,
      icon: exampleEventData.icon,
      metadata: exampleEventData.metadata,
      createdAt: event.createdAt,
    },
  })
  
  // Send push notifications to workspace members
  await sendNotificationToWorkspaceMembers(
    event.projectId,
    {
      type: 'event',
      data: {
        event: exampleEventData.event,
        description: exampleEventData.description,
      }
    }
  )
  
  return {}
   
}, {
  httpStatusCode: 201,
})
