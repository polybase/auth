import { useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import ReactGA from 'react-ga'
import { Home } from './features/Home'
import { Email } from 'features/email/Email'
import { EmailCode } from 'features/email/EmailCode'

export default function AppRouter () {
  // const [isLoggedIn, isLoggedInLoading] = useIsLoggedIn()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    ReactGA.set({ page: location.pathname })
    ReactGA.pageview(location.pathname)
  }, [location.pathname])

  // useEffect(() => {
  //   if (!isLoggedIn && !isLoggedInLoading && location.pathname.startsWith('/d')) return navigate('/')
  // }, [location.pathname, location.state, navigate, isLoggedIn, isLoggedInLoading])

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/email' element={<Email />} />
      <Route path='/email/code' element={<EmailCode />} />
      <Route path='/*' element={<Navigate to='/' />} />
    </Routes>
  )
}
