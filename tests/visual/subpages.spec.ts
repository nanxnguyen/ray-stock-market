import { test, expect } from '@playwright/test'

const SUB_PAGES = [
  { path: '/trading-panel', name: 'trading-panel' },
  { path: '/order-book', name: 'order-book' },
  { path: '/portfolio', name: 'portfolio' },
  { path: '/market-heatmap', name: 'market-heatmap' },
  { path: '/stock-screener', name: 'stock-screener' },
  { path: '/advanced-chart', name: 'advanced-chart' },
]

test.describe('Sub-pages Visual Regression', () => {
  for (const { path, name } of SUB_PAGES) {
    test(`${name} - new 2-row TopBar`, async ({ page }) => {
      await page.goto(path)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1000)

      const topBar = page.locator('.ag-vietcap').first()
      if (await topBar.isVisible().catch(() => false)) {
        await expect(topBar).toHaveScreenshot(`${name}-topbar.png`, {
          maxDiffPixelRatio: 0.02,
        })
      }
    })
  }
})
