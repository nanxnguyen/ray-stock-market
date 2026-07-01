import type { ThemeTokens, MarketIndexView } from '../types/priceboard'

type Props = { indices: MarketIndexView[]; th: ThemeTokens }

const GLOBALS = [
  { name: 'DOW', v: 52342.83, pct: 0.31 },
  { name: 'S&P 500', v: 5862.13, pct: 0.25 },
  { name: 'Nasdaq', v: 26169.95, pct: 1.35 },
  { name: 'Russell', v: 3026.97, pct: 0.55 },
  { name: 'Global DOW', v: 6829.34, pct: 0.32 },
]

export default function IndexStrip({ indices, th }: Props) {
  return (
    <div style={{ background: th.navBg, borderBottom: `1px solid ${th.navBorder}`, display: 'flex', flexShrink: 0, height: 152, overflow: 'hidden' }}>
      <div style={{ display: 'flex', flex: 1, minWidth: 0, overflow: 'hidden' }}>
        {indices.map((idx) => (
          <div key={idx.name} style={{ flex: 1, padding: '8px 10px', borderRight: `1px solid ${th.idxColBorder}`, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 160, overflow: 'hidden' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: th.idxTitle }}>{idx.name}</div>
            <div style={{ fontSize: 9, color: '#64748b' }}>• Thời gian thực</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: idx.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1.15 }}>{idx.val}</div>
            <div style={{ fontSize: 10, color: idx.color, fontWeight: 600 }}>{idx.chg}</div>
            <div style={{ fontSize: 9, color: '#64748b' }}>KL: {idx.vol}</div>
            <div style={{ display: 'flex', gap: 5, fontSize: 9, fontWeight: 700, marginTop: 1 }}>
              <span style={{ color: '#4ade80' }}>▲{idx.up}</span>
              <span style={{ color: '#f87171' }}>▼{idx.dn}</span>
              <span style={{ color: '#94a3b8' }}>──{idx.nc}</span>
            </div>
            <svg viewBox="0 0 100 22" preserveAspectRatio="none" style={{ width: '100%', height: 20, display: 'block', marginTop: 2 }}>
              <path d={idx.fill} fill={idx.color} opacity={0.15} />
              <polyline points={idx.pts} fill="none" stroke={idx.color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
            </svg>
          </div>
        ))}
      </div>
      <div style={{ width: 200, borderLeft: `1px solid ${th.idxColBorder}`, padding: '8px 10px', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 0, marginBottom: 5, borderBottom: `1px solid ${th.idxColBorder}`, paddingBottom: 4 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#2563eb', borderBottom: '2px solid #2563eb', paddingBottom: 2, paddingRight: 6, cursor: 'pointer' }}>Mỹ</span>
          <span style={{ fontSize: 10, color: '#64748b', padding: '0 6px', cursor: 'pointer' }}>Châu Âu</span>
          <span style={{ fontSize: 10, color: '#64748b', padding: '0 6px', cursor: 'pointer' }}>Châu Á</span>
          <span style={{ fontSize: 10, color: '#64748b', cursor: 'pointer' }}>Hàng hoá</span>
        </div>
        {GLOBALS.map((g) => {
          const color = g.pct >= 0 ? '#4ade80' : '#f87171'
          return (
            <div key={g.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 0', borderBottom: `1px solid ${th.glItemBorder}` }}>
              <span style={{ fontSize: 11, color: th.glNameColor, fontWeight: 500 }}>{g.name}</span>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color, fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
                  {g.v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div style={{ fontSize: 9, color, fontWeight: 500 }}>{g.pct >= 0 ? '+' : ''}{g.pct.toFixed(2)}%</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
