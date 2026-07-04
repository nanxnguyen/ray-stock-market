# Market Heatmap Treemap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the placeholder MarketHeatmap page with a full squarified treemap visualization of ~85 Vietnamese stocks, including color mapping, gradient legend, and top movers summary.

**Architecture:** Single self-contained React component (`MarketHeatmap.tsx`) using SVG for treemap rendering. All logic (data generation, layout algorithm, color mapping) lives in the same file. Uses inline styles with CSS variables from the design system. No external dependencies needed.

**Tech Stack:** React (memo, useState, useMemo, useCallback), SVG, CSS variables (`--ds-*` tokens)

## Global Constraints

- All styles must use inline `style={{ }}` with CSS variables from `--ds-*` tokens
- Dark mode is default (CSS variables handle this)
- Component name: `MarketHeatmapPage` (default export)
- Function name: `MarketHeatmapPageInner`
- After editing, run `npx tsc --noEmit` to verify no type errors
- Vietnamese stock conventions: ceiling = +7% (tím), floor = -7% (xanh lam), 0% = vàng
- Use `memo()` wrapper for the component

---

## File Structure

- **Modify:** `src/pages/MarketHeatmap.tsx` — full implementation (single file, ~350-400 lines)
- **No new files created** — all logic is self-contained in the page component

---

### Task 1: Mock Data + Color Mapping Utility

**Files:**
- Modify: `src/pages/MarketHeatmap.tsx`

**Interfaces:**
- Produces: `Stock` type, `generateStocks()` function, `colorForPct()` function

- [ ] **Step 1: Define types and mock data generator**

Replace the entire file content with the following. This defines the `Stock` interface, a seeded random mock data generator producing ~85 Vietnamese stocks, and a `colorForPct` function mapping percent change to Vietnamese market colors.

```tsx
import { memo, useMemo } from 'react'

interface Stock {
  symbol: string
  sector: string
  exchange: string
  cap: number
  vol: number
  pct: number
}

const SECTORS = ['Ngân hàng', 'BĐS', 'Thực phẩm', 'Chứng khoán', 'Thép', 'Năng lượng', 'Công nghệ', 'Dược phẩm', 'Bảo hiểm', 'Bán lẻ', 'Vận tải', 'Xây dựng']

const CONSONANTS = 'BCDHKLMNPRSTVX'

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function generateStocks(): Stock[] {
  const rand = seededRandom(91)
  const usedNames = new Set<string>()
  const stocks: Stock[] = []

  for (let i = 0; i < 85; i++) {
    let symbol: string
    do {
      symbol = Array.from({ length: 3 }, () => CONSONANTS[Math.floor(rand() * CONSONANTS.length)]).join('')
    } while (usedNames.has(symbol))
    usedNames.add(symbol)

    const cap = Math.pow(rand(), 3.2) * 100000 + 200
    const changeRoll = rand()
    let pct: number
    if (changeRoll < 0.08) pct = 6.8 + rand() * 33
    else if (changeRoll < 0.45) pct = rand() * 6.8
    else if (changeRoll < 0.53) pct = 0
    else if (changeRoll < 0.90) pct = -rand() * 6.8
    else pct = -6.8 - rand() * 2

    stocks.push({
      symbol,
      sector: SECTORS[Math.floor(rand() * SECTORS.length)],
      exchange: ['HOSE', 'HOSE', 'HOSE', 'HNX', 'HNX', 'UPCOM'][Math.floor(rand() * 6)],
      cap: Math.round(cap),
      vol: Math.round(cap * (0.3 + rand() * 2)),
      pct: parseFloat(pct.toFixed(2)),
    })
  }
  return stocks
}

function colorForPct(pct: number): string {
  if (pct >= 6.8) return 'rgb(196,70,222)'
  if (pct <= -6.8) return 'rgb(41,121,255)'
  if (pct === 0) return 'rgb(234,179,8)'

  const lerp = (a: number, b: number, t: number) => Math.round(a + (b - a) * t)

  if (pct > 0) {
    const t = Math.pow(Math.min(1, pct / 6.8), 0.4)
    return `rgb(${lerp(234, 22, t)},${lerp(179, 163, t)},${lerp(8, 74, t)})`
  } else {
    const t = Math.pow(Math.min(1, Math.abs(pct) / 6.8), 0.4)
    return `rgb(${lerp(234, 220, t)},${lerp(179, 38, t)},${lerp(8, 38, t)})`
  }
}

function MarketHeatmapPageInner() {
  return <div>TODO</div>
}

const MarketHeatmapPage = memo(MarketHeatmapPageInner)
export default MarketHeatmapPage
```

- [ ] **Step 2: Verify types compile**

Run: `npx tsc --noEmit`
Expected: No errors related to this file (other files may have pre-existing errors)

---

### Task 2: Squarified Treemap Layout Algorithm

**Files:**
- Modify: `src/pages/MarketHeatmap.tsx`

**Interfaces:**
- Consumes: `Stock[]` from Task 1
- Produces: `Rect` type, `squarify()` function, `worstRatio()` helper

- [ ] **Step 1: Add Rect type and treemap algorithm functions**

Add these types and functions after the `colorForPct` function (before the component):

```tsx
interface Rect {
  symbol: string
  pct: number
  x: number
  y: number
  w: number
  h: number
}

function worstRatio(row: { area: number }[], side: number, rowSum: number): number {
  if (rowSum <= 0) return Infinity
  const rowThickness = rowSum / side
  let worst = 0
  for (const it of row) {
    const itemLen = (it.area / rowSum) * side
    if (itemLen <= 0) continue
    const ratio = Math.max(rowThickness / itemLen, itemLen / rowThickness)
    if (ratio > worst) worst = ratio
  }
  return worst
}

function squarify(items: (Stock & { area: number })[], x: number, y: number, w: number, h: number): Rect[] {
  const result: Rect[] = []
  let remaining = items.slice()

  while (remaining.length) {
    const side = Math.min(w, h)
    let row = [remaining[0]]
    let rowSum = remaining[0].area
    let bestWorst = worstRatio(row, side, rowSum)
    let i = 1

    while (i < remaining.length) {
      const testRow = row.concat([remaining[i]])
      const testSum = rowSum + remaining[i].area
      const testWorst = worstRatio(testRow, side, testSum)
      if (testWorst <= bestWorst) {
        row = testRow
        rowSum = testSum
        bestWorst = testWorst
        i++
      } else break
    }

    const rowThickness = rowSum / side
    if (w >= h) {
      let cy = y
      for (const it of row) {
        const itemH = rowSum > 0 ? (it.area / rowSum) * h : 0
        result.push({ symbol: it.symbol, pct: it.pct, x, y: cy, w: rowThickness, h: itemH })
        cy += itemH
      }
      x += rowThickness
      w -= rowThickness
    } else {
      let cx = x
      for (const it of row) {
        const itemW = rowSum > 0 ? (it.area / rowSum) * w : 0
        result.push({ symbol: it.symbol, pct: it.pct, x: cx, y, w: itemW, h: rowThickness })
        cx += itemW
      }
      y += rowThickness
      h -= rowThickness
    }

    remaining = remaining.slice(row.length)
    if (w <= 0 || h <= 0) break
  }

  return result
}
```

- [ ] **Step 2: Verify types compile**

Run: `npx tsc --noEmit`
Expected: No errors

---

### Task 3: Main Component with SVG Treemap + Legend + Top Movers

**Files:**
- Modify: `src/pages/MarketHeatmap.tsx`

**Interfaces:**
- Consumes: All utilities from Tasks 1-2
- Produces: Full `MarketHeatmapPageInner` component

- [ ] **Step 1: Implement the full component**

Replace `MarketHeatmapPageInner` with the complete implementation:

```tsx
const CONTAINER_W = 1360
const CONTAINER_H = 640

function MarketHeatmapPageInner() {
  const stocks = useMemo(() => generateStocks(), [])

  const rects = useMemo(() => {
    const totalCap = stocks.reduce((s, d) => s + d.cap, 0) || 1
    const scale = (CONTAINER_W * CONTAINER_H) / totalCap
    const sorted = [...stocks].sort((a, b) => b.cap - a.cap)
    const scaled = sorted.map(d => ({ ...d, area: d.cap * scale }))
    return squarify(scaled, 0, 0, CONTAINER_W, CONTAINER_H)
  }, [stocks])

  const topGainers = useMemo(() => {
    return [...stocks].sort((a, b) => b.pct - a.pct).slice(0, 6)
  }, [stocks])

  const topLosers = useMemo(() => {
    return [...stocks].sort((a, b) => a.pct - b.pct).slice(0, 6)
  }, [stocks])

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 12,
      height: '100%', fontFamily: 'var(--ds-font-sans)',
    }}>
      {/* Treemap */}
      <div style={{
        position: 'relative', width: '100%', height: CONTAINER_H,
        background: 'var(--ds-color-bg-elevated)',
        border: '1px solid var(--ds-color-border-default)',
        borderRadius: 'var(--ds-radius-xl)', overflow: 'hidden',
      }}>
        <svg
          viewBox={`0 0 ${CONTAINER_W} ${CONTAINER_H}`}
          preserveAspectRatio="none"
          style={{ width: '100%', height: '100%' }}
        >
          {rects.map((r, i) => {
            const showPct = r.w > 44 && r.h > 30
            const showSymbol = r.w > 24 && r.h > 16
            const fontSize = r.w > 140 ? 15 : r.w > 90 ? 12 : r.w > 50 ? 10 : 8
            const pctFontSize = r.w > 140 ? 12 : r.w > 90 ? 10.5 : 9
            return (
              <g key={i}>
                <rect
                  x={r.x} y={r.y} width={r.w} height={r.h}
                  fill={colorForPct(r.pct)}
                  stroke="var(--ds-color-bg-app)"
                  strokeWidth={1}
                  style={{ cursor: 'pointer' }}
                />
                {showSymbol && (
                  <text
                    x={r.x + 8} y={r.y + r.h / 2 + (showPct ? -2 : 4)}
                    fill="#fff" fontSize={fontSize} fontWeight={800}
                    fontFamily="var(--ds-font-sans)"
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,.4)' }}
                  >
                    {r.symbol}
                  </text>
                )}
                {showPct && (
                  <text
                    x={r.x + 8} y={r.y + r.h / 2 + fontSize * 0.6}
                    fill="rgba(255,255,255,.92)" fontSize={pctFontSize} fontWeight={700}
                    fontFamily="var(--ds-font-mono)"
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,.4)' }}
                  >
                    {r.pct >= 0 ? '+' : ''}{r.pct.toFixed(2)}%
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* Gradient Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 9, color: 'var(--ds-color-text-muted)', fontWeight: 700 }}>-7%</span>
        <div style={{
          flex: 1, height: 8, borderRadius: 4,
          background: 'linear-gradient(90deg, #2979ff 0%, #dc2626 12%, #eab308 50%, #16a34a 88%, #c446de 100%)',
        }} />
        <span style={{ fontSize: 9, color: 'var(--ds-color-text-muted)', fontWeight: 700 }}>+7%+</span>
      </div>

      {/* Top Movers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {/* Top Gainers */}
        <div style={{
          background: 'var(--ds-color-bg-elevated)',
          border: '1px solid var(--ds-color-border-default)',
          borderRadius: 'var(--ds-radius-xl)', padding: 16,
        }}>
          <h3 style={{
            margin: '0 0 10px', fontSize: 11, fontWeight: 700,
            color: 'var(--ds-color-market-ceiling)', textTransform: 'uppercase' as const,
          }}>
            🔥 Tăng trần / Tăng mạnh
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {topGainers.map(g => (
              <div key={g.symbol} style={{
                display: 'grid', gridTemplateColumns: '50px 1fr 70px', gap: 8,
                padding: '7px 8px', background: 'rgba(196,70,222,.12)',
                borderRadius: 6, fontSize: 10.5, fontFamily: 'var(--ds-font-mono)',
              }}>
                <span style={{ fontWeight: 700, color: '#fff' }}>{g.symbol}</span>
                <span style={{ color: 'var(--ds-color-text-muted)', textAlign: 'center', fontFamily: 'var(--ds-font-sans)' }}>{g.sector}</span>
                <span style={{ fontWeight: 700, color: '#e28ae8', textAlign: 'right' }}>
                  {g.pct >= 0 ? '+' : ''}{g.pct.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Losers */}
        <div style={{
          background: 'var(--ds-color-bg-elevated)',
          border: '1px solid var(--ds-color-border-default)',
          borderRadius: 'var(--ds-radius-xl)', padding: 16,
        }}>
          <h3 style={{
            margin: '0 0 10px', fontSize: 11, fontWeight: 700,
            color: 'var(--ds-color-info)', textTransform: 'uppercase' as const,
          }}>
            ❄️ Giảm sàn / Giảm mạnh
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {topLosers.map(l => (
              <div key={l.symbol} style={{
                display: 'grid', gridTemplateColumns: '50px 1fr 70px', gap: 8,
                padding: '7px 8px', background: 'rgba(41,121,255,.12)',
                borderRadius: 6, fontSize: 10.5, fontFamily: 'var(--ds-font-mono)',
              }}>
                <span style={{ fontWeight: 700, color: '#fff' }}>{l.symbol}</span>
                <span style={{ color: 'var(--ds-color-text-muted)', textAlign: 'center', fontFamily: 'var(--ds-font-sans)' }}>{l.sector}</span>
                <span style={{ fontWeight: 700, color: '#6ba3ff', textAlign: 'right' }}>
                  {l.pct.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify types compile**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Final file verification**

Read the complete file to verify structure is correct, then run final type check:

Run: `npx tsc --noEmit`
Expected: Clean compile

---

## Self-Review Checklist

1. **Spec coverage:**
   - ✅ Treemap with squarified layout algorithm
   - ✅ Mock data for ~85 Vietnamese stocks with market cap, price change
   - ✅ Vietnamese color convention (tím=ceiling, xanh lá=tăng, vàng=0%, đỏ=giảm, xanh lam=floor)
   - ✅ Each cell shows symbol + % change
   - ✅ Gradient legend bar (-7% to +7%)
   - ✅ Top movers summary (2-column: Top Tăng Mạnh + Top Giảm Mạnh)
   - ✅ SVG rendering for treemap
   - ✅ CSS variables from design-system.css
   - ✅ Function name `MarketHeatmapPage`
   - ✅ `memo()` wrapper
   - ✅ `npx tsc --noEmit` verification

2. **Placeholder scan:** No TBD/TODO in final code (Task 3 Step 1 `TODO` is only in intermediate step)

3. **Type consistency:** All types (`Stock`, `Rect`) defined in Task 1-2, used consistently in Task 3. Function signatures match.
