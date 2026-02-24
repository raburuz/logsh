import { IEvent } from "@/modules/feed/interface"

export const maskEventIfBlocked = ( event: IEvent, mustBlock: boolean ) => {

  if(mustBlock){
    return {
      id: event.id,
      event: "event.monthly.limit.reached",
      description: "Your monthly quota has been reached. Upgrade your plan or wait for the next billing cycle to access this event.",
      icon: "🔒",
      metadata: {},
      createdAt: event.createdAt,
    } satisfies IEvent
  }

  return event;
}