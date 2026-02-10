"use client"

import { Toaster } from '@/components/ui/sonner';
import { useInitialRender } from '../hook/useInitialRender';

export const Provider = ({ children }: { children: React.ReactNode }) => {

  useInitialRender();

  return (
    <>
      {children}
      <Toaster position='top-center' />
    </>
  )
}
