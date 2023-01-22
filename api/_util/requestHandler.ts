
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { ApiError } from '../_errors/ApiError'
import { createError } from '../_errors/createError'

export function requestHandler (method: 'GET'|'POST', fn: (request: VercelRequest, response: VercelResponse) => Promise<any>) {
  return async (request: VercelRequest, response: VercelResponse)  => {
    try {
      if (request.method !== method) {
        throw createError('method-not-allowed', { message: `Invalid method, expected ${method} got ${request.method}` })
      }

      const res = await fn(request, response)
      response.status(200).json(res)
    } catch (originalError: any) {
      // Handle the error
      let error: ApiError = originalError

      if (!(error instanceof ApiError)) {
        error = createError('server-error', {
          originalError,
        })
      }

      if (process.env.NODE_ENV !== 'production' || error.error?.log) {
        console.log(originalError)
      }

      const {
        code, message, data, reason, statusCode,
      } = error?.toJSON() ?? {}

      // TODO: Notify Sentry
      const out = {
        error: {
          code,
          message,
          data,
          reason,
        },
      }

      response.status(statusCode ?? 500).json(out)
    }
  }
}