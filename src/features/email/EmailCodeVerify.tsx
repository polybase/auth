import { useEffect, useState } from 'react'
import {
  Stack,
  Input,
  Text,
  Button,
} from '@chakra-ui/react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAsyncCallback } from 'modules/common/useAsyncCallback'
import { useAuth } from 'features/auth/useAuth'
import { Layout } from '../Layout'
import { useAction } from 'features/action/useAction'

export function EmailCodeVerify () {
  const [code, setCode] = useState('')
  const { login } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state.email

  useEffect(() => {
    if (!email) {
      navigate('/')
    }
  }, [email, navigate])

  const onSubmit = useAsyncCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (code.length !== 6 || isNaN(parseInt(code, 10))) {
      throw new Error('Invalid code, must be 6 numbers')
    }

    // Verify email code
    const res = await axios.post('/api/email/verify', {
      email,
      code,
    })

    login({
      type: 'email',
      userId: res.data.userId,
      email,
    }, res.data.token)

    navigate('/success')
  })

  if (!email) return null

  return (
    <Layout title='Enter email code'>
      <form onSubmit={onSubmit.execute}>
        <Stack spacing={6}>
          <Stack fontSize='lg'>
            <Text>
            Enter the code sent to <Text as='b' fontSize='xl'>{email}</Text>
            </Text>
            <Text fontWeight='bold' fontSize='xl'>

            </Text>
          </Stack>
          <Input
            size='lg'
            placeholder={`Enter code sent to ${email}`}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button type='submit' size='lg' isLoading={onSubmit.loading}>Continue</Button>
        </Stack>
      </form>
    </Layout>
  )
}