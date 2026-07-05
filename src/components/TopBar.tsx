import { useState, useEffect } from 'react'
import { memo } from 'react'
import { NavLink } from 'react-router-dom'
import type { ThemeTokens } from '../types/priceboard'
import { cn } from '@/lib/utils'

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
      { href: '#', icon: '\u{1F9FE}', iconBg: 'rgba(245,158,11,.15)', label: 'Sao kê TK', desc: 'Nạp/rút, giao dịch tiền' },
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
    <div className="flex-shrink-0">
      <div className="flex items-center gap-2.5 h-[42px] flex-shrink-0 px-4 border-b border-line bg-gradient-to-r from-app via-nav to-app">
        <NavLink to="/" className="flex items-center gap-[7px] flex-shrink-0 mr-1 no-underline">
          <div className="w-[26px] h-[26px] rounded-md bg-gradient-to-br from-market-up to-green-500 flex items-center justify-center">
            <svg width="14" height="12" viewBox="0 0 14 12">
              <polygon points="7,0 14,12 0,12" fill="var(--ds-color-text-inverse)" />
            </svg>
          </div>
          <span className="text-[15px] font-extrabold text-txt-inverse tracking-[0.4px] font-sans">
            Ray <span className="text-market-up">Stock Market</span>
          </span>
        </NavLink>

        <span className="text-txt-muted text-[11px] flex-shrink-0 font-mono font-medium tracking-[0.5px]">
          {timeStr}
        </span>

        <div className="flex-1 overflow-hidden relative h-full flex items-center min-w-0">
          <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-app to-transparent z-[1] pointer-events-none" />
          <span className="absolute whitespace-nowrap animate-[ticker_34s_linear_infinite] text-txt-secondary text-[10.5px] font-medium font-mono">
            <span className="text-yellow-400">VN-Index</span> <span className="text-green-400">{'\u25B2'}1,860.01 +5.04</span> {'\u2502'}
            <span className="text-yellow-400">VN30</span> <span className="text-green-400">{'\u25B2'}1,995.71 +5.06</span> {'\u2502'}
            <span className="text-yellow-400">ACB</span> <span className="text-red-400">{'\u25BC'}22.65 -0.25</span> {'\u2502'}
            <span className="text-yellow-400">HPG</span> <span className="text-green-400">{'\u25B2'}24.10 +0.32</span> {'\u2502'}
            <span className="text-yellow-400">VCB</span> <span className="text-green-400">{'\u25B2'}81.50 +1.13</span> {'\u2502'}
            <span className="text-yellow-400">FPT</span> <span className="text-green-400">{'\u25B2'}137.50 +1.89</span> {'\u2502'}
            <span className="text-yellow-400">DOW</span> <span className="text-green-400">{'\u25B2'}52,342 +0.31%</span>
          </span>
          <div className="absolute inset-y-0 right-0 left-auto w-10 bg-gradient-to-l from-app to-transparent z-[1] pointer-events-none" />
        </div>

        <div className="flex items-center gap-[5px] flex-shrink-0 relative">
          <NavLink to="/portfolio" title="Danh mục đầu tư" className="no-underline flex items-center gap-1 bg-line-subtle border border-line rounded-[14px] py-1 px-[9px] text-txt-secondary text-[10px] font-semibold">
            {'\u{1F4BC}'} Danh mục
          </NavLink>
          <NavLink to="/trading-panel" title="Đặt lệnh" className="no-underline flex items-center gap-1 bg-line-subtle border border-line rounded-[14px] py-1 px-[9px] text-txt-secondary text-[10px] font-semibold">
            {'\u{1F4B0}'} Đặt lệnh
          </NavLink>

          <div
            onClick={(e) => { e.stopPropagation(); setShowMoreTools(p => !p) }}
            className={cn(
              "cursor-pointer flex items-center gap-[5px] rounded-[14px] py-1 px-[10px] pl-[9px] text-[10px] font-bold transition-all duration-150",
              showMoreTools
                ? "bg-blue-700/25 border border-blue-600 text-blue-100"
                : "bg-line-subtle border border-line text-txt-secondary"
            )}
          >
            <span className="grid grid-cols-2 gap-[2px] w-[9px] h-[9px]">
              <span className="bg-current rounded-[1px]" /><span className="bg-current rounded-[1px]" />
              <span className="bg-current rounded-[1px]" /><span className="bg-current rounded-[1px]" />
            </span>
            Công cụ
            <span className={cn("text-[8px] transition-transform duration-150", showMoreTools ? "rotate-180" : "rotate-0")}>{'\u25BE'}</span>
          </div>

          <div className="w-px h-[18px] bg-line" />

          <div
            onClick={toggleDark}
            title={th.toggleTitle}
            className="cursor-pointer flex items-center gap-1.5 bg-line-subtle border border-line rounded-full py-1 px-2.5 transition-all duration-250"
          >
            <span className="text-xs leading-none">{th.toggleIcon}</span>
            <span className="text-[10px] font-semibold text-txt-muted">{th.toggleLabel}</span>
          </div>

          {showMoreTools && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute top-[38px] right-0 bg-card border border-line rounded-[14px] shadow-[0_24px_60px_rgba(0,0,0,.55)] z-[300] w-[660px] max-w-[88vw] overflow-hidden animate-[fadeUp_0.15s_ease]"
            >
              <div className="p-5 px-[20px] grid grid-cols-3 gap-[22px]">
                {MENU_GROUPS.map((grp) => (
                  <div key={grp.title} className="flex flex-col gap-[2px]">
                    <span className="text-[9.5px] font-extrabold uppercase tracking-[0.5px] pb-2 px-2" style={{ color: grp.color }}>{grp.title}</span>
                    {grp.items.map((it) => (
                      <NavLink
                        key={it.label}
                        to={it.href}
                        onClick={() => setShowMoreTools(false)}
                        className="no-underline flex items-center gap-2.5 py-[7px] px-2 rounded-lg transition-colors duration-100 hover:bg-row-hover"
                      >
                        <span className="w-7 h-7 rounded-lg flex items-center justify-center text-[13px] flex-shrink-0" style={{ background: it.iconBg }}>{it.icon}</span>
                        <span className="flex flex-col gap-px min-w-0">
                          <span className="text-[11.5px] font-bold text-txt-primary whitespace-nowrap">{it.label}</span>
                          <span className="text-[9px] text-txt-muted whitespace-nowrap overflow-hidden text-ellipsis">{it.desc}</span>
                        </span>
                      </NavLink>
                    ))}
                  </div>
                ))}
              </div>
              <div className="border-t border-line-subtle py-2.5 px-5 flex justify-between items-center bg-elevated">
                <span className="text-[9.5px] text-txt-muted font-semibold">{toolCount} công cụ & sẽ tiếp tục mở rộng</span>
                <NavLink to="/" onClick={() => setShowMoreTools(false)} className="no-underline text-[10px] font-bold text-blue-400">{'\u{1F3E0}'} Về Trang chủ</NavLink>
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
