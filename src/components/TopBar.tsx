import { useState, useEffect } from 'react'
import { memo } from 'react'
import { NavLink } from 'react-router-dom'
import type { ThemeTokens } from '../types/priceboard'

type Props = { th: ThemeTokens; toggleDark: () => void }

type MenuItem = {
  href: string
  icon: string
  iconBg: string
  label: string
  desc: string
}

type MenuGroup = {
  title: string
  color: string
  items: MenuItem[]
}

const MENU_GROUPS: MenuGroup[] = [
  {
    title: 'Phân tích',
    color: '#60a5fa',
    items: [
      { href: '/advanced-chart', icon: '\u{1F4C8}', iconBg: 'rgba(96,165,250,.15)', label: 'Chart nâng cao', desc: 'Nến, MA, RSI, MACD, Bollinger' },
      { href: '/market-heatmap', icon: '\u{1F5FA}\uFE0F', iconBg: 'rgba(192,38,211,.15)', label: 'Bản đồ nhiệt', desc: 'Treemap toàn thị trường' },
      { href: '/stock-comparison', icon: '\u{1F4CA}', iconBg: 'rgba(96,165,250,.15)', label: 'So sánh mã', desc: 'So sánh hiệu suất 2-5 mã' },
      { href: '/stock-screener', icon: '\u{1F50D}', iconBg: 'rgba(96,165,250,.15)', label: 'Screener', desc: 'Lọc theo P/E, P/B, ROE...' },
      { href: '/money-flow', icon: '\u{1F4B5}', iconBg: 'rgba(34,197,94,.15)', label: 'Dòng tiền', desc: 'NN mua/bán theo ngành' },
      { href: '/company-research', icon: '\u{1F3E2}', iconBg: 'rgba(168,85,247,.15)', label: 'Nghiên cứu DN', desc: 'BCTC & khuyến nghị CTCK' },
      { href: '/portfolio-analytics', icon: '\u{1F4D0}', iconBg: 'rgba(168,85,247,.15)', label: 'Phân tích DM', desc: 'Beta, Sharpe, Backtest' },
    ],
  },
  {
    title: 'Giao dịch',
    color: '#22c55e',
    items: [
      { href: '/trading-panel', icon: '\u{1F4B0}', iconBg: 'rgba(34,197,94,.15)', label: 'Đặt lệnh', desc: 'Bảng giá & khớp lệnh' },
      { href: '/derivatives-trading', icon: '\u{1F4C9}', iconBg: 'rgba(249,115,22,.15)', label: 'Phái sinh', desc: 'VN30F, margin, T+0' },
      { href: '/order-book', icon: '\u{1F4D6}', iconBg: 'rgba(34,197,94,.15)', label: 'Sổ lệnh', desc: 'Độ sâu thị trường' },
      { href: '/order-history', icon: '\u{1F4CB}', iconBg: 'rgba(34,197,94,.15)', label: 'Lịch sử lệnh', desc: 'Đã khớp, chờ khớp, đã hủy' },
      { href: '#', icon: '\u{1F9FE}', iconBg: 'rgba(245,158,11,.15)', label: 'Sao kê TK', desc: 'Nạp/rút, giao dịch tiền' },
      { href: '/watchlists', icon: '\u2B50', iconBg: 'rgba(245,158,11,.15)', label: 'Watchlists', desc: 'Danh mục theo dõi' },
      { href: '/alerts', icon: '\u{1F514}', iconBg: 'rgba(245,158,11,.15)', label: 'Cảnh báo giá', desc: 'Quản lý các alert đã đặt' },
    ],
  },
  {
    title: 'Thông tin & Tài khoản',
    color: '#f59e0b',
    items: [
      { href: '/portfolio', icon: '\u{1F4BC}', iconBg: 'rgba(34,197,94,.15)', label: 'Danh mục đầu tư', desc: 'NAV, phân bổ, lãi/lỗ' },
      { href: '/market-news', icon: '\u{1F4F0}', iconBg: 'rgba(168,85,247,.15)', label: 'Tin tức', desc: 'Vĩ mô, doanh nghiệp, ngành' },
      { href: '/event-calendar', icon: '\u{1F4C5}', iconBg: 'rgba(168,85,247,.15)', label: 'Lịch sự kiện', desc: 'ĐHCĐ, cổ tức, chốt quyền' },
      { href: '/account-settings', icon: '\u2699\uFE0F', iconBg: 'rgba(148,163,184,.15)', label: 'Cài đặt TK', desc: 'Hồ sơ, bảo mật, thông báo' },
      { href: '/auth', icon: '\u{1F511}', iconBg: 'rgba(148,163,184,.15)', label: 'Đăng nhập/KYC', desc: 'Đăng ký & xác thực' },
    ],
  },
]

function TopBarInner({ th, toggleDark }: Props) {
  const [timeStr, setTimeStr] = useState(() => formatTime(new Date()))
  const [showMoreTools, setShowMoreTools] = useState(false)

  useEffect(() => {
    const c = setInterval(() => setTimeStr(formatTime(new Date())), 1000)
    return () => clearInterval(c)
  }, [])

  useEffect(() => {
    if (!showMoreTools) return
    const handler = () => setShowMoreTools(false)
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [showMoreTools])

  const toolCount = MENU_GROUPS.reduce((s, g) => s + g.items.length, 0)

  return (
    <div style={{ flexShrink: 0 }}>
      {/* Main top bar */}
      <div style={{
        background: 'linear-gradient(90deg, #060c18 0%, #0b1628 60%, #060c18 100%)',
        display: 'flex', alignItems: 'center', padding: '0 16px', height: 42,
        flexShrink: 0, gap: 10, borderBottom: '1px solid #0f1e36',
      }}>
        {/* Logo */}
        <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0, marginRight: 4, textDecoration: 'none' }}>
          <div style={{
            width: 26, height: 26, background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="12" viewBox="0 0 14 12">
              <polygon points="7,0 14,12 0,12" fill="#fff" />
            </svg>
          </div>
          <span style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: 0.4, fontFamily: "'Inter', sans-serif" }}>
            Ray <span style={{ color: '#22c55e' }}>Stock Market</span>
          </span>
        </NavLink>

        {/* Clock */}
        <span style={{ color: '#4a6080', fontSize: 11, flexShrink: 0, fontFamily: "'JetBrains Mono', monospace", fontWeight: 500, letterSpacing: 0.5 }}>
          {timeStr}
        </span>

        {/* Ticker tape */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative', height: '100%', display: 'flex', alignItems: 'center', minWidth: 0 }}>
          <div style={{ position: 'absolute', inset: 0, left: 0, width: 40, background: 'linear-gradient(90deg, #060c18, transparent)', zIndex: 1, pointerEvents: 'none' }} />
          <span style={{ position: 'absolute', whiteSpace: 'nowrap', animation: 'ticker 34s linear infinite', color: '#94a3b8', fontSize: 10.5, fontWeight: 500, fontFamily: "'JetBrains Mono', monospace" }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0, position: 'relative' }}>
          {/* Quick links */}
          <NavLink to="/portfolio" title="Danh mục đầu tư" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, background: '#0f1e36', border: '1px solid #1a3050', borderRadius: 14, padding: '4px 9px', color: '#94a3b8', fontSize: 10, fontWeight: 600 }}>{'\u{1F4BC}'} Danh mục</NavLink>
          <NavLink to="/trading-panel" title="Đặt lệnh" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, background: '#0f1e36', border: '1px solid #1a3050', borderRadius: 14, padding: '4px 9px', color: '#94a3b8', fontSize: 10, fontWeight: 600 }}>{'\u{1F4B0}'} Đặt lệnh</NavLink>
          <NavLink to="/order-book" title="Sổ lệnh" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, background: '#0f1e36', border: '1px solid #1a3050', borderRadius: 14, padding: '4px 9px', color: '#94a3b8', fontSize: 10, fontWeight: 600 }}>{'\u{1F4D6}'} Sổ lệnh</NavLink>

          {/* More tools button */}
          <div
            onClick={(e) => { e.stopPropagation(); setShowMoreTools(p => !p) }}
            style={{
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
              background: showMoreTools ? '#16457a' : '#0f1e36',
              border: `1px solid ${showMoreTools ? '#2563eb' : '#1a3050'}`,
              borderRadius: 14, padding: '4px 10px 4px 9px',
              color: showMoreTools ? '#dbeafe' : '#94a3b8',
              fontSize: 10, fontWeight: 700, transition: 'all .15s',
            }}
          >
            <span style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, width: 9, height: 9 }}>
              <span style={{ background: 'currentColor', borderRadius: 1 }} /><span style={{ background: 'currentColor', borderRadius: 1 }} />
              <span style={{ background: 'currentColor', borderRadius: 1 }} /><span style={{ background: 'currentColor', borderRadius: 1 }} />
            </span>
            Công cụ
            <span style={{ fontSize: 8, transform: showMoreTools ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .15s' }}>{'\u25BE'}</span>
          </div>

          <div style={{ width: 1, height: 18, background: '#1a3050' }} />

          {/* Dark/light toggle */}
          <div
            onClick={toggleDark}
            title={th.toggleTitle}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, background: '#0f1e36', border: '1px solid #1a3050', borderRadius: 20, padding: '4px 10px', transition: 'all .25s' }}
          >
            <span style={{ fontSize: 12, lineHeight: 1 }}>{th.toggleIcon}</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: '#64748b' }}>{th.toggleLabel}</span>
          </div>

          {/* More tools dropdown */}
          {showMoreTools && (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute', top: 38, right: 0,
                background: '#0b1424', border: '1px solid #1a3050', borderRadius: 14,
                boxShadow: '0 24px 60px rgba(0,0,0,.55)', zIndex: 300,
                width: 660, maxWidth: '88vw', overflow: 'hidden',
                animation: 'fadeUp .15s ease',
              }}
            >
              <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
                {MENU_GROUPS.map((grp) => (
                  <div key={grp.title} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontSize: 9.5, fontWeight: 800, color: grp.color, textTransform: 'uppercase', letterSpacing: 0.5, padding: '0 8px 8px' }}>{grp.title}</span>
                    {grp.items.map((it) => (
                      <NavLink
                        key={it.label}
                        to={it.href}
                        onClick={() => setShowMoreTools(false)}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#131f36' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                        style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, padding: '7px 8px', borderRadius: 8, transition: 'background .12s' }}
                      >
                        <span style={{ width: 28, height: 28, borderRadius: 8, background: it.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>{it.icon}</span>
                        <span style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
                          <span style={{ fontSize: 11.5, fontWeight: 700, color: '#e2e8f0', whiteSpace: 'nowrap' }}>{it.label}</span>
                          <span style={{ fontSize: 9, color: '#5b7290', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.desc}</span>
                        </span>
                      </NavLink>
                    ))}
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid #16233b', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#08101f' }}>
                <span style={{ fontSize: 9.5, color: '#3a5570', fontWeight: 600 }}>{toolCount} công cụ & sẽ tiếp tục mở rộng</span>
                <NavLink to="/" onClick={() => setShowMoreTools(false)} style={{ textDecoration: 'none', fontSize: 10, fontWeight: 700, color: '#60a5fa' }}>{'\u{1F3E0}'} Về Trang chủ</NavLink>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function formatTime(d: Date): string {
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
}

const TopBar = memo(TopBarInner)
export default TopBar
