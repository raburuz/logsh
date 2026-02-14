"use client"

import Link from "next/link" 
import { Button } from "@/components/ui/button"
import { useSubscription } from "@/modules/shared/store/subscription"
import { cn } from "@/lib/utils"
import { IPlan } from "../interface"

export const CheckoutButton = ( props: { plan: IPlan, isAnnual: boolean, isAuth: boolean } ) => {

  const { subscription, checkout } = useSubscription();

  const handleUpgrade = async () => {

    if(!props.isAuth) return;

    await checkout({
      planName: props.plan.name,
      isAnnual: props.isAnnual,
    })
  }

  if(props.isAuth){
    return (
      <>
        <Button
          className={cn(
            "mb-6 w-full",
            props.plan.isRecommended ? "bg-green-700 hover:bg-green-800" : "",
          )}
          onClick={handleUpgrade}
          disabled={subscription?.plan?.name === props.plan.name}
        >
          {subscription?.plan?.name === props.plan.name ? "Current plan" : props.plan.callToAction}
        </Button>
      </>
    )
  }

  return (
    <>
      <Button
        className={cn(
          "mb-6 w-full",
          props.plan.isRecommended ? "bg-green-700 hover:bg-green-800" : ""
        )}
        size="sm"
        asChild
      >
        <Link href="/auth?redirect=pricing">
          {props.plan.callToAction}
        </Link>
      </Button>
    </>
  )
}
