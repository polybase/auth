import { usePenpal } from 'features/penpal/usePenpal'
import { createContext, useCallback, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

export interface ActionRequest {
  type: 'ethPersonalSign' | 'signIn' | 'signOut'
  data: any
}

export interface Action extends ActionRequest {
  response: any
  resolve: (resp?: any) => void
  reject: (e: Error) => void
}


export interface ActionContextValue {
  setAction: (action: ActionRequest) => Promise<any>
  action: Action | null
}

export const ActionContext = createContext<ActionContextValue>({
  setAction: async (action: ActionRequest) => { },
  action: null,
})

export interface ActionProviderProps {
  children: React.ReactNode
}

export function ActionProvider({ children }: ActionProviderProps) {
  const [action, setAction] = useState<Action | null>(null)
  const navigate = useNavigate()

  const setActionFn = useCallback((newAction: ActionRequest) => {
    // New action requested, while existing action in motion
    if (action) {
      action.reject(new Error('Action cancelled by user'))
    }

    // Return promise of new action
    return new Promise((resolve, reject) => {
      setAction({
        ...newAction,
        resolve: (val: any) => {
          setAction(null)
          navigate('/')
          resolve(val)
        },
        response: null,
        reject: (e: Error) => {
          setAction(null)
          navigate('/')
          reject(e)
        },
      })
    })
  }, [action, navigate])

  const value = useMemo(() => {
    return {
      setAction: setActionFn,
      action,
    }
  }, [setActionFn, action])

  return (
    <ActionContext.Provider value={value}>
      {children}
    </ActionContext.Provider>
  )
}