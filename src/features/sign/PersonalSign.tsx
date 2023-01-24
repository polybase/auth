import { useEffect } from 'react'
import {
  Stack, Heading,
} from '@chakra-ui/react'
import { sign } from '@polybase/eth'
import { useAuth } from 'features/auth/useAuth'
import { Layout } from 'features/Layout'
import { Loading } from 'modules/loading/Loading'
import { useLocation, useNavigate } from 'react-router-dom'

export function PersonalSign () {
  // const [loading, setLoading] = useState(true)
  const { auth, loading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      if (loading) return
      if (!auth?.userId) {
        navigate('/')
        return
      }
      await sign(location.state.msg, auth?.userId)
    })()
  }, [auth?.userId, loading, location.state.msg, navigate])

  return (
    <Layout title='Personal Sign'>
      <Stack spacing={6}>
        <Loading center size='lg' loading />
        <Heading textAlign='center' fontSize='md' lineHeight={1.7} color='bw.600'>
          The app is requesting for you to sign the following request.
        </Heading>
      </Stack>
    </Layout>
  )
}
