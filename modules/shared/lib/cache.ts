import { redis } from "./redis"

export const cacheKey = {
  subscription: ( userId: string ) => `subscription:${userId}`,
}

export const setCache = ( key: string, value: string, ttlAsSeconds?: number ) => {
  if (ttlAsSeconds) {
    return redis.set(key, value, "EX", ttlAsSeconds);
  }
  return redis.set(key, value);
}

export const getCache = async <T>( key: string ): Promise<{ status: true, value: T } | { status: false, value: null }> => {
  try {
    const value = await redis.get(key);
    
    if (value === null) {
      return { status: false, value: null };
    }
    
    return {
      status: true,
      value: JSON.parse(value) as T,
    }
  
  } catch (error) {
    return {
      status: false,
      value: null,
    }
  }
}