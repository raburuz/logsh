import z from "zod";
import { headers } from "next/headers";
import { auth } from "@/modules/shared/lib/auth/server";
import { zodValidator } from "@/modules/shared/lib/zod/zod";
import { withUser } from "@/modules/shared/lib/auth/middlewares/user";
import { sendToLogsh } from "@/modules/shared/lib/logsh";


// CREATE a new API key
export const POST = withUser( async ({ request, user }) => {
  
  const { body } = await zodValidator({ body: await request.json()}, {
    body: z.strictObject({
      name: z.string().trim().min(1, "Name is required"),
    })
  });
  
  try {
    // Create API key
    const api = await auth.api.createApiKey({ 
      body: {
        userId: user.id,
        name: body.name,
      }
    });
  
    return {
      key: api.key,
    }
  
  } catch (error) {
    // Rollback if API key was created but bucket failed
    console.log(error);
    await sendToLogsh({
      workspace: "logsh_api_keys",
      event: "api_key.creation_failed",
      description: "Failed to create a new API key - check logs for details",
      notify: false,
      icon: "⚠️",
      metadata: {
        module: "better-auth/plugins/api",
        userId: user.id,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    })
  }
})

export const GET = withUser( async () => {
  
  const apiKeys = await auth.api.listApiKeys({
    headers: await headers(),
  });
  
  const list = apiKeys.map( apiKey => ({
      id: apiKey.id,
      name: apiKey.name,
      apiKey: apiKey.start,
      createdAt: apiKey.createdAt.toISOString(),
    }) 
  );
  return { list };
})