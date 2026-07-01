import type { ThemeTokens, StockRow } from '../types/priceboard'

type Props = { rows: StockRow[]; th: ThemeTokens }

export default function GridView({ rows, th }: Props) {
  return (
    <div style={{ flex: 1, overflow: 'auto', background: th.tableBg, padding: 14 }}>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: 10, width: '100%',
      }}>
        {rows.map((s) => (
          <div
            key={s.sym}
            onClick={s.onChart}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#2563eb'
              e.currentTarget.style.background = th.rowHover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = th.cellBorder
              e.currentTarget.style.background = s.bg
            }}
            style={{
              background: s.bg, border: `1px solid ${th.cellBorder}`, borderRadius: 8,
              padding: '10px 12px', cursor: 'pointer', transition: 'all .4s',
              position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: s.lc, opacity: 0.7 }} />
            <div style={{ fontSize: 12, fontWeight: 800, color: '#60a5fa', fontFamily: "'Inter', sans-serif", letterSpacing: 0.4, marginBottom: 4 }}>
              {s.sym}
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, color: s.lc, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.1 }}>
              {s.lp}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 3 }}>
              <span style={{
                fontSize: 10, fontWeight: 700, color: s.pc,
                background: s.pct.startsWith('+') ? 'rgba(34,197,94,.15)' : s.pct.startsWith('-') ? 'rgba(244,63,94,.15)' : 'rgba(251,191,36,.15)',
                padding: '1px 5px', borderRadius: 4,
              }}>
                {s.pct}
              </span>
              <span style={{ fontSize: 9, color: th.textMuted }}>{s.chg}</span>
            </div>
            <div style={{ fontSize: 9, color: th.textMuted, marginTop: 4 }}>KL: {s.tvol}</div>
            {s.sparkPts && (
              <svg viewBox="0 0 100 24" preserveAspectRatio="none" style={{ width: '100%', height: 22, marginTop: 5, display: 'block' }}>
                <path d={s.sparkFill} fill={s.lc} opacity={0.12} />
                <polyline points={s.sparkPts} fill="none" stroke={s.lc} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
