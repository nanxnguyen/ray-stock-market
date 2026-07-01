import { useMemo, memo } from 'react'
import type { ThemeTokens, StockRow } from '../types/priceboard'

type Props = { rows: StockRow[]; th: ThemeTokens }

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

function parsePct(pct: string): number {
  const n = parseFloat(pct.replace('%', '').replace('+', ''))
  return isNaN(n) ? 0 : n
}

type HeatCell = { sym: string; pct: string; bg: string; onChart: () => void }

function HeatmapViewInner({ rows, th }: Props) {
  const sectors = useMemo(() => {
    const map = new Map<string, HeatCell[]>()
    for (const s of rows) {
      const sec = s.ng || 'Khác'
      const pctVal = parsePct(s.pct)
      const cell: HeatCell = { sym: s.sym, pct: s.pct, bg: heatColor(pctVal), onChart: s.onChart }
      if (!map.has(sec)) map.set(sec, [])
      map.get(sec)!.push(cell)
    }
    return Array.from(map.entries())
  }, [rows])

  return (
    <div style={{ flex: 1, overflow: 'auto', background: th.tableBg, padding: 14 }}>
      {sectors.map(([sec, items]) => (
        <div key={sec} style={{ marginBottom: 14 }}>
          <div style={{
            fontSize: 12, fontWeight: 700, color: th.text,
            marginBottom: 6, paddingBottom: 4,
            borderBottom: `1px solid ${th.cellBorderL}`,
            fontFamily: "'Inter', sans-serif",
          }}>
            {sec}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {items.map((c) => (
                <div
                  key={c.sym}
                  onClick={c.onChart}
                  onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.25)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.filter = 'none' }}
                  style={{
                    background: c.bg, borderRadius: 5,
                    padding: '6px 10px', cursor: 'pointer',
                    minWidth: 80, textAlign: 'center',
                    transition: 'filter .15s',
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', fontFamily: "'Inter', sans-serif", letterSpacing: 0.3 }}>
                    {c.sym}
                  </div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,.85)', fontFamily: "'JetBrains Mono', monospace", marginTop: 1 }}>
                    {c.pct}
                  </div>
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
          <div style={{ width: 28, height: 14, borderRadius: 3, background: '#7c3aed' }} /><span style={{ fontSize: 8, color: th.textMuted }}>Trần</span>
          <div style={{ width: 28, height: 14, borderRadius: 3, background: '#166534', marginLeft: 4 }} /><span style={{ fontSize: 8, color: th.textMuted }}>+4%</span>
          <div style={{ width: 28, height: 14, borderRadius: 3, background: '#15803d', marginLeft: 4 }} /><span style={{ fontSize: 8, color: th.textMuted }}>+2%</span>
          <div style={{ width: 28, height: 14, borderRadius: 3, background: '#78350f', marginLeft: 4 }} /><span style={{ fontSize: 8, color: th.textMuted }}>0%</span>
          <div style={{ width: 28, height: 14, borderRadius: 3, background: '#991b1b', marginLeft: 4 }} /><span style={{ fontSize: 8, color: th.textMuted }}>-2%</span>
          <div style={{ width: 28, height: 14, borderRadius: 3, background: '#7f1d1d', marginLeft: 4 }} /><span style={{ fontSize: 8, color: th.textMuted }}>-4%</span>
          <div style={{ width: 28, height: 14, borderRadius: 3, background: '#1e3a8a', marginLeft: 4 }} /><span style={{ fontSize: 8, color: th.textMuted }}>Sàn</span>
        </div>
      </div>
    </div>
  )
}

const HeatmapView = memo(HeatmapViewInner)
export default HeatmapView
