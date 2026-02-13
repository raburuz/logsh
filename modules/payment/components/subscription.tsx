"use client"

import Link from "next/link";
import { Activity, CalendarClock, Gauge, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/modules/auth/lib/client"
import { niceFutureDate } from "@/modules/shared/lib/date";
import { useSubscription } from "@/modules/shared/store/subscription";

export const Subscription = () => {

  const { subscription } = useSubscription();
  
  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="w-full flex flex-row items-center justify-between gap-2">
          <h2 className="font-bold text-lg">Subscription</h2>
          {
            subscription?.subscription ? <Portal/> : null
          }
        </div>
        {subscription?.subscription ? (
          <div className="text-xs flex flex-col gap-2">
            <p className="pb-0.5 text-zinc-500">You already have an active subscription.</p>
            <div className="flex items-center gap-2 pb-2">
              <Package className='w-4 h-4 '/>
              <span>Plan:</span>
              <span className="font-bold text-zinc-500">{subscription.plan.name} plan subscription</span>
            </div>
            <div className="flex items-center gap-2 pb-2">
              <Activity  className='w-4 h-4 '/>
              <span>Status:</span>
              <span className="font-bold text-zinc-500">{subscription.subscription.status}</span>
            </div>
            <div className="flex items-center gap-2 pb-2">
              <CalendarClock className='w-4 h-4 '/>
              <span>Next billing:</span>
              <span className="font-bold text-zinc-500">{ subscription.subscription?.periodEnd ? niceFutureDate(subscription.subscription.periodEnd) : undefined}</span>
            </div>
            <div className="flex items-center gap-2 pb-2">
              <Gauge className='w-4 h-4 '/>
              <span>Usage:</span>
              <span className="font-bold text-zinc-500">{subscription.usage.events} / {subscription.plan.limits.events.toLocaleString()} events </span>
            </div>
            {
              ["past_due", "unpaid", "trialing"].includes(subscription.subscription?.status ?? '') && (
                <div className="text-xs flex flex-col gap-2">
                  <p className="text-red-800 font-medium">Once the trial ends, your subscription will pause unless you add a payment method.</p>
                </div>
              )
            }
            <CallToAction/>
          </div>
        ) : (
          <div className="text-xs flex flex-col gap-2">
            <p className="text-zinc-500">🚀 Upgrade your subscription and unlock limitless possibilities!</p>
            <p className="text-blue-800 font-semibold">Sending events is just the start. With an active subscription, you gain full access to premium tools, insights, and features designed to help you grow faster and achieve more.</p>
            <Button size={'xs'} className="w-fit mt-4" asChild>
              <Link href="/pricing" >
                👉 Start your upgrade
              </Link>
            </Button>
          </div>
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
      <Button size={'xs'} onClick={handleManageSubscription}>
        Manage subscription
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
      <Button size={'xs'} onClick={handleManageSubscription} variant={"default"} >
        👉 Update payment method
      </Button>
    </div>
  )
}
