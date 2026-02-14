"use client"

import { Toaster } from '@/components/ui/sonner';
import { useInitialAppRender, useInitialDashboardRender } from '../hook/useInitialRender';

export const AppProvider = ({ children }: { children: React.ReactNode }) => {

  useInitialAppRender();

  return (
    <>
      {children}
      <Toaster position='top-center' />
    </>
  )
}


export const DashboardProvider = ({ children }: { children: React.ReactNode }) => {

  useInitialDashboardRender();

  return (
    <>
      {children}
    </>
  )
}