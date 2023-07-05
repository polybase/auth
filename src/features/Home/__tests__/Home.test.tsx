import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import { Home } from 'features/Home/Home'
import * as useHasEthereumModule from 'modules/web3/useHasEthereum'

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}))

describe('home page tests', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('email btn should be clickable', () => {
    render(<Home />)

    const emailBtn = screen.getByRole('button', { name: 'Email' })
    expect(emailBtn).toHaveAttribute('to', '/email')
    expect(emailBtn).toBeEnabled()
  })

  it('install metamask btn should be clickable', () => {
    jest.spyOn(useHasEthereumModule, 'useHasEthereum').mockReturnValue(false)
    render(<Home />)

    const installMetamaskLink = screen.getByRole('link', { name: 'Install Metamask' })
    expect(installMetamaskLink).toHaveAttribute('href', 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn')
    expect(installMetamaskLink).toBeEnabled()
  })

  it('metamask btn should be clickable', () => {
    jest.spyOn(useHasEthereumModule, 'useHasEthereum').mockReturnValue(true)
    render(<Home />)

    const metamaskBtn = screen.getByRole('button', { name: 'Metamask' })
    expect(metamaskBtn).toHaveAttribute('to', '/metamask')
    expect(metamaskBtn).toBeEnabled()
  })
})