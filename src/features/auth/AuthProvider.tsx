import React, { createContext, useState, useCallback, useEffect, useMemo } from 'react'
import Cookies from 'js-cookie'
import * as Sentry from '@sentry/react'
import posthog from 'posthog-js'
import { usePenpal } from 'features/penpal/usePenpal'
import { AuthState } from './types'

export interface AuthContextValue {
  auth: AuthState | null
  token: string | null
  loading: boolean
  login: (auth: AuthState, token?: string | null) => Promise<void>
  logout: () => Promise<void>
  addAllowedDomain: (domain: string) => void
  removeAllowedDomain: (domain: string) => void
  isAllowedDomain: boolean
  verifiedDomain: string | null
}

export const AuthContext = createContext<AuthContextValue>({
  loading: true,
  auth: null,
  token: null,
  login: async (auth: AuthState, token?: string | null) => { },
  logout: async () => { },
  addAllowedDomain: () => { },
  removeAllowedDomain: () => { },
  isAllowedDomain: false,
  verifiedDomain: null,
})

export interface AuthProviderProps {
  children: React.ReactNode
  storagePrefix?: string
  domain?: string
}

export function AuthProvider({ children, storagePrefix = 'polybase.auth.', domain }: AuthProviderProps) {
  const authPath = `${storagePrefix}auth`
  const tokenPath = `${storagePrefix}token`
  const domainsPath = `${storagePrefix}domains`
  const [auth, setAuth] = useState<AuthState | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [allowedDomains, setAllowedDomains] = useState<string[]>(() => {
    const domains = Cookies.get(domainsPath)
    return domains?.split(',') ?? []
  })
  const [loading, setLoading] = useState(true)
  const { onAuthUpdate, origin } = usePenpal()

  const verifiedDomain = origin ? (new URL(origin)).host : null

  const addAllowedDomain = useCallback(async (domain: string) => {
    setAllowedDomains((domains) => [...domains, domain])
  }, [])

  const removeAllowedDomain = useCallback(async (domain: string) => {
    setAllowedDomains((domains) => domains.filter((d) => d === domain))
  }, [])

  const isAllowedDomain = !!(verifiedDomain && allowedDomains?.indexOf(verifiedDomain) > -1)

  const login = useCallback(async (auth: AuthState, token?: string | null) => {
    Cookies.set(authPath, JSON.stringify(auth), { domain, sameSite: 'none', secure: true })
    setAuth(auth)
    if (verifiedDomain) addAllowedDomain(verifiedDomain)
    if (token) {
      Cookies.set(tokenPath, token, { domain, sameSite: 'none', secure: true })
      setToken(token)
    }
  }, [addAllowedDomain, authPath, domain, tokenPath, verifiedDomain])

  const logout = useCallback(async () => {
    Cookies.remove(authPath, { domain, sameSite: 'none', secure: true })
    Cookies.remove(tokenPath, { domain, sameSite: 'none', secure: true })
    Cookies.remove(domainsPath, { domain, sameSite: 'none', secure: true })
    posthog.reset()
    Sentry.setUser(null)
    setAuth(null)
  }, [authPath, domain, tokenPath, domainsPath])

  useEffect(() => {
    if (loading) return
    Cookies.set(domainsPath, allowedDomains.join(','), { domain, sameSite: 'none', secure: true })
  }, [allowedDomains, auth, authPath, domain, domainsPath, loading])

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
  }, [auth, authPath, domainsPath, onAuthUpdate, tokenPath])

  // Notify parent of login if in allowed domains
  useEffect(() => {
    if (verifiedDomain) {
      onAuthUpdate(auth && allowedDomains?.indexOf(verifiedDomain) > -1 ? auth : null)
    }
  }, [allowedDomains, auth, onAuthUpdate, verifiedDomain])

  const value: AuthContextValue = useMemo(() => ({
    auth,
    token,
    loading,
    login,
    logout,
    verifiedDomain,
    addAllowedDomain,
    removeAllowedDomain,
    isAllowedDomain,
  }), [auth, token, loading, login, logout, verifiedDomain, addAllowedDomain, removeAllowedDomain, isAllowedDomain])

  return (
    <AuthContext.Provider value={value}
    >
      {children}
    </AuthContext.Provider>
  )
}
