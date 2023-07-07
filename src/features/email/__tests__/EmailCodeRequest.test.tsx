/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { EmailCodeRequest } from '../EmailCodeRequest'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({})),
}))

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}))

const getEmailInput = async (screen: any) => screen.getByLabelText('email-input') as HTMLInputElement
const getSubmitBtn = async (screen: any) => screen.getByRole('button', { name: 'Continue' })
const getLoadingSubmit = async (screen: any) => screen.getByRole('button', { name: 'Loading... Continue' })

const mockUseNavigate = (navigate: jest.Mock) => {
  const mockedUseNavigate = jest.spyOn(
    require('react-router-dom'),
    'useNavigate',
  )
  mockedUseNavigate.mockReturnValue(navigate)
}

describe('email code request tests', () => {
  const navigate = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks() // Clear all mocks before each test
  })

  it('renders the email & submit button input field', async () => {
    // Arrange
    render(<EmailCodeRequest />)

    // Assert
    expect(await getEmailInput(screen)).toBeInTheDocument()
    expect(await getSubmitBtn(screen)).toBeInTheDocument()
  })

  it('updates email state when value is entered', async () => {
    // Arrange
    jest.mock('modules/common/useAsyncCallback', () => ({
      useAsyncCallback: (callback: any) => ({
        execute: callback,
        loading: false,
      }),
    }))
    render(<EmailCodeRequest />)

    // Act
    fireEvent.change(await getEmailInput(screen), { target: { value: 'test@example.com' } })

    // Assert
    expect((await getEmailInput(screen)).value).toBe('test@example.com')
  })

  it('submits the form with the entered email', async () => {
    // Arrange
    jest.mock('axios')
    mockUseNavigate(navigate)
    render(<EmailCodeRequest />)

    // Act
    fireEvent.change(await getEmailInput(screen), { target: { value: 'test@example.com' } })
    fireEvent.click(await getSubmitBtn(screen))

    // Assert
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/email/code', {
        email: 'test@example.com',
      })
      expect(useNavigate).toHaveBeenCalled()
    })
  })

  it('displays loading state when sending email', async () => {
    // Arrange
    mockUseNavigate(navigate)
    jest.mock('modules/common/useAsyncCallback', () => ({
      useAsyncCallback: (callback: any) => ({
        execute: callback,
        loading: true,
      }),
    }))
    render(<EmailCodeRequest />)

    // Act
    fireEvent.change(await getEmailInput(screen), { target: { value: 'test@example.com' } })
    fireEvent.click(await getSubmitBtn(screen))

    // Assert
    expect(await getLoadingSubmit(screen)).toBeDisabled()
  })

  it('handles error when email code request fails', async () => {
    // Arrange
    jest.mock('axios', () => ({
      post: jest.fn(() => Promise.reject({})),
    }))
    mockUseNavigate(navigate)
    render(<EmailCodeRequest />)

    // Act
    fireEvent.change(await getEmailInput(screen), { target: { value: 'test@example.com' } })
    fireEvent.click(await getSubmitBtn(screen))

    // Assert
    expect(navigate).not.toHaveBeenCalled()
  })
})