import { Check } from "lucide-react"
import { plans } from "@/modules/payment/lib/plans"
import { CheckoutButton } from "./checkout"
import { getServerSideUser } from "@/modules/auth/actions/auth"
import { IPlan } from "../interface"

export const Plans = async () => {
  
  const user = await getServerSideUser();

  return (
    <section id="pricing" className="w-full py-16">

        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="inline-block text-white px-4 py-2 rounded-md ">
            Choose the plan that best fits your needs. Start with a 7 day free trial
          </p>
        </div>

      <div className="my-6 w-full flex flex-row flex-wrap md:flex-nowrap items-center justify-center gap-6">
        {
          plans.filter(plan => !plan.isFree).map((plan) => (
            <PlanItem key={plan.id} plan={plan} isAuth={!!user} />
          ))
        }
      </div>

    </section>
  )
}


const PlanItem = ( { plan, isAuth }: { plan: IPlan, isAuth: boolean } ) => {

  return (
    <div className="w-80 relative bg-[#161b22]/20 rounded-xl p-6 border border-[#30363d] flex flex-col gap-4">
      {
        plan.discount?.isActive && <span className="absolute top-6 right-6 text-orange-500 text-xs font-semibold">Save {plan.discount?.porcentage}%</span>
      }
      <div className="flex flex-col gap-2 mb-6">
        <h4 className="text-xl font-bold text-white mb-2">{plan.name}</h4>
        {
          plan.discount?.isActive &&
            <p className="text-white/50 text-base line-through">${plan.amount} /{plan.interval}</p>
        }
        <p><span className="text-4xl font-bold">${plan.discount?.isActive? plan.discount.amount : plan.amount}</span> <span className="text-zinc-400">/{plan.interval} </span></p>
        { plan.discount?.isActive && <p className="text-sm text-green-500 font-semibold">{plan.discount.text}</p>}
      </div>

      <ul className="mb-8 space-y-3">
        {
          plan.features.map( ( feature, index ) => (
            <li key={index} className="flex flex-row items-center gap-2 text-zinc-300">
              <Check className="w-5 h-5 mt-0.5 shrink-0 text-emerald-500" />
              <span className="text-base">{feature}</span>
            </li>
          ))
        }
      </ul>
      <CheckoutButton plan={plan} isAuth={isAuth}/> 
      <span className="mt-2 text-xs text-white/50 text-center">$0.00 due today. No card required.</span>

    </div>
  )
}
