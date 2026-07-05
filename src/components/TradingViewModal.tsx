import { useEffect, useRef } from 'react'

type Props = {
  sym: string
  tvSymbol: string
  onClose: () => void
}

const TV_SYM_MAP: Record<string, string> = {
  'VN-Index': 'VNINDEX',
  'VN30-Index': 'VN30',
  'HNX-Index': 'HNX:HNXINDEX',
  'HNX30': 'HNX:HNX30',
  'UPCOM': '301',
}

function getTvOpenUrl(tvSym: string): string {
  return `https://www.tradingview.com/chart/?symbol=${encodeURIComponent(tvSym)}&theme=dark`
}

export default function TradingViewModal({ sym, tvSymbol, onClose }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const tvSym = TV_SYM_MAP[sym] || tvSymbol || 'HOSE:VNINDEX'
  const tvOpenUrl = getTvOpenUrl(tvSym)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    container.innerHTML = ''

    const widgetDiv = document.createElement('div')
    widgetDiv.className = 'tradingview-widget-container'
    widgetDiv.style.cssText = 'height:100%;width:100%'

    const widgetInner = document.createElement('div')
    widgetInner.className = 'tradingview-widget-container__widget'
    widgetInner.style.cssText = 'height:calc(100% - 32px);width:100%'
    widgetDiv.appendChild(widgetInner)

    const config = JSON.stringify({
      autosize: true,
      symbol: tvSym,
      interval: 'D',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'vi',
      allow_symbol_change: true,
      calendar: false,
      support_host: 'https://www.tradingview.com',
    })

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.async = true
    script.textContent = config

    widgetDiv.appendChild(script)
    container.appendChild(widgetDiv)

    return () => {
      container.innerHTML = ''
    }
  }, [tvSym])

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex w-[980px] max-w-[97vw] flex-col overflow-hidden rounded-xl border border-border bg-app shadow-[0_32px_80px_rgba(0,0,0,.7),0_0_40px_rgba(37,99,235,.12)] h-[640px] max-h-[93vh] animate-[fadeUp_0.18s_ease]"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border bg-nav px-[18px] py-[10px]">
          <div className="flex items-center gap-2.5">
            <div className="rounded-md px-2.5 py-[3px] bg-[var(--ds-color-surface-elevated)]">
              <span className="font-extrabold text-[13px] tracking-[0.5px] font-[var(--ds-font-sans)] text-[var(--ds-color-blue-400)]">
                {sym}
              </span>
            </div>
            <span className="text-[10px] text-[var(--ds-color-label-muted)]">
              Biểu đồ TradingView - Thời gian thực
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <a
              href={tvOpenUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer rounded-md border border-[var(--ds-color-blue-600)] bg-[var(--ds-color-surface-elevated)] px-2.5 py-1 text-[10px] font-bold text-[var(--ds-color-blue-400)] no-underline"
            >
              {'\u2197'} Mở TradingView
            </a>
            <button
              onClick={onClose}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-border bg-border-subtle text-[14px] text-txt-muted"
            >
              {'\u2715'}
            </button>
          </div>
        </div>
        <div ref={containerRef} className="h-full w-full flex-1 bg-app" />
      </div>
    </div>
  )
}
