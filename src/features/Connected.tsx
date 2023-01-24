import {
  Stack,
  Button,
  Heading,
} from '@chakra-ui/react'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './auth/useAuth'
import { Layout } from './Layout'

export function Connected () {
  const { auth, loading, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!auth && !loading) {
      navigate('/')
    }
  })

  return (
    <Layout title='Logged In'>
      <Stack spacing={6}>
        <Stack>
          <Heading fontSize='md' lineHeight={1.7} color='bw.600'>
          You are logged in using <b>{auth?.type}</b> as:
          </Heading>
          <Heading fontSize='lg' color='bw.800'>
            {auth?.type === 'email' ? auth?.email : auth?.userId}
          </Heading>
        </Stack>
        <Button size='lg' as={Link} to='/'>Swap Account</Button>
        <Button size='lg' variant='outline' onClick={logout}>Logout</Button>
      </Stack>
    </Layout>
  )
}
