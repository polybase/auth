import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function Email (request: VercelRequest, response: VercelResponse) {
  const { name } = request.query
  response.status(200).send(`Hello ${name}!`)
}