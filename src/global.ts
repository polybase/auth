import type { MetaMaskInpageProvider } from '@metamask/providers'

declare global {
  interface Window {
    gtag: (event: string, cat?: string, value?: string) => void
    ethereum: MetaMaskInpageProvider
  }
}

export {}
