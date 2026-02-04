import { stripeClient } from "@better-auth/stripe/client";
import { createAuthClient } from "better-auth/client";
import { apiKeyClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    apiKeyClient(),
    stripeClient({
      subscription: true,
    })
  ]
});