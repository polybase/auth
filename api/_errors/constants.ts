export const ERROR_CODES = {
  'invalid-argument': 400,
  'failed-precondition': 400,
  'out-of-range': 400,
  unauthenticated: 401,
  'permission-denied': 403,
  'not-found': 404,
  'method-not-allowed': 405,
  aborted: 409,
  'already-exists': 409,
  'resource-exhausted': 429,
  cancelled: 499,
  unavailable: 500,
  internal: 500,
  'deadline-exceeded': 504,
}

export const ERROR_REASONS = {
  'not-found': { code: 'not-found', message: 'Not found' },
  'unauthenticated': { code: 'unauthenticated', message: 'Authentication missing' },
  'server-error': { code: 'internal', message: 'An internal error occured' },
  'required-fields': { code: 'invalid-argument', message: 'Required field is missing' },
  'invalid-argument': { code: 'invalid-argument', message: 'Invalid arguments' },
  'missing-relation': { code: 'internal', message: 'A required relation is missing' },
  'too-many-requests': { code: 'resource-exhausted', message: 'Too many requests' },
  'method-not-allowed': { code: 'method-not-allowed', message: 'Invalid method' },

  'auth/user-id-not-found': { code: 'not-found', message: 'User ID not found' },
  'auth/invalid-email': { code: 'invalid-argument', message: 'Invalid email address' },
  'auth/invalid-email-code': { code: 'failed-precondition', message: 'Email code is invalid or has expired' },
  'auth/too-many-code-requests': { code: 'resource-exhausted', message: 'Too many codes requested, try again in 60 seconds' },
  'auth/too-many-code-verifications': { code: 'resource-exhausted', message: 'Too many codes requested, try again in 5 minutes' },
  'auth/empty-signature-message': { code: 'invalid-argument', message: 'Cannot create signature with empty message' },
}
