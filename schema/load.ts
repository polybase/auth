import { Polybase } from '@polybase/client'
import { ethPersonalSign } from '@polybase/eth'
import { decodeFromString } from '@polybase/util'

const schema = `
collection email {
  id: string;
  email: string;
  pvkey: string;

  constructor (id: string, email: string, pvkey: string) {
    this.id =  id;
    this.email = email;
    this.pvkey = pvkey;
  }
}
`

const PRIVATE_KEY = process.env.PRIVATE_KEY ?? ''

async function load () {
  const db = new Polybase({
    baseURL: `${process.env.API_URL}/v0`,
    signer: async (data) => {
      const privateKey = Buffer.from(decodeFromString(PRIVATE_KEY, 'hex'))
      return { h: 'eth-personal-sign', sig: ethPersonalSign(privateKey, data) }
    },
  })

  if (!PRIVATE_KEY) {
    throw new Error('No private key provided')
  }

  await db.applySchema(schema, 'polybase/apps/auth')

  return 'Schema loaded'
}

load()
  .then(console.log)
  .catch(console.error)
