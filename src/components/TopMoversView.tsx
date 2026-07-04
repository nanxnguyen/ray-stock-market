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

  const cardHoverHandlers = useMemo(() => ({
    onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => {
      e.currentTarget.style.background = th.rowHover
      e.currentTarget.style.borderColor = '#2563eb'
    },
    onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => {
      e.currentTarget.style.background = th.appBg
      e.currentTarget.style.borderColor = th.cellBorder
    },
  }), [])

  return (
    <div style={{ flex: 1, overflow: 'auto', background: th.appBg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: 14, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, flex: 1 }}>
        {/* Top gainers */}
        <div style={{ background: th.navBg, border: `1px solid ${th.cellBorder}`, borderRadius: 8, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#22c55e', letterSpacing: 0.5, textTransform: 'uppercase' }}>{'\u25B2'} Top Tăng Mạnh</div>
          {topGainers.map((tg) => (
            <div
              key={tg.sym}
              onClick={tg.onChart}
              {...cardHoverHandlers}
              style={{ background: th.appBg, border: `1px solid ${th.cellBorder}`, borderRadius: 6, padding: 8, cursor: 'pointer', transition: 'all .2s' }}
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
              {...cardHoverHandlers}
              style={{ background: th.appBg, border: `1px solid ${th.cellBorder}`, borderRadius: 6, padding: 8, cursor: 'pointer', transition: 'all .2s' }}
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
              {...cardHoverHandlers}
              style={{ background: th.appBg, border: `1px solid ${th.cellBorder}`, borderRadius: 6, padding: 8, cursor: 'pointer', transition: 'all .2s' }}
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
      </div>

      {/* Breadth indicators */}
      <div style={{ background: th.navBg, borderTop: `1px solid ${th.navBorder}`, padding: '10px 14px', display: 'flex', gap: 20, alignItems: 'center', flexShrink: 0 }}>
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
