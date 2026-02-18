import { db as $db } from "./db"
import { eventQuery } from "./queries/event"
import { projectQuery } from "./queries/project"
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
    project: projectQuery,
    workspace: workspaceQuery,
    event: eventQuery,
    subscription: subscriptionQuery,
    pushSubscription: pushSubscriptionQuery,
  })
} 