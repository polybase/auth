import { useEffect } from 'react'
import {
  Stack,
  Heading,
  Center,
} from '@chakra-ui/react'
import tick from 'img/tick.svg'
import { useAuth } from './auth/useAuth'
import { Layout } from './Layout'
import { useAction } from './action/useAction'

export function Success () {
  const { auth } = useAuth()
  const { action } = useAction()

  useEffect(() => {
    setTimeout(() => {
      action?.resolve(auth)
    }, 2000)
  }, [action, action?.resolve, auth])

  return (
    <Layout title='Signed In'>
      <Stack spacing={6}>
        <Center>
          <img src={tick} alt='tick' width={84} />
        </Center>
        <Stack>
          <Heading fontSize='md' lineHeight={1.7} color='bw.600'>
          You are logged in using <b>{auth?.type}</b> as:
          </Heading>
          <Heading fontSize='lg' color='bw.800'>
            {auth?.type === 'email' ? auth?.email : auth?.userId}
          </Heading>
        </Stack>
      </Stack>
    </Layout>
  )
}
