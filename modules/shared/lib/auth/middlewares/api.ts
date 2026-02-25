import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/modules/shared/lib/auth/server";
import { getClientIp } from "../../ip";
import { RateLimit } from "../../redis/rate-limit";
import { sendToLogsh } from "../../logsh";
import { ApiHttpError } from "../../error";
import { ApiHandler, ApiRouteOptions } from "../interfaces";

const apiAuthentication = async () => {

  const authorization = (await headers()).get('authorization');

  if(!authorization || !authorization.startsWith('Bearer ')) {
    throw new ApiHttpError({
      name: 'unauthorized',
      message: 'Authorization header must be in the format: Bearer <token>',
      details: 'The request is missing the Authorization header or it is not properly formatted. Please include a valid API key in the Authorization header and try again.',
    });
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
    //Todo
    // Black list the key for a short period if there are repeated failed attempts to prevent brute-force attacks
    throw new ApiHttpError({
      name: 'bad_request', 
      message: 'Invalid body parameters provided for API key verification. Please check the request body and try again.',
      details: 'The request body is missing required parameters or contains invalid values for API key verification. Please ensure that the body includes a valid "key" parameter and try again.',
    });
  }

  if(session.error || !session.valid || !session.key) {
    //https://github.com/better-auth/better-auth/blob/main/packages/better-auth/src/plugins/api-key/routes/verify-api-key.ts
    switch (session.error?.code) {
      case 'RATE_LIMITED':
      case 'USAGE_EXCEEDED':
        throw new ApiHttpError({
          name: 'rate_limit_exceeded',
          message: 'You have exceeded the rate limit for API requests. Please try again later.',
          details: 'The API key has reached its usage limit or rate limit. Please wait before making more requests.',
        });
      case 'UNAUTHORIZED':
      case 'KEY_NOT_FOUND':
      case 'INVALID_API_KEY':
        throw new ApiHttpError({
          name: 'unauthorized',
          message: 'Your API key is invalid, missing required permissions, or has expired. Please check your API key and try again.',
          details: 'The API key provided is either invalid, missing required permissions, or has expired. Please ensure you are using a valid API key with the necessary permissions and try again.',
        });
      default:
        console.log(session.error)
        throw new ApiHttpError({
          name: 'internal_server_error',
          message: 'Something went wrong while verifying your API key. Please try again later.',
          details: 'An unexpected error occurred while verifying the API key. Please try again later. If the issue persists, contact support.',
        });
    }
  }
  
  return {
    id: session.key.id,
    userId: session.key.userId, 
  };
}


export const withApi = ( handler: ApiHandler<any>, options?: ApiRouteOptions ) => {
  return async (request: NextRequest, ctx: any) => {

    const path = request.nextUrl.pathname;

    try {

      const ip = await getClientIp();
      
      await RateLimit.bucket(`api:${ip}`, {
        refillAmount: 10000,
        refillIntervalSeg: 1,
        tokensPerRequest: 1,
        blockDurationSeg: 2,
        redisKeyPrefix: 'global',
      })

      const authData = await apiAuthentication();

      const data = await handler({ request, api: authData, ctx });

      return NextResponse.json(
        {
          status: true,
          ...data,
        },
        {
          status: options?.httpStatusCode ?? 200,
          headers: options?.httpHeaders,
        }
      );
    } catch (error) {

      if( error instanceof ApiHttpError ){
        return NextResponse.json({
          status: false,
          name: error.name,
          message: error.message,
          details: error.details,
        }, {
          status: error.httpStatusCode,
          headers: error.httpHeaders,
        })
      }

      console.log("\n/API//////")
      console.log(error);
      console.log("///////\n")

      await sendToLogsh({
        workspace: "logsh_api_errors",
        event: `error.unexpected / ${path}`,
        description: "An unexpected error occurred in the API route - check logs for details",
        notify: true,
        icon: "⚠️",
        metadata: {
          path,
          error: error instanceof Error ? error.message : "Unknown error",
        }
      });

      return NextResponse.json(
        {
          status: false,
          name: "internal_server_error",
          message: "Internal server error",
          details: "An unexpected error occurred while processing the API request. Please try again later. If the issue persists, contact support.",
        },
        {
          status: 500,
        }
      );
    }
  };
};
