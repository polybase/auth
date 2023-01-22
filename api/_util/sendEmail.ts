import { Client, TemplatedMessage } from 'postmark'

const {
  POSTMARK_KEY = '',
} = process.env

const client = new Client(POSTMARK_KEY)

const defaultVariables = {
  product_name: 'Polybase',
  year: (new Date()).getFullYear(),
  company_name: 'Polybase',
  company_address: '651 N Broad St, Suite 201, Middletown, DE 19709 US',
}

export async function sendEmail (
  templateId: 'login'|'action'|'basic',
  to: string,
  variables: any,
  data?: Partial<TemplatedMessage>,
) {
  return client.sendEmailWithTemplate({
    TemplateAlias: templateId,
    From: 'Cal <calum@polybase.xyz>',
    To: to,
    TemplateModel: {
      ...defaultVariables,
      ...(variables || {}),
    },
    ...data,
  })
}

