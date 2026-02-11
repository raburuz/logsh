"use client"

import { Button } from "@/components/ui/button"
import { authClient } from "../lib/client"

export const Logout = ( props: { className?: string }) => {

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.reload()
  }

  return (
    <Button onClick={handleLogout} size={"xs"} className={props.className}>
      Logout
    </Button>
  )
}
