# UI Style Update — Match HTML Source

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update React app UI, styles, and features to match `Bang Dien.dc (1).html` — new view modes (Table/Grid/Heatmap), global markets panel, TradingView modal, ticker tape, updated theme tokens, JetBrains Mono font, animations, NN columns, and footer.

**Architecture:** Extend existing component structure. New components: `GridView`, `HeatmapView`, `TradingViewModal`, `GlobalMarketsPanel`. Update existing: `TopBar`, `IndexStrip`, `FilterBar`, `StockTable`, `FooterBar`, `App.tsx`, theme tokens, CSS animations.

**Tech Stack:** React 19, TypeScript, Vite, inline styles (existing pattern)

## Global Constraints

- Dark mode only (light mode tokens kept but not primary)
- Inline styles only — no CSS modules, no Tailwind
- Existing component pattern: functional components + props
- `verbatimModuleSyntax: true` + `resolveJsonModule: true`
- Prices in VND ÷ 100 (7820 → 78.20)
- All data from `src/data/generated/` files
- Build must pass: `npm run build` + `npm run lint`

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `src/types/priceboard.ts` | Modify | Add `textMuted`, `rowHover`, `toggleLabel` to ThemeTokens; add viewMode type |
| `src/App.css` | Modify | Add animations (ticker, fadeUp, flashUp/flashDn, pricePop, pulse), scrollbar styles |
| `src/App.tsx` | Modify | Wire view modes, global markets, TradingView modal, ticker tape |
| `src/components/TopBar.tsx` | Modify | Market status, clock, ticker tape, logo update, toggle label |
| `src/components/IndexStrip.tsx` | Modify | Global markets panel, LIVE badge, intraday chart, click→TradingView |
| `src/components/FilterBar.tsx` | Modify | View mode toggle buttons (Table/Grid/Heatmap) |
| `src/components/StockTable.tsx` | Modify | NN columns (Mua/Bán/↕/Room), row hover, darker colors |
| `src/components/FooterBar.tsx` | Modify | Update footer text |
| `src/components/GridView.tsx` | **Create** | Card view with sparklines |
| `src/components/HeatmapView.tsx` | **Create** | Sector heatmap with color-coded cells |
| `src/components/TradingViewModal.tsx` | **Create** | TradingView embed modal for indices |
| `src/components/GlobalMarketsPanel.tsx` | **Create** | US/EU/ASIA/COMM tabs with market data |

---

### Task 1: Theme Tokens + CSS Animations

**Files:**
- Modify: `src/types/priceboard.ts:14-55`
- Modify: `src/App.css`

**Interfaces:**
- Produces: Updated `ThemeTokens` type with `textMuted`, `rowHover`, `toggleLabel`, `toggleBg`, `togglePos`; CSS animations for ticker, fadeUp, flash, pricePop, pulse

- [ ] **Step 1: Update ThemeTokens type**

Add to `src/types/priceboard.ts` ThemeTokens:
```typescript
export type ThemeTokens = {
  appBg: string
  navBg: string
  navBorder: string
  navItemColor: string
  idxColBorder: string
  idxTitle: string
  glItemBorder: string
  glNameColor: string
  filterBorder: string
  searchText: string
  tabFg: string
  tabBorder: string
  tableBg: string
  rowOdd: string
  rowEven: string
  rowBorder: string
  rowHover: string
  cellBorder: string
  cellBorderL: string
  symColor: string
  volColor: string
  iconBg: string
  iconColor: string
  text: string
  textMuted: string
  toggleBg: string
  togglePos: string
  toggleLabel: string
  toggleIcon: string
  toggleTitle: string
}
```

- [ ] **Step 2: Update getTheme() in App.tsx**

Update `src/App.tsx` `getTheme()` to match HTML source values:
```typescript
function getTheme(dark: boolean): ThemeTokens {
  return {
    appBg:       dark ? '#060c18' : '#f0f4f8',
    navBg:       dark ? '#0b1628' : '#ffffff',
    navBorder:   dark ? '#1a3050' : '#e1e8f0',
    navItemColor:dark ? '#8098b4' : '#374151',
    idxColBorder:dark ? '#1a3050' : '#e4ecf5',
    idxTitle:    dark ? '#d4e0ee' : '#1e293b',
    glItemBorder:dark ? '#132035' : '#f0f5fb',
    glNameColor: dark ? '#b0c4d8' : '#334155',
    filterBorder:dark ? '#1a3050' : '#e1e8f0',
    searchText:  dark ? '#3a5570' : '#94a3b8',
    tabFg:       dark ? '#8098b4' : '#374151',
    tabBorder:   dark ? '1px solid #1a3050' : '1px solid #e1e8f0',
    tableBg:     dark ? '#060c18' : '#f4f7fb',
    rowOdd:      dark ? '#0b1628' : '#ffffff',
    rowEven:     dark ? '#08101e' : '#f8fafd',
    rowBorder:   dark ? '#0d1a2e' : '#eaf0f8',
    rowHover:    dark ? '#102040' : '#eef4ff',
    cellBorder:  dark ? '#1a3050' : '#dce8f5',
    cellBorderL: dark ? '#0d1a2e' : '#eaf0f8',
    symColor:    dark ? '#60a5fa' : '#1d4ed8',
    volColor:    dark ? '#4a7090' : '#64748b',
    iconBg:      dark ? '#0f1e36' : '#f0f5fb',
    iconColor:   dark ? '#4a6080' : '#64748b',
    text:        dark ? '#d4e0ee' : '#1e293b',
    textMuted:   dark ? '#3a5570' : '#94a3b8',
    toggleBg:    dark ? '#2563eb' : '#475569',
    togglePos:   dark ? '22px' : '2px',
    toggleLabel: dark ? 'LIGHT' : 'DARK',
    toggleIcon:  dark ? '\u2600' : '\uD83C\uDF19',
    toggleTitle: dark ? 'Chuyển Light mode' : 'Chuyển Dark mode',
  }
}
```

- [ ] **Step 3: Add CSS animations to App.css**

Append to `src/App.css`:
```css
/* Animations */
@keyframes ticker {
  from { transform: translateX(100vw); }
  to { transform: translateX(-200%); }
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes flashUp {
  0% { background: #14532d; }
  60% { background: #14532d; }
  100% { background: inherit; }
}
@keyframes flashDn {
  0% { background: #450a0a; }
  60% { background: #450a0a; }
  100% { background: inherit; }
}
@keyframes pricePop {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.06); }
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* Scrollbar */
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #2563eb; }

/* Font imports */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
```

- [ ] **Step 4: Build + Lint**

Run: `npm run build && npm run lint`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/types/priceboard.ts src/App.tsx src/App.css
git commit -m "feat: update theme tokens, add CSS animations and fonts"
```

---

### Task 2: TopBar — Market Status, Ticker Tape, Logo, Toggle Label

**Files:**
- Modify: `src/components/TopBar.tsx`

**Interfaces:**
- Consumes: `ThemeTokens`, `timeStr`, `toggleDark` callback
- Produces: Updated TopBar with market status badge, scrolling ticker tape, "Ray Stock Market" logo, LIGHT/DARK toggle label

- [ ] **Step 1: Rewrite TopBar.tsx**

Replace `src/components/TopBar.tsx` with:
```tsx
import type { ThemeTokens } from '../types/priceboard'

type Props = { th: ThemeTokens; timeStr: string; toggleDark: () => void }

export default function TopBar({ th, timeStr, toggleDark }: Props) {
  return (
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
        <span style={{
          fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: 0.4,
          fontFamily: "'Inter', sans-serif",
        }}>
          Ray <span style={{ color: '#22c55e' }}>Stock Market</span>
        </span>
      </div>

      {/* Market status */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 5,
        background: '#0f1e36', borderRadius: 20, padding: '3px 10px', flexShrink: 0,
      }}>
        <div style={{
          width: 6, height: 6, borderRadius: '50%', background: '#22c55e',
          animation: 'pulse 2s infinite',
        }} />
        <span style={{
          fontSize: 10, fontWeight: 600, color: '#22c55e', letterSpacing: 0.3,
        }}>
          ĐANG GIAO DỊCH
        </span>
      </div>

      {/* Clock */}
      <span style={{
        color: '#4a6080', fontSize: 11, flexShrink: 0,
        fontFamily: "'JetBrains Mono', monospace", fontWeight: 500, letterSpacing: 0.5,
      }}>
        {timeStr}
      </span>

      {/* Ticker tape */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', height: '100%', display: 'flex', alignItems: 'center', minWidth: 0 }}>
        <div style={{ position: 'absolute', inset: 0, left: 0, width: 40, background: 'linear-gradient(90deg, #060c18, transparent)', zIndex: 1, pointerEvents: 'none' }} />
        <span style={{
          position: 'absolute', whiteSpace: 'nowrap',
          animation: 'ticker 34s linear infinite',
          color: '#94a3b8', fontSize: 10.5, fontWeight: 500,
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          <span style={{ color: '#fbbf24' }}>VN-Index</span> <span style={{ color: '#4ade80' }}>{'\u25B2'}1,860.01 +5.04</span> {'\u2502'}
          <span style={{ color: '#fbbf24' }}>VN30</span> <span style={{ color: '#4ade80' }}>{'\u25B2'}1,995.71 +5.06</span> {'\u2502'}
          <span style={{ color: '#fbbf24' }}>ACB</span> <span style={{ color: '#f87171' }}>{'\u25BC'}22.65 -0.25</span> {'\u2502'}
          <span style={{ color: '#fbbf24' }}>HPG</span> <span style={{ color: '#4ade80' }}>{'\u25B2'}24.10 +0.32</span> {'\u2502'}
          <span style={{ color: '#fbbf24' }}>VCB</span> <span style={{ color: '#4ade80' }}>{'\u25B2'}81.50 +1.13</span> {'\u2502'}
          <span style={{ color: '#fbbf24' }}>FPT</span> <span style={{ color: '#4ade80' }}>{'\u25B2'}137.50 +1.89</span> {'\u2502'}
          <span style={{ color: '#fbbf24' }}>DOW</span> <span style={{ color: '#4ade80' }}>{'\u25B2'}52,342 +0.31%</span>
        </span>
        <div style={{ position: 'absolute', inset: 0, right: 0, left: 'auto', width: 40, background: 'linear-gradient(270deg, #060c18, transparent)', zIndex: 1, pointerEvents: 'none' }} />
      </div>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <div
          onClick={toggleDark}
          title={th.toggleTitle}
          style={{
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            background: '#0f1e36', border: '1px solid #1a3050', borderRadius: 20,
            padding: '4px 10px', transition: 'all .25s',
          }}
        >
          <span style={{ fontSize: 12, lineHeight: 1 }}>{th.toggleIcon}</span>
          <span style={{ fontSize: 10, fontWeight: 600, color: '#64748b', letterSpacing: 0.3 }}>
            {th.toggleLabel}
          </span>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Build + Lint**

Run: `npm run build && npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/TopBar.tsx
git commit -m "feat: update TopBar with market status, ticker tape, logo, toggle label"
```

---

### Task 3: TradingView Index Modal

**Files:**
- Create: `src/components/TradingViewModal.tsx`

**Interfaces:**
- Consumes: `sym: string`, `color: string`, `onClose: () => void`
- Produces: Modal with TradingView iframe embed + "Mở TradingView" link

- [ ] **Step 1: Create TradingViewModal.tsx**

Create `src/components/TradingViewModal.tsx`:
```tsx
type Props = {
  sym: string
  color: string
  tvSymbol: string
  onClose: () => void
}

const TV_SYM_MAP: Record<string, string> = {
  'VN-Index': 'HOSE:VNINDEX',
  'VN30-Index': 'HOSE:VN30',
  'HNX-Index': 'HNX:HNXINDEX',
  'HNX30': 'HNX:HNX30',
  'UPCOM': 'UPCOM:UPCOMINDEX',
}

export default function TradingViewModal({ sym, color, tvSymbol, onClose }: Props) {
  const tvSym = TV_SYM_MAP[sym] || tvSymbol || 'HOSE:VNINDEX'
  const iframeUrl = `https://s.tradingview.com/widgetembed/?frameElementId=tv1&symbol=${encodeURIComponent(tvSym)}&interval=D&hidesidetoolbar=0&hidetoptoolbar=0&theme=dark&style=1&locale=vi&toolbar_bg=%23131722&enable_publishing=false&allow_symbol_change=true&save_image=false&show_popup_button=false`
  const tvOpenUrl = `https://www.tradingview.com/chart/?symbol=${encodeURIComponent(tvSym)}&theme=dark`

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#060c18', border: '1px solid #1a3050', borderRadius: 12,
          width: 980, height: 640, maxWidth: '97vw', maxHeight: '93vh',
          overflow: 'hidden', animation: 'fadeUp .18s ease',
          boxShadow: '0 32px 80px rgba(0,0,0,.7), 0 0 40px rgba(37,99,235,.12)',
          display: 'flex', flexDirection: 'column',
        }}
      >
        <div style={{
          background: '#0b1628', padding: '10px 18px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderBottom: '1px solid #1a3050', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: '#1e3a5f', borderRadius: 6, padding: '3px 10px' }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#60a5fa', fontFamily: "'Inter', sans-serif", letterSpacing: 0.5 }}>
                {sym}
              </span>
            </div>
            <span style={{ fontSize: 10, color: '#3a5570' }}>
              Biểu đồ TradingView - Thời gian thực
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <a
              href={tvOpenUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#1e3a5f', color: '#60a5fa', border: '1px solid #2563eb',
                borderRadius: 6, padding: '4px 10px', fontSize: 10, fontWeight: 700,
                cursor: 'pointer', textDecoration: 'none',
              }}
            >
              {'\u2197'} Mở TradingView
            </a>
            <button
              onClick={onClose}
              style={{
                background: '#0f1e36', color: '#64748b', border: '1px solid #1a3050',
                borderRadius: 6, width: 28, height: 28, cursor: 'pointer', fontSize: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {'\u2715'}
            </button>
          </div>
        </div>
        <iframe
          src={iframeUrl}
          style={{ flex: 1, width: '100%', border: 'none', background: '#060c18' }}
          allowTransparency
          scrolling="no"
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Build + Lint**

Run: `npm run build && npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/TradingViewModal.tsx
git commit -m "feat: add TradingView index modal component"
```

---

### Task 4: Global Markets Panel

**Files:**
- Create: `src/components/GlobalMarketsPanel.tsx`

**Interfaces:**
- Consumes: `th: ThemeTokens`
- Produces: Panel with US/EU/ASIA/COMM tabs, market data rows

- [ ] **Step 1: Create GlobalMarketsPanel.tsx**

Create `src/components/GlobalMarketsPanel.tsx`:
```tsx
import { useState } from 'react'
import type { ThemeTokens } from '../types/priceboard'

type MarketItem = { name: string; v: number; chg: number; pct: number; unit?: string }
type MarketTab = { id: string; label: string }

const TABS: MarketTab[] = [
  { id: 'US', label: 'Mỹ' },
  { id: 'EU', label: 'Châu Âu' },
  { id: 'ASIA', label: 'Châu Á' },
  { id: 'COMM', label: 'Hàng hoá' },
]

const DATA: Record<string, MarketItem[]> = {
  US: [
    { name: 'Dow Jones', v: 42587.50, chg: 132.45, pct: 0.31 },
    { name: 'S&P 500', v: 5862.13, chg: 14.62, pct: 0.25 },
    { name: 'Nasdaq', v: 19169.95, chg: 256.34, pct: 1.35 },
    { name: 'Russell 2000', v: 2026.97, chg: 11.15, pct: 0.55 },
    { name: 'VIX', v: 14.82, chg: -0.34, pct: -2.24 },
  ],
  EU: [
    { name: 'FTSE 100', v: 8712.45, chg: 45.20, pct: 0.52 },
    { name: 'DAX', v: 22345.80, chg: 187.60, pct: 0.85 },
    { name: 'CAC 40', v: 7845.30, chg: -32.10, pct: -0.41 },
    { name: 'Euro Stoxx 50', v: 5234.75, chg: 28.90, pct: 0.55 },
    { name: 'IBEX 35', v: 11892.40, chg: 95.30, pct: 0.81 },
  ],
  ASIA: [
    { name: 'Nikkei 225', v: 38547.20, chg: 312.80, pct: 0.82 },
    { name: 'Hang Seng', v: 21456.90, chg: -198.40, pct: -0.92 },
    { name: 'Shanghai', v: 3287.65, chg: 12.45, pct: 0.38 },
    { name: 'Kospi', v: 2587.30, chg: -15.60, pct: -0.60 },
    { name: 'ASX 200', v: 8234.50, chg: 42.10, pct: 0.51 },
  ],
  COMM: [
    { name: 'Vàng (XAU)', v: 2345.60, chg: 8.40, pct: 0.36, unit: 'USD/oz' },
    { name: 'Bạc (XAG)', v: 29.45, chg: -0.18, pct: -0.61, unit: 'USD/oz' },
    { name: 'Dầu WTI', v: 78.32, chg: 1.24, pct: 1.61, unit: 'USD/thùng' },
    { name: 'Dầu Brent', v: 82.15, chg: 1.08, pct: 1.33, unit: 'USD/thùng' },
    { name: 'Đồng (CU)', v: 4.52, chg: -0.03, pct: -0.66, unit: 'USD/lb' },
  ],
}

const fmt = (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function GlobalMarketsPanel({ th }: { th: ThemeTokens }) {
  const [active, setActive] = useState('US')
  const items = DATA[active] || []

  return (
    <div style={{
      width: 210, borderLeft: `1px solid ${th.idxColBorder}`,
      padding: '10px 12px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 0,
    }}>
      <div style={{
        display: 'flex', gap: 0, marginBottom: 7,
        borderBottom: `1px solid ${th.idxColBorder}`, paddingBottom: 5,
      }}>
        {TABS.map((t) => (
          <span
            key={t.id}
            onClick={() => setActive(t.id)}
            style={{
              fontSize: 10, fontWeight: t.id === active ? 700 : 400,
              color: t.id === active ? '#3b82f6' : th.textMuted,
              borderBottom: t.id === active ? '2px solid #3b82f6' : 'none',
              paddingBottom: 3, paddingRight: 8, cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            {t.label}
          </span>
        ))}
      </div>
      {items.map((g) => {
        const color = g.pct >= 0 ? '#22c55e' : '#f43f5e'
        return (
          <div key={g.name} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '4px 0', borderBottom: `1px solid ${th.glItemBorder}`,
          }}>
            <div>
              <div style={{ fontSize: 11, color: th.glNameColor, fontWeight: 500 }}>{g.name}</div>
              <div style={{ fontSize: 9, color: th.textMuted }}>
                {fmt(g.v)}{g.unit ? ' ' + g.unit : ''}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                {g.chg >= 0 ? '+' : ''}{g.chg.toFixed(2)}
              </div>
              <div style={{ fontSize: 9, color, fontWeight: 600 }}>
                {g.pct >= 0 ? '+' : ''}{g.pct.toFixed(2)}%
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 2: Build + Lint**

Run: `npm run build && npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/GlobalMarketsPanel.tsx
git commit -m "feat: add GlobalMarketsPanel with US/EU/ASIA/COMM tabs"
```

---

### Task 5: IndexStrip — LIVE Badge, Intraday Chart, Click→TradingView

**Files:**
- Modify: `src/components/IndexStrip.tsx`

**Interfaces:**
- Consumes: `MarketIndexView[]`, `ThemeTokens`, `onIndexClick` callback
- Produces: Updated index cards with LIVE badge, volume bars, click opens TradingView

- [ ] **Step 1: Rewrite IndexStrip.tsx**

Replace `src/components/IndexStrip.tsx` with updated version matching HTML source — each index card gets:
- Top color bar (2px)
- LIVE badge (green/red background)
- Value in JetBrains Mono font
- Volume line: "KL: xxx"
- Up/Down/NC counts
- SVG sparkline with area fill
- `onClick` prop to open TradingView modal

Key changes from current:
- Add `gradId` prop per index
- Add `statusBg` for LIVE badge
- Add `onClick` handler
- Font: JetBrains Mono for values

- [ ] **Step 2: Build + Lint**

Run: `npm run build && npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/IndexStrip.tsx
git commit -m "feat: update IndexStrip with LIVE badge, intraday chart, click handler"
```

---

### Task 6: GridView (Card View)

**Files:**
- Create: `src/components/GridView.tsx`

**Interfaces:**
- Consumes: `StockRow[]`, `ThemeTokens`, `onChart` callback
- Produces: Grid of stock cards with sparklines

- [ ] **Step 1: Create GridView.tsx**

Create `src/components/GridView.tsx`:
```tsx
import type { ThemeTokens, StockRow } from '../types/priceboard'

type Props = { rows: StockRow[]; th: ThemeTokens }

export default function GridView({ rows, th }: Props) {
  return (
    <div style={{ flex: 1, overflow: 'auto', background: th.tableBg, padding: 14 }}>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: 10, width: '100%',
      }}>
        {rows.map((s) => (
          <div
            key={s.sym}
            onClick={s.onChart}
            style={{
              background: s.bg, border: `1px solid ${th.cellBorder}`, borderRadius: 8,
              padding: '10px 12px', cursor: 'pointer', transition: 'all .4s',
              position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: s.lc, opacity: 0.7 }} />
            <div style={{ fontSize: 12, fontWeight: 800, color: '#60a5fa', fontFamily: "'Inter', sans-serif", letterSpacing: 0.4, marginBottom: 4 }}>
              {s.sym}
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, color: s.lc, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.1 }}>
              {s.lp}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 3 }}>
              <span style={{
                fontSize: 10, fontWeight: 700, color: s.pc,
                background: s.pct.startsWith('+') ? 'rgba(34,197,94,.15)' : s.pct.startsWith('-') ? 'rgba(244,63,94,.15)' : 'rgba(251,191,36,.15)',
                padding: '1px 5px', borderRadius: 4,
              }}>
                {s.pct}
              </span>
              <span style={{ fontSize: 9, color: th.textMuted }}>{s.chg}</span>
            </div>
            <div style={{ fontSize: 9, color: th.textMuted, marginTop: 4 }}>KL: {s.tvol}</div>
            {/* Sparkline placeholder — would need ipts data */}
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Build + Lint**

Run: `npm run build && npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/GridView.tsx
git commit -m "feat: add GridView card view component"
```

---

### Task 7: HeatmapView

**Files:**
- Create: `src/components/HeatmapView.tsx`

**Interfaces:**
- Consumes: stocks data grouped by sector, `ThemeTokens`, `onChart` callback
- Produces: Heatmap with sector sections, color-coded cells

- [ ] **Step 1: Create HeatmapView.tsx**

Create `src/components/HeatmapView.tsx` with heatColor function matching HTML source:
```typescript
function heatColor(pct: number): string {
  if (pct >= 6.5) return '#7c3aed'
  if (pct >= 4)   return '#14532d'
  if (pct >= 2)   return '#166534'
  if (pct >= 0.5) return '#15803d'
  if (pct > -0.5) return '#78350f'
  if (pct > -2)   return '#7f1d1d'
  if (pct > -4)   return '#991b1b'
  if (pct > -6.5) return '#b91c1c'
  return '#1e3a8a'
}
```

Component receives `stocks: StockState[]` and `th: ThemeTokens`, groups by `ng` (sector), renders sectors with cells.

- [ ] **Step 2: Build + Lint**

Run: `npm run build && npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/HeatmapView.tsx
git commit -m "feat: add HeatmapView component with sector-based heatmap"
```

---

### Task 8: StockTable — NN Columns, Row Hover, Darker Colors

**Files:**
- Modify: `src/components/StockTable.tsx`

**Interfaces:**
- Consumes: `StockRow[]`, `ThemeTokens`
- Produces: Updated table with NN (Foreign) section columns, row hover, darker header

- [ ] **Step 1: Update StockTable headers**

Add NN section columns to table header: Mua, Bán, ↕, Room
Update header colors to match HTML source (#080f1c background, #4a7090 text)
Add row hover effect via onMouseEnter/onMouseLeave

- [ ] **Step 2: Update StockTable row cells**

Add foreign trading cells: `s.fbuy`, `s.fsell`, `s.fbal`, `s.room`
Add opacity gradient for bid/ask levels (b3/b2 lower opacity, b1 full)
Update border colors to match HTML source

- [ ] **Step 3: Build + Lint**

Run: `npm run build && npm run lint`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/StockTable.tsx
git commit -m "feat: update StockTable with NN columns, hover effects, darker theme"
```

---

### Task 9: FooterBar Update

**Files:**
- Modify: `src/components/FooterBar.tsx`

**Interfaces:**
- Consumes: none (static)
- Produces: Updated footer text matching HTML source

- [ ] **Step 1: Update FooterBar.tsx**

Replace footer content with:
```tsx
export default function FooterBar() {
  return (
    <div style={{
      background: '#060c18', borderTop: '1px solid #0f1e36',
      color: '#3a5570', fontSize: 10, padding: '0 16px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      flexShrink: 0, height: 32,
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span>Cơ sở: Giá ×1,000 {'\u2502'} KL ×1</span>
        <span style={{ color: '#1e3a5f' }}>{'\u2502'}</span>
        <span>Phái sinh: Giá ×1 {'\u2502'} KL ×1</span>
      </div>
      <div style={{ display: 'flex', gap: 5 }} />
    </div>
  )
}
```

- [ ] **Step 2: Build + Lint**

Run: `npm run build && npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/FooterBar.tsx
git commit -m "feat: update FooterBar with price/quantity labels"
```

---

### Task 10: FilterBar — View Mode Toggle Buttons

**Files:**
- Modify: `src/components/FilterBar.tsx`

**Interfaces:**
- Consumes: `ThemeTokens`, `viewMode: string`, `onViewModeChange: (mode: string) => void`
- Produces: Filter bar with 3 view mode toggle buttons (Table ☰ / Grid ⊞ / Heatmap ▦) before search

- [ ] **Step 1: Add view mode props to FilterBar**

Add `viewMode` and `onViewModeChange` props to FilterBar component.

- [ ] **Step 2: Add view mode toggle buttons**

Insert 3 buttons at the start of FilterBar (before search input):
```tsx
<div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
  <button onClick={() => onViewModeChange('table')} style={{
    background: viewMode === 'table' ? '#2563eb' : th.iconBg,
    border: `1px solid ${th.navBorder}`, width: 26, height: 26, borderRadius: 5,
    cursor: 'pointer', color: viewMode === 'table' ? '#fff' : th.textMuted,
    fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>{'\u2630'}</button>
  <button onClick={() => onViewModeChange('grid')} style={{
    background: viewMode === 'grid' ? '#2563eb' : th.iconBg,
    border: `1px solid ${th.navBorder}`, width: 26, height: 26, borderRadius: 5,
    cursor: 'pointer', color: viewMode === 'grid' ? '#fff' : th.textMuted,
    fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>{'\u229E'}</button>
  <button onClick={() => onViewModeChange('heat')} style={{
    background: viewMode === 'heat' ? '#2563eb' : th.iconBg,
    border: `1px solid ${th.navBorder}`, width: 26, height: 26, borderRadius: 5,
    cursor: 'pointer', color: viewMode === 'heat' ? '#fff' : th.textMuted,
    fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>{'\u25A6'}</button>
</div>
```

- [ ] **Step 3: Build + Lint**

Run: `npm run build && npm run lint`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/FilterBar.tsx
git commit -m "feat: add view mode toggle buttons to FilterBar"
```

---

### Task 11: App.tsx Integration — Wire Everything Together

**Files:**
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: All components from Tasks 1-10
- Produces: Fully integrated app with view modes, TradingView modal, global markets

- [ ] **Step 1: Add state for viewMode and idxChart**

```typescript
const [viewMode, setViewMode] = useState<'table' | 'grid' | 'heat'>('table')
const [idxChart, setIdxChart] = useState<{ open: boolean; sym: string; color: string }>({ open: false, sym: '', color: '' })
```

- [ ] **Step 2: Update mapIndexViews to include onClick**

Add `onClick` and `color` to `MarketIndexView` type, pass `setIdxChart` callback.

- [ ] **Step 3: Update IndexStrip call**

Pass `onIndexClick` prop to IndexStrip.

- [ ] **Step 4: Add GlobalMarketsPanel to IndexStrip**

Import and render GlobalMarketsPanel inside IndexStrip container, after index cards.

- [ ] **Step 5: Render view mode content**

Replace single `<StockTable>` with conditional rendering:
```tsx
{viewMode === 'table' && <StockTable rows={allStocks} th={th} />}
{viewMode === 'grid' && <GridView rows={allStocks} th={th} />}
{viewMode === 'heat' && <HeatmapView stocks={stocks} th={th} />}
```

- [ ] **Step 6: Add TradingViewModal**

```tsx
{idxChart.open && (
  <TradingViewModal
    sym={idxChart.sym}
    color={idxChart.color}
    tvSymbol={idxChart.sym}
    onClose={() => setIdxChart({ open: false, sym: '', color: '' })}
  />
)}
```

- [ ] **Step 7: Pass viewMode to FilterBar**

```tsx
<FilterBar th={th} filter={filter} onFilterChange={handleFilterChange} onSymbolAdd={handleSymbolAdd} viewMode={viewMode} onViewModeChange={setViewMode} />
```

- [ ] **Step 8: Update mapIndexViews return type**

Add `color` and `onClick` to `MarketIndexView`:

```typescript
function mapIndexViews(
  indices: MarketIndexState[],
  onIndexClick: (sym: string, color: string) => void,
): MarketIndexView[] {
  return indices.map((idx) => {
    const color = idx.ch >= 0 ? '#22c55e' : '#f43f5e'
    return {
      name: idx.n,
      color,
      val: idx.v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      chg: `${idx.ch >= 0 ? '+' : ''}${idx.ch.toFixed(2)} (${idx.pct >= 0 ? '+' : ''}${idx.pct.toFixed(2)}%)`,
      vol: idx.vol,
      up: idx.up,
      dn: idx.dn,
      nc: idx.nc,
      pts: toPolylinePoints(idx.h),
      fill: toAreaPath(idx.h),
      statusBg: (idx.ch >= 0 ? 'rgba(34,197,94,.15)' : 'rgba(244,63,94,.15)'),
      gradId: `ig${idx.n}`,
      onClick: () => onIndexClick(idx.n, color),
    }
  })
}
```

Update `MarketIndexView` type in `src/types/priceboard.ts` to include `color`, `statusBg`, `gradId`, `onClick`.

- [ ] **Step 9: Build + Lint**

Run: `npm run build && npm run lint`
Expected: PASS

- [ ] **Step 10: Commit**

```bash
git add src/App.tsx src/types/priceboard.ts src/components/IndexStrip.tsx
git commit -m "feat: integrate view modes, TradingView modal, global markets in App"
```

---

### Task 12: Final Integration Verification

**Files:** None (verification only)

- [ ] **Step 1: Full build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 2: Full lint**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Visual verification**

Start dev server, verify:
- TopBar: logo, market status, clock, ticker tape, toggle
- IndexStrip: index cards with LIVE badge, global markets panel
- FilterBar: view mode toggle buttons
- StockTable: NN columns, hover effects
- GridView: card layout with sparklines
- HeatmapView: sector heatmap
- TradingViewModal: opens on index click
- Footer: correct text

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete UI style update to match HTML source"
```
