# Priceboard UI Update — Match HTML Design 100%

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update all React components in `src/` to match the HTML design in `designHtml/Bang Dien.home.html` pixel-perfectly — same layout, colors, spacing, features, and interactions.

**Architecture:** Enhance existing components (TopBar, IndexStrip, FilterBar, StockTable, GridView, HeatmapView, IntradayChartModal) and create one new component (TopMoversView). Add state for advanced filters, trade history, movers view, and CSV export in App.tsx. All styling uses inline styles matching the HTML design exactly.

**Tech Stack:** React 18, TypeScript, inline styles (no CSS modules), existing mock data simulation.

## Global Constraints

- All styles must match `designHtml/Bang Dien.home.html` exactly — same colors, sizes, spacing, fonts
- Follow existing patterns: `memo()` for pure components, `useCallback`/`useMemo` for performance
- ThemeTokens type must be extended if new theme values are needed
- No new dependencies — use only what's already in package.json
- All components receive `th: ThemeTokens` for dark/light theme support
- Stock data comes from existing `createInitialStocks()` and `tickStocks()` simulation

---

## File Map

| File | Action | What Changes |
|------|--------|-------------|
| `src/types/priceboard.ts` | Modify | Add `TopMoverItem`, `TradeHistoryItem`, `BreadthData` types |
| `src/components/TopBar.tsx` | Modify | Add nav tabs, quick links, more-tools dropdown |
| `src/components/IndexStrip.tsx` | Modify | Fix height to 158px |
| `src/components/FilterBar.tsx` | Modify | Add movers button, filter/history toggle icons, advanced filter panel, trade history panel |
| `src/components/TopMoversView.tsx` | **Create** | New component: top gainers/losers/volume + breadth indicators |
| `src/components/StockTable.tsx` | Modify | Add watchlist heart column |
| `src/components/GridView.tsx` | Modify | Add price background colors based on % change |
| `src/components/HeatmapView.tsx` | Modify | Add price, % change, volume to cells; sector total % |
| `src/components/IntradayChartModal.tsx` | Modify | Add action buttons (Thông tin CP, Sổ lệnh, Đặt lệnh) |
| `src/App.tsx` | Modify | Add movers view, advanced filter state, trade history, CSV export, watchlist toggle |

---

## Task 1: Extend Types

**Files:**
- Modify: `src/types/priceboard.ts`

**Interfaces:**
- Produces: `TopMoverItem`, `TradeHistoryItem`, `BreadthData` types used by TopMoversView and FilterBar

- [ ] **Step 1: Add new types to priceboard.ts**

Append after the `ChartView` type (line 166):

```typescript
export type TopMoverItem = {
  sym: string
  pct: string
  lp: string
  vol: string
  pc: string
  onChart: () => void
}

export type TradeHistoryItem = {
  sym: string
  time: string
  price: string
  qty: string
  side: string
  sideColor: string
  priceColor: string
  timeColor: string
  volColor: string
}

export type BreadthData = {
  label: string
  upCnt: number
  total: number
  upPct: number
  upColor: string
}
```

- [ ] **Step 2: Verify types compile**

Run: `npx tsc --noEmit`
Expected: No errors

---

## Task 2: Update TopBar — Add Nav Tabs, Quick Links, More Tools Dropdown

**Files:**
- Modify: `src/components/TopBar.tsx`

**Interfaces:**
- Consumes: `ThemeTokens`
- Produces: nothing new (UI only)

- [ ] **Step 1: Add state for more-tools dropdown and nav tabs**

Replace the entire `TopBarInner` component. Key changes:
1. Add `showMoreTools` state
2. Add nav tabs row below the top bar
3. Add quick links (Danh mục, Đặt lệnh, Sổ lệnh)
4. Add more-tools dropdown panel with 3-column grid
5. Add tools grid icon button

```tsx
import { useState, useEffect } from 'react'
import { memo } from 'react'
import type { ThemeTokens } from '../types/priceboard'

type Props = { th: ThemeTokens; toggleDark: () => void }

type MenuItem = {
  href: string
  icon: string
  iconBg: string
  label: string
  desc: string
}

type MenuGroup = {
  title: string
  color: string
  items: MenuItem[]
}

const MENU_GROUPS: MenuGroup[] = [
  {
    title: 'Phân tích',
    color: '#60a5fa',
    items: [
      { href: '#', icon: '\u{1F4C8}', iconBg: 'rgba(96,165,250,.15)', label: 'Chart nâng cao', desc: 'Nến, MA, RSI, MACD, Bollinger' },
      { href: '#', icon: '\u{1F5FA}', iconBg: 'rgba(192,38,211,.15)', label: 'Bản đồ nhiệt', desc: 'Treemap toàn thị trường' },
      { href: '#', icon: '\u{1F4CA}', iconBg: 'rgba(96,165,250,.15)', label: 'So sánh mã', desc: 'So sánh hiệu suất 2-5 mã' },
      { href: '#', icon: '\u{1F50D}', iconBg: 'rgba(96,165,250,.15)', label: 'Screener', desc: 'Lọc theo P/E, P/B, ROE...' },
      { href: '#', icon: '\u{1F4B5}', iconBg: 'rgba(34,197,94,.15)', label: 'Dòng tiền', desc: 'NN mua/bán theo ngành' },
      { href: '#', icon: '\u{1F3E2}', iconBg: 'rgba(168,85,247,.15)', label: 'Nghiên cứu DN', desc: 'BCTC & khuyến nghị CTCK' },
      { href: '#', icon: '\u{1F4D0}', iconBg: 'rgba(168,85,247,.15)', label: 'Phân tích DM', desc: 'Beta, Sharpe, Backtest' },
    ],
  },
  {
    title: 'Giao dịch',
    color: '#22c55e',
    items: [
      { href: '#', icon: '\u{1F4B0}', iconBg: 'rgba(34,197,94,.15)', label: 'Đặt lệnh', desc: 'Bảng giá & khớp lệnh' },
      { href: '#', icon: '\u{1F4C9}', iconBg: 'rgba(249,115,22,.15)', label: 'Phái sinh', desc: 'VN30F, margin, T+0' },
      { href: '#', icon: '\u{1F4D6}', iconBg: 'rgba(34,197,94,.15)', label: 'Sổ lệnh', desc: 'Độ sâu thị trường' },
      { href: '#', icon: '\u{1F4CB}', iconBg: 'rgba(34,197,94,.15)', label: 'Lịch sử lệnh', desc: 'Đã khớp, chờ khớp, đã hủy' },
      { href: '#', icon: '\u{1F9FE}', iconBg: 'rgba(245,158,11,.15)', label: 'Sao kê TK', desc: 'Nạp/rút, giao dịch tiền' },
      { href: '#', icon: '\u2B50', iconBg: 'rgba(245,158,11,.15)', label: 'Watchlists', desc: 'Danh mục theo dõi' },
      { href: '#', icon: '\u{1F514}', iconBg: 'rgba(245,158,11,.15)', label: 'Cảnh báo giá', desc: 'Quản lý các alert đã đặt' },
    ],
  },
  {
    title: 'Thông tin & Tài khoản',
    color: '#f59e0b',
    items: [
      { href: '#', icon: '\u{1F4BC}', iconBg: 'rgba(34,197,94,.15)', label: 'Danh mục đầu tư', desc: 'NAV, phân bổ, lãi/lỗ' },
      { href: '#', icon: '\u{1F4F0}', iconBg: 'rgba(168,85,247,.15)', label: 'Tin tức', desc: 'Vĩ mô, doanh nghiệp, ngành' },
      { href: '#', icon: '\u{1F4C5}', iconBg: 'rgba(168,85,247,.15)', label: 'Lịch sự kiện', desc: 'ĐHCĐ, cổ tức, chốt quyền' },
      { href: '#', icon: '\u2699\uFE0F', iconBg: 'rgba(148,163,184,.15)', label: 'Cài đặt TK', desc: 'Hồ sơ, bảo mật, thông báo' },
      { href: '#', icon: '\u{1F511}', iconBg: 'rgba(148,163,184,.15)', label: 'Đăng nhập/KYC', desc: 'Đăng ký & xác thực' },
    ],
  },
]

const NAV_ITEMS = [
  { label: 'TRANG CH\u1EE6', weight: '400' as const, active: false },
  { label: 'B\u1EA2NG GIÁ', weight: '700' as const, active: true },
  { label: 'TH\u1ECA TR\u01AF\u1EDANG', weight: '500' as const, active: false },
  { label: 'TÀI S\u1EA2N', weight: '400' as const, active: false },
  { label: 'GIAO D\u1ECACH', weight: '400' as const, active: false },
  { label: 'VIETCAP IQ', weight: '400' as const, active: false },
  { label: 'AI NEWS', weight: '400' as const, active: false },
  { label: 'S\u1EA2N PH\u1EA8M', weight: '400' as const, active: false },
  { label: 'TI\u1EC6N \u00DDCH', weight: '400' as const, active: false },
]

function TopBarInner({ th, toggleDark }: Props) {
  const [timeStr, setTimeStr] = useState(() => formatTime(new Date()))
  const [showMoreTools, setShowMoreTools] = useState(false)

  useEffect(() => {
    const c = setInterval(() => setTimeStr(formatTime(new Date())), 1000)
    return () => clearInterval(c)
  }, [])

  const toolCount = MENU_GROUPS.reduce((s, g) => s + g.items.length, 0)

  return (
    <div style={{ flexShrink: 0 }}>
      {/* Main top bar */}
      <div style={{
        background: 'linear-gradient(90deg, #060c18 0%, #0b1628 60%, #060c18 100%)',
        display: 'flex', alignItems: 'center', padding: '0 16px', height: 42,
        flexShrink: 0, gap: 10, borderBottom: '1px solid #0f1e36',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0, marginRight: 4 }}>
          <div style={{
            width: 26, height: 26, background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="12" viewBox="0 0 14 12">
              <polygon points="7,0 14,12 0,12" fill="#fff" />
            </svg>
          </div>
          <span style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: 0.4, fontFamily: "'Inter', sans-serif" }}>
            Ray <span style={{ color: '#22c55e' }}>Stock Market</span>
          </span>
        </div>

        {/* Market status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#0f1e36', borderRadius: 20, padding: '3px 10px', flexShrink: 0 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: 10, fontWeight: 600, color: '#22c55e', letterSpacing: 0.3 }}>ĐANG GIAO DỊCH</span>
        </div>

        {/* Clock */}
        <span style={{ color: '#4a6080', fontSize: 11, flexShrink: 0, fontFamily: "'JetBrains Mono', monospace", fontWeight: 500, letterSpacing: 0.5 }}>
          {timeStr}
        </span>

        {/* Ticker tape */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative', height: '100%', display: 'flex', alignItems: 'center', minWidth: 0 }}>
          <div style={{ position: 'absolute', inset: 0, left: 0, width: 40, background: 'linear-gradient(90deg, #060c18, transparent)', zIndex: 1, pointerEvents: 'none' }} />
          <span style={{ position: 'absolute', whiteSpace: 'nowrap', animation: 'ticker 34s linear infinite', color: '#94a3b8', fontSize: 10.5, fontWeight: 500, fontFamily: "'JetBrains Mono', monospace" }}>
            <span style={{ color: '#fbbf24' }}>VN-Index</span> <span style={{ color: '#4ade80' }}>{'\u25B2'}1,860.01 +5.04</span> {'\u2502'}
            <span style={{ color: '#fbbf24' }}>VN30</span> <span style={{ color: '#4ade80' }}>{'\u25B2'}1,995.71 +5.06</span> {'\u2502'}
            <span style={{ color: '#fbbf24' }}>ACB</span> <span style={{ color: '#f87171' }}>{'\u25BC'}22.65 -0.25</span> {'\u2502'}
            <span style={{ color: '#fbbf24' }}>HPG</span> <span style={{ color: '#4ade80' }}>{'\u25B2'}24.10 +0.32</span>
          </span>
          <div style={{ position: 'absolute', inset: 0, right: 0, left: 'auto', width: 40, background: 'linear-gradient(270deg, #060c18, transparent)', zIndex: 1, pointerEvents: 'none' }} />
        </div>

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0, position: 'relative' }}>
          {/* Quick links */}
          <a href="#" title="Danh mục đầu tư" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, background: '#0f1e36', border: '1px solid #1a3050', borderRadius: 14, padding: '4px 9px', color: '#94a3b8', fontSize: 10, fontWeight: 600 }}>{'\u{1F4BC}'} Danh mục</a>
          <a href="#" title="Đặt lệnh" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, background: '#0f1e36', border: '1px solid #1a3050', borderRadius: 14, padding: '4px 9px', color: '#94a3b8', fontSize: 10, fontWeight: 600 }}>{'\u{1F4B0}'} Đặt lệnh</a>
          <a href="#" title="Sổ lệnh" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, background: '#0f1e36', border: '1px solid #1a3050', borderRadius: 14, padding: '4px 9px', color: '#94a3b8', fontSize: 10, fontWeight: 600 }}>{'\u{1F4D6}'} Sổ lệnh</a>

          {/* More tools button */}
          <div
            onClick={() => setShowMoreTools(p => !p)}
            style={{
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
              background: showMoreTools ? '#16457a' : '#0f1e36',
              border: `1px solid ${showMoreTools ? '#2563eb' : '#1a3050'}`,
              borderRadius: 14, padding: '4px 10px 4px 9px',
              color: showMoreTools ? '#dbeafe' : '#94a3b8',
              fontSize: 10, fontWeight: 700, transition: 'all .15s',
            }}
          >
            <span style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, width: 9, height: 9 }}>
              <span style={{ background: 'currentColor', borderRadius: 1 }} /><span style={{ background: 'currentColor', borderRadius: 1 }} />
              <span style={{ background: 'currentColor', borderRadius: 1 }} /><span style={{ background: 'currentColor', borderRadius: 1 }} />
            </span>
            Công cụ
            <span style={{ fontSize: 8, transform: showMoreTools ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .15s' }}>{'\u25BE'}</span>
          </div>

          <div style={{ width: 1, height: 18, background: '#1a3050' }} />

          {/* Dark/light toggle */}
          <div
            onClick={toggleDark}
            title={th.toggleTitle}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, background: '#0f1e36', border: '1px solid #1a3050', borderRadius: 20, padding: '4px 10px', transition: 'all .25s' }}
          >
            <span style={{ fontSize: 12, lineHeight: 1 }}>{th.toggleIcon}</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: '#64748b' }}>{th.toggleLabel}</span>
          </div>

          {/* More tools dropdown */}
          {showMoreTools && (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute', top: 38, right: 0,
                background: '#0b1424', border: '1px solid #1a3050', borderRadius: 14,
                boxShadow: '0 24px 60px rgba(0,0,0,.55)', zIndex: 300,
                width: 660, maxWidth: '88vw', overflow: 'hidden',
                animation: 'fadeUp .15s ease',
              }}
            >
              <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
                {MENU_GROUPS.map((grp) => (
                  <div key={grp.title} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontSize: 9.5, fontWeight: 800, color: grp.color, textTransform: 'uppercase', letterSpacing: 0.5, padding: '0 8px 8px' }}>{grp.title}</span>
                    {grp.items.map((it) => (
                      <a
                        key={it.label}
                        href={it.href}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#131f36' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                        style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, padding: '7px 8px', borderRadius: 8, transition: 'background .12s' }}
                      >
                        <span style={{ width: 28, height: 28, borderRadius: 8, background: it.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>{it.icon}</span>
                        <span style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
                          <span style={{ fontSize: 11.5, fontWeight: 700, color: '#e2e8f0', whiteSpace: 'nowrap' }}>{it.label}</span>
                          <span style={{ fontSize: 9, color: '#5b7290', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.desc}</span>
                        </span>
                      </a>
                    ))}
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid #16233b', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#08101f' }}>
                <span style={{ fontSize: 9.5, color: '#3a5570', fontWeight: 600 }}>{toolCount} công cụ & sẽ tiếp tục mở rộng</span>
                <a href="#" style={{ textDecoration: 'none', fontSize: 10, fontWeight: 700, color: '#60a5fa' }}>{'\u{1F3E0}'} Về Trang chủ</a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nav tabs row */}
      <div style={{
        background: 'linear-gradient(90deg, #060c18 0%, #0b1628 60%, #060c18 100%)',
        display: 'flex', alignItems: 'center', padding: '0 16px', height: 32,
        flexShrink: 0, gap: 2, borderBottom: '1px solid #0f1e36',
      }}>
        {NAV_ITEMS.map((item) => (
          <span
            key={item.label}
            style={{
              fontSize: 10.5, fontWeight: item.weight,
              color: item.active ? '#fff' : '#64748b',
              background: item.active ? '#2563eb' : 'transparent',
              borderRadius: 5, padding: '4px 10px',
              cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'all .15s',
            }}
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  )
}

function formatTime(d: Date): string {
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
}

const TopBar = memo(TopBarInner)
export default TopBar
```

- [ ] **Step 2: Verify no compile errors**

Run: `npx tsc --noEmit`
Expected: No errors

---

## Task 3: Fix IndexStrip Height

**Files:**
- Modify: `src/components/IndexStrip.tsx:14`

**Interfaces:**
- Consumes: `ThemeTokens`, `MarketIndexView[]`

- [ ] **Step 1: Change height from 152 to 158**

In `src/components/IndexStrip.tsx`, find line 14:
```tsx
<div style={{ background: th.navBg, borderBottom: `1px solid ${th.navBorder}`, display: 'flex', flexShrink: 0, height: 152, overflow: 'hidden' }}>
```
Change to:
```tsx
<div style={{ background: th.navBg, borderBottom: `1px solid ${th.navBorder}`, display: 'flex', flexShrink: 0, height: 158, overflow: 'hidden' }}>
```

- [ ] **Step 2: Verify no compile errors**

Run: `npx tsc --noEmit`
Expected: No errors

---

## Task 4: Update FilterBar — Add Movers Button, Filter/History Icons, Advanced Filter Panel, Trade History Panel

**Files:**
- Modify: `src/components/FilterBar.tsx`

**Interfaces:**
- Consumes: `ThemeTokens`, filter state, callbacks
- Produces: `onToggleAdvFilter`, `onToggleTradeHist`, `onExportCSV` callbacks passed up to App

- [ ] **Step 1: Extend FilterBar props**

Add new props to the `Props` type:

```typescript
type Props = {
  th: ThemeTokens
  filter: { group: VietcapFilterGroup; value: string; searchText: string }
  onFilterChange: (group: VietcapFilterGroup, value?: string) => void
  onSymbolAdd: (symbol: string) => void
  viewMode?: 'table' | 'grid' | 'heat' | 'movers'
  onViewModeChange?: (mode: 'table' | 'grid' | 'heat' | 'movers') => void
  showSector?: boolean
  onToggleSector?: () => void
  activeSector?: string
  onSectorChange?: (sector: string) => void
  showAdvFilter?: boolean
  onToggleAdvFilter?: () => void
  showTradeHist?: boolean
  onToggleTradeHist?: () => void
  onExportCSV?: () => void
  // Advanced filter values
  filterPctFrom?: string
  filterPctTo?: string
  filterVolMin?: string
  filterPriceMin?: string
  filterPriceMax?: string
  onSetPctFrom?: (v: string) => void
  onSetPctTo?: (v: string) => void
  onSetVolMin?: (v: string) => void
  onSetPriceMin?: (v: string) => void
  onSetPriceMax?: (v: string) => void
  onResetFilters?: () => void
  // Trade history
  tradeHistory?: TradeHistoryItem[]
}
```

- [ ] **Step 2: Add movers view button**

In the view mode buttons section, add a 4th button for movers:

```tsx
<button onClick={() => onViewModeChange?.('movers')} style={{ background: viewMode === 'movers' ? '#2563eb' : th.iconBg, border: `1px solid ${th.navBorder}`, width: 26, height: 26, borderRadius: 5, cursor: 'pointer', color: viewMode === 'movers' ? '#fff' : th.textMuted, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{'\u{1F4CA}'}</button>
```

- [ ] **Step 3: Add filter/history toggle icons and export CSV button**

Replace the right-side action buttons:

```tsx
<div style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
  <button onClick={onToggleAdvFilter} style={{ background: showAdvFilter ? '#f97316' : th.iconBg, border: `1px solid ${showAdvFilter ? '#ea580c' : th.navBorder}`, color: showAdvFilter ? '#fff' : th.textMuted, borderRadius: 5, width: 26, height: 26, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{'\u{1F50D}'}</button>
  <button onClick={onToggleTradeHist} style={{ background: showTradeHist ? '#f97316' : th.iconBg, border: `1px solid ${showTradeHist ? '#ea580c' : th.navBorder}`, color: showTradeHist ? '#fff' : th.textMuted, borderRadius: 5, width: 26, height: 26, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{'\u{1F4CB}'}</button>
  <button onClick={onExportCSV} style={{ background: th.iconBg, border: `1px solid ${th.navBorder}`, color: th.textMuted, borderRadius: 5, width: 26, height: 26, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{'\u2B07'}</button>
</div>
```

- [ ] **Step 4: Add Advanced Filter Panel**

After the main filter bar div, add the advanced filter panel (conditionally rendered):

```tsx
{showAdvFilter && (
  <div style={{ background: th.navBg, borderBottom: `1px solid ${th.navBorder}`, padding: '10px 14px', display: 'flex', gap: 12, alignItems: 'flex-end', flexShrink: 0, animation: 'fadeUp .15s ease', flexWrap: 'wrap' }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 9, fontWeight: 700, color: th.textMuted, textTransform: 'uppercase' }}>% Thay đổi</label>
      <div style={{ display: 'flex', gap: 4 }}>
        <input type="number" placeholder="Từ" value={filterPctFrom || ''} onChange={(e) => onSetPctFrom?.(e.target.value)} style={{ width: 60, padding: '4px 6px', border: `1px solid ${th.cellBorder}`, borderRadius: 4, background: th.appBg, color: th.text, fontSize: 10 }} />
        <span style={{ color: th.textMuted, padding: '4px 0' }}>{'\u2192'}</span>
        <input type="number" placeholder="Đến" value={filterPctTo || ''} onChange={(e) => onSetPctTo?.(e.target.value)} style={{ width: 60, padding: '4px 6px', border: `1px solid ${th.cellBorder}`, borderRadius: 4, background: th.appBg, color: th.text, fontSize: 10 }} />
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 9, fontWeight: 700, color: th.textMuted, textTransform: 'uppercase' }}>KLGD (triệu)</label>
      <input type="number" placeholder="Tối thiểu" value={filterVolMin || ''} onChange={(e) => onSetVolMin?.(e.target.value)} style={{ width: 100, padding: '4px 6px', border: `1px solid ${th.cellBorder}`, borderRadius: 4, background: th.appBg, color: th.text, fontSize: 10 }} />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 9, fontWeight: 700, color: th.textMuted, textTransform: 'uppercase' }}>Giá (từ-đến)</label>
      <div style={{ display: 'flex', gap: 4 }}>
        <input type="number" placeholder="Min" value={filterPriceMin || ''} onChange={(e) => onSetPriceMin?.(e.target.value)} style={{ width: 60, padding: '4px 6px', border: `1px solid ${th.cellBorder}`, borderRadius: 4, background: th.appBg, color: th.text, fontSize: 10 }} />
        <input type="number" placeholder="Max" value={filterPriceMax || ''} onChange={(e) => onSetPriceMax?.(e.target.value)} style={{ width: 60, padding: '4px 6px', border: `1px solid ${th.cellBorder}`, borderRadius: 4, background: th.appBg, color: th.text, fontSize: 10 }} />
      </div>
    </div>
    <button onClick={onResetFilters} style={{ background: th.iconBg, border: `1px solid ${th.cellBorder}`, color: th.textMuted, borderRadius: 4, padding: '4px 10px', fontSize: 10, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>Reset</button>
  </div>
)}
```

- [ ] **Step 5: Add Trade History Panel**

After the advanced filter panel, add the trade history panel:

```tsx
{showTradeHist && (
  <div style={{ background: th.navBg, borderBottom: `1px solid ${th.navBorder}`, padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0, animation: 'fadeUp .15s ease', maxHeight: 200, overflowY: 'auto' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: '#60a5fa', letterSpacing: 0.5 }}>LỊCH SỬ GIAO DỊCH KHỚP LỆNH</span>
      <span style={{ fontSize: 9, color: th.textMuted }}>Realtime</span>
    </div>
    {(tradeHistory || []).map((th, i) => (
      <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 50px 60px 60px 70px', gap: 8, padding: 6, background: th.appBg, borderRadius: 4, border: `1px solid ${th.cellBorder}`, fontSize: 9, fontFamily: "'JetBrains Mono', monospace" }}>
        <div style={{ fontWeight: 700, color: '#60a5fa' }}>{th.sym}</div>
        <div style={{ color: th.timeColor, textAlign: 'right' }}>{th.time}</div>
        <div style={{ color: th.priceColor, textAlign: 'right', fontWeight: 700 }}>{th.price}</div>
        <div style={{ color: th.volColor, textAlign: 'right' }}>{th.qty}</div>
        <div style={{ color: th.sideColor, textAlign: 'center', fontWeight: 700 }}>{th.side}</div>
      </div>
    ))}
  </div>
)}
```

- [ ] **Step 6: Verify no compile errors**

Run: `npx tsc --noEmit`
Expected: No errors

---

## Task 5: Create TopMoversView Component

**Files:**
- Create: `src/components/TopMoversView.tsx`

**Interfaces:**
- Consumes: `StockRow[]`, `ThemeTokens`
- Produces: nothing (display only)

- [ ] **Step 1: Create TopMoversView component**

```tsx
import { useMemo, memo } from 'react'
import type { ThemeTokens, StockRow } from '../types/priceboard'

type Props = { rows: StockRow[]; th: ThemeTokens }

function TopMoversViewInner({ rows, th }: Props) {
  const { topGainers, topLosers, topVolume, breadthData } = useMemo(() => {
    const sorted = [...rows]
    const gainers = sorted
      .sort((a, b) => parseFloat(b.pct) - parseFloat(a.pct))
      .slice(0, 5)
      .map(s => ({
        sym: s.sym, pct: s.pct.replace('+', '').replace('%', ''),
        lp: s.lp, vol: s.tvol, onChart: s.onChart,
      }))
    const losers = sorted
      .sort((a, b) => parseFloat(a.pct) - parseFloat(b.pct))
      .slice(0, 5)
      .map(s => ({
        sym: s.sym, pct: s.pct.replace('%', ''),
        lp: s.lp, vol: s.tvol, onChart: s.onChart,
      }))
    const volume = sorted
      .sort((a, b) => {
        const av = parseInt(a.tvol.replace(/,/g, '')) || 0
        const bv = parseInt(b.tvol.replace(/,/g, '')) || 0
        return bv - av
      })
      .slice(0, 5)
      .map(s => ({
        sym: s.sym, vol: s.tvol, lp: s.lp, pct: s.pct, pc: s.pc,
        onChart: s.onChart,
      }))

    const upCount = rows.filter(s => parseFloat(s.pct) > 0).length
    const dnCount = rows.filter(s => parseFloat(s.pct) < 0).length
    const ncCount = rows.length - upCount - dnCount
    const total = rows.length || 1
    const breadth = [
      { label: 'Tăng', upCnt: upCount, total, upPct: (upCount / total) * 100, upColor: '#22c55e' },
      { label: 'Giảm', upCnt: dnCount, total, upPct: (dnCount / total) * 100, upColor: '#f43f5e' },
      { label: 'Đứng', upCnt: ncCount, total, upPct: (ncCount / total) * 100, upColor: '#fbbf24' },
    ]

    return { topGainers: gainers, topLosers: losers, topVolume: volume, breadthData: breadth }
  }, [rows])

  const cardStyle = (sym: string): React.CSSProperties => ({
    background: th.appBg, border: `1px solid ${th.cellBorder}`, borderRadius: 6,
    padding: 8, cursor: 'pointer', transition: 'all .2s',
  })

  return (
    <div style={{ flex: 1, overflow: 'auto', background: th.appBg, padding: 14, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
      {/* Top gainers */}
      <div style={{ background: th.navBg, border: `1px solid ${th.cellBorder}`, borderRadius: 8, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#22c55e', letterSpacing: 0.5, textTransform: 'uppercase' }}>{'\u25B2'} Top Tăng Mạnh</div>
        {topGainers.map((tg) => (
          <div
            key={tg.sym}
            onClick={tg.onChart}
            onMouseEnter={(e) => { e.currentTarget.style.background = th.rowHover; e.currentTarget.style.borderColor = '#2563eb' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = th.appBg; e.currentTarget.style.borderColor = th.cellBorder }}
            style={cardStyle(tg.sym)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontWeight: 700, color: '#60a5fa' }}>{tg.sym}</span>
              <span style={{ fontSize: 10, color: '#22c55e', fontWeight: 700 }}>+{tg.pct}%</span>
            </div>
            <div style={{ fontSize: 12, color: th.text, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{tg.lp}</div>
            <div style={{ fontSize: 9, color: th.textMuted, marginTop: 3 }}>KL: {tg.vol}</div>
          </div>
        ))}
      </div>

      {/* Top losers */}
      <div style={{ background: th.navBg, border: `1px solid ${th.cellBorder}`, borderRadius: 8, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#f43f5e', letterSpacing: 0.5, textTransform: 'uppercase' }}>{'\u25BC'} Top Giảm Mạnh</div>
        {topLosers.map((tl) => (
          <div
            key={tl.sym}
            onClick={tl.onChart}
            onMouseEnter={(e) => { e.currentTarget.style.background = th.rowHover; e.currentTarget.style.borderColor = '#2563eb' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = th.appBg; e.currentTarget.style.borderColor = th.cellBorder }}
            style={cardStyle(tl.sym)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontWeight: 700, color: '#60a5fa' }}>{tl.sym}</span>
              <span style={{ fontSize: 10, color: '#f43f5e', fontWeight: 700 }}>{tl.pct}%</span>
            </div>
            <div style={{ fontSize: 12, color: th.text, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{tl.lp}</div>
            <div style={{ fontSize: 9, color: th.textMuted, marginTop: 3 }}>KL: {tl.vol}</div>
          </div>
        ))}
      </div>

      {/* Top volume */}
      <div style={{ background: th.navBg, border: `1px solid ${th.cellBorder}`, borderRadius: 8, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#3b82f6', letterSpacing: 0.5, textTransform: 'uppercase' }}>{'\u{1F4C8}'} KLGD Cao Nhất</div>
        {topVolume.map((tv) => (
          <div
            key={tv.sym}
            onClick={tv.onChart}
            onMouseEnter={(e) => { e.currentTarget.style.background = th.rowHover; e.currentTarget.style.borderColor = '#2563eb' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = th.appBg; e.currentTarget.style.borderColor = th.cellBorder }}
            style={cardStyle(tv.sym)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontWeight: 700, color: '#60a5fa' }}>{tv.sym}</span>
              <span style={{ fontSize: 10, color: tv.pc, fontWeight: 700 }}>{tv.pct}</span>
            </div>
            <div style={{ fontSize: 11, color: th.text, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{tv.vol}</div>
            <div style={{ fontSize: 9, color: th.textMuted, marginTop: 3 }}>{tv.lp}</div>
          </div>
        ))}
      </div>

      {/* Breadth indicators — full width below */}
      <div style={{ gridColumn: '1 / -1', background: th.navBg, borderTop: `1px solid ${th.navBorder}`, padding: '10px 14px', display: 'flex', gap: 20, alignItems: 'center', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 16 }}>
          {breadthData.map((bd) => (
            <div key={bd.label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: th.textMuted, letterSpacing: 0.3, textTransform: 'uppercase' }}>{bd.label}</span>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <div style={{ width: 80, height: 8, background: th.appBg, borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${bd.upPct}%`, height: '100%', background: bd.upColor }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: bd.upColor, fontFamily: "'JetBrains Mono', monospace", minWidth: 50 }}>{bd.upCnt}/{bd.total}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const TopMoversView = memo(TopMoversViewInner)
export default TopMoversView
```

- [ ] **Step 2: Verify no compile errors**

Run: `npx tsc --noEmit`
Expected: No errors

---

## Task 6: Update StockTable — Add Watchlist Heart Column

**Files:**
- Modify: `src/components/StockTable.tsx`
- Modify: `src/types/priceboard.ts` (add `watchlisted` to `StockRow`)

**Interfaces:**
- Consumes: `StockRow[]` with new `watchlisted` field
- Produces: nothing (display only)

- [ ] **Step 1: Add `watchlisted` to StockRow type**

In `src/types/priceboard.ts`, add after `onChart` in the `StockRow` type:

```typescript
  watchlisted?: boolean
  onToggleWatchlist?: () => void
```

- [ ] **Step 2: Add heart column header**

In `StockTable.tsx`, add a new `<th>` at the end of the header row (after KLGD TT):

```tsx
<th style={{ padding: '5px 8px', textAlign: 'center', minWidth: 36, color: '#60a5fa' }} rowSpan={2}>{'\u2661'}</th>
```

- [ ] **Step 3: Add heart column cell**

In the `<td>` rendering for each row, add at the end:

```tsx
<td
  onClick={(e) => { e.stopPropagation(); s.onToggleWatchlist?.() }}
  style={{ padding: '3px 8px', textAlign: 'center', cursor: 'pointer', fontSize: 13 }}
>
  {s.watchlisted ? '\u2665' : '\u2661'}
</td>
```

- [ ] **Step 4: Update colSpan for spacer rows**

Change the spacer `<td colSpan={29}` to `colSpan={30}` in both top and bottom spacers.

- [ ] **Step 5: Verify no compile errors**

Run: `npx tsc --noEmit`
Expected: No errors

---

## Task 7: Update GridView — Add Price Background Colors

**Files:**
- Modify: `src/components/GridView.tsx`

**Interfaces:**
- Consumes: `StockRow[]`

- [ ] **Step 1: Add price background and percentage background to grid cards**

In the card rendering, add `background` based on percentage. Find the price `<div>` and wrap it with a background:

Replace the price section in the grid card:

```tsx
<div style={{ fontSize: 17, fontWeight: 700, color: s.lc, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.1, background: s.pct.startsWith('+') ? (parseFloat(s.pct) > 3 ? 'rgba(34,197,94,.3)' : 'rgba(34,197,94,.15)') : s.pct.startsWith('-') ? (parseFloat(s.pct) < -3 ? 'rgba(244,63,94,.3)' : 'rgba(244,63,94,.15)') : 'transparent', padding: '2px 4px', borderRadius: 4 }}>
  {s.lp}
</div>
```

And update the percentage badge:

```tsx
<span style={{
  fontSize: 10, fontWeight: 700, color: s.pc,
  background: s.pct.startsWith('+') ? 'rgba(34,197,94,.25)' : s.pct.startsWith('-') ? 'rgba(244,63,94,.25)' : 'rgba(251,191,36,.15)',
  padding: '1px 5px', borderRadius: 4,
}}>
  {s.pct}
</span>
```

- [ ] **Step 2: Verify no compile errors**

Run: `npx tsc --noEmit`
Expected: No errors

---

## Task 8: Update HeatmapView — Add Price, %, Volume to Cells; Sector Total

**Files:**
- Modify: `src/components/HeatmapView.tsx`

**Interfaces:**
- Consumes: `StockRow[]`

- [ ] **Step 1: Add price and volume to heatmap cells**

Update the cell rendering to include price, percentage, and volume:

```tsx
{items.map((c) => (
  <div
    key={c.sym}
    onClick={c.onChart}
    onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.25)' }}
    onMouseLeave={(e) => { e.currentTarget.style.filter = 'none' }}
    style={{
      background: c.bg, borderRadius: 5,
      padding: '7px 8px', cursor: 'pointer',
      minWidth: c.minW || 80,
      position: 'relative', overflow: 'hidden',
      transition: 'filter .2s',
    }}
  >
    <div style={{ fontSize: 11, fontWeight: 800, color: '#fff', fontFamily: "'Inter', sans-serif", letterSpacing: 0.3, lineHeight: 1.2 }}>{c.sym}</div>
    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.3 }}>{c.lp}</div>
    <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.85)' }}>{c.pct}</div>
    <div style={{ fontSize: 8.5, color: 'rgba(255,255,255,.5)', marginTop: 1 }}>{c.vol}</div>
  </div>
))}
```

- [ ] **Step 2: Add sector total percentage**

Update the sector header to include total percentage:

```tsx
<div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
  <span style={{ fontSize: 10, fontWeight: 700, color: '#60a5fa', letterSpacing: 0.8, textTransform: 'uppercase', fontFamily: "'Inter', sans-serif" }}>{sec}</span>
  <div style={{ flex: 1, height: 1, background: th.cellBorderL }} />
  <span style={{ fontSize: 9, color: secTotalColor, fontWeight: 600 }}>{secTotalPct}</span>
</div>
```

- [ ] **Step 3: Compute sector totals in useMemo**

Add sector total calculation to the useMemo:

```tsx
const sectors = useMemo(() => {
  const map = new Map<string, { cells: HeatCell[], totalPct: number }>()
  for (const s of rows) {
    const sec = s.ng || 'Khác'
    const pctVal = parsePct(s.pct)
    const cell: HeatCell = { sym: s.sym, pct: s.pct, lp: s.lp, vol: s.tvol, bg: heatColor(pctVal), minW: 80, onChart: s.onChart }
    if (!map.has(sec)) map.set(sec, { cells: [], totalPct: 0 })
    const entry = map.get(sec)!
    entry.cells.push(cell)
    entry.totalPct += pctVal
  }
  return Array.from(map.entries()).map(([sec, { cells, totalPct }]) => ({
    sec,
    cells: cells.sort((a, b) => {
      const av = parseInt((a.vol || '0').replace(/,/g, '')) || 0
      const bv = parseInt((b.vol || '0').replace(/,/g, '')) || 0
      return bv - av
    }),
    totalPct,
    totalColor: totalPct >= 0 ? '#22c55e' : '#f43f5e',
    totalPctStr: (totalPct >= 0 ? '+' : '') + totalPct.toFixed(1) + '%',
  }))
}, [rows])
```

- [ ] **Step 4: Update HeatCell type**

Add `lp`, `vol`, `minW` to the HeatCell type:

```tsx
type HeatCell = { sym: string; pct: string; lp: string; vol: string; bg: string; minW: number; onChart: () => void }
```

- [ ] **Step 5: Verify no compile errors**

Run: `npx tsc --noEmit`
Expected: No errors

---

## Task 9: Update IntradayChartModal — Add Action Buttons

**Files:**
- Modify: `src/components/IntradayChartModal.tsx`

**Interfaces:**
- Consumes: `ChartView`

- [ ] **Step 1: Add action buttons at the bottom of the modal**

After the stats grid, add action buttons:

```tsx
<div style={{ display: 'flex', gap: 8, padding: '12px 18px', background: '#060c18', borderTop: '1px solid #1a3050' }}>
  <a href="#" style={{ flex: 1, textDecoration: 'none', textAlign: 'center', background: '#0f1e36', border: '1px solid #1a3050', color: '#cbd5e1', borderRadius: 6, padding: 9, fontSize: 11, fontWeight: 700 }}>{'\u{1F4C4}'} Thông tin CP</a>
  <a href="#" style={{ flex: 1, textDecoration: 'none', textAlign: 'center', background: '#0f1e36', border: '1px solid #1a3050', color: '#cbd5e1', borderRadius: 6, padding: 9, fontSize: 11, fontWeight: 700 }}>{'\u{1F4D6}'} Sổ lệnh</a>
  <a href="#" style={{ flex: 1.3, textDecoration: 'none', textAlign: 'center', background: '#22c55e', border: '1px solid #16a34a', color: '#fff', borderRadius: 6, padding: 9, fontSize: 11, fontWeight: 800 }}>{'\u2713'} Đặt lệnh {chart.sym}</a>
</div>
```

- [ ] **Step 2: Verify no compile errors**

Run: `npx tsc --noEmit`
Expected: No errors

---

## Task 10: Update App.tsx — Wire Everything Together

**Files:**
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: All components, types, and hooks
- Produces: Full application state management

- [ ] **Step 1: Add new state variables**

Add these state variables to the `App` function:

```typescript
const [viewMode, setViewMode] = useState<'table' | 'grid' | 'heat' | 'movers'>('table')
const [showAdvFilter, setShowAdvFilter] = useState(false)
const [showTradeHist, setShowTradeHist] = useState(false)
const [filterPctFrom, setFilterPctFrom] = useState('')
const [filterPctTo, setFilterPctTo] = useState('')
const [filterVolMin, setFilterVolMin] = useState('')
const [filterPriceMin, setFilterPriceMin] = useState('')
const [filterPriceMax, setFilterPriceMax] = useState('')
```

- [ ] **Step 2: Add advanced filter logic**

Add filtering logic after the `allStocks` memo:

```typescript
const filteredStocks = useMemo(() => {
  let result = allStocks
  if (filterPctFrom) result = result.filter(s => parseFloat(s.pct) >= parseFloat(filterPctFrom))
  if (filterPctTo) result = result.filter(s => parseFloat(s.pct) <= parseFloat(filterPctTo))
  if (filterVolMin) result = result.filter(s => {
    const vol = parseInt(s.tvol.replace(/,/g, '')) || 0
    return vol >= parseFloat(filterVolMin) * 1000000
  })
  if (filterPriceMin) result = result.filter(s => parseFloat(s.lp) >= parseFloat(filterPriceMin))
  if (filterPriceMax) result = result.filter(s => parseFloat(s.lp) <= parseFloat(filterPriceMax))
  return result
}, [allStocks, filterPctFrom, filterPctTo, filterVolMin, filterPriceMin, filterPriceMax])
```

- [ ] **Step 3: Add trade history mock data**

```typescript
const tradeHistory = useMemo(() => [
  { sym: 'ACB', time: '15:29', price: '22.65', qty: '5,200', side: 'SELL', sideColor: '#f43f5e', priceColor: '#f43f5e', timeColor: '#94a3b8', volColor: '#3a5570' },
  { sym: 'VCB', time: '15:28', price: '81.50', qty: '1,800', side: 'BUY', sideColor: '#22c55e', priceColor: '#22c55e', timeColor: '#94a3b8', volColor: '#3a5570' },
  { sym: 'FPT', time: '15:27', price: '137.50', qty: '3,400', side: 'BUY', sideColor: '#22c55e', priceColor: '#22c55e', timeColor: '#94a3b8', volColor: '#3a5570' },
  { sym: 'HPG', time: '15:26', price: '24.10', qty: '8,900', side: 'SELL', sideColor: '#f43f5e', priceColor: '#f43f5e', timeColor: '#94a3b8', volColor: '#3a5570' },
  { sym: 'BID', time: '15:25', price: '45.80', qty: '2,100', side: 'BUY', sideColor: '#22c55e', priceColor: '#22c55e', timeColor: '#94a3b8', volColor: '#3a5570' },
], [])
```

- [ ] **Step 4: Add CSV export function**

```typescript
const exportCSV = useCallback(() => {
  const headers = ['Mã CK', 'Giá', '% Thay đổi', 'KLGD', 'Cao', 'Thấp', 'NN Mua', 'NN Bán']
  const rows = filteredStocks.map(s => [
    s.sym, s.lp, s.pct, s.tvol, s.hi, s.lo, s.fbuy, s.fsell,
  ])
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `bang-dien-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
}, [filteredStocks])
```

- [ ] **Step 5: Add reset filters function**

```typescript
const resetFilters = useCallback(() => {
  setFilterPctFrom('')
  setFilterPctTo('')
  setFilterVolMin('')
  setFilterPriceMin('')
  setFilterPriceMax('')
}, [])
```

- [ ] **Step 6: Add watchlist toggle**

```typescript
const toggleWatchlist = useCallback((sym: string) => {
  setFilter(prev => ({
    ...prev,
    watchlist: prev.watchlist.includes(sym)
      ? prev.watchlist.filter(s => s !== sym)
      : [...prev.watchlist, sym],
  }))
}, [])
```

- [ ] **Step 7: Update allStocks mapping to include watchlisted**

In the `mapStockRows` call or `allStocks` memo, add `watchlisted` and `onToggleWatchlist`:

```typescript
// After mapping rows, add watchlist info
const allStocksWithWatchlist = useMemo(() => {
  return filteredStocks.map(s => ({
    ...s,
    watchlisted: filter.watchlist.includes(s.sym),
    onToggleWatchlist: () => toggleWatchlist(s.sym),
  }))
}, [filteredStocks, filter.watchlist, toggleWatchlist])
```

- [ ] **Step 8: Update FilterBar props**

Pass all new props to FilterBar:

```tsx
<FilterBar
  th={th}
  filter={filter}
  onFilterChange={handleFilterChange}
  onSymbolAdd={handleSymbolAdd}
  viewMode={viewMode}
  onViewModeChange={setViewMode}
  showSector={showSector}
  onToggleSector={() => setShowSector(p => !p)}
  activeSector={activeSector}
  onSectorChange={setActiveSector}
  showAdvFilter={showAdvFilter}
  onToggleAdvFilter={() => setShowAdvFilter(p => !p)}
  showTradeHist={showTradeHist}
  onToggleTradeHist={() => setShowTradeHist(p => !p)}
  onExportCSV={exportCSV}
  filterPctFrom={filterPctFrom}
  filterPctTo={filterPctTo}
  filterVolMin={filterVolMin}
  filterPriceMin={filterPriceMin}
  filterPriceMax={filterPriceMax}
  onSetPctFrom={setFilterPctFrom}
  onSetPctTo={setFilterPctTo}
  onSetVolMin={setFilterVolMin}
  onSetPriceMin={setFilterPriceMin}
  onSetPriceMax={setFilterPriceMax}
  onResetFilters={resetFilters}
  tradeHistory={tradeHistory}
/>
```

- [ ] **Step 9: Add movers view rendering**

Update the view rendering section:

```tsx
{viewMode === 'table' && <StockTable rows={allStocksWithWatchlist} th={th} />}
{viewMode === 'grid' && <GridView rows={allStocksWithWatchlist} th={th} />}
{viewMode === 'heat' && <HeatmapView rows={allStocksWithWatchlist} th={th} />}
{viewMode === 'movers' && <TopMoversView rows={allStocksWithWatchlist} th={th} />}
```

- [ ] **Step 10: Import TopMoversView**

Add at the top of App.tsx:

```typescript
import TopMoversView from './components/TopMoversView'
```

- [ ] **Step 11: Verify full build**

Run: `npx tsc --noEmit && npm run build`
Expected: No errors, build succeeds

---

## Task 11: Final Verification

**Files:**
- All modified files

- [ ] **Step 1: Run full type check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Visual comparison**

Start dev server: `npm run dev`
Compare each section of the rendered app with the HTML design:
- TopBar: nav tabs, quick links, more tools dropdown
- IndexStrip: indices + global markets panel
- FilterBar: view buttons (4), search, tabs, filter/history icons
- StockTable: all columns including heart
- GridView: price backgrounds
- HeatmapView: price/volume in cells
- TopMoversView: 3-column layout with breadth
- IntradayChartModal: action buttons
- FooterBar: unchanged

---

## Execution Notes

- **Task 1-3** are independent and can be done in parallel
- **Task 4** depends on Task 1 (TradeHistoryItem type)
- **Task 5** depends on Task 1 (TopMoverItem type)
- **Task 6** depends on Task 1 (StockRow extension)
- **Task 7-9** are independent
- **Task 10** depends on Tasks 1-9 (wires everything together)
- **Task 11** depends on Task 10

Estimated effort: ~2-3 hours for a skilled developer.
