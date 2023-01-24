export interface AuthState {
  type: 'metamask'|'email'
  userId: string
  email?: string|null
  publicKey?: string|null
}
