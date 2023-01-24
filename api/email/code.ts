import type { VercelRequest } from '@vercel/node'
import * as useragent from 'useragent'
import { customAlphabet } from 'nanoid'
import { requestHandler } from '../_util/requestHandler'
import { sendEmail } from '../_util/sendEmail'
import { redis } from '../_config/redis'
import { isValidEmail } from '../_util/validEmail'
import { createError } from '../_errors'
import {
  EMAIL_CODE_LEN,
  REDIS_EMAIL_CODE_PREFIX,
  EMAIL_CODE_EXPIRY_SECONDS,
  EMAIL_CODE_REQUEST_THROTTLE,
} from './_constants'

const nanoid = customAlphabet('1234567890', EMAIL_CODE_LEN)

export default requestHandler('POST', async (request: VercelRequest) => {
  const { email } = request.body

  if (!isValidEmail(email)) {
    throw createError('auth/invalid-email')
  }

  // Check if already recently requested code
  const res = await redis.get(`${REDIS_EMAIL_CODE_PREFIX}:${email}:request`)
  if (res) {
    throw createError('auth/too-many-code-requests')
  }

  // Create code
  const code = nanoid()

  // Save code in redis
  await Promise.all([
    redis.set(
      `${REDIS_EMAIL_CODE_PREFIX}:${email}`, code,
      'EX', EMAIL_CODE_EXPIRY_SECONDS,
    ),
    redis.set(
      `${REDIS_EMAIL_CODE_PREFIX}:${email}:request`, '1',
      'EX', EMAIL_CODE_REQUEST_THROTTLE,
    ),
  ])

  // Send code in email to user
  const codef = `${code.substring(0, 3)} ${code.substring(3)}`
  const agent = useragent.parse(request.headers['user-agent']).toString()
  const date = new Intl.DateTimeFormat('en-GB', { dateStyle: 'full', timeStyle: 'long', timeZone: 'America/New_York' }).format(new Date())
  await sendEmail('login', email, {
    subject: 'Login with email',
    header: `Login with Polybase code: ${codef}`,
    title: 'Login with Polybase',
    action_code: `${codef}`,
    before: [
      {
        this: 'Copy the code below to login:',
      },
    ],
    after: [
      {
        this: `This code expires in 15 minutes. Code was requested from <b>${agent}</b> on <b>${date}</b>.`,
      },
    ],
    before_text: [
      {
        this: 'Copy the code below to login:',
      },
    ],
    after_text: [
      {
        this: `This code expires in 15 minutes. Code was requested from ${agent} on ${date}.`,
      },
    ],
  }, { From: 'Login <calum@polybase.xyz>' })

  return {
    status: 'OK',
  }
})