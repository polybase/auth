import { createContext, useEffect, useState, useMemo, useRef } from 'react'
import { connectToParent, Connection } from 'penpal'
import { useNavigate } from 'react-router-dom'

export interface AuthState {
  type: 'metamask'|'email'
  email?: string|null
  userId?: string|null
  publicKey?: string|null
}

export interface ParentFns {
  onAuthUpdate: (auth: AuthState|null) => Promise<void>
  close: () => void
}

export const PenpalContext = createContext<ParentFns>({
  onAuthUpdate: async () => {},
  close: () => {},
})

export interface PenpalProviderProps {
  children: React.ReactNode
}

export function PenpalProvider ({ children }: PenpalProviderProps) {
  const [parent, setParent] = useState<Connection<ParentFns>|null>(null)
  const navigate = useNavigate()
  const ref = useRef({
    ethPersonalSign: () => {
      // Check user is logged in
      console.log('ethPersonalSign2')
    },
    navigate: (to: string) => {
      navigate(to)
    },
  })

  useEffect(() => {
    const connection = connectToParent<ParentFns>({
      // Methods child is exposing to parent.
      methods: {
        ethPersonalSign: () => {
          ref.current.ethPersonalSign()
        },
        navigate: (to: string) => {
          ref.current.navigate(to)
        },
      },
    })
    setParent(connection)
    return () => {
      setParent(null)
      connection.destroy()
    }
  }, [])

  const value = useMemo(() => {
    return {
      onAuthUpdate: async (auth: AuthState|null) => {
        await (await parent?.promise)?.onAuthUpdate(auth)
      },
      close: async () => {
        await (await parent?.promise)?.close()
      },
    }
  }, [parent])

  return (
    <PenpalContext.Provider value={value}>
      {children}
    </PenpalContext.Provider>
  )
}

