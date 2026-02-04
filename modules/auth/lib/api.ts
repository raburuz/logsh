import { headers } from "next/headers";
import { AppError } from "@/modules/shared/lib/error";
import { auth } from "./server";
import { db } from "@/modules/db";

export const apiAuthentication = async () => {

  const authorization = (await headers()).get('authorization');

  if(!authorization || !authorization.startsWith('Bearer ')) {
    throw new AppError(
      'unauthorized',
      'Authorization header must be in the format: Bearer <token>'
    )
  }

  const key = authorization.split(' ').at(-1)?.trim() ?? '';

  let session: Awaited<ReturnType<typeof auth.api.verifyApiKey>>;

  try {
    session = await auth.api.verifyApiKey({
      body: {
        key,
      }
    });

  } catch (error) {
    throw new AppError(
      'bad_request', 
      'Invalid body parameters provided for API key verification. Please check the request body and try again.'
    );
  }

  if(session.error || !session.valid || !session.key) {
    //https://github.com/better-auth/better-auth/blob/main/packages/better-auth/src/plugins/api-key/routes/verify-api-key.ts
    switch (session.error?.code) {
      case 'RATE_LIMITED':
      case 'USAGE_EXCEEDED':
        throw new AppError(
          'rate_limit_exceeded', 
          'You have exceeded the rate limit for API requests. Please try again later.'
        );
      case 'KEY_NOT_FOUND':
      case 'INVALID_API_KEY':
        throw new AppError(
          'unauthorized', 
          'Your API key is invalid, missing required permissions, or has expired. Please check your API key and try again.'
        );
      default:
        console.log(session.error)
        throw new AppError(
          'internal_server_error',
          'Something went wrong while verifying your API key. Please try again later.'
        )
    }
  }

  await db.api.rate_limit(session.key.id);

  return session.key;
}