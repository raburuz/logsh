import { stripeClient } from "@better-auth/stripe/client";
import { createAuthClient } from "better-auth/client";
import { apiKeyClient, inferAdditionalFields, magicLinkClient } from "better-auth/client/plugins";
import { auth } from "./server";

export const authClient = createAuthClient({
  plugins: [
    magicLinkClient(),
    apiKeyClient(),
    stripeClient({
      subscription: true,
    }),
    inferAdditionalFields<typeof auth>()
  ]
});