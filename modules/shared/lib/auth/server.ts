import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";
import { apiKey, createAuthMiddleware, magicLink } from "better-auth/plugins";
import { config } from "@/modules/shared/config";
import { db } from "@/modules/db";
import { stripePlugin } from "@/modules/shared/lib/stripe/stripe";
import { sendEmail } from "@/modules/shared/lib/resend";
import MagicLinkEmail from "@/emails/magic-link";
import { isProduction } from "@/modules/shared/utils/constraint";
import { sendToLogsh } from "@/modules/shared/lib/logsh";
import { ipAddressHeaders } from "../ip";

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
    ipAddress: {
      ipAddressHeaders: ipAddressHeaders,
    }
  },
  user: {
    additionalFields:{
      isOnboarded: {
        type: "boolean",
        defaultValue: false,
        required: true,
      }
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async ( user ) => {

          // Create a default project for the new user
          // We wrap this in a try-catch to ensure that even if project creation fails, it doesn't affect the user's ability to log in
          try {
            await db.project.create({ by: { userId: user.id }, data: { name: "Default"}});
          } catch (error) {
            console.log("Error creating default project for new user:", error);
          }

          await sendToLogsh({
            workspace: 'logsh_authentication',
            event: "user.signup",
            description: `A new user has signed up with the email: ${user.email}`,
            icon: "👤",
            notify: true,
            metadata: {
              userId: user.id,
              email: user.email,
              verificationStatus: user.emailVerified ? "verified" : "unverified",
            }
          })
        }
      }
    }
  },
  // Plugins to extend functionality
  plugins: [
    magicLink({
      expiresIn: 900, // 15 minutes
      //Rate limit 
      rateLimit:{
        max: 5,
        window: 300, // 5 minutes
      },
      sendMagicLink: async ({ email, url }) => {
        //https://resend.com/docs/dashboard/emails/send-test-emails
        const sendTo = isProduction ? email : 'delivered+login@resend.dev';
        // https://resend.com/docs/dashboard/emails/send-test-emails
        if( isProduction ){
          await sendEmail({
            from: `${config.app.name} <${config.email.fromAuth}>`,
            to: sendTo,
            subject: `Your magic link for ${config.app.name}`,
            react: MagicLinkEmail({ loginUrl: url }),
          })
        } else {
          console.log(`Send magic link to ${sendTo}: ${url}`);
        }
      },
    }),
    apiKey({
      defaultPrefix: `${config.app.name.toLowerCase()}_`,
      startingCharactersConfig: {
        charactersLength: 16,
      },
      requireName: true,
      rateLimit: {
        enabled: false,
      },
      
      
    }),
    stripePlugin,
  ]

});
