import { useEffect } from 'react'
import {
  Stack, Heading,
} from '@chakra-ui/react'
import { sign } from '@polybase/eth'
import { useAuth } from 'features/auth/useAuth'
import { useAction } from 'features/action/useAction'
import { Layout } from 'features/Layout'
import { Loading } from 'modules/loading/Loading'
import { useNavigate } from 'react-router-dom'

export function PersonalSign () {
  // const [loading, setLoading] = useState(true)
  const { auth, loading } = useAuth()
  const { action } = useAction()
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      if (loading) return

      // Invalid auth
      if (!auth) {
        navigate('/')
        return
      }

      // Request sign in
      if (auth.type === 'metamask') {
        const resp = await sign(action?.data.msg, auth.userId)
        action?.resolve(resp)
      }
    })()
  }, [action, action?.data.msg, auth, auth?.userId, loading, navigate])

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
