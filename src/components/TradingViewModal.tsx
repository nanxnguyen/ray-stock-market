type Props = {
  sym: string
  tvSymbol: string
  onClose: () => void
}

const TV_SYM_MAP: Record<string, string> = {
  'VN-Index': 'HOSE:VNINDEX',
  'VN30-Index': 'HOSE:VN30',
  'HNX-Index': 'HNX:HNXINDEX',
  'HNX30': 'HNX:HNX30',
  'UPCOM': 'UPCOM:UPCOMINDEX',
}

export default function TradingViewModal({ sym, tvSymbol, onClose }: Props) {
  const tvSym = TV_SYM_MAP[sym] || tvSymbol || 'HOSE:VNINDEX'
  const iframeUrl = `https://s.tradingview.com/widgetembed/?frameElementId=tv1&symbol=${encodeURIComponent(tvSym)}&interval=D&hidesidetoolbar=0&hidetoptoolbar=0&theme=dark&style=1&locale=vi&toolbar_bg=%23131722&enable_publishing=false&allow_symbol_change=true&save_image=false&show_popup_button=false`
  const tvOpenUrl = `https://www.tradingview.com/chart/?symbol=${encodeURIComponent(tvSym)}&theme=dark`

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
          background: '#060c18', border: '1px solid #1a3050', borderRadius: 12,
          width: 980, height: 640, maxWidth: '97vw', maxHeight: '93vh',
          overflow: 'hidden', animation: 'fadeUp .18s ease',
          boxShadow: '0 32px 80px rgba(0,0,0,.7), 0 0 40px rgba(37,99,235,.12)',
          display: 'flex', flexDirection: 'column',
        }}
      >
        <div style={{
          background: '#0b1628', padding: '10px 18px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderBottom: '1px solid #1a3050', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: '#1e3a5f', borderRadius: 6, padding: '3px 10px' }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#60a5fa', fontFamily: "'Inter', sans-serif", letterSpacing: 0.5 }}>
                {sym}
              </span>
            </div>
            <span style={{ fontSize: 10, color: '#3a5570' }}>
              Biểu đồ TradingView - Thời gian thực
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <a
              href={tvOpenUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#1e3a5f', color: '#60a5fa', border: '1px solid #2563eb',
                borderRadius: 6, padding: '4px 10px', fontSize: 10, fontWeight: 700,
                cursor: 'pointer', textDecoration: 'none',
              }}
            >
              {'\u2197'} Mở TradingView
            </a>
            <button
              onClick={onClose}
              style={{
                background: '#0f1e36', color: '#64748b', border: '1px solid #1a3050',
                borderRadius: 6, width: 28, height: 28, cursor: 'pointer', fontSize: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {'\u2715'}
            </button>
          </div>
        </div>
        <iframe
          src={iframeUrl}
          style={{ flex: 1, width: '100%', border: 'none', background: '#060c18' }}
          allowTransparency
          scrolling="no"
        />
      </div>
    </div>
  )
}
