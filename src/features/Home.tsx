import {
  Stack,
  Button,
  ButtonProps,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import metamask from 'img/metamask.svg'
import email from 'img/email.svg'
import { Layout } from './Layout'
import { useHasEthereum } from 'modules/web3/useHasEthereum'

export function Home() {
  const hasEthereum = useHasEthereum()
  const installMetamaskProps = hasEthereum ? {
    as: Link,
    to: '/metamask',
  } : {
    as: 'a',
    target: '_blank',
    href: 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
  } as ButtonProps

  return (
    <Layout title='Sign in'>
      <Stack spacing={6}>
        <Button
          {...installMetamaskProps}
          justifyContent='start'
          leftIcon={<img src={metamask} alt='metamask' width={22} />}
          size='lg'
          textAlign='left'
        >
          {hasEthereum ? 'Metamask' : 'Install Metamask'}
        </Button>
        <Button
          size='lg'
          justifyContent='start'
          leftIcon={<img src={email} alt='metamask' width={20} />}
          as={Link}
          to='/email'
        >
          Email
        </Button>
      </Stack>
    </Layout>
  )
}
