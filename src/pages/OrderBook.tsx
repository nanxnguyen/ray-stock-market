import { memo, useState, useMemo, useEffect } from 'react'

function OrderBookInner() {
  const [symbol] = useState(() => new URLSearchParams(window.location.search).get('symbol') || 'VCB')
  const [lastPrice, setLastPrice] = useState(81.50)

  const th = useMemo(() => ({
    appBg: 'var(--ds-color-bg-app)',
    cardBg: 'var(--ds-color-bg-card)',
    cardBorder: 'var(--ds-color-border-default)',
    text: 'var(--ds-color-text-primary)',
    textMuted: 'var(--ds-color-text-muted)',
    inputBg: 'var(--ds-color-bg-input)',
    iconBg: 'var(--ds-color-bg-elevated)',
  }), [])

  useEffect(() => {
    const interval = setInterval(() => {
      const rand = (Math.random() - 0.5) * 0.50
      setLastPrice(p => Math.max(70, Math.min(95, p + rand)))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const quickChips = ['VCB', 'ACB', 'FPT', 'HPG', 'BID']

  const bids = useMemo(() => {
    const arr = Array.from({ length: 10 }, (_, i) => {
      const price = lastPrice - (i + 1) * 0.10
      const vol = 10000 + ((i * 7919 + 12345) % 50000)
      return { price: price.toFixed(2), vol, volLabel: (vol / 1000).toFixed(1) + 'k' }
    })
    const maxVol = Math.max(...arr.map(b => b.vol))
    return arr.map(b => ({ ...b, barW: Math.round(b.vol / maxVol * 100) + '%' }))
  }, [lastPrice])

  const asks = useMemo(() => {
    const arr = Array.from({ length: 10 }, (_, i) => {
      const price = lastPrice + (i + 1) * 0.10
      const vol = 10000 + ((i * 7919 + 54321) % 50000)
      return { price: price.toFixed(2), vol, volLabel: (vol / 1000).toFixed(1) + 'k' }
    })
    const maxVol = Math.max(...arr.map(a => a.vol))
    return arr.map(a => ({ ...a, barW: Math.round(a.vol / maxVol * 100) + '%' }))
  }, [lastPrice])

  const bidVolTotal = useMemo(() => bids.reduce((s, b) => s + b.vol, 0), [bids])
  const askVolTotal = useMemo(() => asks.reduce((s, a) => s + a.vol, 0), [asks])
  const bidVolLabel = useMemo(() => (bidVolTotal / 1000).toFixed(1) + 'k', [bidVolTotal])
  const askVolLabel = useMemo(() => (askVolTotal / 1000).toFixed(1) + 'k', [askVolTotal])
  const spread = useMemo(() => '0.10', [])
  const imbalance = useMemo(() => {
    const val = ((bidVolTotal / (bidVolTotal + askVolTotal) - 0.5) * 100)
    return { label: (val >= 0 ? '+' : '') + val.toFixed(1) + '%', color: val >= 0 ? 'var(--ds-color-market-up)' : 'var(--ds-color-market-down)' }
  }, [bidVolTotal, askVolTotal])
  const imbalancePct = useMemo(() => Math.round(bidVolTotal / (bidVolTotal + askVolTotal) * 100), [bidVolTotal, askVolTotal])

  const recentTrades = useMemo(() => [
    { time: '15:29:45', price: '81.50', vol: '5,200', side: '▲', priceColor: 'var(--ds-color-market-up)', sideColor: 'var(--ds-color-market-up)', sideBg: 'rgba(34,197,94,.06)' },
    { time: '15:29:40', price: '81.45', vol: '2,800', side: '▼', priceColor: 'var(--ds-color-market-down)', sideColor: 'var(--ds-color-market-down)', sideBg: 'rgba(244,63,94,.06)' },
    { time: '15:29:35', price: '81.50', vol: '3,400', side: '▲', priceColor: 'var(--ds-color-market-up)', sideColor: 'var(--ds-color-market-up)', sideBg: 'rgba(34,197,94,.06)' },
    { time: '15:29:30', price: '81.40', vol: '8,900', side: '▼', priceColor: 'var(--ds-color-market-down)', sideColor: 'var(--ds-color-market-down)', sideBg: 'rgba(244,63,94,.06)' },
    { time: '15:29:25', price: '81.55', vol: '2,100', side: '▲', priceColor: 'var(--ds-color-market-up)', sideColor: 'var(--ds-color-market-up)', sideBg: 'rgba(34,197,94,.06)' },
    { time: '15:29:20', price: '81.48', vol: '1,500', side: '▼', priceColor: 'var(--ds-color-market-down)', sideColor: 'var(--ds-color-market-down)', sideBg: 'rgba(244,63,94,.06)' },
    { time: '15:29:15', price: '81.52', vol: '4,100', side: '▲', priceColor: 'var(--ds-color-market-up)', sideColor: 'var(--ds-color-market-up)', sideBg: 'rgba(34,197,94,.06)' },
    { time: '15:29:10', price: '81.47', vol: '3,200', side: '▼', priceColor: 'var(--ds-color-market-down)', sideColor: 'var(--ds-color-market-down)', sideBg: 'rgba(244,63,94,.06)' },
    { time: '15:29:05', price: '81.51', vol: '2,600', side: '▲', priceColor: 'var(--ds-color-market-up)', sideColor: 'var(--ds-color-market-up)', sideBg: 'rgba(34,197,94,.06)' },
    { time: '15:29:00', price: '81.49', vol: '1,800', side: '▼', priceColor: 'var(--ds-color-market-down)', sideColor: 'var(--ds-color-market-down)', sideBg: 'rgba(244,63,94,.06)' },
  ], [])

  const totalMatched = useMemo(() => recentTrades.reduce((s, t) => s + parseInt(t.vol.replace(/,/g, '')), 0).toLocaleString(), [recentTrades])

  const lastPriceColor = lastPrice >= 81.50 ? 'var(--ds-color-market-up)' : 'var(--ds-color-market-down)'

  return (
    <div style={{ width: '100%', minHeight: '100%', boxSizing: 'border-box', background: th.appBg, padding: '32px 16px', display: 'flex', justifyContent: 'center', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16, background: th.cardBg, borderRadius: 12, border: `1px solid ${th.cardBorder}`, maxWidth: 1680, width: '100%', margin: '0 auto', height: 'fit-content' }}>

        {/* ══ SYMBOL HEADER ══ */}
        <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 22 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <input
              type="text"
              defaultValue={symbol}
              placeholder="Nhập mã..."
              style={{ width: 110, padding: '8px 10px', border: `1px solid ${th.cardBorder}`, borderRadius: 7, background: th.inputBg, color: th.text, fontSize: 14, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            {quickChips.map(qc => (
              <button
                key={qc}
                style={{
                  background: qc === symbol ? 'var(--ds-color-blue-600)' : th.iconBg,
                  color: qc === symbol ? '#fff' : th.textMuted,
                  border: `1px solid ${qc === symbol ? 'var(--ds-color-blue-700)' : th.cardBorder}`,
                  borderRadius: 6, padding: '5px 10px', fontSize: 10.5, fontWeight: 700, cursor: 'pointer',
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {qc}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
            <span style={{ fontSize: 10.5, color: th.textMuted, fontWeight: 600 }}>Ngân hàng TMCP Ngoại thương Việt Nam</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: th.textMuted, background: th.iconBg, padding: '2px 7px', borderRadius: 4, width: 'fit-content' }}>HOSE</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexShrink: 0 }}>
            <span style={{ fontSize: 26, fontWeight: 800, color: lastPriceColor, fontFamily: "'JetBrains Mono', monospace" }}>{lastPrice.toFixed(2)}</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: lastPriceColor }}>+2.40</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: lastPriceColor }}>+2.94%</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.3)', borderRadius: 20, padding: '5px 12px', marginLeft: 'auto' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: '#22c55e' }}>LIVE</span>
          </div>
        </div>

        {/* ══ MAIN 2-COLUMN GRID ══ */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 12, alignItems: 'start' }}>

          {/* ══ COL A: UNIFIED DEPTH LADDER ══ */}
          <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <h3 style={{ margin: 0, fontSize: 12, fontWeight: 700, color: th.text, textTransform: 'uppercase', letterSpacing: 0.4 }}>Độ sâu thị trường (Level 2)</h3>
              <span style={{ fontSize: 9.5, color: th.textMuted, fontWeight: 600 }}>10 mức giá mỗi bên</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', fontSize: 9, color: th.textMuted, fontWeight: 700, padding: '0 4px 6px', textTransform: 'uppercase' }}>
              <span>Dư mua</span>
              <span style={{ textAlign: 'right' }}>Dư bán</span>
            </div>

            {/* ASKS (reversed — best ask nearest to spread) */}
            <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: 2 }}>
              {asks.map((ask, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 90px 1fr', alignItems: 'center', position: 'relative', cursor: 'pointer', borderRadius: 4, overflow: 'hidden', height: 22 }}>
                  <div />
                  <div style={{ position: 'relative', textAlign: 'center' }}>
                    <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: ask.barW, background: 'rgba(244,63,94,.16)' }} />
                    <span style={{ position: 'relative', fontSize: 11.5, fontWeight: 800, color: 'var(--ds-color-market-down)', fontFamily: "'JetBrains Mono', monospace" }}>{ask.price}</span>
                  </div>
                  <span style={{ textAlign: 'right', paddingRight: 8, fontSize: 10.5, color: th.text, fontFamily: "'JetBrains Mono', monospace" }}>{ask.volLabel}</span>
                </div>
              ))}
            </div>

            {/* SPREAD ROW */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '10px 0', margin: '4px 0', borderTop: `1px dashed ${th.cardBorder}`, borderBottom: `1px dashed ${th.cardBorder}` }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: lastPriceColor, fontFamily: "'JetBrains Mono', monospace" }}>{lastPrice.toFixed(2)}</span>
              <span style={{ fontSize: 10, color: th.textMuted, fontWeight: 700 }}>Spread <b style={{ color: 'var(--ds-color-warning)' }}>{spread}</b></span>
            </div>

            {/* BIDS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {bids.map((bid, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 90px 1fr', alignItems: 'center', position: 'relative', cursor: 'pointer', borderRadius: 4, overflow: 'hidden', height: 22 }}>
                  <span style={{ textAlign: 'left', paddingLeft: 8, fontSize: 10.5, color: th.text, fontFamily: "'JetBrains Mono', monospace" }}>{bid.volLabel}</span>
                  <div style={{ position: 'relative', textAlign: 'center' }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: bid.barW, background: 'rgba(34,197,94,.16)' }} />
                    <span style={{ position: 'relative', fontSize: 11.5, fontWeight: 800, color: 'var(--ds-color-market-up)', fontFamily: "'JetBrains Mono', monospace" }}>{bid.price}</span>
                  </div>
                  <div />
                </div>
              ))}
            </div>

            {/* IMBALANCE BAR */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 14, paddingTop: 12, borderTop: `1px solid ${th.cardBorder}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, fontWeight: 700 }}>
                <span style={{ color: 'var(--ds-color-market-up)' }}>Dư mua {bidVolLabel}</span>
                <span style={{ color: th.textMuted }}>Tương quan cung/cầu</span>
                <span style={{ color: 'var(--ds-color-market-down)' }}>Dư bán {askVolLabel}</span>
              </div>
              <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', background: th.iconBg }}>
                <div style={{ width: imbalancePct + '%', background: 'var(--ds-color-market-up)' }} />
                <div style={{ flex: 1, background: 'var(--ds-color-market-down)' }} />
              </div>
            </div>
          </div>

          {/* ══ COL B: STATS + RECENT TRADES ══ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Stats boxes */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: 11, background: th.cardBg, borderRadius: 10, border: `1px solid ${th.cardBorder}` }}>
                <span style={{ fontSize: 9, color: th.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>Tổng KL khớp</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: th.text, fontFamily: "'JetBrains Mono', monospace" }}>{totalMatched}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: 11, background: th.cardBg, borderRadius: 10, border: `1px solid ${th.cardBorder}` }}>
                <span style={{ fontSize: 9, color: th.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>Imbalance</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: imbalance.color, fontFamily: "'JetBrains Mono', monospace" }}>{imbalance.label}</span>
              </div>
            </div>

            {/* Recent Trades */}
            <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: '14px 16px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: 11, fontWeight: 700, color: th.text, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }} />
                Khớp lệnh gần nhất
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '56px 1fr 56px 40px', fontSize: 8.5, color: th.textMuted, fontWeight: 700, padding: '0 4px 6px', textTransform: 'uppercase' }}>
                <span>Giờ</span>
                <span style={{ textAlign: 'right' }}>Giá</span>
                <span style={{ textAlign: 'right' }}>KL</span>
                <span style={{ textAlign: 'center' }}>Chiều</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 420, overflowY: 'auto' }}>
                {recentTrades.map((trade, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '56px 1fr 56px 40px', padding: '6px 4px', background: trade.sideBg, borderRadius: 5, fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>
                    <span style={{ color: th.textMuted }}>{trade.time}</span>
                    <span style={{ textAlign: 'right', fontWeight: 700, color: trade.priceColor }}>{trade.price}</span>
                    <span style={{ textAlign: 'right', color: th.text }}>{trade.vol}</span>
                    <span style={{ textAlign: 'center', fontWeight: 800, color: trade.sideColor }}>{trade.side}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const OrderBook = memo(OrderBookInner)
export default OrderBook
