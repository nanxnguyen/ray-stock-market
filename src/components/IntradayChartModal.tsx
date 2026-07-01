import type { ThemeTokens, ChartView } from '../types/priceboard'

type Props = { chart: ChartView; th: ThemeTokens; onClose: () => void }

export default function IntradayChartModal({ chart, th, onClose }: Props) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: th.navBg, border: `1px solid ${th.navBorder}`, borderRadius: 10, width: 680, maxWidth: '96vw', padding: 0, overflow: 'hidden', animation: 'fadeIn .18s ease', boxShadow: '0 24px 60px rgba(0,0,0,.4)' }}>
        {/* Modal header */}
        <div style={{ background: '#0d1624', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 17, fontWeight: 700, color: '#60a5fa' }}>{chart.sym}</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: chart.lc }}>{chart.lp}</span>
            <span style={{ fontSize: 13, color: chart.lc, fontWeight: 600 }}>{chart.chg}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {chart.ranges.map((rng) => (
              <button
                key={rng.label}
                onClick={rng.onClick}
                style={{ background: rng.bg, color: rng.fg, border: 'none', borderRadius: 4, padding: '3px 9px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
              >
                {rng.label}
              </button>
            ))}
            <button onClick={onClose} style={{ background: '#334155', color: '#94a3b8', border: 'none', borderRadius: 4, width: 26, height: 26, cursor: 'pointer', fontSize: 14, marginLeft: 4 }}>✕</button>
          </div>
        </div>
        {/* Chart area */}
        <div style={{ padding: '16px 16px 8px' }}>
          <div style={{ position: 'relative', height: 180 }}>
            <svg viewBox="0 0 640 160" preserveAspectRatio="none" style={{ width: '100%', height: 160, display: 'block' }}>
              <line x1="0" y1="32" x2="640" y2="32" stroke={th.cellBorderL} strokeWidth={1} />
              <line x1="0" y1="64" x2="640" y2="64" stroke={th.cellBorderL} strokeWidth={1} />
              <line x1="0" y1="96" x2="640" y2="96" stroke={th.cellBorderL} strokeWidth={1} />
              <line x1="0" y1="128" x2="640" y2="128" stroke={th.cellBorderL} strokeWidth={1} />
              <line x1="0" y1={chart.refY} x2="640" y2={chart.refY} stroke="#facc15" strokeWidth={1} strokeDasharray="4,3" />
              <path d={chart.fillPath} fill={chart.lc} opacity={0.12} />
              <polyline points={chart.linePts} fill="none" stroke={chart.lc} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            </svg>
            <div style={{ position: 'absolute', top: 0, right: 0, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '0 4px' }}>
              {chart.yLabels.map((yl, i) => (
                <span key={i} style={{ fontSize: 9, color: '#64748b', fontVariantNumeric: 'tabular-nums' }}>{yl}</span>
              ))}
            </div>
          </div>
          <div style={{ height: 40, marginTop: 4 }}>
            <svg viewBox="0 0 640 40" preserveAspectRatio="none" style={{ width: '100%', height: 40, display: 'block' }}>
              {chart.vbars.map((vb, i) => (
                <rect key={i} x={vb.x} y={vb.y} width={vb.w} height={vb.h} fill={vb.c} opacity={0.7} rx={1} />
              ))}
            </svg>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0 8px' }}>
            <span style={{ fontSize: 9, color: '#64748b' }}>09:00</span>
            <span style={{ fontSize: 9, color: '#64748b' }}>10:00</span>
            <span style={{ fontSize: 9, color: '#64748b' }}>11:00</span>
            <span style={{ fontSize: 9, color: '#64748b' }}>13:30</span>
            <span style={{ fontSize: 9, color: '#64748b' }}>14:30</span>
            <span style={{ fontSize: 9, color: '#64748b' }}>15:00</span>
          </div>
        </div>
        {/* Stats row */}
        <div style={{ display: 'flex', borderTop: `1px solid ${th.navBorder}`, padding: '10px 16px', gap: 0 }}>
          {chart.stats.map((st, i) => (
            <div key={i} style={{ flex: 1, borderRight: i < chart.stats.length - 1 ? `1px solid ${th.cellBorderL}` : 'none', padding: '0 8px', textAlign: 'center' }}>
              <div style={{ fontSize: 9, color: '#64748b', marginBottom: 2 }}>{st.label}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: st.color, fontVariantNumeric: 'tabular-nums' }}>{st.val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
