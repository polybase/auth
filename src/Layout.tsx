import { Box, Center, useColorMode } from '@chakra-ui/react'
import { useAction } from 'features/action/useAction'

export const POLYBASE_AUTH_CSS_PREFIX = 'polybase-auth-'
export const POLYBASE_AUTH_MODAL_ID = 'polybase-auth-modal'

export interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { action } = useAction()
  const { colorMode } = useColorMode()
  return (
    <Box
      height='100%'
      background='rgba(0, 0, 0, 0.75)'
      className={`${POLYBASE_AUTH_CSS_PREFIX}modal`}
      id='polybase-auth-modal'
      onClick={() => {
        action?.reject(new Error('user-cancelled-request: User closed the modal'))
      }}
    >
      <Center height='100%'>
        <Box
          onClick={(e) => {
            e.stopPropagation()
          }}
          maxW={360}
          height={400}
          width='100%'
          borderRadius='10px'
          background={colorMode === 'dark' ? '#0F1117' : '#fff'}
          box-shadow='0px 3px 6px rgb(0 0 0 / 16%), 0px 3px 6px rgb(0 0 0 / 23%)'
          backgroundPosition='top right'
          backgroundImage='url(background.png)'
          backgroundRepeat='no-repeat'
        >
          {children}
        </Box>
      </Center>
    </Box>
  )
}
