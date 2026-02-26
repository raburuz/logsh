"use client"

import { Info} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import Image from "next/image";
import { config } from "../config";

export const Community = () => {
  return (
    <Card className="flex flex-col gap-4 pb-10">
        <CardHeader>
          <CardTitle>Community</CardTitle>
          <CardDescription>Join our community and be part of the app's growth 🔥</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-px w-full bg-zinc-900/30"></div>
            <div className="text-xs flex flex-row flex-wrap gap-5">
              <Button size={"sm"} asChild>
                <a href={config.community.discord} target="_blank" rel="noopener noreferrer" className="flex items-center">
                  <Image src="/discord-icon.svg" alt="Discord community" width={14} height={14} className="h-auto object-contain"/>
                  <span className="ml-0.5">Join our Discord</span>
                </a>
              </Button>
              <Button size={"sm"} asChild>
                <a href={config.community.x} target="_blank" rel="noopener noreferrer" className="flex items-center">
                  <Image src="/x-icon.svg" alt="X community" width={14} height={14} className="h-auto object-contain"/>
                  <span className="ml-0.5">Join our X</span>
                </a>
              </Button>
            </div>
            <div className="h-px my-4 w-full bg-zinc-900/30"></div>
            <div>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Why join our community?</AlertTitle>
                <AlertDescription>
                  <p>
                    A space to share ideas, report bugs, suggest improvements, and stay up to date with new features.
                    We're building a community for everyone using logsh.co 💙
                    Let's learn, share, and build something great together.
                  </p>
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </CardContent>
      </Card>
  )
}
