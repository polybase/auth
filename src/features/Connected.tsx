import {
  Stack,
  Button,
  Heading,
  Box,
} from '@chakra-ui/react'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAction } from './action/useAction'
import { useAuth } from './auth/useAuth'
import { Layout } from './Layout'

export function Connected() {
  const { auth, loading, logout, isAllowedDomain, verifiedDomain, addAllowedDomain } = useAuth()
  const { action } = useAction()
  const navigate = useNavigate()

  useEffect(() => {
    if (loading) return
    if (!auth) {
      navigate('/')
    } else {
      if (isAllowedDomain && !action?.data?.force) {
        action?.resolve(auth)
      }
    }
  })

  const allowAccess = () => {
    if (!verifiedDomain) return
    addAllowedDomain(verifiedDomain)
    action?.resolve(auth)
  }

  const el = isAllowedDomain ? (
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
  ) : (
    <Stack spacing={6}>
      <Stack>
        <Box>
          <Heading fontSize='lg' color='bw.800' display='inline'>
            {verifiedDomain}
          </Heading>
          <Heading fontSize='md' lineHeight={1.7} color='bw.600' display='inline'> is requesting access.</Heading>
        </Box>
        <Heading fontSize='md' lineHeight={1.7} color='bw.600'>
          You are logged in using <b>{auth?.type}</b> as:
        </Heading>
        <Heading fontSize='lg' color='bw.800'>
          {auth?.type === 'email' ? auth?.email : auth?.userId}
        </Heading>
      </Stack>
      <Button size='lg' onClick={allowAccess}>Allow Access</Button>
      <Button size='lg' as={Link} variant='outline' to='/'>Swap Account</Button>
    </Stack>
  )

  return (
    <Layout title={isAllowedDomain ? 'Logged In' : 'Allow Access'}>
      {el}
    </Layout>
  )
}
