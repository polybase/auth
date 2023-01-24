import { useEffect } from 'react'
import {
  Stack,
  Button,
} from '@chakra-ui/react'
import { useAuth } from './auth/useAuth'
import { Layout } from './Layout'
import { usePenpal } from './penpal/usePenpal'

export function Success () {
  const { logout } = useAuth()
  const { close } = usePenpal()

  useEffect(() => {
    setTimeout(() => {
      close()
    }, 1000)
  }, [close])

  return (
    <Layout title='Success'>
      <Stack spacing={6}>
        <Button onClick={logout}>Logout</Button>
      </Stack>
    </Layout>
  )
}
