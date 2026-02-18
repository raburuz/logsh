import { RateLimiterRedis, RateLimiterMemory, IRateLimiterOptions } from "rate-limiter-flexible";
import { RateLimitError } from "./error";
import { redis, isRedisReady } from "./redis";

export const RateLimit = {

  bucket : async ( key: string, options: {
    refillAmount: number;
    refillIntervalSeg: number;
    tokensPerRequest: number;
    redisKeyPrefix?: string;
    blockDurationSeg?: number;
  } ) => {

    const rateLimiterOptions: IRateLimiterOptions = {
      keyPrefix: `rl:bucket${options.redisKeyPrefix ? `:${options.redisKeyPrefix}` : ''}`,
      // Maximum number of tokens
      points: options.refillAmount,
      // Refill interval in seconds
      duration: options.refillIntervalSeg,
      // Allow burst
      execEvenly: false,
      // no block, just fail immediately when limit is exceeded
      blockDuration: options.blockDurationSeg ?? 0,
    }

    try {

      if( isRedisReady() ) {
        const rateLimiter = new RateLimiterRedis({
          storeClient: redis,
          ...rateLimiterOptions,
        });
  
        await rateLimiter.consume(key, options.tokensPerRequest);

      } else {
        const rateLimiter = new RateLimiterMemory({
          ...rateLimiterOptions
        });

        await rateLimiter.consume(key, options.tokensPerRequest);
      }

      
    } catch (error) {
      throw new RateLimitError(
        `Rate limit exceeded. Try again after ${options.refillIntervalSeg} seconds.`,
        {
          'Retry-After': options.refillIntervalSeg.toString(),
        }
      )
    }

  },

  fixedWindow : async ( key: string, options: {
    maxRequests: number,
    windowSizeSeg: number,
    blockDurationSeg: number,
    redisKeyPrefix?: string,
  } ) => {

    try {
      const limiter = new RateLimiterRedis({
        storeClient: redis,
        keyPrefix: `rl:fixed_window${options.redisKeyPrefix ? `:${options.redisKeyPrefix}` : ''}`,
        // Maximum number of tokens
        points: options.maxRequests, 
        // Refill x tokens every x seconds
        duration: options.windowSizeSeg,
        // Allow burst
        execEvenly: false,
        // Block for x seconds if consumed more than points
        blockDuration: options.blockDurationSeg,
        // Optional: Set a short in-memory block to prevent multiple requests from hitting Redis when the limit is exceeded
        inMemoryBlockDuration: 100,
      })
  
      await limiter.consume(key);
      
    } catch (error) {

      throw new RateLimitError(
        `Rate limit exceeded. Try again after ${options.windowSizeSeg} seconds.`,
        {
          'Retry-After': options.windowSizeSeg.toString(),
        }
      )
      
    }

  }

}