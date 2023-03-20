import { createContext, useCallback, useState, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export interface ActionRequest {
  type: 'ethPersonalSign' | 'signIn' | 'signOut'
  data: any
}

export interface Action extends ActionRequest {
  response: any
  resolve: (resp?: any) => void
  reject: (e: Error) => void
  promise: Promise<any>
}


export interface ActionContextValue {
  addAction: (action: ActionRequest) => Promise<any>
  action: Action | null
}

export const ActionContext = createContext<ActionContextValue>({
  addAction: async (action: ActionRequest) => { },
  action: null,
})

export interface ActionProviderProps {
  children: React.ReactNode
}

export function ActionProvider({ children }: ActionProviderProps) {
  const [action, setAction] = useState<Action | null>(null)
  const actionRef = useRef<Action | null>(null)
  const queueRef = useRef<Action[]>([])
  const navigate = useNavigate()

  const addActionFn = useCallback((newActionRequest: ActionRequest) => {
    // Return promise of new action
    let resolve: (value: unknown) => void
    let reject: (reason?: any) => void
    const p = new Promise((_resolve, _reject) => {
      resolve = _resolve
      reject = _reject
    })

    const newAction = {
      ...newActionRequest,
      resolve: (val: any) => {
        navigate('/')
        const nextAction = queueRef.current.shift() ?? null
        actionRef.current = nextAction
        setAction(nextAction)
        resolve(val)
      },
      reject: (e: Error) => {
        navigate('/')
        const nextAction = queueRef.current.shift() ?? null
        actionRef.current = nextAction
        setAction(nextAction)
        reject(e)
      },
      promise: p,
      response: null,
    }

    // Cancel sign in if we receive sign request
    if (actionRef.current?.type === 'signIn') {
      // User requesting sign in again
      if (newAction.type === 'signIn') {
        return actionRef?.current.promise
      }
      actionRef.current.reject(new Error('Sign In cancelled by user'))
    }

    // New action requested, while existing action in motion
    if (actionRef.current && actionRef.current.type !== 'signIn') {
      queueRef.current.push(newAction)
    } else {
      actionRef.current = newAction
      setAction(newAction)
    }

    return p
  }, [navigate])

  const value = useMemo(() => {
    return {
      addAction: addActionFn,
      action,
    }
  }, [addActionFn, action])

  return (
    <ActionContext.Provider value={value}>
      {children}
    </ActionContext.Provider>
  )
}