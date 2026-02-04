import { useEffect } from "react"
import { useFetchApiKeys } from "@/modules/api-key/hooks/useApi"
import { useEvent } from "../store/event";
import { useWorkspace } from "../store/workspace";

export const useInitialRender = () => {

  const apiKeys = useFetchApiKeys();
  const workspace = useWorkspace();
  const event = useEvent();
  /* 
    FLOW:
    Load Api Keys ✓
    Load Workspaces ✓
    Select the last workspace Created (if any) ✓
    Load Events for the selected workspace ✓
    Satart listening to events (websocket / polling / sse)
  */
  useEffect(() => {
    apiKeys.fetchApiKeys();
    workspace.fetchWorkspaces();
    event.fetchStream();
  }, [])

}
