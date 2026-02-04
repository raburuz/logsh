"use server"

import { headers } from "next/headers"
import { auth } from "../lib/server"
import { AppError } from "@/modules/shared/lib/error"

const fetchSession = async () => {
  return await auth.api.getSession({
    headers: await headers(),
  })
}

// Server-side only
export const getServerSideUser = async () => {
  const session = await fetchSession();

  if(!session){
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    image: session.user.image,
    emailVerified: session.user.emailVerified,

  }

}

// Router / API / endpoints
export const getAuthenticatedUser = async () => {
  
  const session = await fetchSession();

  if(!session){
    throw new AppError( 'unauthorized','No active session found');  
  }
  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    image: session.user.image,
    emailVerified: session.user.emailVerified,
  }

}

