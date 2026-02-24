"use client"

import Link from "next/link";
import { Activity, AlertCircle, CalendarClock, Gauge, Info, Package, Siren } from "lucide-react";
import { Button } from "@/components/ui/button";
import { niceFutureDate } from "@/modules/shared/lib/date";
import { useSubscription } from "@/modules/shared/store/subscription";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { cn } from "@/lib/utils";

export const Subscription = () => {

  const { subscription, portal } = useSubscription();
  
  return (
    <>
      <Card className="flex flex-col gap-4 pb-10">
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Manage your subscription details and settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="w-full flex flex-row items-center justify-between gap-2">
              <div className="h-px w-full bg-zinc-900/30"></div>
              { subscription ? (
                <Button size={'xs'} onClick={portal}>
                  Manage subscription
                </Button>
              ) : null }
            </div>
            {subscription ? (
              <div className="text-xs flex flex-col gap-2">
                <div className="flex items-center gap-2 pb-2">
                  <Package className='w-4 h-4 '/>
                  <span>Plan:</span>
                  <span className="font-bold text-zinc-500">{subscription.plan}</span>
                </div>
                <div className="flex items-center gap-2 pb-2">
                  <Activity  className='w-4 h-4 '/>
                  <span>Status:</span>
                  <span className="font-bold text-orange-600">{subscription.status}</span>
                </div>
                <div className="flex items-center gap-2 pb-2">
                  <CalendarClock className='w-4 h-4 '/>
                  <span>Next billing:</span>
                  <span className="font-bold text-zinc-500">{ subscription.periodEnd ? niceFutureDate(subscription.periodEnd) : undefined}</span>
                </div>
                <div className="flex items-center gap-2 ">
                  <Gauge className='w-4 h-4 '/>
                  <span>Usage:</span>
                  <p className="font-bold text-zinc-500">
                    <span
                      className={cn(
                        subscription.usage.events >= subscription.limits.monthlyEventQuota * 0.8 ? "text-orange-600" : "",
                        subscription.usage.events >= subscription.limits.monthlyEventQuota ? "text-red-600" : "",
                        subscription.usage.events < subscription.limits.monthlyEventQuota * 0.8 ? "text-green-600" : ""
                      )}
                    >{subscription.usage.events.toLocaleString()}</span>
                    {' '}/{' '}
                    <span>{subscription.limits.monthlyEventQuota.toLocaleString()}</span>
                    {' '}events</p>
                </div>
                <div className="h-px my-4 w-full bg-zinc-900/30"></div>
                {
                  subscription.usage.events >= subscription.limits.monthlyEventQuota && (
                    <Alert variant={"destructive"}>
                      <Siren />
                      <AlertTitle>Usage limit reached</AlertTitle>
                      <AlertDescription>
                        <p>Your subscription has reached its monthly event quota. To continue sending events without interruption, please consider upgrading your plan.</p>
                        <div className="mt-2 mb-1">
                          <Button size={'xs'} asChild className="bg-white text-black hover:bg-white/95">
                            <Link href="/pricing">
                              👉 Upgrade plan
                            </Link>
                          </Button>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )
                }
                {
                  subscription.status === 'trialing' && (
                    <Alert>
                      <AlertCircle />
                      <AlertTitle>Update your payment information</AlertTitle>
                      <AlertDescription>
                        <p>Your subscription is currently in <span className="font-bold text-orange-600">{subscription.status}</span> status. To ensure uninterrupted access to all features and benefits, please update your payment information as soon as possible. Click the button below to securely update your payment method and keep enjoying our services without any interruptions.</p>
                        <div className="mt-2 mb-1">
                          <Button size={'xs'} onClick={portal} className="bg-white text-black hover:bg-white/95">
                            👉 Update payment method
                          </Button>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )
                }
              </div>
            ) : (
              <>
                <Alert>
                  <Info />
                  <AlertTitle>Upgrade your subscription and unlock limitless possibilities</AlertTitle>
                  <AlertDescription>
                    <p>Sending events is just the start. With an active subscription, you gain full access to premium tools, insights, and features designed to help you grow faster and achieve more.</p>
                    <div className="mt-2 mb-1">
                      <Button size={'xs'} asChild className="bg-white text-black hover:bg-white/95">
                        <Link href="/pricing" >
                          👉 Let's go! Upgrade now
                        </Link>
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              </>
            )}

          </div>
        </CardContent>
      </Card>
    </>
  )
}
