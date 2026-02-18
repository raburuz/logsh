import z from "zod";
import { getAuthenticatedUser } from "@/modules/auth/actions/auth";
import { db } from "@/modules/db";
import { workspaceValidator } from "@/modules/feed/lib/zod";
import { zodValidator } from "@/modules/shared/lib/zod";
import { apiRouteHandler } from "@/modules/shared/utils/handler";
import { sendNotificationToWorkspaceMembers } from "@/modules/push/server";
import { publishEvent } from "@/modules/shared/lib/pub-sub";

//Create Event
export async function POST( request : Request ) {

  return apiRouteHandler( async ( ) => {

    const user = await getAuthenticatedUser();

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
          color: "#ffffff",
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
        color: "#ffffff",
        icon: "🎉",
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
     
  },{
    statusCode: 201,
  });
  
}
