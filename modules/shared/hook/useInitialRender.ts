import { useEffect } from "react";
import { useEvent } from "../store/event";
import { useWorkspace } from "../store/workspace";
import { useApiKey } from "../store/api-key";
import { useSubscription } from "../store/subscription";
import { usePushNotification } from "@/modules/push/hook/use-push-notication";

export const useInitialRender = () => {

  const apiKey = useApiKey();
  const workspace = useWorkspace();
  const event = useEvent();
  const subscription = useSubscription();
  const pushNotification = usePushNotification();
  
  useEffect(() => {
    apiKey.fetchApikeys();
    workspace.fetchWorkspaces();
    event.fetchStream();
    subscription.fetchSubscription();
    pushNotification.registerDevice();
    pushNotification.registerSW();
  }, [])

}
