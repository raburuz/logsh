import z from "zod";
import { headers } from "next/headers";
import { getAuthenticatedUser } from "@/modules/auth/actions/auth";
import { auth } from "@/modules/auth/lib/server";
import { db } from "@/modules/db"
import { plans } from "@/modules/payment/lib/plans";
import { zodValidator } from "@/modules/shared/lib/zod";
import { routeHandler } from "@/modules/shared/utils/handler"
import { AppError } from "@/modules/shared/lib/error";
import { APIError } from "better-auth";

export async function GET(){

  return routeHandler( async () => {

    const user = await getAuthenticatedUser();

    const subscription = await db.subscription.get({by: { userId: user.id }});

    return subscription;

  })
}

export async function POST( request : Request ){

  return routeHandler( async () => {

    const user = await getAuthenticatedUser();

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

    const subs = await db.subscription.get({by: { userId: user.id }});

    const data = await auth.api.upgradeSubscription({
      body: {
          plan: body.planName, // required
          annual: body.isAnnual, //required
          referenceId: user.id, // required if you want to reuse the same subscription
          subscriptionId: subs.subscription?.stripeSubscriptionId ?? undefined,
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

  })
}