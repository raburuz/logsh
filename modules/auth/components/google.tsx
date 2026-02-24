"use client"

import { Button } from '@/components/ui/button'
import { authClient } from '@/modules/shared/lib/auth/client';
import { config } from '@/modules/shared/config';
import Image from 'next/image';

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
      className="w-full bg-white text-black hover:bg-white/95 cursor-pointer" 
      onClick={handleGoogleSignIn}
      >
        <Image src="/google-icon.svg" alt="Google logo" width={20} height={20} />
        <span className='font-semibold'>
          Google
        </span>
    </Button>
  )
}
