import type { VercelRequest } from '@vercel/node'
import * as jwt from '../_util/jwt'
import { requestHandler } from '../_util/requestHandler'
import { redis } from '../_config/redis'
import { REDIS_EMAIL_CODE_PREFIX, EMAIL_CODE_VERIFY_THROTTLE, EMAIL_CODE_VERIFY_MAX } from './_constants'
import { createError } from '../_errors'

export default requestHandler('POST', async (request: VercelRequest) => {
  const { code, email } = request.body

  // Check brute force - no more than X verifications in X min period
  const counter = await redis.get(`${REDIS_EMAIL_CODE_PREFIX}:${email}:failed`)
  if (counter && parseInt(counter, 10) > EMAIL_CODE_VERIFY_MAX) {
    throw createError('auth/too-many-code-verifications')
  }

  // Get code from redis
  const redisCode = await redis.get(`${REDIS_EMAIL_CODE_PREFIX}:${email}`)

  // Code invalid or expired
  if (!redisCode) {
    throw createError('auth/invalid-email-code')
  }

  // Code not latest requested
  if (redisCode !== code) {
    // Set failed counter (if not already set)
    await redis.set(`${REDIS_EMAIL_CODE_PREFIX}:${email}:failed`, 0,
      'EX', EMAIL_CODE_VERIFY_THROTTLE, 'NX', 'KEEPTTL' as any)

    // Incr failed counter
    await redis.incr(`${REDIS_EMAIL_CODE_PREFIX}:${email}:failed`)

    throw createError('auth/invalid-email-code')
  }

  // Delete the used code
  await redis.del(`${REDIS_EMAIL_CODE_PREFIX}:${email}`)

  // Does user already exist?
  const userId = '123'

  // Create the token for user
  const token = jwt.sign({
    userId,
  })

  return {
    userId,
    token,
  }
})