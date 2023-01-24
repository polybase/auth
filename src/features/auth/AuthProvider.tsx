import React, { createContext, useState, useCallback, useEffect, useMemo } from 'react'
import Cookies from 'js-cookie'
import * as Sentry from '@sentry/react'
import posthog from 'posthog-js'
import { usePenpal } from 'features/penpal/usePenpal'
import { AuthState } from 'features/penpal/PenpalProvider'

export interface AuthContextValue {
  auth: AuthState | null
  token: string|null
  loading: boolean
  login: (auth: AuthState, token?: string|null) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue>({
  loading: true,
  auth: null,
  token: null,
  login: async (auth: AuthState, token?: string|null) => {},
  logout: async () => { console.log('demo logout') },
})

export interface AuthProviderProps {
  children: React.ReactNode
  storagePrefix?: string
  domain?: string
}

export function AuthProvider ({ children, storagePrefix = 'polybase.auth.', domain }: AuthProviderProps) {
  const authPath = `${storagePrefix}auth`
  const tokenPath = `${storagePrefix}token`
  const [auth, setAuth] = useState<AuthState|null>(null)
  const [token, setToken] = useState<string|null>(null)
  const [loading, setLoading] = useState(true)
  const { onAuthUpdate } = usePenpal()

  const login = useCallback(async (auth: AuthState, token?: string|null) => {
    Cookies.set(authPath, JSON.stringify(auth), { domain, sameSite: 'none', secure: true })
    setAuth(auth)
    if (token) {
      Cookies.set(tokenPath, token)
      setToken(token)
    }
  }, [authPath, domain, tokenPath])

  const logout = useCallback(async () => {
    Cookies.remove(authPath, { domain, sameSite: 'none', secure: true })
    posthog.reset()
    Sentry.setUser(null)
    setAuth(null)
  }, [authPath, domain])

  useEffect(() => {
    if (auth) return
    const authStr = Cookies.get(authPath)
    const token = Cookies.get(tokenPath)
    if (authStr) {
      const auth = JSON.parse(authStr)
      setAuth(auth)
    }
    if (token) setToken(token)
    setLoading(false)
  }, [auth, authPath, onAuthUpdate, tokenPath])

  useEffect(() => {
    onAuthUpdate(auth)
  }, [auth, onAuthUpdate])

  const value: AuthContextValue = useMemo(() => ({
    auth,
    token,
    loading,
    login,
    logout,
  }), [auth, token, loading, login, logout])

  return (
    <AuthContext.Provider value={value}
    >
      {children}
    </AuthContext.Provider>
  )
}
