"use client"

import { Button } from '@/components/ui/button'
import { authClient } from '../lib/client';

export const Google = () => {

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: `${window.location.origin}/dashboard`,
    });
  }

  return (
    <Button
      type='button' 
      variant="outline" 
      className="w-full" 
      onClick={handleGoogleSignIn}
      >
      Login with Google
    </Button>
  )
}
