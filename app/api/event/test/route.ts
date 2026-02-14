import z from "zod";
import { getAuthenticatedUser } from "@/modules/auth/actions/auth";
import { db } from "@/modules/db";
import { workspaceValidator } from "@/modules/feed/lib/zod";
import { publishEvent } from "@/modules/shared/lib/redis";
import { zodValidator } from "@/modules/shared/lib/zod";
import { routeHandler } from "@/modules/shared/utils/handler";

//Create Event
export async function POST( request : Request ) {

 return routeHandler( async () => {
 
    const bodyRequest = await request.json();

    const user = await getAuthenticatedUser();

    const { body } = await zodValidator({ body: bodyRequest }, {
        body: z.strictObject({
        workspace: workspaceValidator.name,
      })
    });

    const workspaceId = await db.workspace.find_or_create(user.id, { name: body.workspace });

    const event = await db.event.create({
      userId: user.id,
      workspaceId: workspaceId.id,
      event: "user.signup.test",
      description: "New user registered",
      icon: "🎉",
      color: "#ffffff",
    });

    // Publish event to Redis SSE channel
    await publishEvent({
      userId: user.id,
      workspaceId: workspaceId.id,
      event: {
        id: event.id,
        event: "user.signup.test",
        description: "New user registered",
        color: "#ffffff",
        icon: "🎉",
        createdAt: event.createdAt.toISOString(),
      },
    })
  
    return {}
     
  });
  
}
