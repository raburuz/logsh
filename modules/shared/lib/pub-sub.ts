import { redis, isRedisReady } from "./redis";
import { IEventSse } from "@/modules/feed/interface";

/**
 * Publish event to user's channel
 * Cost: 1 PUBLISH command
 */
export const publishEvent = async ( data: IEventSse) => {

  if(!isRedisReady()) {
    console.log('Redis is not ready, skipping event publish');
    return;
  }
  // Publish to user-specific channel
  try {
    const channel = getChannelName(data.userId);
    const message = JSON.stringify(data);
    await redis.publish(channel, message);
  } catch (error) {
    console.log('Error publishing event:', error);
  }

}

export const getChannelName = (userId: string): string => `user:${userId}`;