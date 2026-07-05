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
    <div
      className="w-[210px] border-l border-line p-[10px_12px] shrink-0 flex flex-col gap-0"
    >
      <div className="flex gap-0 mb-[7px] border-b border-line pb-[5px]">
        {TABS.map((t) => (
          <span
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`text-[10px] cursor-pointer whitespace-nowrap pr-2 pb-[3px] ${
              t.id === active
                ? 'font-bold text-blue-500 border-b-2 border-blue-500'
                : 'font-normal text-txt-muted'
            }`}
          >
            {t.label}
          </span>
        ))}
      </div>
      {items.map((g) => (
        <div
          key={g.name}
          className="flex justify-between items-center py-[4px] border-b border-line"
        >
          <div>
            <div className="text-[11px] text-txt-secondary font-medium">{g.name}</div>
            <div className="text-[9px] text-txt-muted">
              {fmt(g.v)}{g.unit ? ' ' + g.unit : ''}
            </div>
          </div>
          <div className="text-right">
            <div className={`text-[11px] font-bold font-mono ${g.pct >= 0 ? 'text-market-up' : 'text-market-down'}`}>
              {g.chg >= 0 ? '+' : ''}{g.chg.toFixed(2)}
            </div>
            <div className={`text-[9px] font-semibold ${g.pct >= 0 ? 'text-market-up' : 'text-market-down'}`}>
              {g.pct >= 0 ? '+' : ''}{g.pct.toFixed(2)}%
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
