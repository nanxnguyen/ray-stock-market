import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef, memo } from 'react'
import type { ThemeTokens, MarketIndexView } from '../types/priceboard'
import FooterBar from './FooterBar'

type Props = { th: ThemeTokens; toggleDark: () => void; indices: MarketIndexView[] }

type MenuItem = { href: string; icon: string; iconBg: string; label: string; desc: string }
type MenuGroup = { title: string; color: string; items: MenuItem[] }

const MENU_GROUPS: MenuGroup[] = [
  {
    title: 'Phân tích',
    color: 'var(--ds-color-blue-400)',
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
    color: 'var(--ds-color-market-up)',
    items: [
      { href: '/trading-panel', icon: '\u{1F4B0}', iconBg: 'rgba(34,197,94,.15)', label: 'Đặt lệnh', desc: 'Bảng giá & khớp lệnh' },
      { href: '/derivatives-trading', icon: '\u{1F4C9}', iconBg: 'rgba(249,115,22,.15)', label: 'Phái sinh', desc: 'VN30F, margin, T+0' },
      { href: '/order-book', icon: '\u{1F4D6}', iconBg: 'rgba(34,197,94,.15)', label: 'Sổ lệnh', desc: 'Độ sâu thị trường' },
      { href: '/order-history', icon: '\u{1F4CB}', iconBg: 'rgba(34,197,94,.15)', label: 'Lịch sử lệnh', desc: 'Đã khớp, chờ khớp, đã hủy' },
      { href: '/account-statement', icon: '\u{1F9FE}', iconBg: 'rgba(245,158,11,.15)', label: 'Sao kê TK', desc: 'Nạp/rút, giao dịch tiền' },
      { href: '/watchlists', icon: '\u2B50', iconBg: 'rgba(245,158,11,.15)', label: 'Watchlists', desc: 'Danh mục theo dõi' },
      { href: '/alerts', icon: '\u{1F514}', iconBg: 'rgba(245,158,11,.15)', label: 'Cảnh báo giá', desc: 'Quản lý các alert đã đặt' },
    ],
  },
  {
    title: 'Thông tin & Tài khoản',
    color: 'var(--ds-color-warning)',
    items: [
      { href: '/portfolio', icon: '\u{1F4BC}', iconBg: 'rgba(34,197,94,.15)', label: 'Danh mục đầu tư', desc: 'NAV, phân bổ, lãi/lỗ' },
      { href: '/market-news', icon: '\u{1F4F0}', iconBg: 'rgba(168,85,247,.15)', label: 'Tin tức', desc: 'Vĩ mô, doanh nghiệp, ngành' },
      { href: '/event-calendar', icon: '\u{1F4C5}', iconBg: 'rgba(168,85,247,.15)', label: 'Lịch sự kiện', desc: 'ĐHCĐ, cổ tức, chốt quyền' },
      { href: '/account-settings', icon: '\u2699\uFE0F', iconBg: 'rgba(148,163,184,.15)', label: 'Cài đặt TK', desc: 'Hồ sơ, bảo mật, thông báo' },
      { href: '/auth', icon: '\u{1F511}', iconBg: 'rgba(148,163,184,.15)', label: 'Đăng nhập/KYC', desc: 'Đăng ký & xác thực' },
    ],
  },
]

const NAV_LINKS = [
  { icon: '\u{1F3E0}', label: 'Trang chủ', path: '/' },
  { icon: '\u{1F4BC}', label: 'Danh mục', path: '/portfolio' },
  { icon: '\u{1F4B0}', label: 'Đặt lệnh', path: '/trading-panel' },
  { icon: '\u{1F4D6}', label: 'Sổ lệnh', path: '/order-book' },
] as const

function SubPageTopBar({ th, toggleDark, indices }: Props) {
  const [timeStr, setTimeStr] = useState(() => formatTime(new Date()))
  const [showMoreTools, setShowMoreTools] = useState(false)
  const toolsRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const c = setInterval(() => setTimeStr(formatTime(new Date())), 1000)
    return () => clearInterval(c)
  }, [])

  useEffect(() => {
    if (!showMoreTools) return
    const handler = (e: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) setShowMoreTools(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showMoreTools])

  const toolCount = MENU_GROUPS.reduce((s, g) => s + g.items.length, 0)

  return (
    <div style={{ background: 'var(--ds-color-bg-card)', border: '1px solid var(--ds-color-border-subtle)', borderRadius: 12, overflow: 'visible', flexShrink: 0 }}>
      {/* ROW 1: LOGO + INDEX SPARKLINES + CLOCK */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, padding: '9px 16px', borderBottom: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0, paddingRight: 16, marginRight: 16, borderRight: '1px solid var(--ds-color-border-muted)' }}>
          <div style={{ width: 24, height: 24, background: 'linear-gradient(135deg,#22c55e,#16a34a)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="12" height="10" viewBox="0 0 14 12"><polygon points="7,0 14,12 0,12" fill="#fff" /></svg>
          </div>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--ds-color-text-primary)', whiteSpace: 'nowrap' }}>Ray <span style={{ color: '#22c55e' }}>Stock Market</span></span>
        </div>

        {indices.map((idx) => (
          <div key={idx.name} onClick={idx.onClick} style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, padding: '0 18px', borderRight: '1px solid var(--ds-color-border-muted)', cursor: 'pointer' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 66 }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--ds-color-text-muted)', letterSpacing: 0.3 }}>{idx.name}</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: idx.color, fontFamily: "'JetBrains Mono', monospace", letterSpacing: -0.3 }}>{idx.val}</span>
              <span style={{ fontSize: 9.5, color: idx.color, fontWeight: 700 }}>{idx.chg}</span>
            </div>
            <svg viewBox="0 0 80 32" preserveAspectRatio="none" style={{ width: 80, height: 32, flexShrink: 0 }}>
              <defs>
                <linearGradient id={idx.gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={idx.color} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={idx.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <path d={idx.fill} fill={`url(#${idx.gradId})`} />
              <polyline points={idx.pts} fill="none" stroke={idx.color} strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round" />
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 64 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}><span style={{ fontSize: 9, color: 'var(--ds-color-text-muted)' }}>Val</span><span style={{ fontSize: 9.5, color: 'var(--ds-color-text-primary)', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>{idx.vol}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}><span style={{ fontSize: 9, color: 'var(--ds-color-text-muted)' }}>F.Val</span><span style={{ fontSize: 9.5, color: idx.color, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>{idx.vol}</span></div>
            </div>
          </div>
        ))}

        <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--ds-color-text-muted)', fontFamily: "'JetBrains Mono', monospace", flexShrink: 0, paddingLeft: 16 }}>{timeStr}</span>
      </div>

      {/* ROW 2: NAV PILLS + TOOLS MEGA MENU + THEME TOGGLE */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', overflowX: 'visible', position: 'relative' }}>
        {NAV_LINKS.map((link) => {
          const isActive = location.pathname === link.path
          return (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              style={{
                flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5,
                background: isActive ? 'rgba(37,99,235,.25)' : 'var(--ds-color-bg-elevated)',
                border: `1px solid ${isActive ? '#2563eb' : 'var(--ds-color-border-subtle)'}`,
                color: isActive ? '#dbeafe' : 'var(--ds-color-text-secondary)',
                borderRadius: 14, padding: '5px 12px', fontSize: 10.5,
                fontWeight: isActive ? 700 : 600, whiteSpace: 'nowrap', cursor: 'pointer',
              }}
            >
              {link.icon} {link.label}
            </button>
          )
        })}

        <div
          ref={toolsRef}
          onClick={() => setShowMoreTools(!showMoreTools)}
          style={{
            cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6,
            background: showMoreTools ? 'rgba(37,99,235,.25)' : 'var(--ds-color-bg-elevated)',
            border: `1px solid ${showMoreTools ? '#2563eb' : 'var(--ds-color-border-subtle)'}`,
            color: showMoreTools ? '#dbeafe' : 'var(--ds-color-text-secondary)',
            borderRadius: 14, padding: '5px 12px 5px 11px', fontSize: 10.5, fontWeight: 700,
            transition: 'all .15s', whiteSpace: 'nowrap',
          }}
        >
          <span style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, width: 9, height: 9 }}>
            <span style={{ background: 'currentColor', borderRadius: 1 }} /><span style={{ background: 'currentColor', borderRadius: 1 }} />
            <span style={{ background: 'currentColor', borderRadius: 1 }} /><span style={{ background: 'currentColor', borderRadius: 1 }} />
          </span>
          Công cụ
          <span style={{ fontSize: 8, transform: showMoreTools ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform .15s' }}>▾</span>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <div onClick={toggleDark} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, background: 'var(--ds-color-bg-elevated)', border: '1px solid var(--ds-color-border-subtle)', borderRadius: 20, padding: '5px 12px', transition: 'all .25s' }}>
            <span style={{ fontSize: 12 }}>{th.toggleIcon}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--ds-color-text-secondary)' }}>{th.toggleLabel}</span>
          </div>
        </div>

        {showMoreTools && (
          <div style={{ position: 'absolute', top: 44, right: 14, background: 'var(--ds-color-bg-card)', border: '1px solid var(--ds-color-border-subtle)', borderRadius: 14, boxShadow: '0 24px 60px rgba(0,0,0,.55)', zIndex: 300, width: 660, maxWidth: '88vw', overflow: 'hidden', animation: 'fadeUp .15s ease' }}>
            <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
              {MENU_GROUPS.map((grp) => (
                <div key={grp.title} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 9.5, fontWeight: 800, color: grp.color, textTransform: 'uppercase', letterSpacing: 0.5, padding: '0 8px 8px' }}>{grp.title}</span>
                  {grp.items.map((it) => (
                    <button key={it.href} onClick={() => { navigate(it.href); setShowMoreTools(false) }} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, padding: '7px 8px', borderRadius: 8, background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--ds-color-bg-elevated)' }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                    >
                      <span style={{ width: 28, height: 28, borderRadius: 8, background: it.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>{it.icon}</span>
                      <span style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
                        <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ds-color-text-primary)', whiteSpace: 'nowrap' }}>{it.label}</span>
                        <span style={{ fontSize: 9, color: 'var(--ds-color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.desc}</span>
                      </span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid var(--ds-color-border-subtle)', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--ds-color-bg-elevated)' }}>
              <span style={{ fontSize: 9.5, color: 'var(--ds-color-text-muted)', fontWeight: 600 }}>{toolCount} công cụ & sẽ tiếp tục mở rộng</span>
              <button onClick={() => { navigate('/'); setShowMoreTools(false) }} style={{ textDecoration: 'none', fontSize: 10, fontWeight: 700, color: 'var(--ds-color-blue-400)', background: 'none', border: 'none', cursor: 'pointer' }}>{'\u{1F3E0}'} Về Trang chủ</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function formatTime(d: Date) {
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} · ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
}

const MemoizedSubPageTopBar = memo(SubPageTopBar)

export default function SubPageLayout({ th, toggleDark, indices }: Props) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100vh',
      fontFamily: "'Inter', system-ui, sans-serif", color: th.text,
      overflow: 'hidden', background: th.appBg,
    }}>
      <MemoizedSubPageTopBar th={th} toggleDark={toggleDark} indices={indices} />
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Outlet />
      </div>
      <FooterBar />
    </div>
  )
}
