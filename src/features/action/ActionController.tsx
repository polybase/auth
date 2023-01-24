import { useAuth } from 'features/auth/useAuth'
// import { usePenpal } from 'features/penpal/usePenpal'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAction } from './useAction'

export interface ActionControllerProps {
  children: React.ReactNode
}

export function ActionController ({ children }: ActionControllerProps) {
  const { action } = useAction()
  const auth = useAuth()
  const navigate = useNavigate()
  // const { hide } = usePenpal

  useEffect(() => {
    if (!action) {
      return
      // return hide()
    }

    if (!auth) {
      navigate('/')
    }

    const login = () => {
      if (auth) {
        navigate('/success')
      }
    }

    const sign = () => {
      if (auth) {
        navigate('/sign/personal')
      }
    }

    // New action, map actions to a starting point
    switch (action.type) {
      case 'login': return login()
      case 'sign': return sign()
    }
  }, [action, auth, navigate])

  return (
    <>{children}</>
  )
}