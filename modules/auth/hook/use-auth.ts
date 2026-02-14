import { authClient } from "../lib/client";

export const useAuth = () => {

  const fetchSession = async () => {
    const session = await authClient.getSession({
      query: {
        disableCookieCache: true
      }
    });

    return session.data;
  }

  return {
    fetchSession
  }
} 