import { and, eq, or } from "drizzle-orm";
import { db } from "../db"
import { pushSubscriptions , workspaceMember } from "../schemas/app"

export const pushNotificationStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

export const pushSubscriptionQuery = {
  create: async ( 
    userId: string, 
    data: { 
      endpoint: string, 
      deviceId: string, 
      deviceInfo: { userAgent: string, platform: string, browser: string, device: string } 
      keys: { auth: string, p256dh: string }
    } 
  ) => {
    await db
    .insert(pushSubscriptions)
    .values({
      userId,
      endpoint: data.endpoint,
      deviceId: data.deviceId,
      deviceInfo: data.deviceInfo,
      keys: data.keys,
      status: pushNotificationStatus.ACTIVE,
    })
  },
  create_or_update: async ( 
    userId: string, 
    data: { 
      endpoint: string, 
      deviceId: string, 
      deviceInfo: { userAgent: string, platform: string, browser: string, device: string }, 
      keys: { auth: string, p256dh: string },
      status: typeof pushNotificationStatus[keyof typeof pushNotificationStatus]
    }
  ) => {
    const response = await pushSubscriptionQuery.get({ 
      where: {
        userId,
        deviceId: data.deviceId,
        endpoint: data.endpoint,
      } 
    });

    if( response ){
      await db
        .update(pushSubscriptions )
        .set({
          endpoint: data.endpoint,
          keys: data.keys,
          status: data.status,
          deviceInfo: data.deviceInfo,
        })
        .where(
          and(
            eq(pushSubscriptions.id, response.id),
          )
        )
    } else {
      await pushSubscriptionQuery.create(userId, data);
    }
  },
  get: async ( data: { where : { deviceId: string, userId: string, endpoint?: string } } ) => {
    const { deviceId, userId, endpoint } = data.where;

    const conditions = [
      and(
        eq(pushSubscriptions .deviceId, deviceId),
        eq(pushSubscriptions .userId, userId)
      )
    ];

    // Only add endpoint match if provided
    if (endpoint) {
      conditions.push(
        and(
          eq(pushSubscriptions .endpoint, endpoint),
          eq(pushSubscriptions .userId, userId)
        )
      );
    }

    const response = await db
      .select({
        id: pushSubscriptions .id,
        endpoint: pushSubscriptions .endpoint,
      })
      .from(pushSubscriptions )
      .where(or(...conditions))
      .limit(1);

    return response.at(0);
  },
  delete: async ( data: { where: { endpoint: string } } ) => {
    await db
    .delete(pushSubscriptions )
    .where(
      eq(pushSubscriptions .endpoint, data.where.endpoint),
    )
  },
  get_workspace_members_subscriptions: async (workspaceId: string ) => {
    return await db
    .select({
      enpoint: pushSubscriptions .endpoint,
      keys: pushSubscriptions .keys,
      userId: workspaceMember.userId,
    })
    .from(workspaceMember)
    .innerJoin(pushSubscriptions , eq(workspaceMember.userId, pushSubscriptions .userId))
    .where(
      and(
        eq(workspaceMember.workspaceId, workspaceId),
      )
    );
  },
  device_list: async ( by: { userId: string } ) => {
    return await db
    .select({
      id: pushSubscriptions.id,
      endpoint: pushSubscriptions.endpoint,
      deviceId: pushSubscriptions.deviceId,
      deviceInfo: pushSubscriptions.deviceInfo,
      status: pushSubscriptions.status,
    })
    .from(pushSubscriptions)
    .where(
      eq(pushSubscriptions.userId, by.userId)
    )
  }

}