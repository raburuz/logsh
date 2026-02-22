import { auth } from "@/modules/shared/lib/auth/server";
import { toNextJsHandler } from "better-auth/next-js";
export const { GET, POST } = toNextJsHandler(auth);