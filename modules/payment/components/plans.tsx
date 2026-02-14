"use client"
import { useEffect, useState } from "react"
import { Check, CreditCard, Shield } from "lucide-react"
import { plans } from "@/modules/payment/lib/plans"
import { cn } from "@/lib/utils"
import { CheckoutButton } from "./checkout"
import { useAuth } from "@/modules/auth/hook/use-auth"

export const Pricing = () => {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly")
  const [isAuth, setIsAuth] = useState(false);
  const { fetchSession } = useAuth();

  useEffect(() => {
    checkSession();
  }, [])

  const checkSession = async () => {
    const session = await fetchSession();

    if(session?.user){
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

              <CheckoutButton plan={plan} isAnnual={billing === "yearly"} isAuth={isAuth} />

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
/* 

export const Plans = async () => {
  
  const user = await getServerSideUser();

  return (
    <section id="pricing" className="w-full py-16">

        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="inline-block text-gray-400 px-4 py-2 rounded-md ">
            Scalable credit plans for creators. Start with a 14 day free trial
          </p>
        </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {
          plans.filter(plan => !plan.isFree && plan.type === 'recurring').map((plan) => (
            <PlanItem key={plan.id} plan={plan} isAuth={!!user} />
          ))
        }
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

    </section>
  )
}


const PlanItem = ( { plan, isAuth }: { plan: IPlan, isAuth: boolean } ) => {

  return (
    <div className={`relative flex flex-col rounded-xl p-6 border w-full min-w-0 transition-all duration-500 hover:-translate-y-0.5 ${plan.isRecommended ? "border-blue-500/30 bg-blue-900/10" : "bg-gray-900/20 border-gray-900/60"}`}>
      {
        plan.discount?.isActive && <span className="absolute top-6 right-6 text-blue-500 text-xs font-semibold">Save {plan.discount?.porcentage}%</span>
      }
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex flex-col">
          <h4 className="text-xl font-bold text-white mb-2">{plan.name}</h4>
          <div className="-mt-1.5 flex items-center gap-1">
            <Zap className="w-3 h-3 text-gray-600"/>
            <span className="text-[10px] font-semibold">{plan.limits.events.toLocaleString()} / MO</span>
          </div>
        </div>
        {
          plan.discount?.isActive &&
            <p className="text-white/50 text-base line-through decoration-blue-500 decoration-2">${plan.amount} /{plan.interval}</p>
        }
        <p><span className="text-4xl font-bold">${plan.discount?.isActive? plan.discount.amount : plan.amount}</span> <span className="text-zinc-400">/{plan.interval} </span></p>
        { plan.discount?.isActive && <p className="text-xs text-green-500 font-semibold">{plan.discount.text}</p>}
      </div>

      <ul className="mb-8 space-y-3 flex-1">
        {
          plan.features.map( ( feature, index ) => (
            <li key={index} className="flex flex-row items-center gap-2 text-zinc-300">
              <div className={plan.isRecommended ? "bg-blue-900/30 w-5 h-5 rounded-full grid place-content-center" : ""}>
                <Check className={`w-4 h-4 mt-0.5 shrink-0 ${plan.isRecommended ? "text-blue-500" : "text-gray-500"}`} />
              </div>
              <span className="text-sm">{feature}</span>
            </li>
          ))
        }
      </ul>
      {
        isSelfHosted ?
        <Button asChild>
          <a href={  config.app.url } target="_blank" >
            {plan.callToAction}
          </a> 
        </Button>
        :
        <CheckoutButton plan={plan} isAuth={isAuth}/> 
      }
      <span className="mt-2 text-[10px] text-white/50 text-center">{plan.footer}</span>

    </div>
  )
}
 */