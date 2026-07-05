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
      { label: 'Tăng', upCnt: upCount, total, upPct: (upCount / total) * 100, upColor: 'var(--ds-color-market-up)' },
      { label: 'Giảm', upCnt: dnCount, total, upPct: (dnCount / total) * 100, upColor: 'var(--ds-color-market-down)' },
      { label: 'Đứng', upCnt: ncCount, total, upPct: (ncCount / total) * 100, upColor: 'var(--ds-color-yellow-400)' },
    ]

    return { topGainers: gainers, topLosers: losers, topVolume: volume, breadthData: breadth }
  }, [rows])

  const cardHoverHandlers = useMemo(() => ({
    onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => {
      e.currentTarget.style.background = th.rowHover
      e.currentTarget.style.borderColor = 'var(--ds-color-blue-600)'
    },
    onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => {
      e.currentTarget.style.background = th.appBg
      e.currentTarget.style.borderColor = th.cellBorder
    },
  }), [th.appBg, th.cellBorder, th.rowHover])

  return (
    <div className="flex flex-1 flex-col overflow-auto" style={{ background: th.appBg }}>
      <div className="grid flex-1 grid-cols-3 gap-3.5 p-3.5">
        {/* Top gainers */}
        <div className="flex flex-col gap-2 rounded-lg border border-line bg-nav p-3">
          <div className="text-xs font-bold uppercase tracking-wider text-market-up">▲ Top Tăng Mạnh</div>
          {topGainers.map((tg) => (
            <div
              key={tg.sym}
              onClick={tg.onChart}
              {...cardHoverHandlers}
              className="cursor-pointer rounded-md border border-line p-2 transition-all"
              style={{ background: th.appBg }}
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="font-bold text-blue-400">{tg.sym}</span>
                <span className="text-[10px] font-bold text-market-up">+{tg.pct}%</span>
              </div>
              <div className="text-xs font-bold text-txt-primary font-mono">{tg.lp}</div>
              <div className="mt-0.5 text-[9px] text-txt-muted">KL: {tg.vol}</div>
            </div>
          ))}
        </div>

        {/* Top losers */}
        <div className="flex flex-col gap-2 rounded-lg border border-line bg-nav p-3">
          <div className="text-xs font-bold uppercase tracking-wider text-market-down">▼ Top Giảm Mạnh</div>
          {topLosers.map((tl) => (
            <div
              key={tl.sym}
              onClick={tl.onChart}
              {...cardHoverHandlers}
              className="cursor-pointer rounded-md border border-line p-2 transition-all"
              style={{ background: th.appBg }}
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="font-bold text-blue-400">{tl.sym}</span>
                <span className="text-[10px] font-bold text-market-down">{tl.pct}%</span>
              </div>
              <div className="text-xs font-bold text-txt-primary font-mono">{tl.lp}</div>
              <div className="mt-0.5 text-[9px] text-txt-muted">KL: {tl.vol}</div>
            </div>
          ))}
        </div>

        {/* Top volume */}
        <div className="flex flex-col gap-2 rounded-lg border border-line bg-nav p-3">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-500">📈 KLGD Cao Nhất</div>
          {topVolume.map((tv) => (
            <div
              key={tv.sym}
              onClick={tv.onChart}
              {...cardHoverHandlers}
              className="cursor-pointer rounded-md border border-line p-2 transition-all"
              style={{ background: th.appBg }}
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="font-bold text-blue-400">{tv.sym}</span>
                <span className="text-[10px] font-bold" style={{ color: tv.pc }}>{tv.pct}</span>
              </div>
              <div className="text-[11px] font-bold text-txt-primary font-mono">{tv.vol}</div>
              <div className="mt-0.5 text-[9px] text-txt-muted">{tv.lp}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Breadth indicators */}
      <div className="flex shrink-0 items-center gap-5 border-t border-line-subtle bg-nav px-3.5 py-2.5">
        <div className="flex gap-4">
          {breadthData.map((bd) => (
            <div key={bd.label} className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-txt-muted">{bd.label}</span>
              <div className="flex items-center gap-1">
                <div className="h-2 w-20 overflow-hidden rounded bg-app">
                  <div className="h-full" style={{ width: `${bd.upPct}%`, background: bd.upColor }} />
                </div>
                <span className="min-w-[50px] text-[11px] font-bold font-mono" style={{ color: bd.upColor }}>{bd.upCnt}/{bd.total}</span>
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
