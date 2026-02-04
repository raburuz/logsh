"use client";

import { ApiService } from "@/modules/api-key/service";
import { useInitialRender } from "../hook/useInitialRender";
import { SubscriptionService } from "@/modules/payment/service";

export const Providers = ( { children }: { children: React.ReactNode } ) => {
  return (
    <>
      {/* Add other providers here as needed */}
      <ApiService>
        <SubscriptionService>
          {children}
        </SubscriptionService>
        <Loader />
      </ApiService>
    </>
  )
}


export const Loader = () => {
  useInitialRender()
  return (
    <></>
  )
}