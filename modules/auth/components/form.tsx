"use client"

import z from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { config } from "@/modules/shared/config"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Google } from "./google"
import { authClient } from "../lib/client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const schema = z.object({
  email: z.email("Invalid email address"),
});

type ISchema = z.infer<typeof schema>;

export function AuthForm() {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISchema>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  const magicLink = ( data: ISchema) => {
    authClient.signIn.magicLink({
      email: data.email,
      callbackURL: `${origin}/dashboard`,
      newUserCallbackURL: `${origin}/dashboard`,
    });
  }

  return (
    <form onSubmit={handleSubmit(magicLink)}>
      <Card className="w-96 bg-black text-white/80 border border-zinc-900/50" >
        <CardHeader>
          <CardTitle>Sign in to your account</CardTitle>
          <CardDescription>
            Enter your email below to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  className="border-white/20"
                  id="email"
                  type="email"
                  placeholder={`m@${config.app.name.toLowerCase()}.com`}
                  {...register("email")}
                />
                {
                  errors.email && (
                    <p className="text-xs text-red-500">
                      {errors.email.message}
                    </p>
                  )
                }
              </div>
            </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
            Login with Email
          </Button>
          <Google/>
        </CardFooter>
      </Card>
    </form>
  )
}
