"use client";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form"
import { MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { FeedBackSchema, feedBackSchema } from "../lib/zod/schemas/feedback";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from "@/lib/utils";
import { config } from "../config";

export const Feedback = () => {

  const [state, setState] = useState("idle"); // idle | loading | success | error

  const form = useForm({
    resolver: zodResolver(feedBackSchema),
    mode: "onSubmit",
  });

  const postFeedback = async (data: FeedBackSchema) => {
    setState("loading");
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const res = await response.json()

      if( !response.ok ) {
        throw new Error(res.message);
      }
      setState("success");
      
    } catch (error) {
      setState("error");
      const err = error as Error;
      toast.error( err.message || "Something went wrong. Please try again later.");
    }

  }

  const handleSubmit = async ( data: FeedBackSchema) => {
    await postFeedback(data);
  }

  return (
    <>
      <Dialog
        onOpenChange={()=>{
          form.reset();
          setState("idle");
        }}
      >
        <DialogTrigger asChild>
          <div className="z-10 fixed bottom-6 right-4 border-2 border-zinc-900/60 rounded-full p-3 text-white cursor-pointer hover:bg-zinc-900 bg-black transition-colors">
            <MessageCircle className="w-4 h-4" />
          </div>
        </DialogTrigger>
        
        <DialogContent 
          className="sm:max-w-md border-zinc-900/30"
          onCloseAutoFocus={(e)=> e.preventDefault()}  
        >
          {
            state === "success" ? (
              <DialogHeader className="py-10 flex flex-col items-center justify-center text-center ">
                <Send className="mx-auto h-5 w-5 mb-1" />
                <DialogTitle className="font-bold text-md">Your feedback has been received</DialogTitle>
                <DialogDescription className="text-zinc-500 mb-6 text-sm">We'll get in touch soon.</DialogDescription>
              </DialogHeader>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle className="text-start">Send us your feedback</DialogTitle>
                  <DialogDescription className="text-start text-sm">
                    Help us improve {config.app.name.toLowerCase()} with your suggestions
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                  <Textarea
                    className={cn(
                      "bg-zinc-900/10 text-zinc-300 min-h-28",
                      "border-zinc-900/50 hover:border-zinc-900/60 focus:border-zinc-900/70 focus-visible:border-zinc-900/70",
                    )}
                    placeholder={`Ideas to improve ${config.app.name.toLowerCase()}...`}
                    {...form.register("content")} 
                    />
                    <span className="text-red-700 text-xs">{form.formState.errors.content?.message}</span>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-xs space-x-2">
                        <span>Need help?</span>
                        <a href={`mailto:${config.email.help}`} className="text-blue-800" >Contact us</a>
                        <span>or</span>
                        <Link href="/docs/api-reference" className="text-blue-800">see docs</Link>
                      </div>
                      <Button size={'sm'} disabled={state === "loading"}>Send</Button>
                    </div>
                </form>
              </>
            )
          }
        </DialogContent>
      </Dialog>
    </>
  )
}