import { createContext, useEffect, useMemo, useRef, useState } from 'react'
import { connectToParent, Connection } from 'penpal'
import { AuthState } from 'features/auth/types'
import { useAction } from 'features/action/useAction'
import { ActionRequest } from 'features/action/ActionProvider'

export interface ParentFns {
  onAuthUpdate: (auth: AuthState | null) => Promise<void>
  show: () => void
  hide: () => void
}

export interface PenpalContextValue {
  origin: string | null
  onAuthUpdate: (auth: AuthState | null) => Promise<void>
}

export const PenpalContext = createContext<PenpalContextValue>({
  origin: null,
  onAuthUpdate: async () => { },
})

export interface PenpalProviderProps {
  children: React.ReactNode
}

export interface Register {
  domain: string
}

export function PenpalProvider({ children }: PenpalProviderProps) {
  const parentRef = useRef<Connection<ParentFns> | null>(null)
  const [parent, setParent] = useState<Connection<ParentFns> | null>(null)
  const { setAction } = useAction()
  const [origin, setOrigin] = useState<null | string>(null)

  const ref = useRef({
    action: async (action: ActionRequest) => {
      const parent = await parentRef.current?.promise
      if (action.type !== 'signOut') {
        await parent?.show()
      }
      try {
        const res = await setAction(action)
        await parent?.hide()
        return res
      } catch (e) {
        await parent?.hide()
        throw e
      }
    },
  })

  useEffect(() => {
    const parent = connectToParent<ParentFns>({
      // Methods child is exposing to parent.
      methods: {
        register: (register: Register) => {
          setOrigin(register.domain)
        },
        action: (action: ActionRequest) => {
          if (!origin) {
            throw new Error('Domain must be registered')
          }
          return ref.current.action(action)
        },
      },
      parentOrigin: origin ?? undefined,
    })
    setParent(parent)
    parentRef.current = parent
    return () => {
      parentRef.current = null
      parent.destroy()
    }
  }, [origin])

  const value = useMemo(() => {
    return {
      origin,
      onAuthUpdate: async (auth: AuthState | null) => {
        if (!parentRef.current) return
        await (await parent?.promise)?.onAuthUpdate(auth)
      },
    }
  }, [origin, parent])

  return (
    <PenpalContext.Provider value={value}>
      {children}
    </PenpalContext.Provider>
  )
}

