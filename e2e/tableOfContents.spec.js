const { test, expect } = require('@playwright/test')

test.describe('TableOfContents', () => {
  test('renders correctly', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('nav.toc > ol > li')).toHaveCount(2)
    await expect(page.locator('nav.toc > ol > li:nth-child(1) > a.toc-part')).toHaveText(
      'Creating a campaign'
    )
    await expect(page.locator('nav.toc > ol > li:nth-child(1) > ol > li')).toHaveCount(2)
    await expect(
      page.locator('nav.toc > ol > li:nth-child(1) > ol > li:nth-child(1) > a.toc-chapter')
    ).toHaveText('Getting started')
    await expect(page.locator('nav.toc > ol > li:nth-child(1) > ol > li:nth-child(1) > ol > li')).toHaveCount(
      3
    )
    await expect(
      page.locator(
        'nav.toc > ol > li:nth-child(1) > ol > li:nth-child(1) > ol > li:nth-child(1) > a.toc-section'
      )
    ).toHaveText('Installing Campaigner')
    await expect(
      page.locator(
        'nav.toc > ol > li:nth-child(1) > ol > li:nth-child(1) > ol > li:nth-child(2) > a.toc-section'
      )
    ).toHaveText('Campaign building blocks')
    await expect(
      page.locator(
        'nav.toc > ol > li:nth-child(1) > ol > li:nth-child(1) > ol > li:nth-child(3) > a.toc-section'
      )
    ).toHaveText('Running Campaigner')
    await expect(
      page.locator('nav.toc > ol > li:nth-child(1) > ol > li:nth-child(2) > a.toc-chapter')
    ).toHaveText('Components')
    await expect(page.locator('nav.toc > ol > li:nth-child(1) > ol > li:nth-child(2) > ol > li')).toHaveCount(
      4
    )
    await expect(
      page.locator(
        'nav.toc > ol > li:nth-child(1) > ol > li:nth-child(2) > ol > li:nth-child(1) > a.toc-section'
      )
    ).toHaveText('read-aloud')
    await expect(
      page.locator(
        'nav.toc > ol > li:nth-child(1) > ol > li:nth-child(2) > ol > li:nth-child(2) > a.toc-section'
      )
    ).toHaveText('encounter')
    await expect(
      page.locator(
        'nav.toc > ol > li:nth-child(1) > ol > li:nth-child(2) > ol > li:nth-child(3) > a.toc-section'
      )
    ).toHaveText('table-of-contents')
    await expect(
      page.locator(
        'nav.toc > ol > li:nth-child(1) > ol > li:nth-child(2) > ol > li:nth-child(4) > a.toc-section'
      )
    ).toHaveText('captioned-figure')
    await expect(page.locator('nav.toc > ol > li:nth-child(2) > a.toc-part')).toHaveText('Resources')
  })

  test('is functional', async ({ page }) => {
    await page.goto('/')
    await page.locator('.page').click({ force: true })
    await expect(page.locator('#show-toc-always')).toBeVisible({ timeout: 10000 })
    await page.locator('#show-toc-always').uncheck()
    await page.locator('.page').click({ force: true })
    await expect(page.locator('#show-toc-always')).toHaveCount(0, { timeout: 10000 })
    await page.locator('nav.toc').click()
    await expect(page.locator('#show-toc-always')).toBeVisible({ timeout: 10000 })
    await page.locator('#show-toc-always').check()

    const links = page.locator('.toc .toc-part, .toc .toc-chapter, .toc .toc-section')
    const count = await links.count()
    for (let i = 0; i < count; i++) {
      const link = links.nth(i)
      await expect(link).toHaveAttribute('href')
      const href = await link.getAttribute('href')
      await link.click()
      await expect(page.locator(href)).toBeVisible()
    }
  })
})
