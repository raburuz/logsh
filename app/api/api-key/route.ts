import z from "zod";
import { getAuthenticatedUser } from "@/modules/auth/actions/auth";
import { auth } from "@/modules/auth/lib/server";
import { zodValidator } from "@/modules/shared/lib/zod";
import { routeHandler } from "@/modules/shared/utils/handler";
import { db } from "@/modules/db";
import { AppError } from "@/modules/shared/lib/error";
import { headers } from "next/headers";


// CREATE a new API key
export async function POST( request: Request ) {

  return routeHandler( async () => {

    const bodyRequest = await request.json();

    const user = await getAuthenticatedUser();

    const { body } = await zodValidator({ body: bodyRequest }, {
      body: z.strictObject({
        name: z.string().trim().min(1, "Name is required"),
      })
    });

    await db.api.get_or_create_usage({ data: { userId: user.id} });
    const subscription = await db.subscription.get({ by: { userId: user.id} });
    
    let keyId: string | null = null;
    try {
      // Create API key
      const api = await auth.api.createApiKey({ 
        body: {
          userId: user.id,
          name: body.name,
        }
      });

      keyId = api.id;
      // Create API bucket
      await db.api.create_bucket({
        by: { apiKeyId: keyId },
        data: {
          capacity: subscription.plan.limits.events,
          refillAmount: Math.ceil(subscription.plan.limits.events * 0.05), // 5% of capacity
          refillInterval: 1000 * 60, // every minute
        }
      });

      return {
        key: api.key,
      }

    } catch (error) {
      // Rollback if API key was created but bucket failed
      if (keyId) {
        try {
          await auth.api.deleteApiKey({ 
            body: { keyId, }, 
            headers: await headers(),
          });
        } catch (cleanupError) {
          throw new AppError(
            'internal_server_error',
            `${cleanupError}`
          )
        }
      }
      throw error; // rethrow original error

    }
    
  });

}

export async function GET() {

  return routeHandler( async () => {
    await getAuthenticatedUser();

    const apiKeys = await auth.api.listApiKeys({
      headers: await headers(),
    });

    return apiKeys.map( apiKey => ({
        id: apiKey.id,
        name: apiKey.name,
        key: apiKey.start,
        createdAt: apiKey.createdAt.toISOString(),
      }) 
   );
  });

}