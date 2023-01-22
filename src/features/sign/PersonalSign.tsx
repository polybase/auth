import {
  Stack,
} from '@chakra-ui/react'
import { Layout } from 'features/Layout'

export function PersonalSign () {
  return (
    <Layout title='Personal Sign'>
      <Stack spacing={6}>
        The app is requesting for you to sign the following request.
      </Stack>
    </Layout>
  )
}
