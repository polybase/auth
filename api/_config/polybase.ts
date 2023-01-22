import { Polybase } from '@polybase/client'
import { ethPersonalSign } from '@polybase/eth'
import { decodeFromString } from '@polybase/util'

const PRIVATE_KEY = process.env.PRIVATE_KEY ?? ''

export const polybase = new Polybase({
  baseURL: `${process.env.API_URL}/v0`,
  defaultNamespace: 'polybase/apps/auth',
  signer: async (data) => {
    const privateKey = Buffer.from(decodeFromString(PRIVATE_KEY, 'hex'))
    return { h: 'eth-personal-sign', sig: ethPersonalSign(privateKey, data) }
  },
})
