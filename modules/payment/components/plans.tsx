"use client"
import { useEffect, useState } from "react"
import { Check, CreditCard, Shield } from "lucide-react"
import { plans } from "@/modules/shared/lib/stripe/plans"
import { cn } from "@/lib/utils"
import { CheckoutButton } from "./checkout"
import { useAuth } from "@/modules/auth/hook/use-auth"
import { useSubscription } from "@/modules/shared/store/subscription"

export const Pricing = () => {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly")
  const [isAuth, setIsAuth] = useState(false);
  const auth = useAuth();
  const subscription = useSubscription();

  useEffect(() => {
    checkSession();
  }, [])
  
  const checkSession = async () => {
    const session = await auth.fetchSession();
    
    if(session?.user){
      subscription.fetchSubscription();
      setIsAuth(true);
    }
  }

  return (
    <section id="pricing" className="w-full py-20 md:py-28 ">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 flex flex-col items-center text-center">
          <p className="mb-2 text-sm font-medium text-zinc-500">Pricing</p>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-100 md:text-3xl text-balance">
            Simple pricing. No surprises.
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-500">
            Start free, upgrade when you need more. Every plan includes the core features to track and understand your product.
          </p>

          <div className="mt-8 inline-flex items-center rounded-lg border border-border bg-card p-1">
            <button
              className={cn(
                "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                billing === "monthly"
                  ? "bg-zinc-900/30 text-zinc-500"
                  : "text-zinc-500 hover:text-zinc-400"
              )}
              onClick={() => setBilling("monthly")}
            >
              Monthly
            </button>
            <button
              className={cn(
                "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                billing === "yearly"
                  ? "bg-zinc-900/30 text-zinc-500"
                  : "text-zinc-500 hover:text-zinc-400"
              )}
              onClick={() => setBilling("yearly")}
            >
              Yearly
              <span className="ml-1.5 text-xs text-primary">-20%</span>
            </button>
          </div>
        </div>

        <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "flex flex-col bg-card p-6 md:p-8",
                plan.isRecommended && "relative"
              )}
            >
              {plan.isRecommended && (
                <span className="absolute top-0 left-0 right-0 h-px bg-green-700" />
              )}

              <div className="mb-6">
                <h3 className="text-sm font-medium text-foreground">{plan.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{plan.description}</p>
              </div>

              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-3xl font-semibold tracking-tight text-foreground">
                  ${billing === "monthly" ? plan.interval.monthly.amount : plan.interval.yearly.amount}
                </span>
                <span className="text-sm text-muted-foreground">/ mo</span>
              </div>

              {
                !auth.isLoading 
                ? <CheckoutButton plan={plan} isAnnual={billing === "yearly"} isAuth={isAuth} /> 
                : <div className="mb-6 h-10 w-full animate-pulse rounded-md bg-zinc-700" />
              }

              <ul className="flex flex-col gap-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-700" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div>
          <p className="mt-8 text-center text-xs text-muted-foreground">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
        <div className="w-full flex items-center justify-center gap-12 mt-12 flex-wrap">
          <div className="flex items-center justify-center gap-2">
            <Shield className="w-3 h-3 text-green-500"/>
            <span className="text-xs text-gray-500 font-semibold">Secure checkout</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CreditCard className="w-3 h-3 text-blue-500"/>
            <span className="text-xs text-gray-500 font-semibold">Powered by stripe</span>
          </div>
        </div>
      </div>
    </section>
  )
}