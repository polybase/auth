import type { VercelRequest } from '@vercel/node'
import crypto from 'crypto'
import { secp256k1, encodeToString, aescbc, decodeFromString } from '@polybase/util'
import * as jwt from '../_util/jwt'
import { requestHandler } from '../_util/requestHandler'
import { redis } from '../_config/redis'
import { polybase } from '../_config/polybase'
import { REDIS_EMAIL_CODE_PREFIX, EMAIL_CODE_VERIFY_THROTTLE, EMAIL_CODE_VERIFY_MAX } from './_constants'
import { createError } from '../_errors'
import { PolybaseError } from '@polybase/client'
import { getPublicKey } from '@polybase/util/dist/algorithems/secp256k1'
import { EmailUser } from '../_types'

const {
  ENCRYPTION_KEY = '',
} = process.env

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
      'EX', EMAIL_CODE_VERIFY_THROTTLE, 'NX')

    // Incr failed counter
    await redis.incr(`${REDIS_EMAIL_CODE_PREFIX}:${email}:failed`)

    throw createError('auth/invalid-email-code')
  }

  // Delete the used code
  await Promise.all([
    redis.del(`${REDIS_EMAIL_CODE_PREFIX}:${email}`),
    redis.del(`${REDIS_EMAIL_CODE_PREFIX}:${email}:request`),
  ])

  // Get userId (sha256 of email)
  const userId = `0x${crypto.createHash('sha256').update(email).digest('hex')}`

  // Does user already exist?
  const user = await polybase.collection<EmailUser>('email').record(userId).get().catch((e) => {
    if (e instanceof PolybaseError && e.reason === 'record/not-found') {
      return null
    }
    throw e
  })

  let privateKey

  if (!user?.exists()) {
    // Generate public/private key pair
    privateKey = await secp256k1.generatePrivateKey()

    // Encrypt private key
    const encryptedPvKey = await aescbc.symmetricEncryptToEncoding(
      decodeFromString(ENCRYPTION_KEY, 'hex'),
      encodeToString(privateKey, 'hex'),
      'hex',
    )

    // Encrypt email
    const encryptedEmail = await aescbc.symmetricEncryptToEncoding(
      decodeFromString(ENCRYPTION_KEY, 'hex'),
      email,
      'hex',
    )

    // Create the user
    await polybase.collection('email').create([userId, encryptedEmail, encryptedPvKey])
  } else {
    // Decode existing user private key
    const privateKeyStr = await aescbc.symmetricDecryptFromEncoding(
      decodeFromString(ENCRYPTION_KEY, 'hex'),
      user.data.pvkey,
      'hex',
    )
    privateKey = decodeFromString(privateKeyStr, 'hex')
  }

  // Get 64 byte public key
  const publicKey = encodeToString(getPublicKey(privateKey).slice(1), 'hex')

  // Create the token for user
  const token = await jwt.sign({
    type: 'email',
    userId,
    publicKey,
  })

  return {
    userId,
    publicKey,
    token,
  }
})
