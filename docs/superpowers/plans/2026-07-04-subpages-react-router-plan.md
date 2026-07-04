# Sub-Pages with React Router — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add React Router navigation and create all 19 sub-page components matching HTML designs in `designHtml/`, with working menu links from the main priceboard page.

**Architecture:** Install react-router-dom, set up BrowserRouter in main.tsx, create a shared Layout component with TopBar, define routes for all pages, create page components that render the same UI as HTML designs (converted from DC template syntax to React inline styles). Each page component manages its own local state.

**Tech Stack:** React 19, React Router DOM v7, TypeScript, inline styles (matching existing pattern)

## Global Constraints

- All styles must match HTML designs exactly — same colors, sizes, spacing, fonts
- Follow existing patterns: `memo()` for pure components, inline styles, ThemeTokens where applicable
- No new CSS files — all inline styles matching HTML design
- Each page is self-contained with its own state management
- React Router v7 (latest stable)

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `package.json` | Modify | Add react-router-dom dependency |
| `src/main.tsx` | Modify | Wrap App in BrowserRouter |
| `src/App.tsx` | Modify | Add Routes, convert TopBar links to NavLink |
| `src/components/Layout.tsx` | **Create** | Shared layout with TopBar + Outlet |
| `src/components/TopBar.tsx` | Modify | Convert `<a>` to `<NavLink>` for menu items |
| `src/pages/TradingPanel.tsx` | **Create** | Bảng đặt lệnh |
| `src/pages/OrderBook.tsx` | **Create** | Sổ lệnh |
| `src/pages/OrderHistory.tsx` | **Create** | Lịch sử lệnh |
| `src/pages/Portfolio.tsx` | **Create** | Danh mục đầu tư |
| `src/pages/PortfolioAnalytics.tsx` | **Create** | Phân tích danh mục |
| `src/pages/AdvancedChart.tsx` | **Create** | Biểu đồ nâng cao |
| `src/pages/MarketHeatmap.tsx` | **Create** | Bản đồ nhiệt |
| `src/pages/StockComparison.tsx` | **Create** | So sánh mã |
| `src/pages/StockScreener.tsx` | **Create** | Screener |
| `src/pages/MoneyFlow.tsx` | **Create** | Dòng tiền |
| `src/pages/CompanyResearch.tsx` | **Create** | Nghiên cứu DN |
| `src/pages/DerivativesTrading.tsx` | **Create** | Phái sinh |
| `src/pages/Watchlists.tsx` | **Create** | Watchlists |
| `src/pages/AlertsManagement.tsx` | **Create** | Cảnh báo giá |
| `src/pages/MarketNews.tsx` | **Create** | Tin tức |
| `src/pages/EventCalendar.tsx` | **Create** | Lịch sự kiện |
| `src/pages/AccountSettings.tsx` | **Create** | Cài đặt TK |
| `src/pages/AuthFlow.tsx` | **Create** | Đăng nhập/KYC |
| `src/pages/StockInfo.tsx` | **Create** | Thông tin CP |

---

## Task 1: Install React Router & Setup Infrastructure

**Files:**
- Modify: `package.json`
- Modify: `src/main.tsx`
- Create: `src/components/Layout.tsx`

**Interfaces:**
- Produces: BrowserRouter wrapper, Layout component with TopBar + Outlet

- [ ] **Step 1: Install react-router-dom**

Run: `npm install react-router-dom`
Expected: Package added to dependencies

- [ ] **Step 2: Update main.tsx to wrap with BrowserRouter**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

- [ ] **Step 3: Create Layout component**

Create `src/components/Layout.tsx`:

```tsx
import { Outlet } from 'react-router-dom'
import TopBar from './TopBar'
import FooterBar from './FooterBar'
import type { ThemeTokens } from '../types/priceboard'

type Props = { th: ThemeTokens; toggleDark: () => void }

export default function Layout({ th, toggleDark }: Props) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100vh',
      fontFamily: "'Inter', system-ui, sans-serif", color: th.text,
      overflow: 'hidden', background: th.appBg,
    }}>
      <TopBar th={th} toggleDark={toggleDark} />
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Outlet />
      </div>
      <FooterBar />
    </div>
  )
}
```

- [ ] **Step 4: Verify no compile errors**

Run: `npx tsc --noEmit`
Expected: No errors

---

## Task 2: Update App.tsx with Routes

**Files:**
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: Layout, all page components
- Produces: Route configuration

- [ ] **Step 1: Add Routes to App.tsx**

Replace the return section of App.tsx. Keep all existing state logic, but change the JSX to use Routes:

```tsx
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
// ... existing imports ...

// Lazy load pages for better performance
import TradingPanel from './pages/TradingPanel'
import OrderBook from './pages/OrderBook'
import OrderHistory from './pages/OrderHistory'
import Portfolio from './pages/Portfolio'
import PortfolioAnalytics from './pages/PortfolioAnalytics'
import AdvancedChart from './pages/AdvancedChart'
import MarketHeatmap from './pages/MarketHeatmap'
import StockComparison from './pages/StockComparison'
import StockScreener from './pages/StockScreener'
import MoneyFlow from './pages/MoneyFlow'
import CompanyResearch from './pages/CompanyResearch'
import DerivativesTrading from './pages/DerivativesTrading'
import Watchlists from './pages/Watchlists'
import AlertsManagement from './pages/AlertsManagement'
import MarketNews from './pages/MarketNews'
import EventCalendar from './pages/EventCalendar'
import AccountSettings from './pages/AccountSettings'
import AuthFlow from './pages/AuthFlow'
import StockInfo from './pages/StockInfo'

// In the return statement:
return (
  <Routes>
    <Route element={<Layout th={th} toggleDark={toggleDark} />}>
      <Route path="/" element={<HomePage th={th} stocks={stocksWithWatchlist} indices={indices} ... />} />
      <Route path="/trading-panel" element={<TradingPanel />} />
      <Route path="/order-book" element={<OrderBook />} />
      <Route path="/order-history" element={<OrderHistory />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/portfolio-analytics" element={<PortfolioAnalytics />} />
      <Route path="/advanced-chart" element={<AdvancedChart />} />
      <Route path="/market-heatmap" element={<MarketHeatmap />} />
      <Route path="/stock-comparison" element={<StockComparison />} />
      <Route path="/stock-screener" element={<StockScreener />} />
      <Route path="/money-flow" element={<MoneyFlow />} />
      <Route path="/company-research" element={<CompanyResearch />} />
      <Route path="/derivatives-trading" element={<DerivativesTrading />} />
      <Route path="/watchlists" element={<Watchlists />} />
      <Route path="/alerts" element={<AlertsManagement />} />
      <Route path="/market-news" element={<MarketNews />} />
      <Route path="/event-calendar" element={<EventCalendar />} />
      <Route path="/account-settings" element={<AccountSettings />} />
      <Route path="/auth" element={<AuthFlow />} />
      <Route path="/stock-info" element={<StockInfo />} />
    </Route>
  </Routes>
)
```

- [ ] **Step 2: Extract HomePage component**

Move the existing priceboard JSX (IndexStrip, FilterBar, StockTable, etc.) into a separate `src/pages/HomePage.tsx` component to keep App.tsx clean for routing.

- [ ] **Step 3: Verify no compile errors**

Run: `npx tsc --noEmit`
Expected: No errors (may have unused imports to clean up)

---

## Task 3: Update TopBar Navigation Links

**Files:**
- Modify: `src/components/TopBar.tsx`

**Interfaces:**
- Consumes: React Router NavLink
- Produces: Working navigation links

- [ ] **Step 1: Convert menu links to NavLink**

In TopBar.tsx, replace `<a href="#">` with `<NavLink to="/path">` for:
- Quick links: Danh mục → /portfolio, Đặt lệnh → /trading-panel, Sổ lệnh → /order-book
- More Tools dropdown items: each item gets its correct route
- Nav tabs: TRANG CHỦ → /, BẢNG GIÁ → / (active)

Key changes:
```tsx
import { NavLink } from 'react-router-dom'

// Quick links
<NavLink to="/portfolio" style={{...}}>💼 Danh mục</NavLink>
<NavLink to="/trading-panel" style={{...}}>💰 Đặt lệnh</NavLink>
<NavLink to="/order-book" style={{...}}>📖 Sổ lệnh</NavLink>

// Menu items get href replaced with to:
{ href: '/advanced-chart', icon: '📈', label: 'Chart nâng cao', ... }
{ href: '/market-heatmap', icon: '🗺️', label: 'Bản đồ nhiệt', ... }
// etc.
```

- [ ] **Step 2: Update MENU_GROUPS with correct routes**

```typescript
const MENU_GROUPS: MenuGroup[] = [
  {
    title: 'Phân tích',
    color: '#60a5fa',
    items: [
      { href: '/advanced-chart', icon: '📈', iconBg: 'rgba(96,165,250,.15)', label: 'Chart nâng cao', desc: 'Nến, MA, RSI, MACD, Bollinger' },
      { href: '/market-heatmap', icon: '🗺️', iconBg: 'rgba(192,38,211,.15)', label: 'Bản đồ nhiệt', desc: 'Treemap toàn thị trường' },
      { href: '/stock-comparison', icon: '📊', iconBg: 'rgba(96,165,250,.15)', label: 'So sánh mã', desc: 'So sánh hiệu suất 2-5 mã' },
      { href: '/stock-screener', icon: '🔍', iconBg: 'rgba(96,165,250,.15)', label: 'Screener', desc: 'Lọc theo P/E, P/B, ROE...' },
      { href: '/money-flow', icon: '💵', iconBg: 'rgba(34,197,94,.15)', label: 'Dòng tiền', desc: 'NN mua/bán theo ngành' },
      { href: '/company-research', icon: '🏢', iconBg: 'rgba(168,85,247,.15)', label: 'Nghiên cứu DN', desc: 'BCTC & khuyến nghị CTCK' },
      { href: '/portfolio-analytics', icon: '📐', iconBg: 'rgba(168,85,247,.15)', label: 'Phân tích DM', desc: 'Beta, Sharpe, Backtest' },
    ],
  },
  {
    title: 'Giao dịch',
    color: '#22c55e',
    items: [
      { href: '/trading-panel', icon: '💰', iconBg: 'rgba(34,197,94,.15)', label: 'Đặt lệnh', desc: 'Bảng giá & khớp lệnh' },
      { href: '/derivatives-trading', icon: '📉', iconBg: 'rgba(249,115,22,.15)', label: 'Phái sinh', desc: 'VN30F, margin, T+0' },
      { href: '/order-book', icon: '📖', iconBg: 'rgba(34,197,94,.15)', label: 'Sổ lệnh', desc: 'Độ sâu thị trường' },
      { href: '/order-history', icon: '📋', iconBg: 'rgba(34,197,94,.15)', label: 'Lịch sử lệnh', desc: 'Đã khớp, chờ khớp, đã hủy' },
      { href: '#', icon: '🧾', iconBg: 'rgba(245,158,11,.15)', label: 'Sao kê TK', desc: 'Nạp/rút, giao dịch tiền' },
      { href: '/watchlists', icon: '⭐', iconBg: 'rgba(245,158,11,.15)', label: 'Watchlists', desc: 'Danh mục theo dõi' },
      { href: '/alerts', icon: '🔔', iconBg: 'rgba(245,158,11,.15)', label: 'Cảnh báo giá', desc: 'Quản lý các alert đã đặt' },
    ],
  },
  {
    title: 'Thông tin & Tài khoản',
    color: '#f59e0b',
    items: [
      { href: '/portfolio', icon: '💼', iconBg: 'rgba(34,197,94,.15)', label: 'Danh mục đầu tư', desc: 'NAV, phân bổ, lãi/lỗ' },
      { href: '/market-news', icon: '📰', iconBg: 'rgba(168,85,247,.15)', label: 'Tin tức', desc: 'Vĩ mô, doanh nghiệp, ngành' },
      { href: '/event-calendar', icon: '📅', iconBg: 'rgba(168,85,247,.15)', label: 'Lịch sự kiện', desc: 'ĐHCĐ, cổ tức, chốt quyền' },
      { href: '/account-settings', icon: '⚙️', iconBg: 'rgba(148,163,184,.15)', label: 'Cài đặt TK', desc: 'Hồ sơ, bảo mật, thông báo' },
      { href: '/auth', icon: '🔑', iconBg: 'rgba(148,163,184,.15)', label: 'Đăng nhập/KYC', desc: 'Đăng ký & xác thực' },
    ],
  },
]
```

- [ ] **Step 3: Use NavLink for menu items**

Replace `<a>` with `<NavLink>` in the dropdown menu rendering, using `onClick={() => setShowMoreTools(false)}` to close the dropdown after navigation.

- [ ] **Step 4: Verify no compile errors**

Run: `npx tsc --noEmit`
Expected: No errors

---

## Task 4: Create Page Components (Batch 1 — Trading & Orders)

**Files:**
- Create: `src/pages/TradingPanel.tsx`
- Create: `src/pages/OrderBook.tsx`
- Create: `src/pages/OrderHistory.tsx`

**Interfaces:**
- Each page is self-contained with local state
- Uses same inline style patterns as existing components

For each page, the component renders the same UI as the HTML design. Since all HTML files have DC template syntax ({{ var }}, sc-for, sc-if), I'll convert them to React state + JSX.

Each page follows this pattern:
```tsx
import { useState } from 'react'

export default function PageName() {
  const [state, setState] = useState(initialValue)
  
  return (
    <div style={{ background: '#060c18', color: '#d4e0ee', minHeight: '100%', padding: 16 }}>
      {/* Page content matching HTML design */}
    </div>
  )
}
```

- [ ] **Step 1: Create TradingPanel page** (~500 lines HTML → ~300 lines React)

Key sections from HTML:
- Symbol header with search autocomplete
- Stock info (price, change, ceiling/floor/reference)
- 3-column layout: Order form (BUY/SELL, LO/ATO/ATC/MP, price stepper, qty stepper), Order book (3-level bid/ask), Account info
- Order form logic: price/qty stepping, order value/fee calculation

- [ ] **Step 2: Create OrderBook page** (~250 lines HTML → ~150 lines React)

Key sections:
- Depth chart visualization
- Bid/Ask tables (10 levels)
- Stats row (Bid Vol, Ask Vol, Spread, Imbalance)
- Recent trades ticker

- [ ] **Step 3: Create OrderHistory page** (~220 lines HTML → ~130 lines React)

Key sections:
- Summary cards (Total, Matched, Pending, Value)
- Filter tabs (All, Matched, Pending, Cancelled)
- Orders table with status badges and action buttons

- [ ] **Step 4: Verify no compile errors**

Run: `npx tsc --noEmit`
Expected: No errors

---

## Task 5: Create Page Components (Batch 2 — Portfolio & Analytics)

**Files:**
- Create: `src/pages/Portfolio.tsx`
- Create: `src/pages/PortfolioAnalytics.tsx`

- [ ] **Step 1: Create Portfolio page** (~540 lines HTML → ~350 lines React)

Key sections:
- NAV summary (total assets, P&L, cash, stock value, margin ratio)
- NAV growth chart (SVG area chart)
- Asset allocation donut
- Sector allocation bars
- Holdings table with sparklines and P&L

- [ ] **Step 2: Create PortfolioAnalytics page** (~210 lines HTML → ~130 lines React)

Key sections:
- Performance chart vs VN-Index
- Risk metrics grid (Beta, Sharpe, Max DD, Volatility)
- Backtesting tool with strategy selector

- [ ] **Step 3: Verify no compile errors**

Run: `npx tsc --noEmit`
Expected: No errors

---

## Task 6: Create Page Components (Batch 3 — Analysis Tools)

**Files:**
- Create: `src/pages/AdvancedChart.tsx`
- Create: `src/pages/MarketHeatmap.tsx`
- Create: `src/pages/StockComparison.tsx`
- Create: `src/pages/StockScreener.tsx`
- Create: `src/pages/MoneyFlow.tsx`
- Create: `src/pages/CompanyResearch.tsx`

- [ ] **Step 1: Create AdvancedChart page** (~370 lines → ~250 lines)

Key sections:
- Candlestick chart SVG
- Volume chart
- Timeframe toolbar (1D-5Y)
- Drawing tools
- RSI, MACD, Bollinger panels

- [ ] **Step 2: Create MarketHeatmap page** (~390 lines → ~250 lines)

Key sections:
- Treemap SVG with color-coded cells
- Filter by exchange
- Size by market cap/volume
- Top gainers/losers summary

- [ ] **Step 3: Create StockComparison page** (~295 lines → ~180 lines)

Key sections:
- Stock selector (add/remove, max 5)
- Comparison table
- Performance stats cards

- [ ] **Step 4: Create StockScreener page** (~319 lines → ~200 lines)

Key sections:
- Filter panel (P/E, P/B, EPS, Dividend, ROE, sector)
- Results table with CSV export

- [ ] **Step 5: Create MoneyFlow page** (~228 lines → ~140 lines)

Key sections:
- Bar chart net flow by sector
- Buy/Sell columns
- Sector summary table

- [ ] **Step 6: Create CompanyResearch page** (~231 lines → ~150 lines)

Key sections:
- Revenue & profit bar chart
- Financial ratios grid
- Analyst recommendations table

- [ ] **Step 7: Verify no compile errors**

Run: `npx tsc --noEmit`
Expected: No errors

---

## Task 7: Create Page Components (Batch 4 — Trading & Info)

**Files:**
- Create: `src/pages/DerivativesTrading.tsx`
- Create: `src/pages/Watchlists.tsx`
- Create: `src/pages/AlertsManagement.tsx`
- Create: `src/pages/StockInfo.tsx`

- [ ] **Step 1: Create DerivativesTrading page** (~253 lines → ~160 lines)

Key sections:
- Contract info header
- Positions table
- Margin info
- Order form (LONG/SHORT)

- [ ] **Step 2: Create Watchlists page** (~174 lines → ~100 lines)

Key sections:
- Tab switcher for watchlists
- Stock table with drag handle

- [ ] **Step 3: Create AlertsManagement page** (~192 lines → ~120 lines)

Key sections:
- Alert creation form
- Alert list with toggle/delete

- [ ] **Step 4: Create StockInfo page** (~393 lines → ~250 lines)

Key sections:
- Hero header with gradient
- Key metrics (P/E, P/B, EPS, Dividend)
- Financial highlights
- Analyst ratings

- [ ] **Step 5: Verify no compile errors**

Run: `npx tsc --noEmit`
Expected: No errors

---

## Task 8: Create Page Components (Batch 5 — Info & Auth)

**Files:**
- Create: `src/pages/MarketNews.tsx`
- Create: `src/pages/EventCalendar.tsx`
- Create: `src/pages/AccountSettings.tsx`
- Create: `src/pages/AuthFlow.tsx`

- [ ] **Step 1: Create MarketNews page** (~175 lines → ~110 lines)

Key sections:
- Category filter pills
- Featured news hero card
- News grid

- [ ] **Step 2: Create EventCalendar page** (~181 lines → ~120 lines)

Key sections:
- Calendar grid with dots
- Event list sidebar

- [ ] **Step 3: Create AccountSettings page** (~217 lines → ~140 lines)

Key sections:
- Sidebar navigation (Profile, Security, Notifications, Appearance)
- Forms for each section

- [ ] **Step 4: Create AuthFlow page** (~206 lines → ~130 lines)

Key sections:
- Multi-step form (Login, Register, eKYC, Success)
- Stepper UI

- [ ] **Step 5: Verify no compile errors**

Run: `npx tsc --noEmit`
Expected: No errors

---

## Task 9: Final Verification

**Files:**
- All modified/created files

- [ ] **Step 1: Full type check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 2: Full build**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Test navigation**

Start dev server: `npm run dev`
Verify:
- Main page loads at /
- Clicking menu items navigates to correct pages
- Browser back/forward works
- All pages render without errors

---

## Execution Notes

- **Task 1-3** are infrastructure (must be done first, sequentially)
- **Task 4-8** are page creation (can be done in parallel batches)
- **Task 9** depends on all previous tasks

Estimated effort: ~4-6 hours for a skilled developer (19 pages × ~15 min each + infrastructure).

**Strategy:** Each page component converts the HTML design's DC template syntax to React. The HTML uses `{{ var }}` for interpolation, `sc-for` for loops, `sc-if` for conditionals — these become React state, `.map()`, and conditional rendering.
