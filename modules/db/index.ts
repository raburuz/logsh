import { db as $db } from "./db"
import { apiQuery } from "./queries/api"
import { eventQuery } from "./queries/event"
import { pushSubscriptionQuery } from "./queries/push"
import { subscriptionQuery } from "./queries/subscription"
import { workspaceQuery } from "./queries/workspace"
import { account, apikey, session, subscription ,user, verification } from "./schemas/auth"

export const db = {
  $db,
  $schemas: {
    auth: {
      user, 
      account, 
      apikey, 
      session, 
      subscription,
      verification,
    }
  },
  ...({
    workspace: workspaceQuery,
    api: apiQuery,
    event: eventQuery,
    subscription: subscriptionQuery,
    pushSubscription: pushSubscriptionQuery,
  })
} 