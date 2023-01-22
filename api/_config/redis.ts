import { Redis } from 'ioredis'

const {
  REDIS_URL = 'localhost:6379',
} = process.env

export const redis = new Redis(
  REDIS_URL,
)
