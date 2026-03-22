const { test, expect } = require('@playwright/test')
const AxeBuilder = require('@axe-core/playwright').default

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should not be violated', async ({ page }) => {
    const results = await new AxeBuilder({ page }).analyze()

    expect(results.violations).toEqual([])
  })
})
