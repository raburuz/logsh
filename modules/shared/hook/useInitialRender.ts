import { useEffect } from "react";
import { useEvent } from "../store/event";
import { useProject } from "../store/project";
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
  const project = useProject();
  const event = useEvent();
  const subscription = useSubscription();
  
  useEffect(() => {
    apiKey.fetchApikeys();
    project.fetchProject();
    event.fetchStream();
    subscription.fetchSubscription();
  }, [])

}
