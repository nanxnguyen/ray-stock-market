import { memo } from 'react'
import type { ThemeTokens, MarketIndexView } from '../types/priceboard'
import GlobalMarketsPanel from './GlobalMarketsPanel'

type Props = { indices: MarketIndexView[]; th: ThemeTokens }

function IndexStripInner({ indices, th }: Props) {
  return (
    <div style={{ background: th.navBg, borderBottom: `1px solid ${th.navBorder}`, display: 'flex', flexShrink: 0, height: 158, overflow: 'hidden' }}>
      <div style={{ display: 'flex', flex: 1, minWidth: 0, overflow: 'hidden' }}>
        {indices.map((idx) => (
          <div
            key={idx.name}
            onClick={idx.onClick}
            onMouseEnter={(e) => { e.currentTarget.style.background = th.rowHover }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '' }}
            style={{ flex: 1, padding: '8px 10px', borderRight: `1px solid ${th.idxColBorder}`, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 160, overflow: 'hidden', cursor: 'pointer', position: 'relative' }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: idx.color, opacity: 0.8 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: th.idxTitle }}>{idx.name}</span>
              {idx.statusBg && (
                <span style={{
                  fontSize: 8, fontWeight: 700, color: '#fff', background: idx.statusBg,
                  borderRadius: 4, padding: '1px 5px', letterSpacing: 0.3,
                }}>LIVE</span>
              )}
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: idx.color, fontFamily: "'JetBrains Mono', monospace", fontVariantNumeric: 'tabular-nums', lineHeight: 1.15 }}>{idx.val}</div>
            <div style={{ fontSize: 10, color: idx.color, fontWeight: 600 }}>{idx.chg}</div>
            <div style={{ fontSize: 9, color: 'var(--ds-color-text-muted)' }}>KL: {idx.vol}</div>
            <div style={{ display: 'flex', gap: 5, fontSize: 9, fontWeight: 700, marginTop: 1 }}>
              <span style={{ color: 'var(--ds-color-green-400)' }}>▲{idx.up}</span>
              <span style={{ color: 'var(--ds-color-red-400)' }}>▼{idx.dn}</span>
              <span style={{ color: 'var(--ds-color-text-secondary)' }}>──{idx.nc}</span>
            </div>
            <svg viewBox="0 0 100 22" preserveAspectRatio="none" style={{ width: '100%', height: 20, display: 'block', marginTop: 2 }}>
              <defs>
                <linearGradient id={idx.gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={idx.color} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={idx.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <path d={idx.fill} fill={`url(#${idx.gradId})`} />
              <polyline points={idx.pts} fill="none" stroke={idx.color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
            </svg>
          </div>
        ))}
      </div>
      <GlobalMarketsPanel th={th} />
    </div>
  )
}

const IndexStrip = memo(IndexStripInner)
export default IndexStrip
