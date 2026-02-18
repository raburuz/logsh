import webpush, { PushSubscription, SendResult  } from "web-push";
import { PushNotification } from "./interface";
import { db } from "../db";

const errorCodes = new Set([404, 410]);

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT ?? '',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? '',
  process.env.VAPID_PRIVATE_KEY ?? '',
)

const sendPushNotification = async ({
  message,
  endpoint,
  keys,
}:{
  message: string;
  endpoint: string;
  keys: {
    auth: string,
    p256dh: string,
  }
}) => {

  const pushSubscriptionOptions: PushSubscription = {
    endpoint,
    keys,
  }
  
  try {
    await webpush.sendNotification(
      pushSubscriptionOptions, 
      message
    );

  } catch (error) {
    const result = error as unknown as SendResult;
    if(errorCodes.has(result.statusCode)) {
      db.pushSubscription.delete_by_endpoint({ where: { endpoint } });
    }
  }

}

export const sendNotificationToWorkspaceMembers = async ( workspaceId: string, message: PushNotification ) => {

  const push = await db.pushSubscription.get_members_subscriptions(workspaceId);

  push.forEach( async (member) => {
    await sendPushNotification({
      endpoint: member.endpoint,
      keys: member.keys,
      message: JSON.stringify(message),
    })
  })

}