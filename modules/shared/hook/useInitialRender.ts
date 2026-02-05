import { useEffect } from "react";
import { useEvent } from "../store/event";
import { useWorkspace } from "../store/workspace";
import { useApiKey } from "../store/api-key";
import { useSubscription } from "../store/subscription";

export const useInitialRender = () => {

  const apiKey = useApiKey();
  const workspace = useWorkspace();
  const event = useEvent();
  const subscription = useSubscription();
  
  useEffect(() => {
    apiKey.fetchApikeys();
    workspace.fetchWorkspaces();
    event.fetchStream();
    subscription.fetchSubscription();
  }, [])

}
