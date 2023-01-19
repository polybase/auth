'use client';
import { 
  Heading, 
  Stack, 
  Input, 
  Center, 
  Button, 
  Box 
} from '@chakra-ui/react'

export default function Home() {
  return (
    <Center width='100%' height='100%' as='main'>
       <Box>
        <Stack spacing={3}>
            <Heading color='bw.800'>Sign in with Email</Heading>
            <Input size='lg' />
            <Button size='lg'>Continue</Button>
          </Stack>
       </Box>
    </Center>
  )
}
