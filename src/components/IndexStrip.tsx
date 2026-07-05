import { memo } from 'react'
import type { ThemeTokens, MarketIndexView } from '../types/priceboard'
import GlobalMarketsPanel from './GlobalMarketsPanel'

type Props = { indices: MarketIndexView[]; th: ThemeTokens }

function IndexStripInner({ indices, th }: Props) {
  return (
    <div className="flex shrink-0 h-[158px] overflow-hidden" style={{ background: th.navBg, borderBottom: `1px solid ${th.navBorder}` }}>
      <div className="flex flex-1 min-w-0 overflow-hidden">
        {indices.map((idx) => (
          <div
            key={idx.name}
            onClick={idx.onClick}
            onMouseEnter={(e) => { e.currentTarget.style.background = th.rowHover }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '' }}
            className="flex-1 py-2 px-[10px] border-r border-line flex flex-col gap-[1px] min-w-[160px] overflow-hidden cursor-pointer relative"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] opacity-80" style={{ background: idx.color }} />
            <div className="flex items-center gap-[5px]">
              <span className="text-[11px] font-bold text-txt-secondary">{idx.name}</span>
              {idx.statusBg && (
                <span
                  className="text-[8px] font-bold text-white rounded px-[5px] py-px tracking-[0.3px]"
                  style={{ background: idx.statusBg }}
                >LIVE</span>
              )}
            </div>
            <div className="text-xl font-bold font-mono tabular-nums leading-[1.15]" style={{ color: idx.color }}>{idx.val}</div>
            <div className="text-[10px] font-semibold" style={{ color: idx.color }}>{idx.chg}</div>
            <div className="text-[9px] text-txt-muted">KL: {idx.vol}</div>
            <div className="flex gap-[5px] text-[9px] font-bold mt-px">
              <span className="text-green-500">▲{idx.up}</span>
              <span className="text-red-400">▼{idx.dn}</span>
              <span className="text-txt-secondary">──{idx.nc}</span>
            </div>
            <svg viewBox="0 0 100 22" preserveAspectRatio="none" className="w-full h-5 block mt-[2px]">
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
