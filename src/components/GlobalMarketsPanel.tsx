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
