import {
  Heading,
  Stack,
  Box,
} from '@chakra-ui/react'

export interface LayoutProps {
  title: string
  children: React.ReactNode
}

export function Layout({ title, children }: LayoutProps) {
  return (
    <Box width='100%' height='100%' p={8}>
      <Stack spacing={6} display='block' h='full'>
        <Heading color='bw.800'>{title}</Heading>
        <Box height='100%'>
          {children}
        </Box>
      </Stack>
    </Box>
  )
}
