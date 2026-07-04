import { useState, useRef, useCallback, useEffect } from 'react'
import { memo } from 'react'
import type { ThemeTokens, StockRow } from '../types/priceboard'

type Props = { rows: StockRow[]; th: ThemeTokens }

const ROW_HEIGHT = 26
const OVERSCAN = 20

const StockTableRow = memo(function StockTableRow({ s, th }: { s: StockRow; th: ThemeTokens }) {
  return (
    <tr
      onMouseEnter={(e) => { e.currentTarget.style.background = th.rowHover }}
      onMouseLeave={(e) => { e.currentTarget.style.background = s.bg }}
      style={{ background: s.bg, borderBottom: `1px solid ${th.rowBorder}`, height: ROW_HEIGHT, transition: 'background .5s' }}
    >
      <td onClick={s.onChart} style={{ position: 'sticky', left: 0, zIndex: 5, background: s.bg, padding: '3px 8px', textAlign: 'center', borderRight: `1px solid ${th.cellBorder}`, fontWeight: 700, fontSize: '11.5px', color: 'var(--ds-color-blue-400)', cursor: 'pointer', letterSpacing: '.3px', fontFamily: "'Inter', sans-serif" }}>{s.sym}</td>
      <td style={{ position: 'sticky', left: 58, zIndex: 5, background: s.bg, padding: '3px 6px', textAlign: 'right', borderRight: `1px solid ${th.cellBorder}`, color: 'var(--ds-color-purple-500)' }}>{s.ceil}</td>
      <td style={{ position: 'sticky', left: 106, zIndex: 5, background: s.bg, padding: '3px 6px', textAlign: 'right', borderRight: `1px solid ${th.cellBorder}`, color: 'var(--ds-color-yellow-400)' }}>{s.tc}</td>
      <td style={{ position: 'sticky', left: 154, zIndex: 5, background: s.bg, padding: '3px 6px', textAlign: 'right', borderRight: `2px solid ${th.cellBorder}`, color: 'var(--ds-color-cyan-400)' }}>{s.floor}</td>
      <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.b3c, opacity: .75 }}>{s.b3p}</td>
      <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.b3c, opacity: .75 }}>{s.b3q}</td>
      <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.b2c, opacity: .85 }}>{s.b2p}</td>
      <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.b2c, opacity: .85 }}>{s.b2q}</td>
      <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.b1c }}>{s.b1p}</td>
      <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `2px solid ${th.cellBorder}`, color: s.b1c }}>{s.b1q}</td>
      <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, fontWeight: 700, fontSize: 12, color: s.lc }}>{s.lp}</td>
      <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.lc, opacity: .9 }}>{s.lq}</td>
      <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, fontWeight: 700, color: s.pc }}>{s.pct}</td>
      <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.pc }}>{s.chg}</td>
      <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `2px solid ${th.cellBorder}`, color: th.volColor }}>{s.tvol}</td>
      <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.a1c }}>{s.a1p}</td>
      <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.a1c }}>{s.a1q}</td>
      <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.a2c, opacity: .85 }}>{s.a2p}</td>
      <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.a2c, opacity: .85 }}>{s.a2q}</td>
      <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.a3c, opacity: .75 }}>{s.a3p}</td>
      <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `2px solid ${th.cellBorder}`, color: s.a3c, opacity: .75 }}>{s.a3q}</td>
      <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.hc }}>{s.hi}</td>
      <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.ac, opacity: .7 }}>{s.avg}</td>
      <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `2px solid ${th.cellBorder}`, color: s.oc }}>{s.lo}</td>
      <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: 'var(--ds-color-success)' }}>{s.fbuy}</td>
      <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: 'var(--ds-color-red-400)' }}>{s.fsell}</td>
      <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.fbc }}>{s.fbal}</td>
      <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `2px solid ${th.cellBorder}`, color: 'var(--ds-color-text-muted)' }}>{s.room}</td>
      <td style={{ padding: '3px 8px', textAlign: 'right', color: th.volColor }}>{s.kltt}</td>
      <td
        onClick={(e) => { e.stopPropagation(); s.onToggleWatchlist?.() }}
        style={{ padding: '3px 8px', textAlign: 'center', cursor: 'pointer', fontSize: 13 }}
      >
        {s.watchlisted ? '\u2665' : '\u2661'}
      </td>
    </tr>
  )
})

function StockTableInner({ rows, th }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [containerHeight, setContainerHeight] = useState(800)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    setContainerHeight(el.clientHeight)
    const ro = new ResizeObserver(([entry]) => {
      if (entry) setContainerHeight(entry.contentRect.height)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const handleScroll = useCallback(() => {
    const el = containerRef.current
    if (el) setScrollTop(el.scrollTop)
  }, [])
  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN)
  const visibleCount = Math.ceil(containerHeight / ROW_HEIGHT) + OVERSCAN * 2
  const endIndex = Math.min(rows.length, startIndex + visibleCount)
  const visibleRows = rows.slice(startIndex, endIndex)

  const topSpacerHeight = startIndex * ROW_HEIGHT
  const bottomSpacerHeight = Math.max(0, (rows.length - endIndex) * ROW_HEIGHT)

  return (
    <div ref={containerRef} onScroll={handleScroll} style={{ flex: 1, overflow: 'auto', background: th.tableBg }}>
      <table style={{ width: 'max-content', minWidth: '100%', fontSize: 11, fontVariantNumeric: 'tabular-nums', fontFamily: "'JetBrains Mono', monospace" }}>
        <thead style={{ position: 'sticky', top: 0, zIndex: 20 }}>
          <tr style={{ background: 'var(--ds-color-bg-nav)', color: 'var(--ds-color-text-muted)', fontSize: 9.5, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', fontFamily: "'Inter', sans-serif" }}>
            <th style={{ position: 'sticky', left: 0, top: 0, zIndex: 31, background: 'var(--ds-color-bg-nav)', padding: '5px 8px', textAlign: 'center', borderRight: '1px solid var(--ds-color-border-subtle)', minWidth: 58 }} rowSpan={2}>Mã CK</th>
            <th style={{ position: 'sticky', left: 58, top: 0, zIndex: 31, background: 'var(--ds-color-bg-nav)', padding: '5px 6px', textAlign: 'right', borderRight: '1px solid var(--ds-color-border-subtle)', minWidth: 48, color: 'var(--ds-color-purple-500)' }} rowSpan={2}>Trần</th>
            <th style={{ position: 'sticky', left: 106, top: 0, zIndex: 31, background: 'var(--ds-color-bg-nav)', padding: '5px 6px', textAlign: 'right', borderRight: '1px solid var(--ds-color-border-subtle)', minWidth: 48, color: 'var(--ds-color-yellow-400)' }} rowSpan={2}>TC</th>
            <th style={{ position: 'sticky', left: 154, top: 0, zIndex: 31, background: 'var(--ds-color-bg-nav)', padding: '5px 6px', textAlign: 'right', borderRight: '2px solid var(--ds-color-border-default)', minWidth: 48, color: 'var(--ds-color-cyan-400)' }} rowSpan={2}>Sàn</th>
            <th colSpan={6} style={{ textAlign: 'center', background: 'var(--ds-color-bg-elevated)', color: 'var(--ds-color-blue-400)', borderRight: '2px solid var(--ds-color-border-default)', padding: 5, letterSpacing: '.8px' }}>── DƯ MUA ──</th>
            <th colSpan={5} style={{ textAlign: 'center', borderRight: '2px solid var(--ds-color-border-default)', padding: 5, color: 'var(--ds-color-text-primary)', letterSpacing: '.5px' }}>KHỚP LỆNH</th>
            <th colSpan={6} style={{ textAlign: 'center', background: 'var(--ds-color-bg-elevated)', color: 'var(--ds-color-red-400)', borderRight: '2px solid var(--ds-color-border-default)', padding: 5, letterSpacing: '.8px' }}>── DƯ BÁN ──</th>
            <th style={{ padding: '5px 6px', textAlign: 'right', borderRight: '1px solid var(--ds-color-border-subtle)', minWidth: 48 }} rowSpan={2}>Cao</th>
            <th style={{ padding: '5px 6px', textAlign: 'right', borderRight: '1px solid var(--ds-color-border-subtle)', minWidth: 48 }} rowSpan={2}>TB</th>
            <th style={{ padding: '5px 6px', textAlign: 'right', borderRight: '2px solid var(--ds-color-border-default)', minWidth: 48 }} rowSpan={2}>Thấp</th>
            <th colSpan={4} style={{ textAlign: 'center', padding: 5, color: 'var(--ds-color-purple-400)', borderRight: '2px solid var(--ds-color-border-default)', letterSpacing: '.5px' }}>NN</th>
            <th style={{ padding: '5px 8px', textAlign: 'right', minWidth: 90, color: 'var(--ds-color-text-secondary)' }} rowSpan={2}>KLGD TT</th>
            <th style={{ padding: '5px 8px', textAlign: 'center', minWidth: 36, color: 'var(--ds-color-blue-400)' }} rowSpan={2}>{'\u2661'}</th>
          </tr>
          <tr style={{ background: 'var(--ds-color-bg-nav)', color: 'var(--ds-color-text-muted)', fontSize: 9, fontFamily: "'Inter', sans-serif", letterSpacing: '.3px' }}>
            <th style={{ background: 'var(--ds-color-bg-elevated)', padding: '3px 6px', textAlign: 'right', borderRight: '1px solid var(--ds-color-border-subtle)', minWidth: 46, color: 'var(--ds-color-blue-500)' }}>Giá 3</th>
            <th style={{ background: 'var(--ds-color-bg-elevated)', padding: '3px 6px', textAlign: 'right', borderRight: '1px solid var(--ds-color-border-subtle)', minWidth: 58, color: 'var(--ds-color-blue-500)' }}>KL 3</th>
            <th style={{ background: 'var(--ds-color-bg-elevated)', padding: '3px 6px', textAlign: 'right', borderRight: '1px solid var(--ds-color-border-subtle)', minWidth: 46, color: 'var(--ds-color-blue-500)' }}>Giá 2</th>
            <th style={{ background: 'var(--ds-color-bg-elevated)', padding: '3px 6px', textAlign: 'right', borderRight: '1px solid var(--ds-color-border-subtle)', minWidth: 58, color: 'var(--ds-color-blue-500)' }}>KL 2</th>
            <th style={{ background: 'var(--ds-color-bg-elevated)', padding: '3px 6px', textAlign: 'right', borderRight: '1px solid var(--ds-color-border-subtle)', minWidth: 46, color: 'var(--ds-color-blue-500)' }}>Giá 1</th>
            <th style={{ background: 'var(--ds-color-bg-elevated)', padding: '3px 6px', textAlign: 'right', borderRight: '2px solid var(--ds-color-border-default)', minWidth: 58, color: 'var(--ds-color-blue-500)' }}>KL 1</th>
            <th style={{ padding: '3px 6px', textAlign: 'right', borderRight: '1px solid var(--ds-color-border-subtle)', minWidth: 46 }}>Giá</th>
            <th style={{ padding: '3px 6px', textAlign: 'right', borderRight: '1px solid var(--ds-color-border-subtle)', minWidth: 64 }}>KL</th>
            <th style={{ padding: '3px 6px', textAlign: 'right', borderRight: '1px solid var(--ds-color-border-subtle)', minWidth: 54 }}>%</th>
            <th style={{ padding: '3px 6px', textAlign: 'right', borderRight: '1px solid var(--ds-color-border-subtle)', minWidth: 46 }}>↕</th>
            <th style={{ padding: '3px 6px', textAlign: 'right', borderRight: '2px solid var(--ds-color-border-default)', minWidth: 74 }}>KLGD</th>
            <th style={{ background: 'var(--ds-color-bg-elevated)', padding: '3px 6px', textAlign: 'right', borderRight: '1px solid var(--ds-color-border-subtle)', minWidth: 46, color: 'var(--ds-color-red-400)' }}>Giá 1</th>
            <th style={{ background: 'var(--ds-color-bg-elevated)', padding: '3px 6px', textAlign: 'right', borderRight: '1px solid var(--ds-color-border-subtle)', minWidth: 58, color: 'var(--ds-color-red-400)' }}>KL 1</th>
            <th style={{ background: 'var(--ds-color-bg-elevated)', padding: '3px 6px', textAlign: 'right', borderRight: '1px solid var(--ds-color-border-subtle)', minWidth: 46, color: 'var(--ds-color-red-400)' }}>Giá 2</th>
            <th style={{ background: 'var(--ds-color-bg-elevated)', padding: '3px 6px', textAlign: 'right', borderRight: '1px solid var(--ds-color-border-subtle)', minWidth: 58, color: 'var(--ds-color-red-400)' }}>KL 2</th>
            <th style={{ background: 'var(--ds-color-bg-elevated)', padding: '3px 6px', textAlign: 'right', borderRight: '1px solid var(--ds-color-border-subtle)', minWidth: 46, color: 'var(--ds-color-red-400)' }}>Giá 3</th>
            <th style={{ background: 'var(--ds-color-bg-elevated)', padding: '3px 6px', textAlign: 'right', borderRight: '2px solid var(--ds-color-border-default)', minWidth: 58, color: 'var(--ds-color-red-400)' }}>KL 3</th>
            <th style={{ padding: '3px 6px', textAlign: 'right', borderRight: '1px solid var(--ds-color-border-subtle)', minWidth: 74, color: 'var(--ds-color-purple-400)' }}>Mua</th>
            <th style={{ padding: '3px 6px', textAlign: 'right', borderRight: '1px solid var(--ds-color-border-subtle)', minWidth: 74, color: 'var(--ds-color-purple-400)' }}>Bán</th>
            <th style={{ padding: '3px 6px', textAlign: 'right', borderRight: '1px solid var(--ds-color-border-subtle)', minWidth: 74, color: 'var(--ds-color-purple-400)' }}>↕</th>
            <th style={{ padding: '3px 6px', textAlign: 'right', borderRight: '2px solid var(--ds-color-border-default)', minWidth: 90, color: 'var(--ds-color-purple-400)' }}>Room</th>
          </tr>
        </thead>
        <tbody>
          {topSpacerHeight > 0 && (
            <tr aria-hidden="true" style={{ height: topSpacerHeight }}>
              <td colSpan={30} style={{ padding: 0, border: 'none' }} />
            </tr>
          )}
          {visibleRows.map((s) => (
            <StockTableRow key={s.sym} s={s} th={th} />
          ))}
          {bottomSpacerHeight > 0 && (
            <tr aria-hidden="true" style={{ height: bottomSpacerHeight }}>
              <td colSpan={30} style={{ padding: 0, border: 'none' }} />
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

const StockTable = memo(StockTableInner)
export default StockTable
