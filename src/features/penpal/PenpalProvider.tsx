import { createContext, useEffect, useMemo, useRef } from 'react'
import { connectToParent, Connection } from 'penpal'
import { AuthState } from 'features/auth/types'
import { useAction } from 'features/action/useAction'
import { ActionRequest } from 'features/action/ActionProvider'

export interface ParentFns {
  onAuthUpdate: (auth: AuthState|null) => Promise<void>
  show: () => void
  hide: () => void
}

export interface PenpalContextValue {
  onAuthUpdate: (auth: AuthState|null) => Promise<void>
}

export const PenpalContext = createContext<PenpalContextValue>({
  onAuthUpdate: async () => {},
})

export interface PenpalProviderProps {
  children: React.ReactNode
}

export function PenpalProvider ({ children }: PenpalProviderProps) {
  const parentRef = useRef<Connection<ParentFns>|null>(null)
  const { setAction } = useAction()

  const ref = useRef({
    action: async (action: ActionRequest) => {
      const parent = await parentRef.current?.promise
      await parent?.show()
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
        action: (action: ActionRequest) => {
          return ref.current.action(action)
        },
      },
    })
    parentRef.current = parent
    return () => {
      parentRef.current = null
      parent.destroy()
    }
  }, [])

  const value = useMemo(() => {
    return {
      onAuthUpdate: async (auth: AuthState|null) => {
        await (await parentRef.current?.promise)?.onAuthUpdate(auth)
      },
    }
  }, [])

  return (
    <PenpalContext.Provider value={value}>
      {children}
    </PenpalContext.Provider>
  )
}

