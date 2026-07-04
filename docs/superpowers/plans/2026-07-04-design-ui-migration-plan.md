# Design UI Migration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update all 20 React page components to match the design HTML files in `designHtml/`. The app already has shared Layout (TopBar + IndexStrip), so only page-specific content needs updating.

**Architecture:** Each design HTML has a shared TopBar/IndexStrip (already in Layout.tsx) + page-specific content. We extract only the page-specific content and convert it to React inline styles with CSS variables (`--ds-*` tokens). Most pages (16/20) are already near-identical and need minor tweaks. 4 pages need significant work.

**Tech Stack:** React + TypeScript + Vite, inline styles, CSS variables (`--ds-*` design tokens)

## Global Constraints

- Use CSS variables from `src/styles/design-system.css` (e.g., `var(--ds-color-bg-app)`, `var(--ds-color-text-primary)`)
- All styles are inline (no CSS modules, no Tailwind)
- Dark mode is default, light mode via `data-theme` attribute
- Mock data only — no real API calls
- Never commit without user approval
- Each task ends with `npx tsc --noEmit` passing

---

## File Structure

### Pages requiring significant work (4 files)
| File | Action | Complexity |
|------|--------|-----------|
| `src/pages/OrderBook.tsx` | Rewrite layout | L |
| `src/pages/TradingPanel.tsx` | Add features | M |
| `src/pages/MarketHeatmap.tsx` | Full rewrite | L |
| `src/pages/AccountStatement.tsx` | **CREATE new** | M |

### Pages requiring minor tweaks (16 files)
| File | Change |
|------|--------|
| `src/pages/Portfolio.tsx` | Add row hover effect |
| `src/pages/AdvancedChart.tsx` | Minor styling |
| `src/pages/StockComparison.tsx` | Minor styling |
| `src/pages/StockScreener.tsx` | Minor styling |
| `src/pages/MoneyFlow.tsx` | Minor styling |
| `src/pages/CompanyResearch.tsx` | Minor styling |
| `src/pages/DerivativesTrading.tsx` | Minor styling |
| `src/pages/Watchlists.tsx` | Minor styling |
| `src/pages/AlertsManagement.tsx` | Remove add-alert form |
| `src/pages/MarketNews.tsx` | Remove filter tabs |
| `src/pages/EventCalendar.tsx` | Minor styling |
| `src/pages/AccountSettings.tsx` | Minor styling |
| `src/pages/AuthFlow.tsx` | Minor styling |
| `src/pages/StockInfo.tsx` | Minor styling |
| `src/pages/OrderHistory.tsx` | Remove summary cards |
| `src/pages/PortfolioAnalytics.tsx` | Remove performance chart |

### Router update
| File | Change |
|------|--------|
| `src/router.tsx` | Add AccountStatement route |

---

## Task 1: Order Book — Rewrite Layout (L)

**Files:**
- Modify: `src/pages/OrderBook.tsx`

**Design reference:** `designHtml/Order Book.dc.html` lines 100-458

**Key changes:**
1. Replace tab-based layout (depth/trades toggle) with 2-column grid: Col A = Unified Ladder, Col B = Stats + Recent Trades
2. Add Symbol Header bar (symbol input, quick chips, price, LIVE badge)
3. Implement unified depth ladder: asks reversed (highest at top), spread row in middle, bids below
4. Add imbalance bar visual
5. Recent trades in 4-column grid with colored backgrounds

**Current layout:** Tab switcher with depth view OR trades view
**Target layout:** 2-column grid `1fr 340px` showing BOTH simultaneously

- [ ] **Step 1: Read design HTML** — Read `designHtml/Order Book.dc.html` lines 100-458 to understand exact layout
- [ ] **Step 2: Read current page** — Read `src/pages/OrderBook.tsx` to understand current implementation
- [ ] **Step 3: Rewrite component** — Replace the entire page content with the unified ladder layout from design
- [ ] **Step 4: Verify** — Run `npx tsc --noEmit`
- [ ] **Step 5: Visual test** — Open in browser, verify layout matches design

---

## Task 2: Trading Panel — Add Features (M)

**Files:**
- Modify: `src/pages/TradingPanel.tsx`

**Design reference:** `designHtml/Trading Panel.dc.html` lines 100-683

**Key changes:**
1. Add Order Mode Tabs (Lệnh thường / Lệnh điều kiện)
2. Add conditional order trigger price input (when "Lệnh điều kiện" selected)
3. Add Qty percentage buttons (% sức mua, % số lượng)
4. Add Session badge (ATO/ATC/Khớp lệnh liên tục/Đóng cửa)
5. Expand depth ladder from 3 to 5 levels

**Current layout:** 3-column `340px 1fr 300px` with basic order form
**Target layout:** Same 3-column but with additional features in Col A

- [ ] **Step 1: Read design HTML** — Read `designHtml/Trading Panel.dc.html` lines 100-683
- [ ] **Step 2: Read current page** — Read `src/pages/TradingPanel.tsx`
- [ ] **Step 3: Add Order Mode Tabs** — Add toggle between "Lệnh thường" and "Lệnh điều kiện"
- [ ] **Step 4: Add conditional order fields** — Trigger price input, condition select (>=, <=, =)
- [ ] **Step 5: Add Qty percentage buttons** — % sức mua, % số lượng đang có
- [ ] **Step 6: Add Session badge** — ATO/ATC/Liên tục/Đóng cửa indicator
- [ ] **Step 7: Expand depth ladder** — 5 levels instead of 3
- [ ] **Step 8: Verify** — Run `npx tsc --noEmit`

---

## Task 3: Market Heatmap — Full Rewrite (L)

**Files:**
- Modify: `src/pages/MarketHeatmap.tsx`

**Design reference:** `designHtml/Market Heatmap.dc.html` lines 115-160

**Key changes:**
1. Replace placeholder ("Trang đang được xây dựng...") with full treemap implementation
2. Implement squarified treemap layout algorithm
3. Add color mapping: Vietnamese convention (tím=tăng trần, xanh lá=tăng, vàng=tham chiếu, cam=giảm, đỏ=giảm sàn, xanh dương=giảm sàn)
4. Add gradient legend bar
5. Add top movers summary (gainers/losers 2-column grid)

- [ ] **Step 1: Read design HTML** — Read `designHtml/Market Heatmap.dc.html` lines 115-160
- [ ] **Step 2: Implement treemap algorithm** — Squarified treemap layout function
- [ ] **Step 3: Implement color mapping** — Vietnamese stock convention colors
- [ ] **Step 4: Build treemap component** — SVG-based treemap with stock cells
- [ ] **Step 5: Add legend bar** — Gradient legend with color labels
- [ ] **Step 6: Add top movers** — Gainers/losers 2-column grid
- [ ] **Step 7: Generate mock data** — 85+ stocks with market cap, price change
- [ ] **Step 8: Verify** — Run `npx tsc --noEmit`

---

## Task 4: Account Statement — New Page (M)

**Files:**
- Create: `src/pages/AccountStatement.tsx`
- Modify: `src/router.tsx` — Add route

**Design reference:** `designHtml/Account Statement.dc.html` lines 112-149

**Key changes:**
1. Create new page with filter tabs (Tất cả, Nạp/Rút, Giao dịch CK, Phí & Cổ tức)
2. Add action buttons (Nạp tiền, Rút tiền)
3. Create transaction table (5 columns: Ngày, Loại, Diễn giải, Số tiền, Số dư)
4. Mock data: deposits, withdrawals, buy/sell, fees, dividends

- [ ] **Step 1: Read design HTML** — Read `designHtml/Account Statement.dc.html` lines 112-149
- [ ] **Step 2: Create page component** — Build AccountStatement.tsx with filter tabs + table
- [ ] **Step 3: Add mock data** — Transaction history with various types
- [ ] **Step 4: Add route** — Update router.tsx with `/account-statement` route
- [ ] **Step 5: Verify** — Run `npx tsc --noEmit`

---

## Task 5: Minor Tweaks for 16 Pages

**Files:** 16 page files listed above

**Key changes per page:**
- Remove extra sections that designs don't have (summary cards, filter tabs, add forms)
- Add missing hover effects
- Ensure CSS variable usage is consistent

- [ ] **Step 1: Alerts Management** — Remove "Add New Alert" form section
- [ ] **Step 2: Market News** — Remove filter tabs
- [ ] **Step 3: Order History** — Remove summary cards at top
- [ ] **Step 4: Portfolio Analytics** — Remove performance comparison chart
- [ ] **Step 5: Portfolio** — Add row hover effect
- [ ] **Step 6: All other pages** — Minor CSS variable alignment
- [ ] **Step 7: Verify** — Run `npx tsc --noEmit`

---

## Execution Strategy

Given the massive scope, tasks will be executed in parallel batches:

**Batch 1 (Parallel):** Task 1 (OrderBook) + Task 2 (TradingPanel) + Task 3 (MarketHeatmap) + Task 4 (AccountStatement)
**Batch 2 (Sequential):** Task 5 (Minor tweaks — all 16 pages)
**Batch 3:** Verify — lint + build + visual check

Each batch dispatches parallel subagents, waits for completion, then proceeds.
