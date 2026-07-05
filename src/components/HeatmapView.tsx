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
    <div className="flex-1 overflow-auto p-3.5" style={{ background: th.tableBg }}>
      {sectors.map(({ sec, cells, totalColor, totalPctStr }) => (
        <div key={sec} className="mb-3.5">
          <div className="mb-1.5 flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">{sec}</span>
            <div className="h-px flex-1" style={{ background: th.cellBorderL }} />
            <span className="text-[9px] font-semibold" style={{ color: totalColor }}>{totalPctStr}</span>
          </div>
          <div className="flex flex-wrap gap-0.5">
            {cells.map((c) => (
                <div
                  key={c.sym}
                  onClick={c.onChart}
                  onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.25)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.filter = 'none' }}
                  className="relative cursor-pointer overflow-hidden rounded-[5px] transition-[filter]"
                  style={{ background: c.bg, minWidth: c.minW, padding: '7px 8px' }}
                >
                  <div className="text-[11px] font-extrabold leading-snug tracking-wide text-white">{c.sym}</div>
                  <div className="text-[13px] font-bold leading-tight text-white font-mono">{c.lp}</div>
                  <div className="text-[10px] font-bold text-white/85">{c.pct}</div>
                  <div className="mt-px text-[8.5px] text-white/50">{c.vol}</div>
                </div>
              ))}
          </div>
        </div>
      ))}
      <div className="mt-2 flex items-center gap-1.5 border-t pt-2" style={{ borderColor: th.cellBorderL }}>
        <span className="text-[9px] font-sans text-txt-muted">Chú thích:</span>
        <div className="flex items-center gap-0.5">
          <div className="h-3.5 w-7 rounded-[3px] bg-purple-700" /><span className="text-[8px] text-txt-muted">Trần</span>
          <div className="ml-1 h-3.5 w-7 rounded-[3px] bg-green-600" /><span className="text-[8px] text-txt-muted">+4%</span>
          <div className="ml-1 h-3.5 w-7 rounded-[3px] bg-green-500" /><span className="text-[8px] text-txt-muted">+2%</span>
          <div className="ml-1 h-3.5 w-7 rounded-[3px] bg-yellow-500" /><span className="text-[8px] text-txt-muted">0%</span>
          <div className="ml-1 h-3.5 w-7 rounded-[3px] bg-red-500" /><span className="text-[8px] text-txt-muted">-2%</span>
          <div className="ml-1 h-3.5 w-7 rounded-[3px] bg-red-500" /><span className="text-[8px] text-txt-muted">-4%</span>
          <div className="ml-1 h-3.5 w-7 rounded-[3px] bg-blue-700" /><span className="text-[8px] text-txt-muted">Sàn</span>
        </div>
      </div>
    </div>
  )
}

const HeatmapView = memo(HeatmapViewInner)
export default HeatmapView
