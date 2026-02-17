import { useEffect } from "react";
import { useEvent } from "../store/event";
import { useWorkspace } from "../store/workspace";
import { useApiKey } from "../store/api-key";
import { useSubscription } from "../store/subscription";
import { usePushNotification } from "@/modules/push/hook/use-push-notification";

export const useInitialAppRender = () => {

  const pushNotification = usePushNotification();
  
  useEffect(() => {
    pushNotification.registerDevice();
    pushNotification.registerServiceWorker();
  }, [])

}
export const useInitialDashboardRender = () => {

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
