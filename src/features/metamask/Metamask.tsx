import { useEffect, useState } from 'react'
import { Box, Heading, Stack, Button } from '@chakra-ui/react'
import { requestAccounts, sign, ethPersonalSignRecoverPublicKey } from '@polybase/eth'
import { Loading } from 'modules/loading/Loading'
import { Layout } from 'features/Layout'
import { useAsyncCallback } from 'modules/common/useAsyncCallback'
import { useNavigate } from 'react-router-dom'
import { useAuth } from 'features/auth/useAuth'

export function Metamask() {
  const { login } = useAuth()
  const [account, setAccount] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (account) return
    (async () => {
      const accounts = await requestAccounts()
      setAccount(accounts[0])
    })()
  }, [account])

  const onSubmit = useAsyncCallback(async () => {
    if (!account) return

    // Get 64 byte public key
    const msg = 'Sign in'
    const sig = await sign(msg, account)
    const pkWithPrefix = await ethPersonalSignRecoverPublicKey(sig, msg)
    const publicKey = '0x' + pkWithPrefix.slice(4)

    login({
      type: 'metamask',
      userId: account,
      publicKey,
    })

    navigate('/success')
  })

  const changeAccount = useAsyncCallback(async () => {
    await window.ethereum.request({
      method: 'wallet_requestPermissions',
      params: [
        {
          eth_accounts: {},
        },
      ],
    })
    setAccount(null)
  })

  const el = account ? (
    <Box>
      <Stack spacing={6}>
        <Stack>
          <Heading fontSize='md' lineHeight={1.7} color='bw.600'>
            You are connected to:
          </Heading>
          <Heading fontSize='lg' color='bw.800'>
            {account}
          </Heading>
        </Stack>
        <Stack spacing={3}>
          <Button size='lg' onClick={onSubmit.execute}>Continue</Button>
          <Button
            size='lg'
            variant='outline'
            isLoading={changeAccount.loading}
            onClick={changeAccount.execute}>
            Swap Account
          </Button>
        </Stack>
      </Stack>
    </Box>
  ) : (
    <Stack spacing={6}>
      <Loading center size='lg' loading={!account} />
      <Heading textAlign='center' fontSize='md' lineHeight={1.7} color='bw.600'>
        Select account in your <br /> Metamask wallet
      </Heading>
    </Stack>
  )

  return (
    <Layout title='Select Account'>
      <Box py={2}>
        {el}
      </Box>
    </Layout>
  )
}