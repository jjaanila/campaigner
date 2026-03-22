const { test, expect } = require('@playwright/test')

test.describe('Settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should hide ToC, Party and Dice and show them again', async ({ page }) => {
    await page.click('.menu [title="Settings"]')
    await page.click('#hide-table-of-contents')
    await expect(page.locator('nav.toc')).toHaveCount(0)
    await page.click('#hide-party')
    await expect(page.locator('.party')).toHaveCount(0)
    await page.click('#hide-dice')
    await expect(page.locator('.dice-overlay')).toHaveCount(0)

    await page.click('#hide-table-of-contents')
    await expect(page.locator('nav.toc')).toBeVisible()
    await page.click('#hide-party')
    await expect(page.locator('.party')).toBeVisible()
    await page.click('#hide-dice')
    await expect(page.locator('.dice-overlay')).toBeVisible()

    await page.locator('.page').click({ force: true })
    await expect(page.locator('#hide-table-of-contents')).toHaveCount(0)
  })
})
