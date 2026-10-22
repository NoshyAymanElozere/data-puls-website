import { expect, test as setup } from '@playwright/test'
import { ADMIN_EMAIL, ADMIN_PASSWORD } from './support/api'

setup('admin can log in through the dashboard', async ({ page }) => {
  await page.goto('login')
  await page.locator('input[name="email"]').fill(ADMIN_EMAIL)
  await page.locator('input[name="password"]').fill(ADMIN_PASSWORD)
  await page.locator('button[type="submit"]').click()

  await expect(page).not.toHaveURL(/\/login$/)
  await expect.poll(async () => (await page.context().cookies()).some((c) => c.name === 'auth_token')).toBe(true)

  await page.context().storageState({ path: './e2e/.cache/admin.json' })
})
