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
import { authClient } from "@/modules/shared/lib/auth/client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"

const schema = z.object({
  email: z.email("Invalid email address"),
});

type ISchema = z.infer<typeof schema>;

export function AuthForm() {

  const [isLoginPage, setIsLoginPage] = useState<boolean>(true);
  const [isClicked, setIsClicked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISchema>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  const magicLink = async ( data: ISchema) => {
    setIsClicked(true);
    setError(null);
    setMessage(null);
    const resp = await authClient.signIn.magicLink({
      email: data.email,
      callbackURL: `${origin}${config.redirects.toDashboard}`,
      newUserCallbackURL: `${origin}${config.redirects.toOnboarding}`,
    });
    if (resp.error) {
      setError(resp.error.message ?? 'An error occurred while sending the magic link. Please try again.');
      setIsClicked(false);
      return;
    }
    setMessage('Magic link sent! Please check your email to sign in.');
  }

  return (
    <div>
      <form onSubmit={handleSubmit(magicLink)}>
        <Card className="py-11 px-1 w-96 bg-zinc-900/20 text-zinc-300 border border-zinc-900/10" >
          <CardHeader>
            <CardTitle>{isLoginPage ? "Sign in to your account" : "Create an account"}</CardTitle>
            <CardDescription>
              Enter your email below to {isLoginPage ? "sign in to your account" : "create an account"}.
            </CardDescription>
          </CardHeader>
          <CardContent>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    className="border-zinc-900/20"
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
            {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
            {message && <p className="text-xs text-green-500 mb-2">{message}</p>}
            <div className="w-full pb-4">
              <Button type="submit" className="w-full" disabled={isClicked}>
                { isLoginPage ? "Send magic link" : "Create account" }
              </Button>
            </div>
            <Google/>
          </CardFooter>
        </Card>
      </form>
      <div className="text-sm text-center text-zinc-500 mt-4">
        {isLoginPage ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          type="button"
          className="text-blue-500 hover:underline"
          onClick={() => setIsLoginPage(!isLoginPage)}
        >
          {isLoginPage ? "Sign up" : "Sign in"}
        </button>
      </div>
    </div>
  )
}
