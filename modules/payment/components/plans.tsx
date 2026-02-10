import { Check, CreditCard, Shield, Zap } from "lucide-react"
import { plans } from "@/modules/payment/lib/plans"
import { CheckoutButton } from "./checkout"
import { getServerSideUser } from "@/modules/auth/actions/auth"
import { IPlan } from "../interface"
import { config } from "@/modules/shared/config"
import { Button } from "@/components/ui/button"
import { isSelfHosted } from "@/modules/shared/utils/self-hosted"

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


export const OneTime = async () => {
    
  const user = await getServerSideUser();

  const withFeatures = [
  {
    text: "",
    bold: "Complete control ",
    rest: "over your data and infrastructure",
  },
  {
    text: "",
    bold: "One-time payment ",
    rest: "with no recurring fees",
  },
  {
    text: "",
    bold: "All features, updates, and support included ",
    rest: "for 2 years",
  },
  {
    text: "",
    bold: "Software remains yours ",
    rest: "and fully functional after 2 years",
  },
  {
    text: "",
    bold: "Discounted renewal option ",
    rest: "for updates and support after 2 years",
  },
  {
    text: "",
    bold: "Perfect for companies ",
    rest: "with strict data privacy requirements",
  },
];

  return (
    <>
      <div className="w-full flex items-center justify-center pb-16">
        <span className="text-white text-center font-black text-xl">-OR-</span>
      </div>
      <section className="w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 max-w-md text-center mx-auto">
            <span>Take{' '}</span>
            <span 
              className="text-green-400 font-bold"
            >
              Full Control{' '}
            </span>
            <span>of Your Events.{' '}</span>
            <span className="text-green-500 font-bold">Pay Once.</span>
          </h2>
          <p className="inline-block text-white px-4 py-2 rounded-md max-w-2xl text-center mx-auto">
            One-time payment for the self-hosted version of {config.app.name}. 
            Pay once, use forever. Updates and support included for 2 years.
          </p>
        </div>
        <div className="flex items-start justify-center gap-12 flex-wrap">
          <div className="bg-green-900/10 rounded-2xl p-6 text-left border border-green-900/50 shadow-md shadow-green-400/10">
            <h3 className="text-white font-semibold text-lg mb-6 text-center">🚀 Why Self-Hosted?</h3>
            <ul className="space-y-5 md:p-6">
              {withFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#22c55e] mt-0.5 shrink-0" />
                  <span className="text-[#888] text-sm leading-relaxed">
                    {feature.text}
                    <span className="text-white font-semibold">{feature.bold}</span>
                    {feature.rest}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {
          plans.filter(plan => !plan.isFree && plan.type === 'one-time').map((plan) => (
            <PlanItem key={plan.id} plan={plan} isAuth={!!user} />
          ))
        }
        </div>
      </section>
    </>
  )
}
