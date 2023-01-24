import type { VercelRequest } from '@vercel/node'
import jwt from 'jsonwebtoken'
import { createError } from '../_errors'

const {
  JWT_SECRET = '',
} = process.env

export interface JWTData {
  type: 'email'
  userId: string
  publicKey?: string
}

export async function requireAuth (request: VercelRequest): Promise<JWTData> {
  const auth = await verifyAuth(request)
  if (!auth) {
    throw createError('unauthenticated')
  }
  return auth
}

export async function verifyAuth (request: VercelRequest): Promise<JWTData|null> {
  const { authorization } = request.headers

  if (!authorization || typeof authorization !== 'string') {
    return null
  }

  // Bearer <token>
  const [bearer, token] = authorization.split(' ')

  if (bearer !== 'Bearer') {
    return null
  }

  return verify(token)
}

export async function sign (data: JWTData) {
  return new Promise((resolve, reject) => {
    jwt.sign({
      iss: 'auth.polybase.xyz',
      ...data,
    }, JWT_SECRET, {
      expiresIn: '7d',
    }, (error, data) => {
      if (error) reject(error)
      else resolve(data)
    })
  })
}


export async function verify (token: string): Promise<JWTData> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (error, data) => {
      if (error) reject(error)
      else resolve(data as JWTData)
    })
  })
}