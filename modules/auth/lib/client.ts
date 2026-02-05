import { stripeClient } from "@better-auth/stripe/client";
import { createAuthClient } from "better-auth/client";
import { apiKeyClient, magicLinkClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    magicLinkClient(),
    apiKeyClient(),
    stripeClient({
      subscription: true,
    }),
  ]
});