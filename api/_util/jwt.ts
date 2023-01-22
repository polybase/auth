import jwt from 'jsonwebtoken'

const {
  JWT_SECRET = '',
} = process.env

export function sign (data: any) {
  const token = jwt.sign({
    iss: 'auth.polybase.xyz',
    ...data,
  }, JWT_SECRET, {
    expiresIn: '7d',
  })
  return token
}