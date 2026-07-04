import { useMemo, memo } from 'react'
import type { ThemeTokens, StockRow } from '../types/priceboard'

type Props = { rows: StockRow[]; th: ThemeTokens }

function heatColor(pct: number): string {
  if (pct >= 6.5) return 'var(--ds-color-purple-700)'
  if (pct >= 4)   return 'var(--ds-color-market-flash-up)'
  if (pct >= 2)   return 'var(--ds-color-green-600)'
  if (pct >= 0.5) return 'var(--ds-color-green-500)'
  if (pct > -0.5) return 'var(--ds-color-yellow-500)'
  if (pct > -2)   return 'var(--ds-color-red-500)'
  if (pct > -4)   return 'var(--ds-color-red-500)'
  if (pct > -6.5) return 'var(--ds-color-red-500)'
  return 'var(--ds-color-blue-700)'
}

function parsePct(pct: string): number {
  const n = parseFloat(pct.replace('%', '').replace('+', ''))
  return isNaN(n) ? 0 : n
}

type HeatCell = { sym: string; pct: string; lp: string; vol: string; bg: string; minW: number; onChart: () => void }

function HeatmapViewInner({ rows, th }: Props) {
  const sectors = useMemo(() => {
    const map = new Map<string, { cells: HeatCell[]; totalPct: number }>()
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
      totalColor: totalPct >= 0 ? 'var(--ds-color-market-up)' : 'var(--ds-color-market-down)',
      totalPctStr: (totalPct >= 0 ? '+' : '') + totalPct.toFixed(1) + '%',
    }))
  }, [rows])

  return (
    <div style={{ flex: 1, overflow: 'auto', background: th.tableBg, padding: 14 }}>
      {sectors.map(({ sec, cells, totalColor, totalPctStr }) => (
        <div key={sec} style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--ds-color-blue-400)', letterSpacing: 0.8, textTransform: 'uppercase', fontFamily: "'Inter', sans-serif" }}>{sec}</span>
            <div style={{ flex: 1, height: 1, background: th.cellBorderL }} />
            <span style={{ fontSize: 9, color: totalColor, fontWeight: 600 }}>{totalPctStr}</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {cells.map((c) => (
                <div
                  key={c.sym}
                  onClick={c.onChart}
                  onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.25)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.filter = 'none' }}
                  style={{
                    background: c.bg, borderRadius: 5,
                    padding: '7px 8px', cursor: 'pointer',
                    minWidth: c.minW,
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
          </div>
        </div>
      ))}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, paddingTop: 8,
        borderTop: `1px solid ${th.cellBorderL}`,
      }}>
        <span style={{ fontSize: 9, color: th.textMuted, fontFamily: "'Inter', sans-serif" }}>Chú thích:</span>
        <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          <div style={{ width: 28, height: 14, borderRadius: 3, background: 'var(--ds-color-purple-700)' }} /><span style={{ fontSize: 8, color: th.textMuted }}>Trần</span>
          <div style={{ width: 28, height: 14, borderRadius: 3, background: 'var(--ds-color-green-600)', marginLeft: 4 }} /><span style={{ fontSize: 8, color: th.textMuted }}>+4%</span>
          <div style={{ width: 28, height: 14, borderRadius: 3, background: 'var(--ds-color-green-500)', marginLeft: 4 }} /><span style={{ fontSize: 8, color: th.textMuted }}>+2%</span>
          <div style={{ width: 28, height: 14, borderRadius: 3, background: 'var(--ds-color-yellow-500)', marginLeft: 4 }} /><span style={{ fontSize: 8, color: th.textMuted }}>0%</span>
          <div style={{ width: 28, height: 14, borderRadius: 3, background: 'var(--ds-color-red-500)', marginLeft: 4 }} /><span style={{ fontSize: 8, color: th.textMuted }}>-2%</span>
          <div style={{ width: 28, height: 14, borderRadius: 3, background: 'var(--ds-color-red-500)', marginLeft: 4 }} /><span style={{ fontSize: 8, color: th.textMuted }}>-4%</span>
          <div style={{ width: 28, height: 14, borderRadius: 3, background: 'var(--ds-color-blue-700)', marginLeft: 4 }} /><span style={{ fontSize: 8, color: th.textMuted }}>Sàn</span>
        </div>
      </div>
    </div>
  )
}

const HeatmapView = memo(HeatmapViewInner)
export default HeatmapView
