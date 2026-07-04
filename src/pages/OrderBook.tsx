import { memo, useState, useMemo, useEffect } from 'react'

function OrderBookInner() {
  const [symbol] = useState(() => new URLSearchParams(window.location.search).get('symbol') || 'VCB')
  const [lastPrice, setLastPrice] = useState(81.50)
  const [activeTab, setActiveTab] = useState<'depth' | 'trades'>('depth')

  const th = useMemo(() => ({
    appBg: '#060c18',
    navBg: '#0d1520',
    text: '#d4e0ee',
    textMuted: '#7a8a9e',
    cellBorder: '#1a3050',
  }), [])

  useEffect(() => {
    const interval = setInterval(() => {
      const rand = (Math.random() - 0.5) * 0.50
      setLastPrice(p => Math.max(70, Math.min(95, p + rand)))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const bids = useMemo(() => Array.from({ length: 10 }, (_, i) => {
    const price = lastPrice - i * 0.10
    const vol = Math.floor(Math.random() * 50000) + 10000
    return { price: price.toFixed(2), vol: (vol / 1000).toFixed(0) + 'k', barBg: '#22c55e' }
  }), [lastPrice])

  const asks = useMemo(() => Array.from({ length: 10 }, (_, i) => {
    const price = lastPrice + i * 0.10
    const vol = Math.floor(Math.random() * 50000) + 10000
    return { price: price.toFixed(2), vol: (vol / 1000).toFixed(0) + 'k', barBg: '#f43f5e' }
  }), [lastPrice])

  const bidVol = useMemo(() => bids.reduce((s, b) => s + parseInt(b.vol), 0) + 'k', [bids])
  const askVol = useMemo(() => asks.reduce((s, a) => s + parseInt(a.vol), 0) + 'k', [asks])
  const spread = useMemo(() => (parseFloat(asks[0]?.price || '0') - parseFloat(bids[0]?.price || '0')).toFixed(2), [asks, bids])
  const imbalance = useMemo(() => {
    const bV = parseInt(bidVol)
    const aV = parseInt(askVol)
    return ((bV / (bV + aV) - 0.5) * 100).toFixed(1)
  }, [bidVol, askVol])

  const recentTrades = useMemo(() => [
    { price: '81.50', vol: '5,200', time: '15:29:45', side: 'BUY', priceColor: '#22c55e', sideColor: '#22c55e', sideBg: 'rgba(34,197,94,.08)' },
    { price: '81.45', vol: '2,800', time: '15:29:40', side: 'SELL', priceColor: '#f43f5e', sideColor: '#f43f5e', sideBg: 'rgba(244,63,94,.08)' },
    { price: '81.50', vol: '3,400', time: '15:29:35', side: 'BUY', priceColor: '#22c55e', sideColor: '#22c55e', sideBg: 'rgba(34,197,94,.08)' },
    { price: '81.40', vol: '8,900', time: '15:29:30', side: 'SELL', priceColor: '#f43f5e', sideColor: '#f43f5e', sideBg: 'rgba(244,63,94,.08)' },
    { price: '81.55', vol: '2,100', time: '15:29:25', side: 'BUY', priceColor: '#22c55e', sideColor: '#22c55e', sideBg: 'rgba(34,197,94,.08)' },
  ], [])

  const depthBars = useMemo(() => Array.from({ length: 10 }, (_, i) => ({
    price: (lastPrice + (i - 4) * 0.10).toFixed(2),
    height: `${30 + Math.random() * 50}%`,
    color: i < 4 ? '#22c55e' : i > 4 ? '#f43f5e' : '#60a5fa',
  })), [lastPrice])

  const lastPriceColor = lastPrice >= 81.50 ? '#22c55e' : '#f43f5e'

  return (
    <div style={{ width: '100%', minHeight: '100%', boxSizing: 'border-box', background: th.appBg, padding: '32px 16px', display: 'flex', justifyContent: 'center', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16, background: th.navBg, borderRadius: 12, border: `1px solid ${th.cellBorder}`, maxWidth: 1680, width: '100%', margin: '0 auto', height: 'fit-content' }}>

        {/* NAV BAR */}
        <div style={{ background: '#0d1420', border: '1px solid #1c2534', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '10px 18px', borderBottom: '1px solid #1c2534', overflowX: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
              <div style={{ width: 24, height: 24, background: 'linear-gradient(135deg,#22c55e,#16a34a)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="12" height="10" viewBox="0 0 14 12"><polygon points="7,0 14,12 0,12" fill="#fff" /></svg>
              </div>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#fff', whiteSpace: 'nowrap' }}>Ray <span style={{ color: '#22c55e' }}>Stock</span></span>
            </div>
            <div style={{ display: 'flex', flexShrink: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', padding: '0 16px', borderRight: '1px solid #1c2534', minWidth: 118 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}><span style={{ fontSize: 9.5, fontWeight: 700, color: '#8a94a6', letterSpacing: 0.3 }}>VNINDEX</span><span style={{ fontSize: 13, fontWeight: 800, color: '#22c55e', fontFamily: "'JetBrains Mono', monospace" }}>1,862.08</span></div>
                <span style={{ fontSize: 9.5, color: '#22c55e', fontWeight: 700 }}>+4.27 +0.23%</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', padding: '0 16px', borderRight: '1px solid #1c2534', minWidth: 118 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}><span style={{ fontSize: 9.5, fontWeight: 700, color: '#8a94a6', letterSpacing: 0.3 }}>HNX</span><span style={{ fontSize: 13, fontWeight: 800, color: '#22c55e', fontFamily: "'JetBrains Mono', monospace" }}>307.57</span></div>
                <span style={{ fontSize: 9.5, color: '#22c55e', fontWeight: 700 }}>+0.84 +0.27%</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', padding: '0 16px', minWidth: 118 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}><span style={{ fontSize: 9.5, fontWeight: 700, color: '#8a94a6', letterSpacing: 0.3 }}>UPCOM</span><span style={{ fontSize: 13, fontWeight: 800, color: '#f43f5e', fontFamily: "'JetBrains Mono', monospace" }}>128.01</span></div>
                <span style={{ fontSize: 9.5, color: '#f43f5e', fontWeight: 700 }}>-0.66 -0.51%</span>
              </div>
            </div>
            <span style={{ marginLeft: 'auto', fontSize: 10, color: '#4a6080', fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 }}>04/07/2026 · 15:00:00</span>
          </div>
          <div style={{ display: 'flex', gap: 6, padding: '8px 14px', overflowX: 'auto' }}>
            {[
              { label: '🏠 Trang chủ', active: false },
              { label: '💼 Danh mục', active: false },
              { label: '💰 Đặt lệnh', active: false },
              { label: '📖 Sổ lệnh', active: true },
              { label: '🗺️ Heatmap', active: false },
              { label: '📊 So sánh', active: false },
              { label: '🔍 Screener', active: false },
              { label: '📰 Tin tức', active: false },
              { label: '📅 Sự kiện', active: false },
              { label: '⚙️ Cài đặt', active: false },
            ].map((item, i) => (
              <span key={i} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5, background: item.active ? '#1a2744' : '#141d2e', border: `1px solid ${item.active ? '#2563eb' : '#1c2534'}`, color: item.active ? '#fff' : '#c3ccd9', borderRadius: 7, padding: '6px 12px', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', cursor: 'pointer' }}>{item.label}</span>
            ))}
          </div>
        </div>

        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${th.cellBorder}`, paddingBottom: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: th.text }}>ĐỘ SÂU THỊ TRƯỜNG</h2>
            <span style={{ fontSize: 10, color: th.textMuted }}>{symbol} | Cập nhật realtime</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: th.textMuted, textTransform: 'uppercase' }}>Giá cuối</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: lastPriceColor, fontFamily: "'JetBrains Mono', monospace" }}>{lastPrice.toFixed(2)}đ</div>
          </div>
        </div>

        {/* DEPTH CHART */}
        <div style={{ background: th.navBg, border: `1px solid ${th.cellBorder}`, borderRadius: 4, height: 120, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: 10, gap: 4 }}>
          {depthBars.map((bar, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
              <div style={{ width: '100%', background: bar.color, height: bar.height, borderRadius: 2, opacity: 0.7, transition: 'all .3s' }} />
              <span style={{ fontSize: 8, color: th.textMuted, textAlign: 'center', wordBreak: 'break-word' }}>{bar.price}</span>
            </div>
          ))}
        </div>

        {/* TAB SWITCHER */}
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => setActiveTab('depth')} style={{ background: activeTab === 'depth' ? '#2563eb' : th.navBg, color: activeTab === 'depth' ? '#fff' : th.textMuted, border: `1px solid ${activeTab === 'depth' ? '#2563eb' : th.cellBorder}`, borderRadius: 6, padding: '6px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Độ sâu</button>
          <button onClick={() => setActiveTab('trades')} style={{ background: activeTab === 'trades' ? '#2563eb' : th.navBg, color: activeTab === 'trades' ? '#fff' : th.textMuted, border: `1px solid ${activeTab === 'trades' ? '#2563eb' : th.cellBorder}`, borderRadius: 6, padding: '6px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Giao dịch</button>
        </div>

        {activeTab === 'depth' ? (
          <>
            {/* BID/ASK TABLE */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {/* SELL SIDE (ASK) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#f43f5e', textTransform: 'uppercase', padding: '0 6px' }}>ASK (BÁN) ⬆</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 300, overflowY: 'auto' }}>
                  {asks.map((ask, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '50px 60px 60px', gap: 8, padding: '8px 6px', background: th.navBg, border: `1px solid ${th.cellBorder}`, borderRadius: 3, cursor: 'pointer', transition: 'all .15s', fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>
                      <div style={{ textAlign: 'right', color: '#f43f5e', fontWeight: 700 }}>{ask.price}</div>
                      <div style={{ textAlign: 'right', color: th.textMuted, fontWeight: 700 }}>{ask.vol}</div>
                      <div style={{ background: ask.barBg, borderRadius: 2, height: 16, margin: 'auto 0', opacity: 0.5 }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* BID SIDE (MUA) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#22c55e', textTransform: 'uppercase', padding: '0 6px' }}>BID (MUA) ⬇</div>
                <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: 2, maxHeight: 300, overflowY: 'auto' }}>
                  {bids.map((bid, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '50px 60px 60px', gap: 8, padding: '8px 6px', background: th.navBg, border: `1px solid ${th.cellBorder}`, borderRadius: 3, cursor: 'pointer', transition: 'all .15s', fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>
                      <div style={{ textAlign: 'right', color: '#22c55e', fontWeight: 700 }}>{bid.price}</div>
                      <div style={{ textAlign: 'right', color: th.textMuted, fontWeight: 700 }}>{bid.vol}</div>
                      <div style={{ background: bid.barBg, borderRadius: 2, height: 16, margin: 'auto 0', opacity: 0.5 }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* STATS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, borderTop: `1px solid ${th.cellBorder}`, paddingTop: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 8, background: th.navBg, borderRadius: 4, border: `1px solid ${th.cellBorder}` }}>
                <span style={{ fontSize: 9, color: th.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>Bid Volume</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#22c55e' }}>{bidVol}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 8, background: th.navBg, borderRadius: 4, border: `1px solid ${th.cellBorder}` }}>
                <span style={{ fontSize: 9, color: th.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>Ask Volume</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#f43f5e' }}>{askVol}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 8, background: th.navBg, borderRadius: 4, border: `1px solid ${th.cellBorder}` }}>
                <span style={{ fontSize: 9, color: th.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>Spread</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b' }}>{spread}đ</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 8, background: th.navBg, borderRadius: 4, border: `1px solid ${th.cellBorder}` }}>
                <span style={{ fontSize: 9, color: th.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>Imbalance</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: parseFloat(imbalance) > 0 ? '#22c55e' : '#f43f5e' }}>{imbalance}%</span>
              </div>
            </div>
          </>
        ) : (
          /* RECENT TRADES */
          <div style={{ borderTop: `1px solid ${th.cellBorder}`, paddingTop: 10 }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: 12, fontWeight: 700, color: th.text, textTransform: 'uppercase' }}>Giao dịch gần nhất</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 400, overflowY: 'auto' }}>
              {recentTrades.map((trade, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '50px 70px 60px 50px', gap: 8, padding: 6, background: trade.sideBg, borderRadius: 3, border: `1px solid ${th.cellBorder}`, fontSize: 9, fontFamily: "'JetBrains Mono', monospace" }}>
                  <div style={{ textAlign: 'right', color: trade.priceColor, fontWeight: 700 }}>{trade.price}</div>
                  <div style={{ textAlign: 'right', color: th.textMuted }}>{trade.vol}</div>
                  <div style={{ textAlign: 'right', color: th.textMuted }}>{trade.time}</div>
                  <div style={{ textAlign: 'center', fontWeight: 700, color: trade.sideColor, textTransform: 'uppercase' }}>{trade.side}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const OrderBook = memo(OrderBookInner)
export default OrderBook
