import type { ChartView } from '../types/priceboard'

type Props = { chart: ChartView; onClose: () => void }

export default function IntradayChartModal({ chart, onClose }: Props) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,.65)', zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#080f1c', border: '1px solid #1a3050', borderRadius: 12,
          width: 700, maxWidth: '96vw', overflow: 'hidden',
          animation: 'fadeUp .18s ease',
          boxShadow: '0 32px 80px rgba(0,0,0,.6), 0 0 40px rgba(37,99,235,.1)',
        }}
      >
        {/* Modal header */}
        <div style={{
          background: 'linear-gradient(90deg, #060c18, #0b1628)',
          padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderBottom: '1px solid #1a3050',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: '#1e3a5f', borderRadius: 6, padding: '3px 8px' }}>
              <span style={{
                fontSize: 14, fontWeight: 800, color: '#60a5fa',
                fontFamily: "'Inter', sans-serif", letterSpacing: 0.5,
              }}>
                {chart.sym}
              </span>
            </div>
            <span style={{
              fontSize: 22, fontWeight: 800, color: chart.lc,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {chart.lp}
            </span>
            <span style={{
              fontSize: 12, color: chart.lc, fontWeight: 600,
              background: chart.chgBg, padding: '2px 8px', borderRadius: 5,
            }}>
              {chart.chg}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            {chart.ranges.map((rng) => (
              <button
                key={rng.label}
                onClick={rng.onClick}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#e2e8f0'
                  e.currentTarget.style.background = '#1a2d45'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = rng.fg
                  e.currentTarget.style.background = rng.bg
                }}
                style={{
                  background: rng.bg, color: rng.fg,
                  border: `1px solid ${rng.border}`, borderRadius: 5,
                  padding: '4px 10px', fontSize: 11, fontWeight: 700,
                  cursor: 'pointer', letterSpacing: 0.3, transition: 'all .15s',
                }}
              >
                {rng.label}
              </button>
            ))}
            <div style={{ width: 1, height: 20, background: '#1a3050', margin: '0 4px' }} />
            <button
              onClick={onClose}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#e2e8f0'
                e.currentTarget.style.background = '#1a2d45'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#64748b'
                e.currentTarget.style.background = '#0f1e36'
              }}
              style={{
                background: '#0f1e36', color: '#64748b',
                border: '1px solid #1a3050', borderRadius: 6,
                width: 28, height: 28, cursor: 'pointer', fontSize: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {'\u2715'}
            </button>
          </div>
        </div>

        {/* Chart body */}
        <div style={{ padding: '16px 18px 10px', background: '#060c18' }}>
          {/* Price chart */}
          <div style={{ position: 'relative', height: 186 }}>
            <svg viewBox="0 0 640 160" preserveAspectRatio="none" style={{ width: '100%', height: 160, display: 'block' }}>
              <defs>
                <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chart.lc} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={chart.lc} stopOpacity={0} />
                </linearGradient>
              </defs>
              {/* Horizontal grid lines */}
              <line x1="0" y1="40" x2="640" y2="40" stroke="#0f1e36" strokeWidth={1} />
              <line x1="0" y1="80" x2="640" y2="80" stroke="#0f1e36" strokeWidth={1} />
              <line x1="0" y1="120" x2="640" y2="120" stroke="#0f1e36" strokeWidth={1} />
              {/* Vertical grid lines */}
              <line x1="160" y1="0" x2="160" y2="160" stroke="#0d1a2e" strokeWidth={1} />
              <line x1="320" y1="0" x2="320" y2="160" stroke="#0d1a2e" strokeWidth={1} />
              <line x1="480" y1="0" x2="480" y2="160" stroke="#0d1a2e" strokeWidth={1} />
              {/* Reference line */}
              <line x1="0" y1={chart.refY} x2="640" y2={chart.refY} stroke="#fbbf24" strokeWidth={1} strokeDasharray="5,4" opacity={0.7} />
              {/* Area fill */}
              <path d={chart.fillPath} fill="url(#chartFill)" />
              {/* Price line */}
              <polyline points={chart.linePts} fill="none" stroke={chart.lc} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            </svg>
            {/* Y-axis labels */}
            <div style={{
              position: 'absolute', top: 0, right: 6, height: 160,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              pointerEvents: 'none',
            }}>
              {chart.yLabels.map((yl, i) => (
                <span key={i} style={{
                  fontSize: 9, color: '#2a4a6a',
                  fontFamily: "'JetBrains Mono', monospace",
                }}>{yl}</span>
              ))}
            </div>
          </div>

          {/* Volume bars */}
          <div style={{
            height: 44, marginTop: 4,
            borderTop: '1px solid #0f1e36', paddingTop: 4,
          }}>
            <svg viewBox="0 0 640 36" preserveAspectRatio="none" style={{ width: '100%', height: 36, display: 'block' }}>
              {chart.vbars.map((vb, i) => (
                <rect key={i} x={vb.x} y={vb.y} width={vb.w} height={vb.h} fill={vb.c} opacity={0.6} rx={1} />
              ))}
            </svg>
          </div>

          {/* Time axis */}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            padding: '3px 0 2px', borderTop: '1px solid #0f1e36',
          }}>
            <span style={{ fontSize: 9, color: '#2a4a6a', fontFamily: "'JetBrains Mono', monospace" }}>09:00</span>
            <span style={{ fontSize: 9, color: '#2a4a6a', fontFamily: "'JetBrains Mono', monospace" }}>10:30</span>
            <span style={{ fontSize: 9, color: '#2a4a6a', fontFamily: "'JetBrains Mono', monospace" }}>11:30</span>
            <span style={{ fontSize: 9, color: '#2a4a6a', fontFamily: "'JetBrains Mono', monospace" }}>13:30</span>
            <span style={{ fontSize: 9, color: '#2a4a6a', fontFamily: "'JetBrains Mono', monospace" }}>14:30</span>
            <span style={{ fontSize: 9, color: '#2a4a6a', fontFamily: "'JetBrains Mono', monospace" }}>15:00</span>
          </div>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)',
          borderTop: '1px solid #1a3050', background: '#080f1c',
        }}>
          {chart.stats.map((st, i) => (
            <div key={i} style={{
              padding: '10px 12px',
              borderRight: i < chart.stats.length - 1 ? '1px solid #0f1e36' : 'none',
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: 9, color: '#3a5570', marginBottom: 3,
                letterSpacing: 0.4, textTransform: 'uppercase' as const,
                fontFamily: "'Inter', sans-serif",
              }}>{st.label}</div>
              <div style={{
                fontSize: 12, fontWeight: 700, color: st.color,
                fontFamily: "'JetBrains Mono', monospace",
              }}>{st.val}</div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8, padding: '12px 18px', background: '#060c18', borderTop: '1px solid #1a3050' }}>
          <a href="#" style={{ flex: 1, textDecoration: 'none', textAlign: 'center', background: '#0f1e36', border: '1px solid #1a3050', color: '#cbd5e1', borderRadius: 6, padding: 9, fontSize: 11, fontWeight: 700 }}>{'\u{1F4C4}'} Thông tin CP</a>
          <a href="#" style={{ flex: 1, textDecoration: 'none', textAlign: 'center', background: '#0f1e36', border: '1px solid #1a3050', color: '#cbd5e1', borderRadius: 6, padding: 9, fontSize: 11, fontWeight: 700 }}>{'\u{1F4D6}'} Sổ lệnh</a>
          <a href="#" style={{ flex: 1.3, textDecoration: 'none', textAlign: 'center', background: '#22c55e', border: '1px solid #16a34a', color: '#fff', borderRadius: 6, padding: 9, fontSize: 11, fontWeight: 800 }}>{'\u2713'} Đặt lệnh {chart.sym}</a>
        </div>
      </div>
    </div>
  )
}
