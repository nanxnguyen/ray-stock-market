import type { ThemeTokens } from '../types/priceboard'

type Props = { th: ThemeTokens; timeStr: string; toggleDark: () => void }

export default function TopBar({ th, timeStr, toggleDark }: Props) {
  return (
    <div style={{ background: '#0d1624', display: 'flex', alignItems: 'center', padding: '0 14px', height: 38, flexShrink: 0, gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0, marginRight: 6 }}>
        <svg width="18" height="16" viewBox="0 0 18 16"><polygon points="9,0 18,16 0,16" fill="#22c55e" /></svg>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: '.3px' }}>Ray Market</span>
      </div>
      <span style={{ color: '#64748b', fontSize: 11, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>{timeStr}</span>
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
        <span style={{ position: 'absolute', whiteSpace: 'nowrap', animation: 'mq 28s linear infinite', color: '#fbbf24', fontSize: 11, fontWeight: 500 }}>
          ⚡ Thêm Chặn Lũ Cùng Ray Market &nbsp;|&nbsp; 📊 VN-Index 1,860 điểm &nbsp;|&nbsp; 📈 ACB dẫn đầu thanh khoản &nbsp;|&nbsp; 🌐 DOW Jones +0.31% &nbsp;|&nbsp; ⚡ Thêm Chặn Lũ Cùng Ray Market
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <div onClick={toggleDark} style={{ cursor: 'pointer', width: 44, height: 24, borderRadius: 12, background: th.toggleBg, position: 'relative', flexShrink: 0, transition: 'background .3s' }} title={th.toggleTitle}>
          <div style={{ position: 'absolute', width: 20, height: 20, borderRadius: '50%', background: '#ffffff', top: 2, left: th.togglePos, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, transition: 'left .25s' }}>{th.toggleIcon}</div>
        </div>
      </div>
    </div>
  )
}
