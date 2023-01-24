import { useAuth } from 'features/auth/useAuth'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAction } from './useAction'

export interface ActionControllerProps {
  children: React.ReactNode
}

export function ActionController ({ children }: ActionControllerProps) {
  const { action } = useAction()
  const { auth, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!action || loading || !auth) return

    // Authenticated, move to next step
    switch (action.type) {
      case 'signIn': return  navigate('/success')
      case 'ethPersonalSign': return navigate('/sign/personal')
    }
  }, [action, auth, loading, navigate])

  return (
    <>{children}</>
  )
}