import Redis from "ioredis"
import { IEventSse } from "@/modules/event/interface";

const redis = new Redis(process.env.REDIS_URL ?? '')

/**
 * Publish event to user's channel
 * Cost: 1 PUBLISH command
 */
export const publishEvent = async ( data: IEventSse) => {

  // Publish to user-specific channel
  await redis.publish(getChannelName(data.userId), JSON.stringify(data));

}

export const getChannelName = (userId: string): string => `user:${userId}`;