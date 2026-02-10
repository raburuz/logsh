import z from "zod";
import * as emoji from "node-emoji";
import { routeHandler } from "@/modules/shared/utils/handler";
import { zodValidator } from "@/modules/shared/lib/zod";
import { db } from "@/modules/db";
import { apiAuthentication } from "@/modules/auth/lib/api";
import { workspaceValidator } from "@/modules/feed/lib/zod";
import { publishEvent } from "@/modules/shared/lib/redis";

//Create Event
export async function POST( request : Request ) {

 return routeHandler( async () => {
 
    const bodyRequest = await request.json();

    const api = await apiAuthentication();

    const { body } = await zodValidator({ body: bodyRequest }, {
      body: z.strictObject({
      event: z.string().trim().min(1, "Event name is required").max(150, "Event name must be 150 characters or less"),
      description: z.string().trim().min(1, "Description can not be a empty string")
      .max(250, "Description must be 250 characters or less").optional().default(""),
      color: z.string().trim().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Color must be a valid hex code").optional().default("#18181b"),
      //https://www.npmjs.com/package/node-emoji
      icon: z.string()
        .trim()
        .optional()
        .default("🔥") 
        .refine((val) => {
          const result = emoji.find(val);
          return !!result
        }, {
          message: "Icon must be a valid emoji",
        }),
      workspace: workspaceValidator.name,
    })
    });

    const workspaceId = await db.workspace.find_or_create(api.userId, { name: body.workspace });

    const event = await db.event.create({
      userId: api.userId,
      event: body.event,
      description: body.description,
      icon: body.icon,
      workspaceId: workspaceId.id,
      color: body.color,
    });

    // Publish event to Redis SSE channel
    await publishEvent({
      userId: api.userId,
      workspaceId: workspaceId.id,
      event: {
        id: event.id,
        event: body.event,
        description: body.description,
        color: body.color,
        icon: body.icon,
        createdAt: event.createdAt.toISOString(),
      },
    })
  
    return {}
     
  });
  
}
