import {
  ShieldCheck,
  Lock,
} from 'lucide-react'

export const Trust = () => {
  return (
    <section className="border-y border-zinc-900/20 py-6 mb-20 w-full">
      <div className="container">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <div className="flex items-center gap-2 rounded-full bg-zinc-900/20 px-3 py-1.5">
              <ShieldCheck className="size-5 text-zinc-600" />
              <span className="text-sm font-medium">SSL Secured</span>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-zinc-900/20 px-3 py-1.5">
              <Lock className="size-5 text-zinc-600" />
              <span className="text-sm font-medium">GDPR Compliant</span>
            </div>

          </div>

          {/* Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-zinc-600 md:justify-end">
            <div className="flex items-center gap-1.5">
              <div className="size-1.5 rounded-full bg-emerald-500" />
              <span>Money-back guarantee</span>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="size-1.5 rounded-full bg-emerald-500" />
              <span>24/7 Support</span>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="size-1.5 rounded-full bg-emerald-500" />
              <span>Secure checkout</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}