import Redis from 'ioredis'
import { env } from '../config/env.js'

export const redis = env.REDIS_URL
  ? new Redis(env.REDIS_URL)
  : null

if (redis) {
  redis.on('error', (error: Error) => {
    console.error('Redis client error', error)
  })
}

export const connectRedis = async () => {
  if (!redis) return null
  return redis
}
