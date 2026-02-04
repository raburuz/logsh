import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";
import { config } from "@/modules/shared/config";
import { db } from "@/modules/db";
import { stripePlugin } from "@/modules/payment/lib/stripe";
import { apiKey } from "better-auth/plugins";

export const auth = betterAuth({
  // Adapter for your database
  database: drizzleAdapter( db.$db, {
    provider: "pg",
    // Provide your database schemas for better-auth
    schema: db.$schemas.auth
  }),
  // Authentication methods
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }
  },
  // Session settings
  emailVerification: {
    expiresIn: 604_800, // 7 days
    autoSignInAfterVerification: true,
  },
  appName: config.app.name,
  advanced: {
    cookiePrefix: config.app.name.toLowerCase(),
  },
  // Plugins to extend functionality
  plugins: [
    apiKey({
      defaultPrefix: `${config.app.name.toLowerCase()}_`,
      startingCharactersConfig: {
        charactersLength: 16,
      },
      requireName: true,
      rateLimit: {
        enabled: false,
      }
    }),
    stripePlugin
  ]

});
