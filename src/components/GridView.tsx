import { useState, useRef, useCallback, useEffect, memo } from 'react'
import type { ThemeTokens, StockRow } from '../types/priceboard'

type Props = { rows: StockRow[]; th: ThemeTokens }

const CARD_HEIGHT = 112
const GAP = 10
const OVERSCAN = 3

const GridCard = memo(function GridCard({ s, th }: { s: StockRow; th: ThemeTokens }) {
  return (
    <div
      onClick={s.onChart}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--ds-color-blue-600)'
        e.currentTarget.style.background = th.rowHover
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = th.cellBorder
        e.currentTarget.style.background = s.bg
      }}
      className="relative cursor-pointer overflow-hidden rounded-lg p-2.5 transition-all"
      style={{ background: s.bg, border: `1px solid ${th.cellBorder}` }}
    >
      <div className="absolute top-0 left-0 right-0 h-0.5 opacity-70" style={{ background: s.lc }} />
      <div className="mb-1 text-xs font-extrabold tracking-wide text-blue-400">
        {s.sym}
      </div>
      <div
        className="rounded py-0.5 px-1 font-mono text-lg font-bold leading-tight"
        style={{
          color: s.lc,
          background: s.pct.startsWith('+') ? (parseFloat(s.pct) > 3 ? 'rgba(34,197,94,.3)' : 'rgba(34,197,94,.15)') : s.pct.startsWith('-') ? (parseFloat(s.pct) < -3 ? 'rgba(244,63,94,.3)' : 'rgba(244,63,94,.15)') : 'transparent',
        }}
      >
        {s.lp}
      </div>
      <div className="mt-0.5 flex items-center justify-between">
        <span
          className="rounded px-1.5 py-px text-[10px] font-bold"
          style={{
            color: s.pc,
            background: s.pct.startsWith('+') ? 'rgba(34,197,94,.25)' : s.pct.startsWith('-') ? 'rgba(244,63,94,.25)' : 'rgba(251,191,36,.15)',
          }}
        >
          {s.pct}
        </span>
        <span className="text-[9px] text-txt-muted">{s.chg}</span>
      </div>
      <div className="mt-1 text-[9px] text-txt-muted">KL: {s.tvol}</div>
      {s.sparkPts && (
        <svg viewBox="0 0 100 24" preserveAspectRatio="none" className="mt-1.5 block h-[22px] w-full">
          <path d={s.sparkFill} fill={s.lc} opacity={0.12} />
          <polyline points={s.sparkPts} fill="none" stroke={s.lc} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      )}
    </div>
  )
})

function GridViewInner({ rows, th }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [containerWidth, setContainerWidth] = useState(800)
  const [containerHeight, setContainerHeight] = useState(800)

  const handleScroll = useCallback(() => {
    const el = containerRef.current
    if (el) setScrollTop(el.scrollTop)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        if (width) setContainerWidth(width)
        if (height) setContainerHeight(height)
      }
    })
    ro.observe(el)
    setContainerWidth(el.clientWidth)
    setContainerHeight(el.clientHeight)
    return () => ro.disconnect()
  }, [])

  const minColWidth = 160
  const cols = Math.max(1, Math.floor((containerWidth + GAP) / (minColWidth + GAP)))
  const totalRows = Math.ceil(rows.length / cols)
  const totalHeight = totalRows * (CARD_HEIGHT + GAP)

  const startRow = Math.max(0, Math.floor(scrollTop / (CARD_HEIGHT + GAP)) - OVERSCAN)
  const visibleCount = Math.ceil(containerHeight / (CARD_HEIGHT + GAP)) + OVERSCAN * 2
  const endRow = Math.min(totalRows, startRow + visibleCount)

  const visibleItems = rows.slice(startRow * cols, endRow * cols)
  const offsetY = startRow * (CARD_HEIGHT + GAP)

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-auto p-3.5"
      style={{ background: th.tableBg }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          className="absolute top-0 left-0 right-0 grid gap-2.5"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            transform: `translateY(${offsetY}px)`,
          }}
        >
          {visibleItems.map((s) => (
            <GridCard key={s.sym} s={s} th={th} />
          ))}
        </div>
      </div>
    </div>
  )
}

const GridView = memo(GridViewInner)
export default GridView
