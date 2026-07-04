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
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--ds-color-bg-app)', border: '1px solid var(--ds-color-border-default)', borderRadius: 12,
          width: 980, height: 640, maxWidth: '97vw', maxHeight: '93vh',
          overflow: 'hidden', animation: 'fadeUp .18s ease',
          boxShadow: '0 32px 80px rgba(0,0,0,.7), 0 0 40px rgba(37,99,235,.12)',
          display: 'flex', flexDirection: 'column',
        }}
      >
        <div style={{
          background: 'var(--ds-color-bg-nav)', padding: '10px 18px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderBottom: '1px solid var(--ds-color-border-default)', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: 'var(--ds-color-surface-elevated)', borderRadius: 6, padding: '3px 10px' }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--ds-color-blue-400)', fontFamily: "'Inter', sans-serif", letterSpacing: 0.5 }}>
                {sym}
              </span>
            </div>
            <span style={{ fontSize: 10, color: 'var(--ds-color-label-muted)' }}>
              Biểu đồ TradingView - Thời gian thực
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <a
              href={tvOpenUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'var(--ds-color-surface-elevated)', color: 'var(--ds-color-blue-400)', border: '1px solid var(--ds-color-blue-600)',
                borderRadius: 6, padding: '4px 10px', fontSize: 10, fontWeight: 700,
                cursor: 'pointer', textDecoration: 'none',
              }}
            >
              {'\u2197'} Mở TradingView
            </a>
            <button
              onClick={onClose}
              style={{
                background: 'var(--ds-color-border-subtle)', color: 'var(--ds-color-text-muted)', border: '1px solid var(--ds-color-border-default)',
                borderRadius: 6, width: 28, height: 28, cursor: 'pointer', fontSize: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {'\u2715'}
            </button>
          </div>
        </div>
        <div ref={containerRef} style={{ flex: 1, width: '100%', background: 'var(--ds-color-bg-app)' }} />
      </div>
    </div>
  )
}
