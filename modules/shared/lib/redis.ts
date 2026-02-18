// lib/redis.ts
import Redis from "ioredis";

declare global {
  var _redis: Redis | undefined;
}

const REDIS_URL = process.env.REDIS_URL ?? "";

const redisInstance =
  global._redis ??
  new Redis(REDIS_URL, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    retryStrategy: times => {
      return Math.min(times * 50, 2000); // Exponential backoff
    },
    reconnectOnError: err => {
      return err.message.includes("READONLY"); 
    },
    connectTimeout: 10_000, // 10 seconds
    commandTimeout: 5_000, // 5 seconds
    keepAlive: 10_000, // 10 seconds
    enableAutoPipelining: true,
    maxLoadingRetryTime: 10_000, // 10 seconds
    // TLS configuration based on environment variable
    tls: process.env.REDIS_TLS === "true" ? {} : undefined,
  });

if (process.env.NODE_ENV !== "production") {
  global._redis = redisInstance;
}

export const isRedisReady = () => {
  return redisInstance.status === "ready";
}

export const redis = redisInstance;