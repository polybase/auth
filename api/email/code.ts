import type { VercelRequest } from '@vercel/node'
import { customAlphabet } from 'nanoid'
import { requestHandler } from '../_util/requestHandler'
import { sendEmail } from '../_util/sendEmail'
import { redis } from '../_config/redis'
import { isValidEmail } from '../_util/validEmail'
import { createError } from '../_errors'
import {
  EMAIL_CODE_LEN,
  REDIS_EMAIL_CODE_PREFIX,
  EMAIL_CODE_REQUEST_THROTTLE,
} from './_constants'

const nanoid = customAlphabet('1234567890', EMAIL_CODE_LEN)

export default requestHandler('POST', async (request: VercelRequest) => {
  const { email } = request.body

  if (!isValidEmail(email)) {
    throw createError('auth/invalid-email')
  }

  // Check if already recently requested code
  const res = await redis.get(`${REDIS_EMAIL_CODE_PREFIX}:${email}`)
  if (res) {
    throw createError('auth/too-many-code-requests')
  }

  // Create code
  const code = nanoid()

  // Save code in redis
  await redis.set(
    `${REDIS_EMAIL_CODE_PREFIX}:${email}`, code,
    'EX', EMAIL_CODE_REQUEST_THROTTLE,
  )

  // Send code in email to user
  await sendEmail('login', email, {
    subject: 'Login with email',
    header: 'Login code for email',
    title: 'Hi',
    action_code_desc: 'Copy the code below to login:',
    action_code: code,
  })

  return {
    status: 'OK',
  }
})