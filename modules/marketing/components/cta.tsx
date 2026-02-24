import { Button } from "@/components/ui/button"
import { ArrowRight, Book, BookOpen, User } from "lucide-react"
import Link from "next/link"

export function CTA() {
  return (
    <section className="w-full mt-12 border-t border-border md:px-6 py-20 md:py-28">
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
      <div className="mt-20 flex flex-col md:flex-row gap-4">
        <Link 
          href="/auth" 
          className="w-full md:w-1/2 flex flex-col items-start gap-8 rounded-xl border border-zinc-900/30 bg-zinc-900/20 px-10 py-8 transition-transform hover:-translate-y-0.5">
            <span className="grid size-12 place-items-center rounded-lg border border-zinc-900/30">
              <User/>
            </span>
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-medium md:text-2xl text-zinc-200">Sign up</h3>
              <p className="mt-4 text-sm text-zinc-500">Create an account to start tracking your events in seconds</p>
            </div>
        </Link>
        <Link 
          href="/docs/get-started" 
          className="w-full md:w-1/2 flex flex-col items-start gap-8 rounded-xl border border-zinc-900/30 bg-zinc-900/20 px-10 py-8 transition-transform hover:-translate-y-0.5">
            <span className="grid size-12 place-items-center rounded-lg border border-zinc-900/30">
              <BookOpen/>
            </span>
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-medium md:text-2xl text-zinc-200">Documentation</h3>
              <p className="mt-4 text-sm text-zinc-500">Comprehensive guides and tutorials to help you succeed</p>
            </div>
        </Link>
      </div>
    </section>
  )
}
