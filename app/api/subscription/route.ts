import z from "zod";
import { headers } from "next/headers";
import { auth } from "@/modules/shared/lib/auth/server";
import { db } from "@/modules/db"
import { plans } from "@/modules/shared/lib/stripe/plans";
import { zodValidator } from "@/modules/shared/lib/zod/zod";
import { withUser } from "@/modules/shared/lib/auth/middlewares/user"
import { APIError } from "better-auth";
import { ApiHttpError } from "@/modules/shared/lib/error";

export const GET = withUser( async ({ user, request }) => {
  const subscription = await db.subscription.get_usable_subscription({by: { userId: user.id }});
  
  return subscription;

})


export const POST = withUser( async ({ user, request }) => {
  
  const { body} = await zodValidator({
    body: await request.json(),
  },{ 
      body: z.object({
        planName: z
          .string()
          .trim()
          .min(1, "Plan name is required")
          .refine((value) =>{
            const pricings = plans.map( p => p.name.toLowerCase() );
            return pricings.includes(value.toLowerCase());
          }, {
            message: "Invalid plan name",
          }),
        isAnnual: z.boolean(),
    })
  })

  const sub = await db.subscription.get_usable_subscription({by: { userId: user.id }});

  try {
    const data = await auth.api.upgradeSubscription({
      body: {
          plan: body.planName, // required
          annual: body.isAnnual, //required
          referenceId: user.id, // required if you want to reuse the same subscription
          subscriptionId: sub?.stripeSubscriptionId ?? undefined,
          successUrl: "/profile", // required
          cancelUrl: "/profile", // required
          returnUrl: "/profile",
          disableRedirect: false, // required
      },
      // This endpoint requires session cookies.
      headers: await headers(),
    });
  
    return {
      url: data.url
    };
    
  } catch (error) {
    const err = error as APIError;

    throw new ApiHttpError({
      name: 'application_error',
      message: err.message,
      details: 'Failed to create checkout session. Please try again.',
    })
  }

})