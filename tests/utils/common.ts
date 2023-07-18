import { Frame, Locator, Page, expect } from '@playwright/test'

const wait = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time))

const theme = {
  get red() {
    return 'rgb(229, 62, 62)'
  },
}

export const elements = {
  toast(page: Page | Frame): Locator {
    return page.locator('[id^="toast-"]').first()
  },
  toastDesc(page: Page | Frame): Locator {
    return page.locator('[id^="toast-"][id*="description"]')
  },
  menu(page: Page, name: string) {
    return page.getByRole('link', { name }).first()
  },
  validationMessage(page: Page | Frame) {
    return page.locator('[aria-label="validation-message"]')
  },
}

export const checkErrorToast = async (page: Page | Frame, text: string) => {
  const background = await elements
    .toast(page)
    .evaluate((el) => window.getComputedStyle(el).backgroundColor)
  expect(background).toEqual(common.theme.red)

  const toastDescription = elements.toastDesc(page)
  const textContent = await toastDescription.textContent()
  expect(textContent).toEqual(text)
}

export const checkValidationMessage = async (page: Page | Frame, text: string) => {
  const textColor = await elements
    .validationMessage(page)
    .evaluate((el) => window.getComputedStyle(el).color)
  expect(textColor).toEqual(common.theme.red)

  const validationText= await elements.validationMessage(page).textContent()
  expect(validationText).toEqual(text)
}

export const waitForPageLoaded = async (page: Page | Frame) =>
  page.waitForLoadState('load')

export const pathNameShouldMatchRoute = async (page: Page, path: string) =>
  expect(page.url()).toEqual('http://localhost:3000' + path)

export const common = { wait, theme }

