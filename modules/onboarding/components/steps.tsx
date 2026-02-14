
"use client"

import { useState, useCallback, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import {
  Check,
  Bell,
  Copy,
  User,
  CreditCard,
  Rocket,
  Shield,
} from "lucide-react"
import { plans } from "@/modules/payment/lib/plans"
import { usePushNotification } from "@/modules/push/hook/use-push-notication"
import { useOnboardingData } from "../store"

export const StepWelcome = () => {

  const onboardingData = useOnboardingData();

  return (
    <div>
      <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-zinc-900/30 bg-zinc-900/30 px-2.5 py-0.5">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
        <span className="text-[11px] text-zinc-500">Step 1 of 5</span>
      </div>
      <h2 className="mt-4 text-xl font-semibold tracking-tight text-zinc-100">
        Welcome to Logsh
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-zinc-500">
        {"Let's set up your workspace in under a minute. Give your workspace a name to get started."}
      </p>

      <div className="mt-6">
        <label
          htmlFor="workspace"
          className="mb-2 block text-xs font-medium text-zinc-500"
        >
          Workspace name
        </label>
        <Input
          id="workspace"
          placeholder="e.g. My SaaS"
          value={onboardingData.workspace}
          onChange={(e) => onboardingData.setWorkspace(e.target.value)}
          className="bg-zinc-900/30 border-zinc-900/30 ring-zinc-900/30 text-zinc-100"
        />
      </div>
    </div>
  )
}

export const StepNotifications = () => {

  const [isChecked, setIsChecked] = useState(false);
  const pushNotification = usePushNotification();

  return (
    <div>
      <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-zinc-900/30 bg-zinc-900/30 px-2.5 py-0.5">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
        <span className="text-[11px] text-zinc-500">Step 2 of 5</span>
      </div>
      <h2 className="mt-4 text-xl font-semibold tracking-tight text-zinc-100">
        Stay in the loop
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-zinc-500">
        Choose how you want to be notified when events fire. You can always change this later.
      </p>

      <div className="mt-6 flex flex-col gap-3">
          <div
            className={cn(
              "flex items-center justify-between rounded-lg border border-zinc-900/30 bg-zinc-900/10 px-4 py-3 text-zinc-500",
              isChecked && "border-green-900 bg-green-900/10 text-zinc-300"
            )}
          >
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 text-zinc-500" />
              <div>
                <p className="text-sm font-medium ">
                  Push notifications
                </p>
                <p className="text-xs ">
                  Instant alerts on desktop and mobile
                </p>
              </div>
            </div>
            <Switch
              checked={isChecked}
              onCheckedChange={(checked) =>{
                setIsChecked(checked);
                if(checked) pushNotification.subscribe();  
              }}
            />
          </div>
      </div>
    </div>
  )
}

export const StepFirstEvent = () => {

  const [copied, setCopied] = useState(false)
  const onboardingData = useOnboardingData();


  const codeSnippet = `await fetch("https://logsh.co/api/event", {
    method: "POST",
    headers: {
      "Authorization": "Bearer logsh.co_your_api_key",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      channel: "${onboardingData.workspace || "my-workspace"}",
      event: "user.signup.test",
      description: "New user registered",
      color: "#ffffff",
    }),
  })`

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(codeSnippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [codeSnippet])

  return (
    <div>
      <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-zinc-900/30 bg-zinc-900/30 px-2.5 py-0.5">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
        <span className="text-[11px] text-zinc-500">Step 3 of 5</span>
      </div>
      <h2 className="mt-4 text-xl font-semibold tracking-tight text-zinc-100">
        Send your first event
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-zinc-500">
        Copy this snippet into your app. It will send a test event to your dashboard so you can see how it works.
      </p>

      {/* Code block */}
      <div className="mt-5 rounded-lg border border-zinc-900/30 bg-zinc-900/30 p-3 font-mono text-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-500" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-500" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-500" />
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[10px] text-zinc-500 transition-colors hover:text-zinc-500"
            aria-label="Copy code snippet"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-green-500" />
                <span className="text-green-500">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 text-zinc-300" />
                <span className="text-zinc-300">Copy</span>
              </>
            )}
          </button>
        </div>
        <pre className="overflow-x-auto text-[11px] leading-5 text-zinc-500">
          <code>{codeSnippet}</code>
        </pre>
      </div>

      {/* Listening state */}
      <div className="mt-5 flex flex-row items-center justify-end gap-2">
      <div className="relative h-2 w-2">
        <div className="absolute inset-0 rounded-full bg-green-600/20 animate-ping" />
        <div className="absolute inset-0 rounded-full bg-green-600" />
      </div>
        <span className="text-xs text-zinc-500">
          Send my first event 👇
        </span>
      </div>
    </div>
  )
}

export const StepDashboard = () => {
  const events = [
    {
      name: "user.signup.test",
      description: "New user registered",
      highlight: true,
      time: "now",
      color: "#10b981",
      icon: <User className="h-3.5 w-3.5" />,
    },
    {
      name: "payment.completed",
      description: "Pro plan -- $29/mo",
      highlight: false,
      time: "1m ago",
      color: "#3b82f6",
      icon: <CreditCard className="h-3.5 w-3.5" />,
    },
    {
      name: "deploy.success",
      description: "v2.4.1 deployed to production",
      highlight: false,
      time: "5m ago",
      color: "#8b5cf6",
      icon: <Rocket className="h-3.5 w-3.5" />,
    },
  ]

  const onboardingData = useOnboardingData();

  return (
    <div>
      <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-zinc-900/30 bg-zinc-900/30 px-2.5 py-0.5">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
        <span className="text-[11px] text-zinc-500">Step 4 of 5</span>
      </div>
      <h2 className="mt-4 text-xl font-semibold tracking-tight text-zinc-100">
        {"You're all set"}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-zinc-500">
        Your workspace is ready. Here is a preview of what your dashboard will look like.
      </p>

      {/* Mini dashboard preview */}
      <div className="mt-5 rounded-lg border border-zinc-900/30 bg-zinc-900/30 overflow-hidden">
        {/* Dashboard header */}
        <div className="flex flex-col gap-1">
          <div className="relative shrink-0 px-4 pb-1.5 pt-3 text-xs transition-all duration-200 flex items-center gap-2 text-foreground font-medium">
            {onboardingData.workspace}
            <span className="text-[7px] font-mono px-1 py-0.5 rounded border transition-all duration-200 border-muted-foreground/20 text-muted-foreground/50">1</span>
          </div>
          <div className="flex items-center justify-between border-b border-zinc-900/30 px-4 py-3">
            <span className="text-xs font-medium text-zinc-500">
              Activity stream
            </span>
            <span className="text-[10px] font-medium text-zinc-500">
              1 new event
            </span>
          </div>
        </div>

        {/* Event feed */}
        <div className="divide-y divide-zinc-900/30">
          {events.map((event, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center gap-3 px-4 py-3 animate-in fade-in slide-in-from-bottom-1 duration-300 text-zinc-500",
                event.highlight ? "bg-green-900/10 text-green-600" : ""
              )}
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: "both" }}
            >
              <div 
                className="flex h-1 w-1 rounded-full bg-white self-start mt-1.5"
                style={{ backgroundColor: event.color }}></div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium font-mono">
                  {event.name}
                </p>
                <p className="text-[11px] truncate">
                  {event.description}
                </p>
              </div>
              {
                event.time === "now" ? (
                  <div className="flex items-center gap-1">
                    <div className="animate-pulse w-1 h-1 bg-green-600 rounded-full mt-px"></div>
                    <span className="text-[10px] text-green-500 shrink-0">
                      now
                    </span>
                  </div>
                ) : (
                  <span className="text-[10px] text-zinc-500 shrink-0">
                    {event.time}
                  </span>
                )
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


export const StepPlan = () => {

  const onboardingData = useOnboardingData();
  const [isAnnual, setIsAnnual] = useState<boolean>(false);

  // Set default plan on mount
  useEffect(() => {
    const defaultPlan = plans.find(p => p.name.toLowerCase() === 'pro') || plans[0];
    onboardingData.setPrice({ plan: defaultPlan.name, isAnnual });
  }, [])

  // Update plan when billing cycle changes
  useEffect(() => {
    if(onboardingData.price) {
      onboardingData.setPrice({ plan: onboardingData.price.plan, isAnnual })
    }
  }, [isAnnual])
  

  return (
    <div>
      <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-zinc-900/30 bg-zinc-900/30 px-2.5 py-0.5">
        <Check className="h-3 w-3 text-green-500" />
        <span className="text-[11px] text-zinc-500">All done</span>
      </div>
      <h2 className="mt-4 text-xl font-semibold tracking-tight text-zinc-100">
        Choose your plan
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-zinc-500">
        Start free and upgrade whenever. All plans include core tracking features.
      </p>

      {/* Billing toggle */}
      <div className="mt-5 flex items-center justify-center">
        <div className="inline-flex items-center rounded-lg border border-zinc-900/30 bg-zinc-900/10 p-0.5">
          <button
            className={cn(
              "rounded-md px-3 py-1 text-xs font-medium transition-colors",
              !isAnnual
                ? "bg-green-900/30 text-green-500"
                : "text-zinc-300 hover:text-zinc-200"
            )}
            onClick={() => setIsAnnual(false)}
          >
            Monthly
          </button>
          <button
            className={cn(
              "rounded-md px-3 py-1 text-xs font-medium transition-colors",
              isAnnual
                ? "bg-green-900/30 text-green-500"
                : "text-zinc-300 hover:text-zinc-200"
            )}
            onClick={() => setIsAnnual(true)}
          >
            Yearly
            <span className="ml-1 text-[10px] text-green-500">-20%</span>
          </button>
        </div>
      </div>

      {/* Plan cards */}
      <div className="mt-4 flex flex-col gap-2">
        {plans.map((plan) => {

          const isSelected = onboardingData.price?.plan.toLowerCase() === plan.name.toLowerCase();
          
          return (
            <button
              key={plan.name}
              onClick={() => onboardingData.setPrice({ plan: plan.name, isAnnual })}
              className={cn(
                "relative flex items-start gap-3 rounded-lg border p-3.5 text-left transition-all",
                isSelected
                  ? "border-primary bg-green-900/10"
                  : "border-zinc-900/30 bg-zinc-900/10 hover:border-zinc-900/30"
              )}
            >
              {/* Radio indicator */}
              <div
                className={cn(
                  "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                  isSelected
                    ? "border-primary bg-green-900/30"
                    : "border-zinc-500/40"
                )}
              >
                {isSelected && (
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                )}
              </div>

              {/* Plan content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-zinc-300">
                    {plan.name}
                  </span>
                  {plan.isRecommended && (
                    <span className="rounded-full bg-green-700 px-1.5 py-px text-[9px] font-medium text-white">
                      Popular
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-zinc-500">
                  {plan.description}
                </p>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                  {plan.features.map((f) => (
                    <span
                      key={f}
                      className="flex items-center gap-1 text-[11px] text-zinc-500"
                    >
                      <Check className="h-2.5 w-2.5 text-green-500" />
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="shrink-0 text-right">
                <span className="text-lg font-semibold tracking-tight text-zinc-300">
                  ${
                    isAnnual                      
                      ? plan.interval.yearly.amount
                      : plan.interval.monthly.amount
                  }
                </span>
                <span className="text-[10px] text-zinc-500">/mo</span>
              </div>
            </button>
          )
        })}
      </div>

      <p className="mt-3 text-center text-[11px] text-zinc-500">
        You won't be charged today. <span className="text-green-500">14-day free trial</span> on all paid plans.
      </p>
      <div className="w-full flex items-center justify-center gap-12 mt-4 flex-wrap">
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
  )
}