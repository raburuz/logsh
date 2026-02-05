"use client"

import { useInitialRender } from '../hook/useInitialRender';

export const Provider = ({ children }: { children: React.ReactNode }) => {

  useInitialRender();

  return (
    <>
      {children}
    </>
  )
}
