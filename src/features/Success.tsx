import { useEffect } from 'react'
import {
  Stack,
  Button,
} from '@chakra-ui/react'
import { useAuth } from './auth/useAuth'
import { Layout } from './Layout'
import { useAction } from './action/useAction'

export function Success () {
  const { auth, logout } = useAuth()
  const { action } = useAction()

  // useEffect(() => {
  //   setTimeout(() => {
  //     action?.resolve()
  //   }, 1000)
  // }, [action, action?.resolve])

  return (
    <Layout title='Success'>
      <Stack spacing={6}>
        <Button onClick={logout}>Logout</Button>
      </Stack>
    </Layout>
  )
}
