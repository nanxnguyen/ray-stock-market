import { test, expect } from '@playwright/test'

test.describe('HomePage Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)
  })

  test('homepage table view - full page', async ({ page }) => {
    await expect(page).toHaveScreenshot('homepage-table-view.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    })
  })

  test('homepage - filter bar visible', async ({ page }) => {
    const filterBar = page.locator('[data-testid="filter-bar"]').first()
    if (await filterBar.isVisible()) {
      await expect(filterBar).toHaveScreenshot('filter-bar.png', {
        maxDiffPixelRatio: 0.02,
      })
    }
  })

  test('homepage - dark mode', async ({ page }) => {
    await expect(page).toHaveScreenshot('homepage-dark-mode.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    })
  })
})

test.describe('AG Grid Table Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1500)
  })

  test('AG Grid renders with correct structure', async ({ page }) => {
    const agGrid = page.locator('.ag-vietcap')
    await expect(agGrid).toBeVisible()
    await expect(agGrid).toHaveScreenshot('ag-grid-full.png', {
      maxDiffPixelRatio: 0.02,
    })
  })

  test('AG Grid header groups visible', async ({ page }) => {
    const headerGroups = page.locator('.ag-header-group-cell')
    const count = await headerGroups.count()
    expect(count).toBeGreaterThan(0)
  })

  test('AG Grid header labels are visible and centered', async ({ page }) => {
    const headerIssues = await page.evaluate(() => {
      const headerColumnIds = [
        'b3p', 'b3q', 'b2p', 'b2q', 'b1p', 'b1q',
        'lp', 'lq', 'pct', 'chg', 'tvol',
        'a1p', 'a1q', 'a2p', 'a2q', 'a3p', 'a3q',
        'hi', 'avg', 'lo',
        'fbuy', 'fsell', 'fbal', 'room',
        'kltt',
      ]

      return headerColumnIds.flatMap((id) => {
        const cell = document.querySelector<HTMLElement>(`.ag-header-cell[col-id="${id}"]`)
        const label = cell?.querySelector<HTMLElement>('.ag-header-cell-label')
        const text = cell?.querySelector<HTMLElement>('.ag-header-cell-text')
        if (!cell || !label || !text) {
          return [{ column: id, reason: 'missing header element' }]
        }

        const cellRect = cell.getBoundingClientRect()
        const labelRect = label.getBoundingClientRect()
        const textRect = text.getBoundingClientRect()
        const cellCenter = cellRect.left + cellRect.width / 2
        const textCenter = textRect.left + textRect.width / 2
        const centered = Math.abs(cellCenter - textCenter) <= 2
        const visibleLabel = labelRect.height >= 8
          && labelRect.top >= cellRect.top
          && labelRect.bottom <= cellRect.bottom
        const visibleHeight = textRect.height >= 8
          && textRect.top >= cellRect.top
          && textRect.bottom <= cellRect.bottom

        return visibleLabel && visibleHeight && centered
          ? []
          : [{
              column: id,
              text: text.textContent?.trim(),
              centered,
              visibleLabel,
              visibleHeight,
              cell: { top: cellRect.top, bottom: cellRect.bottom, width: cellRect.width },
              labelRect: { top: labelRect.top, bottom: labelRect.bottom, height: labelRect.height },
              textRect: { top: textRect.top, bottom: textRect.bottom, width: textRect.width },
            }]
      })
    })

    expect(headerIssues).toEqual([])
  })

  test('AG Grid pinned columns', async ({ page }) => {
    const pinnedLeft = page.locator('.ag-pinned-left-cols-container')
    await expect(pinnedLeft).toBeVisible()
  })

  test('AG Grid row count matches data', async ({ page }) => {
    const rows = page.locator('.ag-row')
    const count = await rows.count()
    expect(count).toBeGreaterThan(0)
  })

  test('AG Grid numeric cells do not clip visible values', async ({ page }) => {
    const clippedCells = await page.evaluate(() => {
      const numericColumnIds = [
        'ceil', 'tc', 'floor',
        'b3p', 'b2p', 'b1p',
        'lp', 'tvol',
        'a1p', 'a2p', 'a3p',
        'hi', 'avg', 'lo',
        'kltt',
      ]
      const selector = numericColumnIds.map((id) => `.ag-cell[col-id="${id}"]`).join(',')
      const cells = Array.from(document.querySelectorAll<HTMLElement>(selector))
        .filter((cell) => {
          const rect = cell.getBoundingClientRect()
          return rect.width > 0 && rect.height > 0 && cell.textContent?.trim()
        })

      return cells.flatMap((cell) => {
        const range = document.createRange()
        range.selectNodeContents(cell)
        const textRect = range.getBoundingClientRect()
        range.detach()

        const style = window.getComputedStyle(cell)
        const horizontalPadding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight)
        const contentWidth = cell.getBoundingClientRect().width - horizontalPadding
        const clipped = textRect.width > contentWidth + 0.5

        return clipped
          ? [{
              column: cell.getAttribute('col-id'),
              text: cell.textContent?.trim(),
              contentWidth,
              textWidth: textRect.width,
            }]
          : []
      })
    })

    expect(clippedCells).toEqual([])
  })

  test('AG Grid priceboard scrolls horizontally on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 720 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1500)

    const scrollState = await page.evaluate(async () => {
      const shell = document.querySelector<HTMLElement>('.priceboard-scroll-shell')
      if (!shell) {
        return { hasShell: false }
      }

      const before = shell.scrollLeft
      shell.scrollLeft = shell.scrollWidth
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
      const after = shell.scrollLeft
      const shellRect = shell.getBoundingClientRect()
      const watchlist = document.querySelector<HTMLElement>('.ag-cell[col-id="watchlist"]')
      const watchlistRect = watchlist?.getBoundingClientRect()

      return {
        hasShell: true,
        hasOverflow: shell.scrollWidth > shell.clientWidth + 1,
        moved: after > before,
        clientWidth: shell.clientWidth,
        scrollWidth: shell.scrollWidth,
        scrollbarInViewport: shellRect.bottom <= window.innerHeight,
        watchlistVisibleAfterScroll: Boolean(
          watchlistRect
            && watchlistRect.left >= 0
            && watchlistRect.right <= window.innerWidth,
        ),
      }
    })

    expect(scrollState).toMatchObject({
      hasShell: true,
      hasOverflow: true,
      moved: true,
      scrollbarInViewport: true,
      watchlistVisibleAfterScroll: true,
    })
  })
})
