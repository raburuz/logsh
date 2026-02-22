"use client"

import { Button } from '@/components/ui/button'
import { authClient } from '@/modules/shared/lib/auth/client';
import { config } from '@/modules/shared/config';

export const Google = () => {

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: `${window.location.origin}${config.redirects.toDashboard}`,
      newUserCallbackURL: `${window.location.origin}${config.redirects.toOnboarding}`,
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
