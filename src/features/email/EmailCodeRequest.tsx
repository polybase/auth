import { useState } from 'react'
import {
  Stack,
  Input,
  Button,
} from '@chakra-ui/react'
import axios from 'axios'
import { Layout } from '../Layout'
import { useNavigate } from 'react-router-dom'
import { useAsyncCallback } from 'modules/common/useAsyncCallback'

export function EmailCodeRequest() {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()
  const sendEmail = useAsyncCallback(async (e) => {
    e.preventDefault()

    // Send email code request
    await axios.post('/api/email/code', {
      email,
    })

    // Navigate to next route
    navigate('/email/verify', {
      state: {
        email,
      },
    })
  })

  const goBack = () => {
    navigate(-1)
  }

  return (
    <Layout title='Enter email'>
      <form onSubmit={sendEmail.execute}>
        <Stack spacing={3}>
          <Input
            size='lg'
            autoFocus
            value={email}
            onChange={(e) => { setEmail(e.target.value) }}
          />
          <Button
            type='submit'
            size='lg'
            isLoading={sendEmail.loading}
          >
            Continue
          </Button>
          <Button
            size='lg'
            onClick={goBack}
          >
            Back
          </Button>
        </Stack>
      </form>
    </Layout>
  )
}