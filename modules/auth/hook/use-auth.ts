import { useState } from "react";
import { authClient } from "../lib/client";

export const useAuth = () => {

  const [isLoading, setIsLoading] = useState(true);

  const fetchSession = async () => {
    setIsLoading(true);
    const session = await authClient.getSession({
      query: {
        disableCookieCache: true
      }
    });
    setIsLoading(false);

    return session.data;
  }

  return {
    fetchSession,
    isLoading,
  }
} 