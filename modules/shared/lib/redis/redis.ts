// lib/redis.ts
import { createClient } from "redis";

declare global {
  var redisInstance: ReturnType<typeof createClient> | undefined;
}

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("REDIS_URL environment variable is not set");
}

const createRedisInstance = () => {

  const isTLS = redisUrl.startsWith("rediss://") || process.env.REDIS_TLS === "true";

  const instance = createClient({
    url: redisUrl,
    socket: {
      connectTimeout: 20_000,
      reconnectStrategy: (retries) => Math.min(retries * 100, 3_000),
      ...(
        isTLS
        ? { tls: true, rejectUnauthorized: false, } 
        : { tls: false, noDelay: true, }
      )
    }
  })

  //Register listeners for connection events
  instance.on("connect", () => console.log("✅ Redis connected"));
  instance.on("ready", () => console.log("✅ Redis ready"));
  instance.on("reconnecting", () => console.log("🔄 Redis reconnecting..."));
  instance.on("end", () => console.log("🔴 Redis connection closed"));
  instance.on("error", (err) => console.error("⭕ Redis error: ", err));

  instance.connect().catch(console.error);

  return instance;
};

// ✅ Singleton guard — prevents duplicate clients on Next.js hot reload
if (!globalThis.redisInstance) {
  globalThis.redisInstance = createRedisInstance();
}

export const redis = globalThis.redisInstance;
export const isRedisReady = () => redis.isReady;
export const checkRedis = async () => {
  try {
    await redis.ping();
    console.log("✅ Redis ping successful");
  } catch (error) {
    console.error("⭕ Redis ping failed: ", error);
  }
}