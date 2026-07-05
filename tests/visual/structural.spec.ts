import { test, expect } from '@playwright/test'

/**
 * Structural Assertions — independent of screenshot baselines.
 * These catch layout regressions that pixel-comparison might miss
 * (e.g. flex-direction wrong, elements hidden, count changed).
 */

test.describe('IndexStrip structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1500)
  })

  test('all 5 indices render horizontally', async ({ page }) => {
    const positions = await page.evaluate(() => {
      // Query within the IndexStrip container (first child of .home-page-shell)
      // to avoid matching the TopBar ticker duplicate of "VN-Index"
      const strip = document.querySelector('.home-page-shell')?.firstElementChild
      if (!strip) return []
      const names = ['VN-Index', 'VN30-Index', 'HNX-Index', 'HNX30', 'UPCOM']
      return names.map(name => {
        const el = Array.from(strip.querySelectorAll('span, div')).find(
          e => e.childNodes.length <= 3 && e.textContent?.trim() === name,
        )
        if (!el) return { name, found: false }
        const r = el.getBoundingClientRect()
        return { name, found: true, x: Math.round(r.x), y: Math.round(r.y) }
      })
    })

    const found = positions.filter(p => p.found)
    expect(found.length).toBe(5)

    // All must be visible (inside viewport)
    for (const p of found) {
      expect(p.x).toBeGreaterThanOrEqual(0)
      expect(p.x).toBeLessThan(1920)
    }

    // Must be horizontal: same y-row (within 30px tolerance)
    const ys = found.map(p => p.y)
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)
    expect(maxY - minY).toBeLessThan(30)
  })

  test('IndexStrip container uses flex-row layout', async ({ page }) => {
    const flexDir = await page.evaluate(() => {
      const strip = document.querySelector('.home-page-shell')?.firstElementChild
      return strip ? getComputedStyle(strip).flexDirection : null
    })
    expect(flexDir).toBe('row')
  })

  test('IndexStrip children are side by side (not stacked)', async ({ page }) => {
    const positions = await page.evaluate(() => {
      const strip = document.querySelector('.home-page-shell')?.firstElementChild
      if (!strip) return []
      const vals = Array.from(strip.querySelectorAll('[class*="text-xl"]'))
      return vals.map(el => {
        const r = el.getBoundingClientRect()
        return { x: Math.round(r.x), y: Math.round(r.y) }
      }).filter(p => p.x > 0 && p.y > 0 && p.y < 200)
    })
    // Should have multiple values at similar y positions (horizontal)
    if (positions.length >= 2) {
      const ys = positions.map(p => p.y)
      const maxY = Math.max(...ys)
      const minY = Math.min(...ys)
      expect(maxY - minY).toBeLessThan(30)
    }
  })

  test('each index card shows value and sparkline SVG', async ({ page }) => {
    const cards = await page.evaluate(() => {
      const strip = document.querySelector('.home-page-shell')?.firstElementChild
      if (!strip) return { found: false }
      const items = strip.querySelectorAll('[class*="flex-1"]')
      return {
        found: true,
        count: items.length,
        hasSvg: Array.from(items).every(item => item.querySelector('svg polyline')),
      }
    })
    expect(cards.found).toBe(true)
    expect(cards.count).toBeGreaterThanOrEqual(5)
    expect(cards.hasSvg).toBe(true)
  })
})

test.describe('FilterBar structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1500)
  })

  test('filter bar renders with all group buttons', async ({ page }) => {
    const groups = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'))
      const labels = ['Danh mục quan tâm', 'HOSE', 'HNX', 'UPCOM', 'Phái Sinh', 'Chứng Quyền', 'Ngành', 'Trái phiếu']
      return buttons
        .map(b => b.textContent?.trim() ?? '')
        .filter(t => labels.some(label => t.includes(label)))
    })
    expect(groups.length).toBeGreaterThanOrEqual(5)
  })

  test('search input is visible and functional', async ({ page }) => {
    const input = page.locator('input[placeholder*="Tìm mã"]').first()
    await expect(input).toBeVisible()
    await input.fill('VNM')
    await page.waitForTimeout(300)
    // Input should have value
    await expect(input).toHaveValue('VNM')
  })
})

test.describe('Layout structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1500)
  })

  test('page has correct flex layout hierarchy', async ({ page }) => {
    const layout = await page.evaluate(() => {
      // Layout shell: flex col h-screen
      const shell = document.querySelector('.flex.flex-col')
      const shellStyle = shell ? getComputedStyle(shell) : null

      // Home page: flex col
      const homeShell = document.querySelector('.home-page-shell')
      const homeStyle = homeShell ? getComputedStyle(homeShell) : null

      // Index strip: flex (horizontal)
      const indexStrip = homeShell?.firstElementChild
      const stripStyle = indexStrip ? getComputedStyle(indexStrip) : null

      // Table view container: home-page-view
      const tableView = document.querySelector('.home-page-view')
      const tableStyle = tableView ? getComputedStyle(tableView) : null

      return {
        shellFlex: shellStyle?.flexDirection,
        homeFlex: homeStyle?.flexDirection,
        stripFlex: stripStyle?.flexDirection,
        tableOverflow: tableStyle?.overflow,
        hasAgGrid: !!document.querySelector('.ag-vietcap'),
      }
    })

    expect(layout.shellFlex).toBe('column')
    expect(layout.homeFlex).toBe('column')
    expect(layout.stripFlex).toBe('row')
    expect(layout.tableOverflow).toBe('hidden')
    expect(layout.hasAgGrid).toBe(true)
  })

  test('AG Grid has data rows', async ({ page }) => {
    const grid = await page.evaluate(() => {
      const rows = document.querySelectorAll('.ag-row')
      const cells = document.querySelectorAll('.ag-cell')
      return { rowCount: rows.length, cellCount: cells.length }
    })
    expect(grid.rowCount).toBeGreaterThan(0)
    expect(grid.cellCount).toBeGreaterThan(grid.rowCount)
  })
})

test.describe('GlobalMarketsPanel structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1500)
  })

  test('market tabs render (My, Chau Au, Chau A, Hang hoa)', async ({ page }) => {
    const tabs = await page.evaluate(() => {
      // Tabs are <span> elements inside GlobalMarketsPanel, not buttons
      const spans = Array.from(document.querySelectorAll('span'))
      const labels = ['Mỹ', 'Châu Âu', 'Châu Á', 'Hàng hoá']
      return spans
        .map(s => s.textContent?.trim() ?? '')
        .filter(t => labels.some(label => t.includes(label)))
    })
    expect(tabs.length).toBeGreaterThanOrEqual(3)
  })

  test('market data shows index names (Dow Jones, S&P 500, Nasdaq)', async ({ page }) => {
    const names = await page.evaluate(() => {
      return ['Dow Jones', 'S&P 500', 'Nasdaq'].map(name => {
        const el = Array.from(document.querySelectorAll('*')).find(
          e => e.textContent?.includes(name) && e.getBoundingClientRect().width > 0,
        )
        return { name, found: !!el }
      })
    })
    const found = names.filter(n => n.found)
    expect(found.length).toBeGreaterThanOrEqual(2)
  })
})
