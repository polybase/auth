'use client'
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

export function Email () {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()
  const sendEmail = useAsyncCallback(async (e) => {
    e.preventDefault()

    // Send email
    await axios.post('/api/email', {
      email,
    })

    // Navigate to next route
    navigate('/email/code', {
      state: {
        email,
      },
    })
  })

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
          >
            Continue
          </Button>
        </Stack>
      </form>
    </Layout>
  )
}