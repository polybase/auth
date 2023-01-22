export const REDIS_EMAIL_CODE_PREFIX = 'ply:auth:email:code'
export const EMAIL_CODE_LEN = 6
export const EMAIL_CODE_EXPIRY_SECONDS = 15 * 60 // 15 mins
export const EMAIL_CODE_REQUEST_THROTTLE = 60 // 1 request in 60 seconds (=> 15 over 15 mins)
export const EMAIL_CODE_VERIFY_THROTTLE = 5 * 60 // 5 mins
export const EMAIL_CODE_VERIFY_MAX = 5 // 5 codes in 5 mins