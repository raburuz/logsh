import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers"
import { auth } from "@/modules/shared/lib/auth/server"
import { sendToLogsh } from "../../logsh";
import { ApiHttpError } from "../../error";
import { UserHandler, UserRouteOptions } from "../interfaces";

const fetchSession = async () => {
  return await auth.api.getSession({
    headers: await headers(),
  })
}

// Compatible with both server-side and API routes
export const getServerSideUser = async () => {
  const session = await fetchSession();

  if(!session){
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    image: session.user.image,
    emailVerified: session.user.emailVerified,
    isOnboarded: session.user.isOnboarded,
  }

}

export const withUser = ( handler: UserHandler<any>, options?: UserRouteOptions, ) => {
  return async (request: NextRequest, ctx: any) => {

    const path = request.nextUrl.pathname;

    try {

      if(options?.onBeforeHandle){
        await options.onBeforeHandle();
      }

      const authData = await getServerSideUser();

      if(!authData){
        throw new ApiHttpError({
          name: 'unauthorized',
          message: 'No active session found - user must be authenticated to access this resource',
        })
      }

      const data = await handler({ 
        request, 
        user: {
          id: authData.id,
          email: authData.email,
          name: authData.name,
          isOnboarded: authData.isOnboarded,
          emailVerified: authData.emailVerified,
        }, 
        ctx 
      });

      // If the route is a streaming endpoint, return a streaming response
      if(options?.enableStreaming){
        return new Response(data, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            ...options?.httpHeaders,
          },
          status: options?.httpStatusCode ?? 200,
        });
      }

      // Standard JSON response for non-streaming routes
      return NextResponse.json({
          status: true,
          data,
        }, {
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

      console.log("\n/USER//////")
      console.log(error);
      console.log("///////\n")

      await sendToLogsh({
        workspace: "logsh_app_errors",
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
