export interface AuthState {
  type: 'metamask'|'email'
  email?: string|null
  userId?: string|null
  publicKey?: string|null
}
