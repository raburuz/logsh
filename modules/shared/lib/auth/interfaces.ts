import { NextRequest } from "next/server";
import { apiAuthentication } from "./middlewares/api";

export type UserHandler<T> = (
  data: {
    request: NextRequest,
    user: {
      id: string;
      email: string;
      name: string;
      isOnboarded: boolean;
      emailVerified: boolean;
    },
    ctx: any,
  }
) => Promise<T>;

export type ApiHandler<T> = (
  data: {
    request: NextRequest,
    api: Awaited<ReturnType<typeof apiAuthentication>>,
    ctx: any,
  }
) => Promise<T>;

export type ApiRouteOptions = {
  httpStatusCode?: number,
  httpHeaders? : Record<string, string>,  
}

export type UserRouteOptions = {
  httpStatusCode?: number,
  httpHeaders? : Record<string, string>,
  enableStreaming?: boolean,
  onBeforeHandle?: () => Promise<void>,
}
