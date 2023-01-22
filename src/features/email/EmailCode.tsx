import { useEffect } from 'react'
import {
  Stack,
  Input,
  Text,
  Button,
} from '@chakra-ui/react'
import { Layout } from '../Layout'
import { useLocation, useNavigate } from 'react-router-dom'

export interface EmailCodeProps {
  email: string
}

export function EmailCode () {
  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state.email

  useEffect(() => {
    if (!email) {
      navigate('/')
    }
  }, [email, navigate])

  if (!email) return null

  return (
    <Layout title='Enter email code'>
      <Stack spacing={6}>
        <Stack fontSize='lg'>
          <Text>
            Enter the code sent to <Text as='b' fontSize='xl'>{email}</Text>
          </Text>
          <Text fontWeight='bold' fontSize='xl'>

          </Text>
        </Stack>
        <Input size='lg' placeholder={`Enter code sent to ${email}`} />
        <Button size='lg'>Continue</Button>
      </Stack>
    </Layout>
  )
}