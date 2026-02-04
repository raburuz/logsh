"use client"

import { Button } from "@/components/ui/button"
import { authClient } from "../lib/client"

export const Logout = () => {

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.reload()
  }

  return (
    <Button onClick={handleLogout}>
      Logout
    </Button>
  )
}
