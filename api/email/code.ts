import type { VercelRequest } from '@vercel/node'
import { customAlphabet } from 'nanoid'
import { requestHandler } from '../_util/requestHandler'
import { sendEmail } from '../_util/sendEmail'
import { redis } from '../_config/redis'
import { isValidEmail } from '../_util/validEmail'
import { createError } from '../_errors'

const nanoid = customAlphabet('1234567890', 6)
const REDIS_EMAIL_CODE_PREFIX = 'ply:email:code'
const EMAIL_CODE_EXPIRY_SECONDS = 15 * 60 // 15 minutes

export default requestHandler('POST', async (request: VercelRequest) => {
  const { email } = request.body

  if (!isValidEmail(email)){
    throw createError('invalid-email')
  }

  const id = nanoid()

  // TODO: Check if email exists

  // Set code in redis
  await redis.set(`${REDIS_EMAIL_CODE_PREFIX}:${id}`, email, 'EX', EMAIL_CODE_EXPIRY_SECONDS)

  // Send email
  await sendEmail('login', email, {
    subject: 'Login with email',
    header: 'Login code for email',
    title: 'Hi',
    action_code_desc: 'Copy the code below to login:',
    action_code: id,
  })

  return {
    status: 'OK',
  }
})