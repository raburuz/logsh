"use client"

import Link from "next/link" 
import { Button } from "@/components/ui/button"
import { authClient } from "@/modules/auth/lib/client"
import { IPlan } from "../interface"
import { useSubscription } from "@/modules/shared/store/subscription"

export const CheckoutButton = ( props: { plan: IPlan, isAuth: boolean } ) => {

  const { subscription } = useSubscription();

  const handleUpgrade = async () => {

    const { data, error } = await authClient.subscription.upgrade({
      plan: props.plan.name,
      //subscriptionId: data.subscriptionId,
      successUrl: window.location.origin + "/auth/profile",
      cancelUrl: window.location.origin + "/",
      subscriptionId: subscription?.subscription?.stripeSubscriptionId || undefined,
    })

    if (data?.url) {
      window.location.href = data.url;
    }
  }

  if(props.isAuth){
    return (
      <>
        <Button
          className="bg-blue-600 hover:bg-blue-700" 
          onClick={handleUpgrade}
          disabled={subscription?.plan?.name === props.plan.name}
        >
          {subscription?.plan?.name === props.plan.name ? "Current Plan" : props.plan.callToAction}
        </Button>
      </>
    )
  }

  return (
    <>
      <Button
        className="bg-blue-600 hover:bg-blue-700" 
        asChild
      >
        <Link href="/auth?redirect=pricing">
          {props.plan.callToAction}
        </Link>
      </Button>
    </>
  )
}
