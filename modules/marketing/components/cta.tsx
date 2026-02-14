import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CTA() {
  return (
    <section className="w-full mt-12 border-t border-border px-6 py-20 md:py-28">
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl text-balance">
          Start tracking events today
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Free to start. No credit card required. Set up in under two minutes and see your first event in real time.
        </p>
        <div className="mt-8 flex items-center gap-3">
          <Button 
            size="lg" 
            className="gap-2 bg-green-700 hover:bg-green-800"
            asChild 
          >
            <Link href="/auth" className="flex items-center gap-2">
              Get started free <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
