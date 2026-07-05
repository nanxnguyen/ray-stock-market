# Stock Detail Modal (7-Tab) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current SVG-based IntradayChartModal with a full-featured 7-tab Stock Detail Modal matching the design in `designHtml/Stock Detail Modal.dc.html`.

**Architecture:** Create `StockDetailModal.tsx` as a single component (~2000 lines) that renders 7 tabs (Overview, Statistics, Technical Chart, Technical Sentiment, Financials, Research, Events). Uses ECharts for all financial charts. Reuses existing `ChartState`/`ChartView` types for open/close flow. Synthetic data generated per-stock via deterministic RNG.

**Tech Stack:** React 19, ECharts 5.5 (npm), TypeScript, Tailwind CSS

---

## File Structure

| File | Purpose |
|------|---------|
| `src/components/StockDetailModal.tsx` | **NEW** — Main 7-tab modal (~2000 lines) |
| `src/App.tsx` | **MODIFY** — Replace `IntradayChartModal` import, adapt chartView computation to pass raw StockState instead of formatted ChartView |
| `src/pages/HomePage.tsx` | **MODIFY** — Import `StockDetailModal` instead of `IntradayChartModal` |
| `src/types/priceboard.ts` | **MODIFY** — Extend `ChartView` to include raw stock data |
| `index.html` | **MODIFY** — Add ECharts CDN script tag |
| `src/components/IntradayChartModal.tsx` | **DELETE** (replaced) |

---

## Global Constraints

- React 19, TypeScript ~6.0, Vite 8
- All chart styling matches dark theme (#0b1420 background, #1b2838 borders, JetBrains Mono for numbers)
- ECharts loaded via CDN in `index.html` (not npm) — keeps bundle size down and matches design
- No new npm dependencies
- Modal width: `min(1560px, 97vw)`, height: `93vh`
- All synthetic data uses deterministic RNG seeded by symbol

---

### Task 1: Add ECharts CDN + Delete Old Modal

**Files:**
- Modify: `index.html:1-13`
- Delete: `src/components/IntradayChartModal.tsx`

**Interfaces:**
- Consumes: none
- Produces: `window.echarts` available globally

- [ ] **Step 1: Add ECharts CDN to index.html**

```html
<!doctype html>
<html lang="vi" data-theme="dark">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ray Stock Market</title>
    <script src="https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 2: Delete IntradayChartModal.tsx**

```bash
rm src/components/IntradayChartModal.tsx
```

- [ ] **Step 3: Commit**

```bash
git add index.html src/components/IntradayChartModal.tsx
git commit -m "feat: add ECharts CDN, remove old SVG modal"
```

---

### Task 2: Update Types + Chart State Flow

**Files:**
- Modify: `src/types/priceboard.ts` — extend `ChartState` to include raw stock data
- Modify: `src/App.tsx` — pass `StockState` to modal instead of `ChartView`
- Modify: `src/pages/HomePage.tsx` — import new modal, update render
- Modify: `src/router.tsx` — update `AppRoutesProps` type

**Interfaces:**
- Consumes: `ChartState` (existing), `StockState` (existing)
- Produces: Updated `ChartState` with `stock?: StockState`

- [ ] **Step 1: Update ChartState in types/priceboard.ts**

Add `stock` field to `ChartState`:

```typescript
export type ChartState = {
  open: boolean
  sym: string
  range: string
  stock?: StockState  // raw stock data for StockDetailModal
}
```

- [ ] **Step 2: Update App.tsx chart state**

In `App.tsx`, change `openChart` to capture the raw stock:

```typescript
const openChart = useCallback((sym: string) => {
  setChart({ open: true, sym, range: '1Đ' })
}, [])
```

In the `chartStock` memo, attach the raw stock to chart state — but actually the simpler approach is to just pass `chartStock` directly. Change:

```typescript
// In App.tsx, the chartView computation:
const chartStock = useMemo(() => {
  if (!chart.open || !chart.sym) return null
  return stocks.find((x) => x.s === chart.sym) ?? null
}, [chart.open, chart.sym, stocks])
```

Then pass `chartStock` as a new prop to HomePage, and let StockDetailModal use it directly. This avoids duplicating data in ChartState.

- [ ] **Step 3: Update AppRoutesProps in router.tsx**

Add `chartStock: StockState | null` to AppRoutesProps:

```typescript
type AppRoutesProps = {
  // ... existing props ...
  chartStock: StockState | null  // raw stock for StockDetailModal
  onCloseChart: () => void
  // ... rest ...
}
```

- [ ] **Step 4: Update HomePage.tsx**

Replace IntradayChartModal import and render:

```tsx
import StockDetailModal from '../components/StockDetailModal'

// In render:
{chartStock && (
  <StockDetailModal stock={chartStock} onClose={onCloseChart} />
)}
```

- [ ] **Step 5: Run typecheck**

```bash
npx tsc --noEmit
```

- [ ] **Step 6: Commit**

```bash
git add src/types/priceboard.ts src/App.tsx src/router.tsx src/pages/HomePage.tsx
git commit -m "refactor: update chart state to pass raw StockState to modal"
```

---

### Task 3: StockDetailModal Shell + Title + Symbol Row + Tabs

**Files:**
- Create: `src/components/StockDetailModal.tsx`

**Interfaces:**
- Consumes: `StockState` (from App.tsx)
- Produces: Modal shell with title bar, symbol info row, 7 tab buttons, tab content area

- [ ] **Step 1: Create StockDetailModal.tsx with shell**

The modal shell includes:
- Backdrop overlay (rgba(4,8,14,.72), backdrop-blur)
- Modal container (1560px max, 93vh, #0b1420 background)
- Title bar ("Phân tích chuyên sâu cổ phiếu" + close button)
- Symbol row (symbol, price, change, %, company name, star button)
- Tab bar (7 tabs: Tổng quan, Thống kê, Biểu đồ kỹ thuật, Tâm lý kỹ thuật, Tài chính, Khuyến nghị, Sự kiện)
- Tab content area (scrollable)

Key state:
```typescript
const [tab, setTab] = useState('overview')
const [ovPanel, setOvPanel] = useState('timesales')  // overview sidebar: keymetrics | timesales
const [ovRange, setOvRange] = useState('1D')
const [statSub, setStatSub] = useState('stats')  // stats sub: stats | foreign | proprietary
const [finSub, setFinSub] = useState('overview')  // fin sub: overview | indicators
const [finPeriod, setFinPeriod] = useState('quarter')
const [sentPeriod, setSentPeriod] = useState('1D')
const [eventSub, setEventSub] = useState('news')
const [starred, setStarred] = useState(false)
```

ECharts lifecycle:
```typescript
const chartsRef = useRef<Record<string, any>>({})
const modalRef = useRef<HTMLDivElement>(null)

useEffect(() => {
  const onResize = () => {
    Object.values(chartsRef.current).forEach(c => { try { c.resize(); } catch(e) {} })
  }
  window.addEventListener('resize', onResize)
  return () => window.removeEventListener('resize', onResize)
}, [])

// Dispose charts on unmount or tab change
useEffect(() => {
  return () => {
    Object.values(chartsRef.current).forEach(c => { try { c.dispose(); } catch(e) {} })
    chartsRef.current = {}
  }
}, [tab, statSub, finSub, finPeriod, sentPeriod, ovRange, ovPanel])

// Render charts after tab change (with small delay for DOM)
useEffect(() => {
  const t = setTimeout(() => renderCharts(), 50)
  return () => clearTimeout(t)
}, [tab, statSub, finSub, finPeriod, sentPeriod, ovRange, ovPanel])
```

- [ ] **Step 2: Implement priceColor + format helpers**

```typescript
const priceColor = (p: number, ref: number, ceil?: number, fl?: string | null) => {
  if (fl === 'u') return '#22c55e'
  if (fl === 'd') return '#f43f5e'
  if (p > ref) return '#22c55e'
  if (p < ref) return '#f43f5e'
  return '#eab308'
}
```

- [ ] **Step 3: Implement deterministic RNG**

```typescript
function makeRng(seed: string) {
  let h = 1779033703 ^ seed.length
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  let a = h >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
```

- [ ] **Step 4: Implement synthetic data generator**

The `_data()` function generates all chart datasets from the stock's current price. It returns:
- Intraday price/volume arrays (135 data points)
- Daily candles (180 days)
- Depth ladder (13 levels)
- Liquidity cumulative series
- Foreign net cumulative series
- Financial metrics (11 quarters, 5 years)

- [ ] **Step 5: Run typecheck + build**

```bash
npx tsc --noEmit && npm run build
```

- [ ] **Step 6: Commit**

```bash
git add src/components/StockDetailModal.tsx
git commit -m "feat: StockDetailModal shell with tabs and synthetic data"
```

---

### Task 4: Overview Tab — Price Chart + Sidebar

**Files:**
- Modify: `src/components/StockDetailModal.tsx`

**Interfaces:**
- Consumes: synthetic data from Task 3
- Produces: Overview tab with price chart (ECharts), 7 range buttons, liquidity/foreign/sentiment mini charts, sidebar (Key Metrics or Time & Sales)

- [ ] **Step 1: Implement Overview tab JSX**

The Overview tab has:
- Left: Price chart (ECharts line+bar, 320px) + 7 range buttons (1D, 2D, 1W, 3M, YTD, 1Y, 5Y)
- Below: 3-column grid — Liquidity chart, Foreign chart, Sentiment gauge
- Right sidebar (356px): Toggle between Key Metrics (12 rows) and Time & Sales (depth ladder + trade log + aggregation)

- [ ] **Step 2: Implement price chart ECharts config**

```typescript
// In renderCharts():
if (tab === 'overview') {
  // sdPrice: line chart with volume bars below
  // Reference line at ref price
  // Area fill gradient
  mkChart('sdPrice', {
    grid: [{ left: 8, right: 44, top: 12, bottom: 78, height: '62%' },
           { left: 8, right: 44, bottom: 24, height: '16%' }],
    xAxis: [{ type: 'category', data: d.times, boundaryGap: false, gridIndex: 0 },
            { type: 'category', data: d.times, gridIndex: 1 }],
    yAxis: [{ type: 'value', scale: true, position: 'right', gridIndex: 0 },
            { type: 'value', gridIndex: 1 }],
    series: [
      { type: 'line', data: d.price, showSymbol: false, lineStyle: { color: '#eab308', width: 1.6 },
        areaStyle: { color: new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'rgba(234,179,8,.28)'},{offset:1,color:'rgba(234,179,8,0)'}]) },
        markLine: { data: [{ yAxis: d.ref }] } },
      { type: 'bar', data: d.vol.map((v,i) => ({ value: v, itemStyle: { color: d.price[i] >= d.price[i-1] ? 'rgba(34,197,94,.55)' : 'rgba(244,63,94,.55)' } })) }
    ]
  })
}
```

- [ ] **Step 3: Implement mini charts (Liquidity, Foreign, Sentiment)**

- [ ] **Step 4: Implement sidebar (Key Metrics / Time & Sales)**

- [ ] **Step 5: Run build + verify in browser**

```bash
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add src/components/StockDetailModal.tsx
git commit -m "feat: StockDetailModal Overview tab with ECharts"
```

---

### Task 5: Statistics Tab

**Files:**
- Modify: `src/components/StockDetailModal.tsx`

**Interfaces:**
- Consumes: synthetic data
- Produces: Statistics tab with 3 sub-tabs (Thống kê, Giao dịch NĐTNN, Tự doanh)

- [ ] **Step 1: Implement Statistics tab JSX**

3 sub-tabs:
- **Thống kê**: Liquidity chart (440px) + Depth chart + Trade log
- **Giao dịch NĐTNN**: Foreign value/volume summary + Foreign area chart
- **Tự doanh**: Proprietary value/volume summary + Proprietary bar chart

- [ ] **Step 2: Implement depth chart (ECharts horizontal bar)**

```typescript
mkChart('sdDepth', {
  grid: { left: 6, right: 56, top: 8, bottom: 24 },
  xAxis: { type: 'value', inverse: true },
  yAxis: { type: 'category', data: cats, position: 'right' },
  series: [
    { name: 'Buy', type: 'bar', stack: 'x', data: levels.map(l => l.buy), itemStyle: { color: '#22c55e' } },
    { name: 'Sell', type: 'bar', stack: 'x', data: levels.map(l => l.sell), itemStyle: { color: '#f43f5e' } }
  ]
})
```

- [ ] **Step 3: Run build + verify**

- [ ] **Step 4: Commit**

```bash
git add src/components/StockDetailModal.tsx
git commit -m "feat: StockDetailModal Statistics tab"
```

---

### Task 6: Technical Chart + Technical Sentiment Tabs

**Files:**
- Modify: `src/components/StockDetailModal.tsx`

**Interfaces:**
- Consumes: symbol for TradingView URL
- Produces: Technical Chart tab (TradingView iframe) + Technical Sentiment tab (gauge + indicators table)

- [ ] **Step 1: Implement Technical Chart tab**

Simple iframe embed:
```tsx
<iframe
  src={`https://s.tradingview.com/widgetembed/?frameElementId=tvsd&symbol=HOSE:${sym}&interval=D&theme=dark&style=1&locale=vi`}
  style={{ width: '100%', height: 640, border: 'none' }}
  allowTransparency
/>
```

- [ ] **Step 2: Implement Technical Sentiment tab**

- Period buttons (1D, 1W, 1M)
- Left: Summary gauge + 3 gauge cards (Moving Averages, Oscillators, Volatility)
- Right: Indicator groups table (3 groups: Moving Averages, Oscillators, Volatility)

- [ ] **Step 3: Implement gauge chart (ECharts)**

```typescript
mkChart(id, {
  series: [{
    type: 'gauge', startAngle: 200, endAngle: -20, min: 0, max: 100,
    pointer: { width: 4, length: '62%' },
    axisLine: { lineStyle: { width: 14, color: [[0.35, '#f43f5e'], [0.65, '#4b5a6d'], [1, '#22c55e']] } },
    detail: { show: false }
  }]
})
```

- [ ] **Step 4: Run build + verify**

- [ ] **Step 5: Commit**

```bash
git add src/components/StockDetailModal.tsx
git commit -m "feat: StockDetailModal Technical tabs"
```

---

### Task 7: Financials Tab

**Files:**
- Modify: `src/components/StockDetailModal.tsx`

**Interfaces:**
- Consumes: synthetic financial data
- Produces: Financials tab with Overview (valuation + performance charts) and Indicators (table)

- [ ] **Step 1: Implement Financials tab JSX**

- Sub-tabs: Tổng quan, Chỉ số
- Period toggle: Quý, Năm
- Overview: P/E + P/B line chart + Revenue/Profit bar chart
- Indicators: Scrollable table with 17 rows, 11 columns

- [ ] **Step 2: Implement valuation chart (dual Y-axis)**

```typescript
mkChart('sdValuation', {
  xAxis: { type: 'category', data: cols },
  yAxis: [{ type: 'value', position: 'left' }, { type: 'value', position: 'right' }],
  series: [
    { name: 'P/E TTM', type: 'line', data: pe, yAxisIndex: 0, symbol: 'circle', symbolSize: 7 },
    { name: 'P/B TTM', type: 'line', data: pb, yAxisIndex: 1, symbol: 'circle', symbolSize: 7 }
  ]
})
```

- [ ] **Step 3: Run build + verify**

- [ ] **Step 4: Commit**

```bash
git add src/components/StockDetailModal.tsx
git commit -m "feat: StockDetailModal Financials tab"
```

---

### Task 8: Research + Events Tabs + Final Integration

**Files:**
- Modify: `src/components/StockDetailModal.tsx`

**Interfaces:**
- Consumes: synthetic research/event data
- Produces: Research tab (rating card + report list) + Events tab (event list with sub-tabs)

- [ ] **Step 1: Implement Research tab**

- Left sidebar (280px): Rating card (recommendation, target price, upside)
- Right: Report list (4-5 cards with title, tag, summary, date)

- [ ] **Step 2: Implement Events tab**

- Sub-tabs: Tin tức, Cổ tức & Tăng vốn, Cổ đông lớn & GD nội bộ, Sự kiện khác
- Event list table (3 columns: Ngày, Tiêu đề, Loại)

- [ ] **Step 3: Run typecheck + full build**

```bash
npx tsc --noEmit && npm run build
```

- [ ] **Step 4: Run dev server + screenshot verification**

```bash
npm run dev
# Navigate to http://localhost:5173
# Click on any stock row to open StockDetailModal
# Verify all 7 tabs render correctly
```

- [ ] **Step 5: Commit**

```bash
git add src/components/StockDetailModal.tsx
git commit -m "feat: StockDetailModal complete with all 7 tabs"
```

---

## Summary

| Task | Description | Est. Lines |
|------|-------------|-----------|
| 1 | ECharts CDN + delete old modal | ~5 |
| 2 | Types + chart state flow | ~30 |
| 3 | Modal shell + tabs + data generation | ~500 |
| 4 | Overview tab (price chart + sidebar) | ~400 |
| 5 | Statistics tab (depth, foreign, proprietary) | ~300 |
| 6 | Technical tabs (TradingView + sentiment) | ~300 |
| 7 | Financials tab (valuation + indicators) | ~300 |
| 8 | Research + Events tabs + integration | ~200 |
| **Total** | | **~2000** |
