import React, { createContext, useState, useCallback, useEffect, useMemo } from 'react'
import Cookies from 'js-cookie'
import ReactGA from 'react-ga'
import * as Sentry from '@sentry/react'
import posthog from 'posthog-js'

export interface AuthContextValue {
  auth: { token: string, userId?: string|undefined|null } | null
  loading: boolean
  login: (token: string, userId?: string, email?:string|null) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue>({
  loading: true,
  auth: null,
  login: async (token: string, userId?: string, email?: string|null) => {},
  logout: async () => { console.log('demo logout') },
})

export interface AuthProviderProps {
  children: React.ReactNode
  storagePrefix?: string
  domain?: string
}

export function AuthProvider ({ children, storagePrefix = 'polybase.auth.', domain }: AuthProviderProps) {
  const tokenPath = `${storagePrefix}token`
  const userIdPath = `${storagePrefix}userId`
  const [auth, setAuth] = useState<AuthContextValue['auth']>(null)
  const [loading, setLoading] = useState(true)

  const login = useCallback(async (token: string, userId?: string, email?: string|null, loginAsUser?: boolean) => {
    Cookies.set(tokenPath, token, { domain })
    if (userId) Cookies.set(userIdPath, userId, { domain })
    if (!loginAsUser) {
      if (userId) posthog.identify(userId, { email })
      if (email) Sentry.setUser({ email, id: userId })
    }
    setAuth({ token, userId })
    ReactGA.ga('event', 'login')
  }, [tokenPath, domain, userIdPath])

  const logout = useCallback(async () => {
    Cookies.remove(tokenPath, { domain })
    Cookies.remove(userIdPath, { domain })
    posthog.reset()
    Sentry.setUser(null)
    setAuth(null)
  }, [tokenPath, domain, userIdPath])

  useEffect(() => {
    const token = Cookies.get(tokenPath)
    const userId = Cookies.get(userIdPath)
    setLoading(false)
    if (token) setAuth({ token, userId })
  }, [tokenPath, userIdPath])

  const value = useMemo(() => ({
    auth,
    loading,
    login,
    logout,
  }), [auth, loading, login, logout])

  return (
    <AuthContext.Provider value={value}
    >
      {children}
    </AuthContext.Provider>
  )
}
