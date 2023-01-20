import {
  Heading,
  Stack,
  Box,
} from '@chakra-ui/react'

export interface LayoutProps {
  title: string
  children: React.ReactNode
}

export function Layout ({ title, children }: LayoutProps) {
  return (
    <Box width='100%' p={8}>
      <Stack spacing={6}>
        <Heading color='bw.800'>{title}</Heading>
        <Box>
          {children}
        </Box>
      </Stack>
    </Box>
  )
}