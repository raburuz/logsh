"use client"

import { Button } from '@/components/ui/button'
import { authClient } from '../lib/client';

export const Google = () => {

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  }

  return (
    <Button variant="outline" className="w-full text-black" onClick={handleGoogleSignIn}>
      Login with Google
    </Button>
  )
}
