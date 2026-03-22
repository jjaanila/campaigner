const { test, expect } = require('@playwright/test')

test.describe('Combat', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.click('[title="Add party member"]')
    await page.locator('.character-name').clear()
    await page.locator('.character-name').fill('Maukka')
    await page.click('button.encounter-start-button')
    await expect(page.locator('.combat-overlay')).toBeVisible()
    await page.locator('.initiative:has-text("Maukka") input').clear()
    await page.locator('.initiative:has-text("Maukka") input').fill('10')
    await page.locator('.initiative:has-text("Swashbuckler of Long Name Islands") input').clear()
    await page.locator('.initiative:has-text("Swashbuckler of Long Name Islands") input').fill('9')
    await page.locator('.initiative:has-text("Commoner") input').clear()
    await page.locator('.initiative:has-text("Commoner") input').fill('8')
    await page.click('.combat-initialization-start-combat-button')
  })

  test('should open and close', async ({ page }) => {
    await expect(page.locator('.party')).toBeVisible()
    await expect(page.locator('.menu')).toBeVisible()
    await expect(page.locator('.dice-overlay')).toBeVisible()
    // ToC is rendered but behind the combat overlay (Cypress treated this as not visible)
    await expect(page.locator('.combat-overlay')).toBeVisible()
    // Opens and closes with menu button
    await page.click('.menu > .combat-overlay-open-button')
    await expect(page.locator('.combat-overlay')).toHaveCount(0)
    await page.click('.menu > .combat-overlay-open-button')
    await expect(page.locator('.combat-overlay')).toBeVisible()
    // Closes if mask is clicked
    await page.locator('.combat-overlay-mask').dispatchEvent('click')
    await expect(page.locator('.combat-overlay')).toHaveCount(0)
  })

  test('should render units', async ({ page }) => {
    await expect(page.locator('.combat-turn-order .combat-character')).toHaveCount(1)
    await expect(page.locator('.combat-turn-order .combat-enemy')).toHaveCount(8)
    await expect(page.locator('.combat-turn-order .combat-ally')).toHaveCount(1)
    await expect(page.locator('.combat-grid .combat-character')).toHaveCount(1)
    await expect(page.locator('.combat-grid .combat-enemy')).toHaveCount(8)
    await expect(page.locator('.combat-grid .combat-ally')).toHaveCount(1)
  })

  test('should select unit in turn', async ({ page }) => {
    await expect(
      page.locator('.combat-turn-order .combat-turn-unit-container:nth-child(2) .turn-indicator.on')
    ).toBeVisible()
    await expect(
      page.locator('.combat-turn-order .combat-turn-unit-container .turn-indicator.on')
    ).toHaveCount(1)
    await page.click('.combat-turn-order .combat-turn-unit-container:nth-child(3) .turn-indicator')
    await expect(
      page.locator('.combat-turn-order .combat-turn-unit-container:nth-child(3) .turn-indicator.on')
    ).toBeVisible()
    await expect(
      page.locator('.combat-turn-order .combat-turn-unit-container:nth-child(2) .turn-indicator.on')
    ).toHaveCount(0)
    await expect(
      page.locator('.combat-turn-order .combat-turn-unit-container .turn-indicator.on')
    ).toHaveCount(1)
  })

  test('should move unit to new position', async ({ page }) => {
    const character = page.locator('.combat-grid .combat-character')
    await character.dispatchEvent('mousedown')
    await character.dispatchEvent('mousemove', { clientX: 0, clientY: -30 })
    await character.dispatchEvent('mouseup')
    // TODO: Should verify that the unit was actually moved to another cell
  })

  test('should remove unit', async ({ page }) => {
    await page.locator('.combat-grid .combat-ally').filter({ hasText: 'Co' }).click()
    await expect(page.locator('.combat-grid .combat-ally.selected').filter({ hasText: 'Co' })).toBeVisible()
    await expect(
      page.locator('.combat-turn-order .combat-ally.selected').filter({ hasText: 'Co' })
    ).toBeVisible()
    await expect(page.locator('.combat-unit-details').filter({ hasText: 'Commoner (ally)' })).toBeVisible()
    page.on('dialog', dialog => dialog.accept())
    await page.click('.combat-remove-units-button')
    await expect(page.locator('.combat-grid .combat-ally')).toHaveCount(0)
    await expect(page.locator('.combat-turn-order .combat-ally')).toHaveCount(0)
    await expect(page.locator('.combat-unit-details')).toHaveCount(0)
  })

  test('should roll for monster hit and damage', async ({ page }) => {
    await page.locator('.combat-turn-order > :nth-child(9) > .combat-unit > span').click()
    await page.locator('.combat-unit-details').hover()
    await expect(page.locator('.combat-unit-details .monster-action')).toBeVisible()
    await page.locator('.combat-unit-details .monster-action').hover()
    await expect(page.locator('.combat-unit-details .monster-action > .hit-mask')).toBeVisible()
    await expect(page.locator('.combat-unit-details .monster-action > .damage-mask')).toBeVisible()
    await page.click('.combat-unit-details .monster-action > .hit-mask')
    await expect(page.locator('.dice-overlay .dice-record:nth-child(1)')).toContainText('To hit with Club')
    await page.click('.combat-unit-details .monster-action > .damage-mask')
    await page.click('.dice-history')
    await expect(page.locator('.dice-overlay .dice-record:nth-child(1)')).toContainText('Club damage')
    await expect(page.locator('.dice-overlay .dice-record:nth-child(2)')).toContainText('To hit with Club')
  })
})
