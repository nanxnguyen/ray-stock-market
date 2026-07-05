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
    <div className="bg-card border border-line-subtle rounded-xl overflow-visible shrink-0">
      {/* ROW 1: LOGO + INDEX SPARKLINES + CLOCK */}
      <div className="flex items-center gap-0 py-[9px] px-4 border-b border-line-subtle overflow-x-auto">
        <div className="flex items-center gap-[7px] shrink-0 pr-4 mr-4 border-r border-line-subtle">
          <div className="w-6 h-6 bg-gradient-to-br from-[#22c55e] to-[#16a34a] rounded-md flex items-center justify-center shrink-0">
            <svg width="12" height="10" viewBox="0 0 14 12"><polygon points="7,0 14,12 0,12" fill="var(--ds-color-text-inverse)" /></svg>
          </div>
          <span className="text-[13px] font-extrabold text-txt-primary whitespace-nowrap">Ray <span className="text-market-up">Stock Market</span></span>
        </div>

        {indices.map((idx) => (
          <div key={idx.name} onClick={idx.onClick} className="flex items-center gap-3 shrink-0 px-[18px] border-r border-line-subtle cursor-pointer">
            <div className="flex flex-col gap-[1px] min-w-[66px]">
              <span className="text-[9px] font-bold text-txt-muted tracking-[0.3px]">{idx.name}</span>
              <span className="text-[15px] font-extrabold font-mono tracking-[-0.3px]" style={{ color: idx.color }}>{idx.val}</span>
              <span className="text-[9.5px] font-bold" style={{ color: idx.color }}>{idx.chg}</span>
            </div>
            <svg viewBox="0 0 80 32" preserveAspectRatio="none" className="w-20 h-8 shrink-0">
              <defs>
                <linearGradient id={idx.gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={idx.color} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={idx.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <path d={idx.fill} fill={`url(#${idx.gradId})`} />
              <polyline points={idx.pts} fill="none" stroke={idx.color} strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round" />
            </svg>
            <div className="flex flex-col gap-[3px] min-w-[64px]">
              <div className="flex justify-between gap-1.5"><span className="text-[9px] text-txt-muted">Val</span><span className="text-[9.5px] text-txt-primary font-semibold font-mono">{idx.vol}</span></div>
              <div className="flex justify-between gap-1.5"><span className="text-[9px] text-txt-muted">F.Val</span><span className="text-[9.5px] font-semibold font-mono" style={{ color: idx.color }}>{idx.vol}</span></div>
            </div>
          </div>
        ))}

        <span className="ml-auto text-[10px] text-txt-muted font-mono shrink-0 pl-4">{timeStr}</span>
      </div>

      {/* ROW 2: NAV PILLS + TOOLS MEGA MENU + THEME TOGGLE */}
      <div className="flex items-center gap-1.5 py-2 px-[14px] overflow-x-visible relative">
        {NAV_LINKS.map((link) => {
          const isActive = location.pathname === link.path
          return (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`shrink-0 flex items-center gap-[5px] rounded-[14px] py-[5px] px-3 text-[10.5px] whitespace-nowrap cursor-pointer border transition-colors ${
                isActive
                  ? 'bg-[rgba(37,99,235,.25)] border-blue-600 text-blue-100 font-bold'
                  : 'bg-elevated border-line-subtle text-txt-secondary font-semibold'
              }`}
            >
              {link.icon} {link.label}
            </button>
          )
        })}

        <div
          ref={toolsRef}
          onClick={() => setShowMoreTools(!showMoreTools)}
          className={`shrink-0 flex items-center gap-1.5 rounded-[14px] py-[5px] px-3 pl-[11px] text-[10.5px] font-bold transition-all whitespace-nowrap cursor-pointer border ${
            showMoreTools
              ? 'bg-[rgba(37,99,235,.25)] border-blue-600 text-blue-100'
              : 'bg-elevated border-line-subtle text-txt-secondary'
          }`}
        >
          <span className="grid grid-cols-2 gap-[2px] w-[9px] h-[9px]">
            <span className="bg-current rounded-[1px]" /><span className="bg-current rounded-[1px]" />
            <span className="bg-current rounded-[1px]" /><span className="bg-current rounded-[1px]" />
          </span>
          Công cụ
          <span className={`text-[8px] transition-transform ${showMoreTools ? 'rotate-180' : 'rotate-0'}`}>▾</span>
        </div>

        <div className="ml-auto flex items-center gap-1.5 shrink-0">
          <div onClick={toggleDark} className="cursor-pointer flex items-center gap-1.5 bg-elevated border border-line-subtle rounded-full py-[5px] px-3 transition-all">
            <span className="text-xs leading-none">{th.toggleIcon}</span>
            <span className="text-[10px] font-bold text-txt-secondary">{th.toggleLabel}</span>
          </div>
        </div>

        {showMoreTools && (
          <div className="absolute top-[44px] right-[14px] bg-card border border-line-subtle rounded-[14px] shadow-[0_24px_60px_rgba(0,0,0,.55)] z-[300] w-[660px] max-w-[88vw] overflow-hidden animate-[fadeUp_0.15s_ease]">
            <div className="p-4 px-5 grid grid-cols-3 gap-[22px]">
              {MENU_GROUPS.map((grp) => (
                <div key={grp.title} className="flex flex-col gap-[2px]">
                  <span className="text-[9.5px] font-extrabold uppercase tracking-[0.5px] px-2 pb-2" style={{ color: grp.color }}>{grp.title}</span>
                  {grp.items.map((it) => (
                    <button key={it.href} onClick={() => { navigate(it.href); setShowMoreTools(false) }} className="no-underline flex items-center gap-2.5 py-[7px] px-2 rounded-lg bg-transparent border-none cursor-pointer w-full text-left hover:bg-elevated transition-colors"
                    >
                      <span className="w-7 h-7 rounded-lg flex items-center justify-center text-[13px] shrink-0" style={{ background: it.iconBg }}>{it.icon}</span>
                      <span className="flex flex-col gap-[1px] min-w-0">
                        <span className="text-[11.5px] font-bold text-txt-primary whitespace-nowrap">{it.label}</span>
                        <span className="text-[9px] text-txt-muted whitespace-nowrap overflow-hidden text-ellipsis">{it.desc}</span>
                      </span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
            <div className="border-t border-line-subtle py-2.5 px-5 flex justify-between items-center bg-elevated">
              <span className="text-[9.5px] text-txt-muted font-semibold">{toolCount} công cụ & sẽ tiếp tục mở rộng</span>
              <button onClick={() => { navigate('/'); setShowMoreTools(false) }} className="no-underline text-[10px] font-bold text-blue-400 bg-transparent border-none cursor-pointer">{'\u{1F3E0}'} Về Trang chủ</button>
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
    <div className="flex flex-col h-screen font-sans overflow-hidden bg-app" style={{ color: th.text }}>
      <MemoizedSubPageTopBar th={th} toggleDark={toggleDark} indices={indices} />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
      <FooterBar />
    </div>
  )
}
