"use client"

import { Button } from "@/components/ui/button"
import { authClient } from "@/modules/shared/lib/auth/client"

export const Logout = ( props: { className?: string }) => {

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.reload()
  }

  return (
    <Button onClick={handleLogout} size={"xs"} className={props.className}>
      logout
    </Button>
  )
}
