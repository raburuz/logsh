import { checkRedis } from "./modules/shared/lib/redis/redis";

// This file is responsible for registering any instrumentation or monitoring services, such as Redis health checks, that need to be initialized when the application starts. 
export const register = async () => {

  await checkRedis();

}