import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";
import { apiKey, magicLink } from "better-auth/plugins";
import { config } from "@/modules/shared/config";
import { db } from "@/modules/db";
import { stripePlugin } from "@/modules/payment/lib/stripe";
import { sendEmail } from "@/modules/shared/lib/resend";
import MagicLink from "@/modules/shared/emails/magic-link";

export const auth = betterAuth({
  // Adapter for your database
  database: drizzleAdapter( db.$db, {
    provider: "pg",
    // Provide your database schemas for better-auth
    schema: db.$schemas.auth,
  }),
  // Authentication methods
  emailAndPassword: {
    enabled: false,
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
  user: {
    additionalFields:{
      isOnboarded: {
        type: "boolean",
        default: false,
        defaultValue: false,
        required: true,
      }
    }
  },
  // Plugins to extend functionality
  plugins: [
    magicLink({
        sendMagicLink: async ({ email, url }) => {
          // https://resend.com/docs/dashboard/emails/send-test-emails
          console.log(`Send magic link to ${email}: ${url}`);
          await sendEmail({
            from: `${config.app.name} <${config.email.fromNoReply}>`,
            to: email,
            subject: `Your magic link for ${config.app.name}`,
            react: MagicLink({ email, url }),
          })
        }
    }),
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
    stripePlugin,
  ]

});
