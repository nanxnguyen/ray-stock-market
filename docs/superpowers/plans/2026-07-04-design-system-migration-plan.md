# Design System Phase 2 — Migration Plan

> **For agentic workers:** Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate all existing components from hardcoded hex colors to CSS variable design tokens (`var(--ds-*)`).

**Architecture:** Replace hardcoded hex values with `var(--ds-color-*)` CSS variables. Remove local theme objects (`const th = {...}`) from pages. Remove `getTheme()` function and update `ThemeTokens` type. Enable dark/light mode switching across entire app.

**Tech Stack:** CSS variables, React hooks, TypeScript.

## Global Constraints

- All color replacements use `var(--ds-*)` from `src/styles/design-system.css`
- Market colors: `var(--ds-color-market-up/down/flat/ceiling/floor)`
- Semantic colors: `var(--ds-color-bg-*)`, `var(--ds-color-text-*)`, `var(--ds-color-border-*)`
- Remove `const th = {...}` local theme objects from pages
- Remove `getTheme()` function from App.tsx
- Keep `ThemeTokens` type as deprecated wrapper during migration
- Do NOT change component behavior, only color references
- Dark mode should work via `data-theme` attribute after migration

---

## Task 1: Migrate marketFormat.ts — priceColor() function

**Files:**
- Modify: `src/lib/marketFormat.ts`

**Interfaces:**
- Consumes: CSS variables from design-system.css
- Produces: `priceColor()` returns CSS variable strings instead of hex

- [ ] **Step 1: Read current priceColor() function**

Read `src/lib/marketFormat.ts` and find the `priceColor` function.

- [ ] **Step 2: Replace hardcoded hex with CSS variable references**

Change the function to return CSS variable strings:

```typescript
export function priceColor(price: number, ref: number, ceiling: number, floor: number): string {
  if (price >= ceiling) return 'var(--ds-color-market-ceiling)'
  if (price <= floor) return 'var(--ds-color-market-floor)'
  if (price > ref) return 'var(--ds-color-market-up)'
  if (price < ref) return 'var(--ds-color-market-down)'
  return 'var(--ds-color-market-flat)'
}
```

- [ ] **Step 3: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/lib/marketFormat.ts
git commit -m "refactor: migrate priceColor() to use CSS variables"
```

---

## Task 2: Migrate App.tsx — Remove getTheme() and hardcoded colors

**Files:**
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: CSS variables
- Produces: App uses CSS variables directly, ThemeTokens deprecated

- [ ] **Step 1: Read current App.tsx**

Read `src/App.tsx` and identify:
- `getTheme()` function (lines 21-54)
- All hardcoded market colors in `mapStockRows`, `mapIndexViews`, `chartView`

- [ ] **Step 2: Remove getTheme() function**

Delete the entire `getTheme(dark: boolean): ThemeTokens` function.

- [ ] **Step 3: Update ThemeTokens usage**

Replace `const th = useMemo(() => getTheme(darkMode), [darkMode])` with a simple object that reads CSS variables. For backward compatibility, create a thin wrapper:

```typescript
const th = useMemo(() => ({
  appBg: 'var(--ds-color-bg-app)',
  navBg: 'var(--ds-color-bg-nav)',
  navBorder: 'var(--ds-color-border-default)',
  navItemColor: 'var(--ds-color-text-secondary)',
  idxColBorder: 'var(--ds-color-border-default)',
  idxTitle: 'var(--ds-color-text-primary)',
  glItemBorder: 'var(--ds-color-border-subtle)',
  glNameColor: 'var(--ds-color-text-secondary)',
  filterBorder: 'var(--ds-color-border-default)',
  searchText: 'var(--ds-color-text-muted)',
  tabFg: 'var(--ds-color-text-secondary)',
  tabBorder: `1px solid var(--ds-color-border-default)`,
  tableBg: 'var(--ds-color-bg-table)',
  rowOdd: 'var(--ds-color-bg-row-odd)',
  rowEven: 'var(--ds-color-bg-row-even)',
  rowBorder: 'var(--ds-color-border-subtle)',
  rowHover: 'var(--ds-color-bg-row-hover)',
  cellBorder: 'var(--ds-color-border-default)',
  cellBorderL: 'var(--ds-color-border-subtle)',
  symColor: 'var(--ds-color-text-link)',
  volColor: 'var(--ds-color-text-muted)',
  iconBg: 'var(--ds-color-bg-elevated)',
  iconColor: 'var(--ds-color-text-muted)',
  text: 'var(--ds-color-text-primary)',
  textMuted: 'var(--ds-color-text-muted)',
  toggleBg: 'var(--ds-color-blue-600)',
  togglePos: darkMode ? '22px' : '2px',
  toggleLabel: darkMode ? 'LIGHT' : 'DARK',
  toggleIcon: darkMode ? '\u2600' : '\uD83C\uDF19',
  toggleTitle: darkMode ? 'Chuyển Light mode' : 'Chuyển Dark mode',
}), [darkMode])
```

- [ ] **Step 4: Replace hardcoded market colors in mapStockRows**

In `mapStockRows` function, replace:
- `'#14532d'` → `'var(--ds-color-market-flash-up)'`
- `'#450a0a'` → `'var(--ds-color-market-flash-down)'`
- `'#dcfce7'` → `'rgba(34,197,94,.12)'` (or keep as-is if too complex)
- `'#fee2e2'` → `'rgba(244,63,94,.12)'` (or keep as-is if too complex)

- [ ] **Step 5: Replace hardcoded market colors in mapIndexViews**

Replace `'#22c55e'` and `'#f43f5e'` with CSS variable references.

- [ ] **Step 6: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx
git commit -m "refactor: migrate App.tsx from getTheme() to CSS variables"
```

---

## Task 3: Migrate TopBar.tsx — Replace all hardcoded colors

**Files:**
- Modify: `src/components/TopBar.tsx`

**Interfaces:**
- Consumes: CSS variables
- Produces: TopBar uses `var(--ds-*)` for all colors

- [ ] **Step 1: Read TopBar.tsx**

Read the full file and identify all hardcoded hex colors.

- [ ] **Step 2: Replace background colors**

Replace:
- `'#060c18'` → `'var(--ds-color-bg-app)'`
- `'#0b1628'` → `'var(--ds-color-bg-nav)'`
- `'#0b1424'` → `'var(--ds-color-bg-card)'`
- `'#08101f'` → `'var(--ds-color-bg-elevated)'`
- `'#0f1e36'` → `'var(--ds-color-bg-elevated)'`
- `'#131f36'` → `'var(--ds-color-bg-elevated)'`

- [ ] **Step 3: Replace border colors**

Replace:
- `'#0f1e36'` → `'var(--ds-color-border-subtle)'`
- `'#1a3050'` → `'var(--ds-color-border-default)'`
- `'#16233b'` → `'var(--ds-color-border-subtle)'`
- `'#1c2534'` → `'var(--ds-color-border-default)'`

- [ ] **Step 4: Replace text colors**

Replace:
- `'#4a6080'` → `'var(--ds-color-text-muted)'`
- `'#94a3b8'` → `'var(--ds-color-text-secondary)'`
- `'#64748b'` → `'var(--ds-color-text-muted)'`
- `'#dbeafe'` → `'var(--ds-color-text-primary)'`
- `'#e2e8f0'` → `'var(--ds-color-text-primary)'`

- [ ] **Step 5: Replace status/accent colors**

Replace:
- `'#22c55e'` → `'var(--ds-color-market-up)'`
- `'#fbbf24'` → `'var(--ds-color-yellow-400)'`
- `'#4ade80'` → `'var(--ds-color-green-400)'`
- `'#f87171'` → `'var(--ds-color-red-400)'`
- `'#60a5fa'` → `'var(--ds-color-blue-400)'`
- `'#2563eb'` → `'var(--ds-color-blue-600)'`

- [ ] **Step 6: Run TypeScript check**

Run: `npx tsc --noEmit`

- [ ] **Step 7: Commit**

```bash
git add src/components/TopBar.tsx
git commit -m "refactor: migrate TopBar.tsx to CSS variables"
```

---

## Task 4: Migrate FooterBar.tsx + Layout.tsx

**Files:**
- Modify: `src/components/FooterBar.tsx`
- Modify: `src/components/Layout.tsx`

- [ ] **Step 1: Migrate FooterBar.tsx**

Replace all hardcoded colors with CSS variables.

- [ ] **Step 2: Verify Layout.tsx uses tokens correctly**

Layout.tsx already uses `th.appBg` and `th.text` — verify these now resolve to CSS variables via the updated `th` object from Task 2.

- [ ] **Step 3: Commit**

```bash
git add src/components/FooterBar.tsx src/components/Layout.tsx
git commit -m "refactor: migrate FooterBar + verify Layout"
```

---

## Task 5: Migrate StockTable.tsx header

**Files:**
- Modify: `src/components/StockTable.tsx`

- [ ] **Step 1: Read StockTable.tsx**

Find the thead section with hardcoded colors.

- [ ] **Step 2: Replace header background colors**

Replace `'#080f1c'`, `'#05111e'`, `'#1a0808'` with CSS variable references.

- [ ] **Step 3: Replace header text/border colors**

Replace hardcoded text and border colors with CSS variables.

- [ ] **Step 4: Commit**

```bash
git add src/components/StockTable.tsx
git commit -m "refactor: migrate StockTable header to CSS variables"
```

---

## Task 6: Migrate FilterBar.tsx + SymbolSearch.tsx + FilterDropdown.tsx

**Files:**
- Modify: `src/components/FilterBar.tsx`
- Modify: `src/components/SymbolSearch.tsx`
- Modify: `src/components/FilterDropdown.tsx`

- [ ] **Step 1: Migrate FilterBar.tsx**

Replace hardcoded `#2563eb`, `#fff`, `#f97316`, `#60a5fa` with CSS variables.

- [ ] **Step 2: Migrate SymbolSearch.tsx**

Replace hardcoded `#94a3b8`, `#2563eb`, `#fff`.

- [ ] **Step 3: Migrate FilterDropdown.tsx**

Replace hardcoded `#2563eb`, `#fff`.

- [ ] **Step 4: Commit**

```bash
git add src/components/FilterBar.tsx src/components/SymbolSearch.tsx src/components/FilterDropdown.tsx
git commit -m "refactor: migrate FilterBar + SymbolSearch + FilterDropdown"
```

---

## Task 7: Migrate GridView.tsx + TopMoversView.tsx + IndexStrip.tsx + GlobalMarketsPanel.tsx

**Files:**
- Modify: `src/components/GridView.tsx`
- Modify: `src/components/TopMoversView.tsx`
- Modify: `src/components/IndexStrip.tsx`
- Modify: `src/components/GlobalMarketsPanel.tsx`

- [ ] **Step 1: Migrate GridView.tsx**

Replace `#2563eb`, `#60a5fa`.

- [ ] **Step 2: Migrate TopMoversView.tsx**

Replace market colors.

- [ ] **Step 3: Migrate IndexStrip.tsx**

Replace `#4ade80`, `#f87171`, `#64748b`, `#94a3b8`.

- [ ] **Step 4: Migrate GlobalMarketsPanel.tsx**

Replace `#3b82f6`, `#22c55e`, `#f43f5e`.

- [ ] **Step 5: Commit**

```bash
git add src/components/GridView.tsx src/components/TopMoversView.tsx src/components/IndexStrip.tsx src/components/GlobalMarketsPanel.tsx
git commit -m "refactor: migrate GridView + TopMovers + IndexStrip + GlobalMarkets"
```

---

## Task 8: Migrate HeatmapView.tsx + IntradayChartModal.tsx + TradingViewModal.tsx

**Files:**
- Modify: `src/components/HeatmapView.tsx`
- Modify: `src/components/IntradayChartModal.tsx`
- Modify: `src/components/TradingViewModal.tsx`

- [ ] **Step 1: Migrate HeatmapView.tsx**

Replace heatColor() hardcoded values with CSS variables.

- [ ] **Step 2: Migrate IntradayChartModal.tsx**

Replace ~30 hardcoded colors.

- [ ] **Step 3: Migrate TradingViewModal.tsx**

Replace ~15 hardcoded colors.

- [ ] **Step 4: Commit**

```bash
git add src/components/HeatmapView.tsx src/components/IntradayChartModal.tsx src/components/TradingViewModal.tsx
git commit -m "refactor: migrate Heatmap + IntradayChart + TradingView modals"
```

---

## Task 9: Migrate Tier 2 pages (batch 1) — TradingPanel, OrderBook, MoneyFlow

**Files:**
- Modify: `src/pages/TradingPanel.tsx`
- Modify: `src/pages/OrderBook.tsx`
- Modify: `src/pages/MoneyFlow.tsx`

- [ ] **Step 1: Migrate TradingPanel.tsx**

Remove local `const th`, replace all hardcoded colors with CSS variables.

- [ ] **Step 2: Migrate OrderBook.tsx**

Remove local `const th`, replace all hardcoded colors.

- [ ] **Step 3: Migrate MoneyFlow.tsx**

Remove local `const th`, replace all hardcoded colors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/TradingPanel.tsx src/pages/OrderBook.tsx src/pages/MoneyFlow.tsx
git commit -m "refactor: migrate TradingPanel + OrderBook + MoneyFlow to CSS variables"
```

---

## Task 10: Migrate Tier 2 pages (batch 2) — StockScreener, Portfolio, StockInfo

**Files:**
- Modify: `src/pages/StockScreener.tsx`
- Modify: `src/pages/Portfolio.tsx`
- Modify: `src/pages/StockInfo.tsx`

- [ ] **Step 1: Migrate StockScreener.tsx**

Replace ~80 hardcoded colors.

- [ ] **Step 2: Migrate Portfolio.tsx**

Remove local `const th`, replace colors.

- [ ] **Step 3: Migrate StockInfo.tsx**

Remove local `const th`, replace colors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/StockScreener.tsx src/pages/Portfolio.tsx src/pages/StockInfo.tsx
git commit -m "refactor: migrate StockScreener + Portfolio + StockInfo"
```

---

## Task 11: Migrate Tier 2 pages (batch 3) — OrderHistory, CompanyResearch, PortfolioAnalytics

**Files:**
- Modify: `src/pages/OrderHistory.tsx`
- Modify: `src/pages/CompanyResearch.tsx`
- Modify: `src/pages/PortfolioAnalytics.tsx`

- [ ] **Step 1-3: Migrate each page**

Remove local `const th`, replace hardcoded colors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/OrderHistory.tsx src/pages/CompanyResearch.tsx src/pages/PortfolioAnalytics.tsx
git commit -m "refactor: migrate OrderHistory + CompanyResearch + PortfolioAnalytics"
```

---

## Task 12: Migrate Tier 3 pages (batch 1) — EventCalendar, AccountSettings, AuthFlow

**Files:**
- Modify: `src/pages/EventCalendar.tsx`
- Modify: `src/pages/AccountSettings.tsx`
- Modify: `src/pages/AuthFlow.tsx`

- [ ] **Step 1-3: Migrate each page**

Remove local `const th`, replace hardcoded colors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/EventCalendar.tsx src/pages/AccountSettings.tsx src/pages/AuthFlow.tsx
git commit -m "refactor: migrate EventCalendar + AccountSettings + AuthFlow"
```

---

## Task 13: Migrate Tier 3 pages (batch 2) — MarketNews, AlertsManagement, DerivativesTrading, Watchlists

**Files:**
- Modify: `src/pages/MarketNews.tsx`
- Modify: `src/pages/AlertsManagement.tsx`
- Modify: `src/pages/DerivativesTrading.tsx`
- Modify: `src/pages/Watchlists.tsx`

- [ ] **Step 1-4: Migrate each page**

Remove local `const th`, replace hardcoded colors.

- [ ] **Step 5: Commit**

```bash
git add src/pages/MarketNews.tsx src/pages/AlertsManagement.tsx src/pages/DerivativesTrading.tsx src/pages/Watchlists.tsx
git commit -m "refactor: migrate MarketNews + Alerts + Derivatives + Watchlists"
```

---

## Task 14: Migrate remaining pages + cleanup

**Files:**
- Modify: `src/pages/AdvancedChart.tsx`
- Modify: `src/pages/StockComparison.tsx`
- Modify: `src/pages/MarketHeatmap.tsx`
- Modify: `src/types/priceboard.ts` (deprecate ThemeTokens)

- [ ] **Step 1: Migrate remaining pages**

Replace hardcoded colors in AdvancedChart, StockComparison, MarketHeatmap.

- [ ] **Step 2: Deprecate ThemeTokens type**

Add `@deprecated` JSDoc to ThemeTokens type in priceboard.ts.

- [ ] **Step 3: Full build verification**

Run: `npm run build`
Expected: Clean build, no errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "refactor: complete design system migration — all components use CSS variables"
```

---

## Summary

| Task | Files | Focus |
|------|-------|-------|
| 1 | marketFormat.ts | priceColor() → CSS vars |
| 2 | App.tsx | Remove getTheme(), update th object |
| 3 | TopBar.tsx | All hardcoded colors |
| 4 | FooterBar + Layout | Footer hardcoded, Layout verify |
| 5 | StockTable.tsx | Header colors |
| 6 | FilterBar + SymbolSearch + FilterDropdown | Mixed hardcoded |
| 7 | GridView + TopMovers + IndexStrip + GlobalMarkets | Component colors |
| 8 | Heatmap + IntradayChart + TradingView modals | Modal colors |
| 9 | TradingPanel + OrderBook + MoneyFlow | Page batch 1 |
| 10 | StockScreener + Portfolio + StockInfo | Page batch 2 |
| 11 | OrderHistory + CompanyResearch + PortfolioAnalytics | Page batch 3 |
| 12 | EventCalendar + AccountSettings + AuthFlow | Page batch 4 |
| 13 | MarketNews + Alerts + Derivatives + Watchlists | Page batch 5 |
| 14 | AdvancedChart + StockComparison + MarketHeatmap + cleanup | Final migration |
