import type { ThemeTokens } from '../types/priceboard'

type Props = { th: ThemeTokens; timeStr: string; toggleDark: () => void }

export default function TopBar({ th, timeStr, toggleDark }: Props) {
  return (
    <div style={{
      background: 'linear-gradient(90deg, #060c18 0%, #0b1628 60%, #060c18 100%)',
      display: 'flex', alignItems: 'center', padding: '0 16px', height: 42,
      flexShrink: 0, gap: 10, borderBottom: '1px solid #0f1e36',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0, marginRight: 4 }}>
        <div style={{
          width: 26, height: 26, background: 'linear-gradient(135deg, #22c55e, #16a34a)',
          borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="14" height="12" viewBox="0 0 14 12">
            <polygon points="7,0 14,12 0,12" fill="#fff" />
          </svg>
        </div>
        <span style={{
          fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: 0.4,
          fontFamily: "'Inter', sans-serif",
        }}>
          Ray <span style={{ color: '#22c55e' }}>Stock Market</span>
        </span>
      </div>

      {/* Market status */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 5,
        background: '#0f1e36', borderRadius: 20, padding: '3px 10px', flexShrink: 0,
      }}>
        <div style={{
          width: 6, height: 6, borderRadius: '50%', background: '#22c55e',
          animation: 'pulse 2s infinite',
        }} />
        <span style={{
          fontSize: 10, fontWeight: 600, color: '#22c55e', letterSpacing: 0.3,
        }}>
          ĐANG GIAO DỊCH
        </span>
      </div>

      {/* Clock */}
      <span style={{
        color: '#4a6080', fontSize: 11, flexShrink: 0,
        fontFamily: "'JetBrains Mono', monospace", fontWeight: 500, letterSpacing: 0.5,
      }}>
        {timeStr}
      </span>

      {/* Ticker tape */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', height: '100%', display: 'flex', alignItems: 'center', minWidth: 0 }}>
        <div style={{ position: 'absolute', inset: 0, left: 0, width: 40, background: 'linear-gradient(90deg, #060c18, transparent)', zIndex: 1, pointerEvents: 'none' }} />
        <span style={{
          position: 'absolute', whiteSpace: 'nowrap',
          animation: 'ticker 34s linear infinite',
          color: '#94a3b8', fontSize: 10.5, fontWeight: 500,
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          <span style={{ color: '#fbbf24' }}>VN-Index</span> <span style={{ color: '#4ade80' }}>{'\u25B2'}1,860.01 +5.04</span> {'\u2502'}
          <span style={{ color: '#fbbf24' }}>VN30</span> <span style={{ color: '#4ade80' }}>{'\u25B2'}1,995.71 +5.06</span> {'\u2502'}
          <span style={{ color: '#fbbf24' }}>ACB</span> <span style={{ color: '#f87171' }}>{'\u25BC'}22.65 -0.25</span> {'\u2502'}
          <span style={{ color: '#fbbf24' }}>HPG</span> <span style={{ color: '#4ade80' }}>{'\u25B2'}24.10 +0.32</span> {'\u2502'}
          <span style={{ color: '#fbbf24' }}>VCB</span> <span style={{ color: '#4ade80' }}>{'\u25B2'}81.50 +1.13</span> {'\u2502'}
          <span style={{ color: '#fbbf24' }}>FPT</span> <span style={{ color: '#4ade80' }}>{'\u25B2'}137.50 +1.89</span> {'\u2502'}
          <span style={{ color: '#fbbf24' }}>DOW</span> <span style={{ color: '#4ade80' }}>{'\u25B2'}52,342 +0.31%</span>
        </span>
        <div style={{ position: 'absolute', inset: 0, right: 0, left: 'auto', width: 40, background: 'linear-gradient(270deg, #060c18, transparent)', zIndex: 1, pointerEvents: 'none' }} />
      </div>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <div
          onClick={toggleDark}
          title={th.toggleTitle}
          style={{
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            background: '#0f1e36', border: '1px solid #1a3050', borderRadius: 20,
            padding: '4px 10px', transition: 'all .25s',
          }}
        >
          <span style={{ fontSize: 12, lineHeight: 1 }}>{th.toggleIcon}</span>
          <span style={{ fontSize: 10, fontWeight: 600, color: '#64748b', letterSpacing: 0.3 }}>
            {th.toggleLabel}
          </span>
        </div>
      </div>
    </div>
  )
}
