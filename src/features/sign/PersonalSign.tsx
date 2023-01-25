import { useEffect, useRef, useState, useCallback } from 'react'
import {
  Stack, Heading, Button, Box, Spacer,
} from '@chakra-ui/react'
import { sign } from '@polybase/eth'
import { useAuth } from 'features/auth/useAuth'
import { useAction } from 'features/action/useAction'
import { Layout } from 'features/Layout'
import { Loading } from 'modules/loading/Loading'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAsyncCallback } from 'modules/common/useAsyncCallback'

export function PersonalSign () {
  const signRefLoading = useRef(false)
  const [error, setError] = useState<boolean>(false)
  const { auth, token, loading } = useAuth()
  const { action } = useAction()
  const navigate = useNavigate()

  const msg = action?.data?.msg
  const userId = auth?.userId
  const authType = auth?.type

  useEffect(() => {
    // Missing auth
    if (!loading && !userId) {
      navigate('/')
    }
  }, [loading, navigate, userId])

  const polybaseSign = useAsyncCallback(async () => {
    const res = await axios.post('/api/ethPersonalSign', {
      msg,
    }, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    action?.resolve(res.data.sig)
  })

  const metamaskSign = useCallback(async () => {
    if (!userId || signRefLoading.current) return
    signRefLoading.current = true
    setError(false)
    try {
      const resp = await sign(msg, userId)
      action?.resolve(resp)
    } catch (e) {
      signRefLoading.current = false
      setError(true)
    }
  }, [action, msg, userId])

  useEffect(() => {
    (async () => {
      if (loading) return

      // Invalid auth
      if (!userId) {
        navigate('/')
        return
      }

      // Request sign in
      if (authType === 'metamask' && !signRefLoading.current) {
        try {
          await metamaskSign()
        } catch (e: any) {
          signRefLoading.current = false
          setError(true)
        }
      }
    })()
  }, [action, msg, userId, loading, navigate, authType, setError, metamaskSign])

  return (
    <Layout title='Personal Sign'>
      <Stack spacing={6} h='full'>
        <Loading center size='lg' loading={!error && authType === 'metamask'} />
        <Heading textAlign='center' fontSize='md' lineHeight={1.7} color='bw.600'>
          {error ? 'An error occurred, try again.' : 'The app is requesting for you to sign the following request.'}
        </Heading>
        {error && authType === 'metamask' && <Button onClick={metamaskSign}>Try Again</Button>}
        {authType !== 'metamask' && (
          <Box flex='1 1 auto'>
            <code>
              {msg}
            </code>
          </Box>
        )}
        <Spacer dir='' />
        {authType !== 'metamask' && <Button size='lg' onClick={polybaseSign.execute} isLoading={polybaseSign.loading}>Sign</Button>}
      </Stack>
    </Layout>
  )
}
