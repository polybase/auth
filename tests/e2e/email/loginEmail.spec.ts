/* eslint-disable testing-library/prefer-screen-queries */
import { test, expect } from '@playwright/test'
import { faker } from '@faker-js/faker'
import { fillCodeInput, fillEmailInput, login, openCodeEnteringStep, mockCodeSending } from '../../selectors/login.selectors'
import { waitForPageLoaded, checkErrorToast } from '../../utils/common'

test.describe('email login', async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForPageLoaded(page)
    await page.getByRole('link', { name: 'Email' }).click()
  })

  test('renders the email & submit button input field', async ({ page }) => {
    // Assert
    expect(login.emailInput(page)).not.toBeNull()
    expect(login.continueBtn(page)).not.toBeNull()
  })

  test('when enter email, expected input state to be updated', async ({ page }) => {
    // Act
    await login.emailInput(page).fill('test@example.com')

    // Assert
    expect(await login.emailInput(page)!.getAttribute('value')).toBe('test@example.com')
  })

  test('when login with empty email field, expected validation to be displayed', async ({ page }) => {
    // Act
    await login.continueBtn(page).click()
    await page.waitForSelector('[id^="toast"]')

    // Assert
    await checkErrorToast(page, 'Invalid email address')
  })

  test('when login with invalid format of email, expected validation to be displayed', async ({ page }) => {
    // Act
    await fillEmailInput(page, '12345')

    // Assert
    expect(page.locator('h2:text("Enter email")')).toBeVisible()
    expect(await login.emailInput(page).getAttribute('value')).toEqual('12345')
  })

  test('when submit the form with the entered email, expected request to be sent with correct data', async ({ page }) => {
    // Arrange
    const email = 'random@test.com'
    let interceptedRequest

    await page.route('**/email/code', async (route, request) => {
      interceptedRequest = request
      await route.continue()
    })

    // Act
    await login.emailInput(page).fill(email)
    await login.continueBtn(page).click()
    const requestBody = JSON.parse(await interceptedRequest.postData())

    // Assert
    expect(interceptedRequest.method()).toBe('POST')
    expect(requestBody.email).toEqual(email)
  })

  test('when enter login and receive error from be, expected error to be correctly handled', async ({ page }) => {
    // Arrange
    await page.route('**/email/code', (route) => {
      route.abort()
    })

    // Act
    await login.emailInput(page).fill('test@example.com')
    await login.continueBtn(page).click()
    await page.waitForSelector('[id^="toast"]')

    // Assert
    await checkErrorToast(page, 'Network Error')
  })

  test('when enter code, expected input state to be updated', async ({ page }) => {
    // Arrange
    const code = '12345'
    const fakeEmail = faker.internet.userName() + '@mailto.plus'
    await mockCodeSending(page)
    await openCodeEnteringStep(page, fakeEmail)

    // Act
    await page.fill('input', code)

    // Assert
    expect(await page.locator('input').inputValue()).toEqual(code)
  })

  test('when login with empty code input, expected validation to be displayed', async ({ page }) => {
    // Arrange
    const fakeEmail = faker.internet.userName() + '@mailto.plus'
    await mockCodeSending(page)
    await openCodeEnteringStep(page, fakeEmail)

    // Act
    await login.continueBtn(page).click()

    // Assert
    await checkErrorToast(page, 'Invalid code, must be 6 numbers')
  })

  test('when login with invalid format of the verification code (less than 6 digits), expected validation to be displayed', async ({ page }) => {
    // Arrange
    const fakeEmail = faker.internet.userName() + '@mailto.plus'
    await mockCodeSending(page)
    await openCodeEnteringStep(page, fakeEmail)

    // Act
    await fillCodeInput(page, '12345')

    // Assert
    await checkErrorToast(page, 'Invalid code, must be 6 numbers')
  })

  test('when login with invalid format of the verification code (more than 6 digits), expected validation to be displayed', async ({ page }) => {
    // Arrange
    const fakeEmail = faker.internet.userName() + '@mailto.plus'
    await mockCodeSending(page)
    await openCodeEnteringStep(page, fakeEmail)

    // Act
    await fillCodeInput(page, '1234567')

    // Assert
    await checkErrorToast(page, 'Invalid code, must be 6 numbers')
  })

  test('when login with invalid format of the verification code (letters), expected validation to be displayed', async ({ page }) => {
    // Arrange
    const fakeEmail = faker.internet.userName() + '@mailto.plus'
    await mockCodeSending(page)
    await openCodeEnteringStep(page, fakeEmail)

    // Act
    await fillCodeInput(page, 'abcdef')

    // Assert
    await checkErrorToast(page, 'Invalid code, must be 6 numbers')
  })

  test('when login with invalid verification code, expected error to be displayed', async ({ page }) => {
    // Arrange
    const fakeEmail = faker.internet.userName() + '@mailto.plus'
    await mockCodeSending(page)
    const response = {
      error: {
        code: 'failed-precondition',
        message: 'Email code is invalid or has expired',
        reason: 'auth/invalid-email-code',
      },
    }
    await page.route('**/email/verify', (route) => {
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify(response),
      })
    })
    await openCodeEnteringStep(page, fakeEmail)

    // Act
    await fillCodeInput(page, '123456')

    // Assert
    await checkErrorToast(page, 'Email code is invalid or has expired')
  })

  test('when login with email & code, expected request with correct data to be sent', async ({ page, request }) => {
    // Arrange
    let interceptedRequest
    const code = '123456'
    await mockCodeSending(page)
    await page.route('**/email/verify', async (route, request) => {
      interceptedRequest = request
      await route.continue()
    })
    const fakeEmail = faker.internet.userName() + '@mailto.plus'
    await openCodeEnteringStep(page, fakeEmail)

    // Act
    await fillCodeInput(page, code)
    const requestBody = JSON.parse(await interceptedRequest.postData())

    expect(interceptedRequest.method()).toBe('POST')
    expect(requestBody.email).toEqual(fakeEmail)
    expect(requestBody.code).toEqual(code)
  })

  test('when login with email & code and receive error from be, expected error to be correclty handled', async ({ page, request }) => {
    // Arrange
    const code = '123456'
    await mockCodeSending(page)
    await page.route('**/email/verify', async (route) => {
      await route.abort()
    })
    const fakeEmail = faker.internet.userName() + '@mailto.plus'
    await openCodeEnteringStep(page, fakeEmail)

    // Act
    await fillCodeInput(page, code)
    await page.waitForSelector('[id^="toast"]')

    // Assert
    await checkErrorToast(page, 'Network Error')
  })
})
