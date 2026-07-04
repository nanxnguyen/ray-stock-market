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
          background: 'var(--ds-color-bg-app)', border: '1px solid var(--ds-color-border-default)', borderRadius: 12,
          width: 700, maxWidth: '96vw', overflow: 'hidden',
          animation: 'fadeUp .18s ease',
          boxShadow: '0 32px 80px rgba(0,0,0,.6), 0 0 40px rgba(37,99,235,.1)',
        }}
      >
        {/* Modal header */}
        <div style={{
          background: 'linear-gradient(90deg, var(--ds-color-bg-app), var(--ds-color-bg-nav))',
          padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderBottom: '1px solid var(--ds-color-border-default)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: 'var(--ds-color-surface-elevated)', borderRadius: 6, padding: '3px 8px' }}>
              <span style={{
                fontSize: 14, fontWeight: 800, color: 'var(--ds-color-blue-400)',
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
                  e.currentTarget.style.color = 'var(--ds-color-neutral-200)'
                  e.currentTarget.style.background = 'var(--ds-color-surface-hover)'
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
            <div style={{ width: 1, height: 20, background: 'var(--ds-color-border-default)', margin: '0 4px' }} />
            <button
              onClick={onClose}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--ds-color-neutral-200)'
                e.currentTarget.style.background = 'var(--ds-color-surface-hover)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--ds-color-text-muted)'
                e.currentTarget.style.background = 'var(--ds-color-border-subtle)'
              }}
              style={{
                background: 'var(--ds-color-border-subtle)', color: 'var(--ds-color-text-muted)',
                border: '1px solid var(--ds-color-border-default)', borderRadius: 6,
                width: 28, height: 28, cursor: 'pointer', fontSize: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {'\u2715'}
            </button>
          </div>
        </div>

        {/* Chart body */}
        <div style={{ padding: '16px 18px 10px', background: 'var(--ds-color-bg-table)' }}>
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
              <line x1="0" y1="40" x2="640" y2="40" stroke="var(--ds-color-border-subtle)" strokeWidth={1} />
              <line x1="0" y1="80" x2="640" y2="80" stroke="var(--ds-color-border-subtle)" strokeWidth={1} />
              <line x1="0" y1="120" x2="640" y2="120" stroke="var(--ds-color-border-subtle)" strokeWidth={1} />
              {/* Vertical grid lines */}
              <line x1="160" y1="0" x2="160" y2="160" stroke="var(--ds-color-border-subtle)" strokeWidth={1} />
              <line x1="320" y1="0" x2="320" y2="160" stroke="var(--ds-color-border-subtle)" strokeWidth={1} />
              <line x1="480" y1="0" x2="480" y2="160" stroke="var(--ds-color-border-subtle)" strokeWidth={1} />
              {/* Reference line */}
              <line x1="0" y1={chart.refY} x2="640" y2={chart.refY} stroke="var(--ds-color-yellow-400)" strokeWidth={1} strokeDasharray="5,4" opacity={0.7} />
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
                  fontSize: 9, color: 'var(--ds-color-label-dim)',
                  fontFamily: "'JetBrains Mono', monospace",
                }}>{yl}</span>
              ))}
            </div>
          </div>

          {/* Volume bars */}
          <div style={{
            height: 44, marginTop: 4,
            borderTop: '1px solid var(--ds-color-border-subtle)', paddingTop: 4,
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
            padding: '3px 0 2px', borderTop: '1px solid var(--ds-color-border-subtle)',
          }}>
            <span style={{ fontSize: 9, color: 'var(--ds-color-label-dim)', fontFamily: "'JetBrains Mono', monospace" }}>09:00</span>
            <span style={{ fontSize: 9, color: 'var(--ds-color-label-dim)', fontFamily: "'JetBrains Mono', monospace" }}>10:30</span>
            <span style={{ fontSize: 9, color: 'var(--ds-color-label-dim)', fontFamily: "'JetBrains Mono', monospace" }}>11:30</span>
            <span style={{ fontSize: 9, color: 'var(--ds-color-label-dim)', fontFamily: "'JetBrains Mono', monospace" }}>13:30</span>
            <span style={{ fontSize: 9, color: 'var(--ds-color-label-dim)', fontFamily: "'JetBrains Mono', monospace" }}>14:30</span>
            <span style={{ fontSize: 9, color: 'var(--ds-color-label-dim)', fontFamily: "'JetBrains Mono', monospace" }}>15:00</span>
          </div>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)',
          borderTop: '1px solid var(--ds-color-border-default)', background: 'var(--ds-color-bg-app)',
        }}>
          {chart.stats.map((st, i) => (
            <div key={i} style={{
              padding: '10px 12px',
              borderRight: i < chart.stats.length - 1 ? '1px solid var(--ds-color-border-subtle)' : 'none',
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: 9, color: 'var(--ds-color-label-muted)', marginBottom: 3,
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
        <div style={{ display: 'flex', gap: 8, padding: '12px 18px', background: 'var(--ds-color-bg-table)', borderTop: '1px solid var(--ds-color-border-default)' }}>
          <a href="#" style={{ flex: 1, textDecoration: 'none', textAlign: 'center', background: 'var(--ds-color-border-subtle)', border: '1px solid var(--ds-color-border-default)', color: 'var(--ds-color-neutral-300)', borderRadius: 6, padding: 9, fontSize: 11, fontWeight: 700 }}>{'\u{1F4C4}'} Thông tin CP</a>
          <a href="#" style={{ flex: 1, textDecoration: 'none', textAlign: 'center', background: 'var(--ds-color-border-subtle)', border: '1px solid var(--ds-color-border-default)', color: 'var(--ds-color-neutral-300)', borderRadius: 6, padding: 9, fontSize: 11, fontWeight: 700 }}>{'\u{1F4D6}'} Sổ lệnh</a>
          <a href="#" style={{ flex: 1.3, textDecoration: 'none', textAlign: 'center', background: 'var(--ds-color-market-up)', border: '1px solid var(--ds-color-green-600)', color: 'var(--ds-color-text-inverse)', borderRadius: 6, padding: 9, fontSize: 11, fontWeight: 800 }}>{'\u2713'} Đặt lệnh {chart.sym}</a>
        </div>
      </div>
    </div>
  )
}
