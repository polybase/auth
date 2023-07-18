import { Frame, Page } from '@playwright/test'
import { waitForPageLoaded } from '../utils/common'

export const login = {
  loginBtn(page: Page) {
    return page.getByRole('button', { name: 'Login' })
  },
  continueBtn(page: Page) {
    return page.getByRole('button', { name: 'Continue' })
  },
  signModalBtn(iframe: Frame) {
    return iframe.getByRole('button', { name: 'Sign' })
  },
  emailInput(page: Page) {
    return page.locator('input[type="email"]')
  },
}

export const fillEmailInput = async (page: Page, email: string) => {
  await page.locator('input').fill(email)
  await page.getByRole('button', { name: 'Continue' }).click()
  waitForPageLoaded(page)
  console.log('New Email: ' + email)
}

export const fillCodeInput = async (page: Page, code: string) => {
  await page.locator('input').fill(code)
  await login.continueBtn(page).click()
  await waitForPageLoaded(page)
}

export const openCodeEnteringStep = async (page: Page, email: string) => {
  await fillEmailInput(page, email)
  await page.waitForSelector(`:text("Enter the code sent to ${email}")`)
  await page.waitForSelector(':text("Enter email code")')
}

export const mockCodeSending = async (page: Page) => {
  await page.route('**/email/code', (route) => {
    route.fulfill({
      status: 200,
    })
  })
}
