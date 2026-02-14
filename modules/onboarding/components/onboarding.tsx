"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  ArrowRight,
  ArrowLeft,
  ChevronRight,
} from "lucide-react"
import { config } from "../../shared/config"
import { useOnboarding } from "../hooks/use-onboarding"
import { useOnboardingData } from "../store"


export const Onboarding = () => {

  const {
    currentStep,
    isLoading,
    totalSteps,
    executeCurrentStep,
    currentStepConfig,
    prevStep,
    isFirstStep,
    isLastStep,
    progress,
  } = useOnboarding();

  const onboardingData = useOnboardingData();
  const router = useRouter();


  return (
    <div className="flex py-8 flex-col items-center justify-center bg-transparent px-4">
      {/* Logo */}
      <Link href="/" className="mb-8 flex items-center gap-2">
        <span className="text-sm font-semibold tracking-tight text-zinc-300 lowercase">
          {config.app.name}
        </span>
      </Link>

      {/* Card */}
      <div className="w-full max-w-md">
        {/* Progress bar */}
        <Progress value={progress} className="mb-6 h-1 rounded-full" />

        <div className="rounded-lg border border-zinc-900/30 bg-zinc-900/10 p-6 md:p-8">
          {/* Step content with fade transition */}
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            { currentStepConfig?.component }
          </div>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between">
            {!isFirstStep && !isLastStep ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={prevStep}
                className="gap-1.5 text-zinc-500 hover:bg-zinc-900/30 hover:text-zinc-300"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </Button>
            ) : <div></div> }

            <Button
              onClick={async () => {
                await executeCurrentStep();
              }}
              size="sm"
              disabled={
                isLoading || 
                (currentStep === 0 && !onboardingData.workspace.trim())
              }
              className="gap-1.5 ml-auto"
            >
              {
                isLoading 
                ? "Loading..." 
                : currentStepConfig?.cta || "Continue"
              }
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Step dots */}
        <div className="mt-5 flex items-center justify-center gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentStep
                  ? "w-5 bg-primary"
                  : i < currentStep
                    ? "w-1.5 bg-primary/40"
                    : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>

        <div className="mt-10 grid place-content-center">
          <Button 
            variant="ghost" 
            size="xs" 
            className="mt-4 flex items-center gap-1.5 transition-all delay-75 text-zinc-500 hover:text-zinc-300 hover:bg-transparent"
            onClick={ async ()=> {
              await onboardingData.markUserAsOnboarded();
              router.push("/dashboard");
            }}
            >
              <span>Skip onboarding</span>
              <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}
