# Performance & Re-render Optimization Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce re-renders and object allocations in the priceboard app. Currently every 1.1s stock tick causes ~2500+ object allocations and cascading re-renders through the entire component tree because memo() is disabled on key components.

**Architecture:** Fix inline callbacks/objects in App.tsx to unblock memo(), extract row-level components with memo(), and move inline styles to CSS classes where performance-critical.

**Tech Stack:** React 19, React.Profiler for measurement, CSS Modules or inline styles optimization

## Global Constraints

- All visual output must remain identical
- Follow existing patterns: memo(), inline styles, ThemeTokens
- No new dependencies (no react-virtual, no external libs)
- Must pass `npx tsc --noEmit` and `npm run build`

---

## Problem Summary

Every 1.1s tick causes:
- `memo()` on **HomePage**, **IndexStrip**, **FilterBar** completely disabled by inline arrows
- **StockTable** re-renders all ~60 visible rows with ~1800 style objects
- **600+ closure functions** created per tick (onChart + onToggleWatchlist per row)
- **~2500+ object allocations** per tick

---

## Task 1: Fix Inline Callbacks in App.tsx (Unblock memo)

**Files:**
- Modify: `src/App.tsx`

**Impact:** Unblocks memo on HomePage, IndexStrip, FilterBar — reduces re-render cascade by ~60%

- [ ] **Step 1: Wrap indexViews in useMemo with stable callback**

```tsx
// Add after existing useCallback definitions:
const handleIndexClick = useCallback((sym: string, color: string) => {
  setIdxChart({ open: true, sym, color })
}, [])

// Replace inline mapIndexViews call in JSX with:
const indexViews = useMemo(
  () => mapIndexViews(indices, handleIndexClick),
  [indices, handleIndexClick]
)
```

- [ ] **Step 2: Wrap inline toggle callbacks in useCallback**

```tsx
const onToggleSector = useCallback(() => setShowSector(p => !p), [])
const onToggleAdvFilter = useCallback(() => setShowAdvFilter(p => !p), [])
const onToggleTradeHist = useCallback(() => setShowTradeHist(p => !p), [])
const onCloseIdxChart = useCallback(() => setIdxChart({ open: false, sym: '', color: '' }), [])
```

- [ ] **Step 3: Update HomePage props to use stable callbacks**

Replace inline arrows in `<HomePage>` JSX:
```tsx
onToggleSector={onToggleSector}
onToggleAdvFilter={onToggleAdvFilter}
onToggleTradeHist={onToggleTradeHist}
onCloseIdxChart={onCloseIdxChart}
```

- [ ] **Step 4: Update IndexStrip props**

```tsx
<IndexStrip indices={indexViews} th={th} />
```

- [ ] **Step 5: Verify build**

Run: `npx tsc --noEmit && npm run build`
Expected: No errors

---

## Task 2: Memoize Row Data in App.tsx (Reduce 600+ Closures)

**Files:**
- Modify: `src/App.tsx`

**Impact:** Reduces 600+ closure functions per tick to stable references

- [ ] **Step 1: Create stable onChart callback with useRef**

```tsx
const onChartRef = useRef(openChart)
onChartRef.current = openChart
```

- [ ] **Step 2: Create stable onToggleWatchlist callback**

```tsx
const onToggleWatchlistRef = useRef(toggleWatchlist)
onToggleWatchlistRef.current = toggleWatchlist
```

- [ ] **Step 3: Update mapStockRows to use refs**

In `mapStockRows`, replace:
```tsx
onChart: () => openChart(s.s),
```
with a stable function pattern. Since mapStockRows is called inside useMemo which depends on `openChart`, the closures are already recreated when openChart changes. The key fix is making `openChart` stable (already useCallback) and ensuring the useMemo dependencies are correct.

Actually, the current approach is acceptable since `openChart` is already wrapped in `useCallback` with `[]` deps — it never changes. The issue is that `allStocks` useMemo depends on `openChart` but `openChart` is stable, so `allStocks` only recomputes when `stocks`, `darkMode`, `th`, or `filter` changes. This is correct.

The real issue is `stocksWithWatchlist` which adds `onToggleWatchlist` per row. Since `toggleWatchlist` is `useCallback([])`, it's stable. So closures are stable too.

**Re-assessment:** The closures are actually stable because both `openChart` and `toggleWatchlist` are `useCallback([])`. The useMemo dependencies are correct. Skip this step — the closures are fine.

- [ ] **Step 4: Verify build**

Run: `npx tsc --noEmit && npm run build`
Expected: No errors

---

## Task 3: Extract Row Component with memo() in StockTable

**Files:**
- Modify: `src/components/StockTable.tsx`

**Impact:** Prevents re-rendering all rows when only one stock changes. With ~60 visible rows, this reduces re-render work by ~95%.

- [ ] **Step 1: Create memoized StockTableRow component**

Extract the `<tr>` rendering into a separate `memo()` component:

```tsx
type RowProps = {
  s: StockRow
  th: ThemeTokens
  onMouseEnter: (e: React.MouseEvent<HTMLTableRowElement>) => void
  onMouseLeave: (e: React.MouseEvent<HTMLTableRowElement>) => void
}

const StockTableRow = memo(function StockTableRow({ s, th, onMouseEnter, onMouseLeave }: RowProps) {
  return (
    <tr
      style={{ background: s.bg, borderBottom: `1px solid ${th.rowBorder}`, transition: 'background .15s', cursor: 'default', height: 30 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* All 30 td cells exactly as current */}
    </tr>
  )
})
```

- [ ] **Step 2: Create stable hover handlers outside render**

```tsx
const handleRowEnter = useCallback((e: React.MouseEvent<HTMLTableRowElement>) => {
  e.currentTarget.style.background = th.rowHover
}, [th.rowHover])

const handleRowLeave = useCallback((e: React.MouseEvent<HTMLTableRowElement>, bg: string) => {
  e.currentTarget.style.background = bg
}, [])
```

Wait — `handleRowLeave` needs `bg` per row, so it can't be a simple useCallback. Instead, use data attribute or inline the leave handler but memoize the row.

Better approach: Keep `onMouseLeave` inline per row but the row itself is memo'd — it only re-renders when `s` reference changes.

- [ ] **Step 3: Update StockTable to use StockTableRow**

```tsx
{visibleRows.map((s) => (
  <StockTableRow
    key={s.sym}
    s={s}
    th={th}
    onMouseEnter={handleRowEnter}
    onMouseLeave={(e) => { e.currentTarget.style.background = s.bg }}
  />
))}
```

Note: The `onMouseLeave` inline arrow creates a new function per row, but since the row is memo'd and `s` is a stable reference (from useMemo), the row won't re-render unless its specific stock data changes. The inline arrow is created once per render of that specific row, which only happens when that row's data changes.

- [ ] **Step 4: Verify build**

Run: `npx tsc --noEmit && npm run build`
Expected: No errors

---

## Task 4: Extract Row Component with memo() in GridView

**Files:**
- Modify: `src/components/GridView.tsx`

**Impact:** Same as StockTable — prevents re-rendering all cards when one changes.

- [ ] **Step 1: Create memoized GridCard component**

```tsx
const GridCard = memo(function GridCard({ s, th }: { s: StockRow; th: ThemeTokens }) {
  return (
    <div
      style={{ ... card styles ... }}
      onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.25)' }}
      onMouseLeave={(e) => { e.currentTarget.style.filter = 'none' }}
      onClick={s.onChart}
    >
      {/* Card content */}
    </div>
  )
})
```

- [ ] **Step 2: Update GridView to use GridCard**

- [ ] **Step 3: Verify build**

Run: `npx tsc --noEmit && npm run build`
Expected: No errors

---

## Task 5: Memoize Style Objects in FilterBar

**Files:**
- Modify: `src/components/FilterBar.tsx`

**Impact:** Reduces ~15 style object allocations per render to cached references.

- [ ] **Step 1: Memoize tabStyle and iconBtn with useMemo**

Since these functions depend on `th` (ThemeTokens), use `useMemo` to cache the function reference:

```tsx
const tabStyle = useMemo(() => (active: boolean): React.CSSProperties => ({
  background: active ? '#2563eb' : 'transparent',
  color: active ? '#fff' : th.tabFg,
  borderRadius: 5,
  padding: '4px 10px',
  fontSize: 11,
  fontWeight: active ? 600 : 500,
  cursor: 'pointer',
  border: active ? 'none' : th.tabBorder,
  whiteSpace: 'nowrap',
  transition: 'all .15s',
}), [th.tabFg, th.tabBorder])

const iconBtn = useMemo(() => (active: boolean): React.CSSProperties => ({
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: 30, height: 30, borderRadius: 8,
  background: active ? 'rgba(37,99,235,.15)' : 'transparent',
  color: active ? '#60a5fa' : th.iconColor,
  border: active ? '1px solid rgba(37,99,235,.25)' : '1px solid transparent',
  cursor: 'pointer', fontSize: 13, transition: 'all .15s',
}), [th.iconColor])
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit && npm run build`
Expected: No errors

---

## Task 6: Memoize Handlers in TopMoversView

**Files:**
- Modify: `src/components/TopMoversView.tsx`

**Impact:** Prevents creating 15 new handler objects per render.

- [ ] **Step 1: Cache cardHoverHandlers with useMemo**

```tsx
const cardHoverHandlers = useMemo(() => ({
  onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.filter = 'brightness(1.25)'
    e.currentTarget.style.transform = 'translateY(-2px)'
  },
  onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.filter = 'none'
    e.currentTarget.style.transform = 'translateY(0)'
  }
}), [])
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit && npm run build`
Expected: No errors

---

## Task 7: Add React Profiler for Measurement

**Files:**
- Modify: `src/App.tsx`

**Impact:** Enables measuring re-render counts and render duration before/after optimization.

- [ ] **Step 1: Import Profiler**

```tsx
import { Profiler } from 'react'
```

- [ ] **Step 2: Add profiler callback**

```tsx
const onRenderCallback: React.ProfilerOnRenderCallback = (
  id, phase, actualDuration, baseDuration, startTime, commitTime
) => {
  if (actualDuration > 16) { // Log only if > 16ms (one frame)
    console.log(`[Profiler ${id}] ${phase} — ${actualDuration.toFixed(1)}ms`)
  }
}
```

- [ ] **Step 3: Wrap key components with Profiler**

```tsx
<Profiler id="IndexStrip" onRender={onRenderCallback}>
  <IndexStrip indices={indexViews} th={th} />
</Profiler>

<Profiler id="FilterBar" onRender={onRenderCallback}>
  <FilterBar ... />
</Profiler>

<Profiler id="StockTable" onRender={onRenderCallback}>
  <StockTable rows={stocksWithWatchlist} th={th} />
</Profiler>
```

- [ ] **Step 4: Verify build**

Run: `npx tsc --noEmit && npm run build`
Expected: No errors

---

## Task 8: Final Verification

**Files:**
- All modified files

- [ ] **Step 1: Full type check**

Run: `npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 2: Full build**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Measure with Profiler**

Start dev server: `npm run dev`
Open browser console, observe Profiler logs.
Before optimization: expect many re-renders per tick (>10 components re-rendering)
After optimization: expect significantly fewer re-renders (memo'd components skipped)

---

## Expected Results

| Metric | Before | After |
|--------|--------|-------|
| Components re-rendering per tick | ~12 | ~4 (App, StockTable, maybe GridView/Heatmap) |
| Object allocations per tick | ~2500+ | ~200 (mostly StockTable rows that changed) |
| HomePage memo | Disabled | Active |
| IndexStrip memo | Disabled | Active |
| FilterBar memo | Disabled | Active |
| StockTable row re-renders | All 60 visible | Only changed rows |
| FilterBar style objects | ~15 new/render | 0 (static objects) |
