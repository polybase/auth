import {
  Stack,
  Button,
} from '@chakra-ui/react'
import { useAuth } from './auth/useAuth'
import { Layout } from './Layout'

export function Success () {
  const { logout } = useAuth()
  return (
    <Layout title='Success'>
      <Stack spacing={6}>
        <Button onClick={logout} >Logout</Button>
      </Stack>
    </Layout>
  )
}
