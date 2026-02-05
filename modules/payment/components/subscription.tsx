"use client"

import { Button } from "@/components/ui/button";
import { authClient } from "@/modules/auth/lib/client"
import { niceDate } from "@/modules/shared/lib/date";
import { useSubscription } from "@/modules/shared/store/subscription";

export const Subscription = () => {

  const { subscription } = useSubscription();
  
  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="w-full flex flex-row items-center justify-between gap-2">
          <h1 className="text-white font-bold text-2xl">Subscription</h1>
          {
            subscription?.subscription ? <Portal/> : null
          }
        </div>
        {subscription?.subscription ? (
          <>
            <p className="text-white/50">You have an active subscription.</p>
            <p className="text-green-500">- <span className="font-bold">{subscription.plan.name} subscription</span></p>
            <div className="flex flex-col gap-2">
              <p className="text-white/50 text-sm">Status: <span className="font-semibold text-orange-500">{subscription.subscription.status}</span></p>
              <p className="text-white/50 text-sm">Next billing date: <span className="font-semibold text-orange-500">{ subscription.subscription?.periodEnd ? niceDate(subscription.subscription.periodEnd) : undefined}</span></p>
              {
                ["past_due", "unpaid", "trialing"].includes(subscription.subscription?.status ?? '') && (
                  <>
                    <p>Once the trial ends, your subscription will pause unless you add a payment method.</p>
                    <CallToAction/>
                  </>
                )
              }
            </div>
          </>
        ) : (
          <>
            <p className="text-white/50">You do not have an active subscription.</p>
            <p className="text-orange-500 font-semibold">Having a subscription is needed to send events.</p>
          </>
        )}
      </div>
    </>
  )
}

export const Portal = () => {

  const handleManageSubscription = async () => {
    const { data: portal } = await authClient.subscription.billingPortal({
      returnUrl: window.location.origin + "/auth/profile"
    });

    if (portal?.url) {
      window.location.href = portal.url;
    }
  }

  return (
    <div>
      <Button onClick={handleManageSubscription}>
        Manage Subscription
      </Button>
    </div>
  )
}
export const CallToAction = () => {

  const handleManageSubscription = async () => {
    const { data: portal } = await authClient.subscription.billingPortal({
      returnUrl: window.location.origin + "/auth/profile"
    });

    if (portal?.url) {
      window.location.href = portal.url;
    }
  }

  return (
    <div className="mt-5">
      <Button onClick={handleManageSubscription} variant={"default"} >
        👉 Update payment method
      </Button>
    </div>
  )
}
