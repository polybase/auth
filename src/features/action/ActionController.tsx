import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from 'features/auth/useAuth'
import { useAction } from './useAction'
import { Action } from './ActionProvider'

export interface ActionControllerProps {
  children: React.ReactNode
}

export function ActionController ({ children }: ActionControllerProps) {
  const runOnceRef = useRef<Action|null>(null)
  const { action } = useAction()
  const { auth, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!action || loading) {
      runOnceRef.current = null
      return
    }
    if (runOnceRef.current === action) return

    // Save the action, so we only run this once per action
    runOnceRef.current = action

    // Authenticated, move to next step
    switch (action.type) {
      case 'signIn': return  navigate('/connected')
      case 'ethPersonalSign': return navigate('/sign/personal')
    }
  }, [action, auth, loading, navigate])

  return (
    <>{children}</>
  )
}