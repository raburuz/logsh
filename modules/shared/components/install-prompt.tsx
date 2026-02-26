"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircleIcon, CircleCheck, CircleX, MonitorSmartphone } from "lucide-react"
import { config } from "../config"
import { Badge } from "@/components/ui/badge"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
}

export const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Detect iOS
    const ios =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as any).MSStream

    setIsIOS(ios)

    // Detect standalone mode
    setIsStandalone(
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    )

    const handleBeforeInstallPrompt = (event: Event) => {
      const installEvent = event as BeforeInstallPromptEvent
      installEvent.preventDefault()
      setDeferredPrompt(installEvent)
      setIsVisible(true)
    }

    const handleAppInstalled = () => {
      setDeferredPrompt(null)
      setIsVisible(false)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    await deferredPrompt.prompt()
    await deferredPrompt.userChoice

    setDeferredPrompt(null)
    setIsVisible(false)
  }

  // Don't show if already installed
  if (isStandalone) return null

  // iOS install UI
  if (isIOS) {
    return (
      <Card className="flex flex-col gap-4 pb-6">
        <CardHeader>
          <CardTitle>Install {config.app.name}</CardTitle>
          <CardDescription>
            Install this app on your iPhone for the best experience.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <MonitorSmartphone className="h-4 w-4" />
            <AlertTitle>Add to Home Screen</AlertTitle>
            <AlertDescription>
              <p className="text-sm mt-2">
                Tap the <strong>Share</strong> button (⬆️) in Safari,
                then scroll down and tap <strong>"Add to Home Screen"</strong> ➕.
              </p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  // Android / Desktop install UI
  if (!isVisible || !deferredPrompt) return (
    <Card className="flex flex-col gap-4 pb-6">
      <CardHeader>
        <CardTitle className="space-x-3">
          <span>Install {config.app.name}</span>
          <Badge className="text-red-800 bg-red-950/30">
            <CircleX data-icon="inline-start"/>
            Not supported on this browser
          </Badge>
        </CardTitle>
        <CardDescription>
          <p>It looks like <span className="font-semibold text-zinc-300">your current browser doesn't support the {config.app.name} app</span>.</p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-px w-full bg-zinc-900/30"></div>
          <div> 
            <Alert> 
              <AlertCircleIcon className="h-4 w-4" /> 
              <AlertTitle>😢 Oops… your browser isn't cooperating</AlertTitle> 
              <AlertDescription> 
                <p> 
                  Your current browser doesn't support the {config.app.name} app.
                  For the best experience,{' '} 
                  <span className="font-semibold text-zinc-300">
                    please use{' '}
                    <span className="font-bold text-green-500">Chrome, Firefox, or Edge</span> 
                    {' '}to download the app.
                  </span>
                </p> 
              </AlertDescription> 
            </Alert> 
          </div>
        </div>
          
      </CardContent>
    </Card>
  )

  return (
    <Card className="flex flex-col gap-4 pb-6">
      <CardHeader>
        <CardTitle className="space-x-3">
          <span>Install {config.app.name}</span>
          {' '}
          <Badge className="text-green-600 bg-green-950/30">
            <CircleCheck data-icon="inline-start"/>
            Available on your device
          </Badge>
        </CardTitle>
        <CardDescription>
          <p>Get the full experience on your device.</p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-px w-full bg-zinc-900/30"></div>
          <div className="space-y-3">
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>🚀 Fast and responsive</li>
              <li>🔔 Real-time notifications</li>
              <li>📊 View and manage logs on the go</li>
            </ul>
            <Button
              onClick={handleInstallClick}
              className="bg-white text-black hover:bg-white/95"
              size={"xs"}
              >
              👉 Download {config.app.name} now
            </Button>
          </div>
          <div className="h-px w-full bg-zinc-900/30"></div>
          <div> 
            <Alert> 
              <MonitorSmartphone className="h-4 w-4" /> 
              <AlertTitle>Never miss a new log.</AlertTitle> 
              <AlertDescription> 
                <p> 
                  Receive real-time notifications the moment a new log is received, wherever you are.
                </p> 
              </AlertDescription> 
            </Alert> 
          </div>
        </div>
          
      </CardContent>
    </Card>
  )
}