import { useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { Home } from './features/Home/Home'
import { EmailCodeRequest } from 'features/email/EmailCodeRequest'
import { EmailCodeVerify } from 'features/email/EmailCodeVerify'
import { Metamask } from 'features/metamask/Metamask'
import { Connected } from 'features/Connected'
import { Success } from 'features/Success'
import { useIsLoggedIn } from 'features/auth/useIsLoggedIn'
import { PersonalSign } from 'features/sign/PersonalSign'
import { Layout } from 'Layout'

export default function AppRouter() {
  const [isLoggedIn, isLoggedInLoading] = useIsLoggedIn()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (isLoggedInLoading) return

    // If success, but not logged in, send to start of flow
    if (!isLoggedIn && location.pathname.startsWith('/success')) return navigate('/')

    // If sent to root, confirm login
    // if (isLoggedIn && location.pathname === '/') return navigate('/success')
  }, [location.pathname, location.state, navigate, isLoggedIn, isLoggedInLoading])

  return (
    <Layout>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/metamask' element={<Metamask />} />
        <Route path='/email' element={<EmailCodeRequest />} />
        <Route path='/email/verify' element={<EmailCodeVerify />} />
        <Route path='/sign/personal' element={<PersonalSign />} />
        <Route path='/success' element={<Success />} />
        <Route path='/connected' element={<Connected />} />
        <Route path='/*' element={<Navigate to='/' />} />
      </Routes>
    </Layout>
  )
}
