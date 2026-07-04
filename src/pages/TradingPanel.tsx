import { memo, useState, useMemo, useCallback, useEffect } from 'react'

type StockData = {
  name: string
  exchange: string
  ref: number
  price: number
  high: number
  low: number
  totalVol: string
  fBuy: string
  fSell: string
}

type PositionData = { qty: number; avgCost: number }
type OrderData = { side: string; qty: string; price: string; time: string; status: string; filled: boolean }

const STOCK_DB: Record<string, StockData> = {
  VCB: { name: 'Ngân hàng TMCP Ngoại thương Việt Nam', exchange: 'HOSE', ref: 81.5, price: 83.9, high: 84.2, low: 81.0, totalVol: '2,145,300', fBuy: '450k', fSell: '320k' },
  ACB: { name: 'Ngân hàng TMCP Á Châu', exchange: 'HOSE', ref: 22.9, price: 22.55, high: 23.1, low: 22.4, totalVol: '5,680,200', fBuy: '210k', fSell: '380k' },
  FPT: { name: 'CTCP FPT', exchange: 'HOSE', ref: 135.6, price: 137.5, high: 138.9, low: 134.8, totalVol: '1,340,100', fBuy: '620k', fSell: '180k' },
  HPG: { name: 'CTCP Tập đoàn Hòa Phát', exchange: 'HOSE', ref: 24.4, price: 24.1, high: 24.6, low: 23.9, totalVol: '8,920,400', fBuy: '340k', fSell: '410k' },
  BID: { name: 'Ngân hàng TMCP Đầu tư và PT VN', exchange: 'HOSE', ref: 45.0, price: 45.8, high: 46.1, low: 44.8, totalVol: '2,780,600', fBuy: '290k', fSell: '150k' },
}

const POSITION_DB: Record<string, PositionData> = {
  VCB: { qty: 500, avgCost: 79.5 },
  FPT: { qty: 100, avgCost: 135.0 },
}

const ORDERS_DB: Record<string, OrderData[]> = {
  VCB: [
    { side: 'MUA', qty: '200', price: '81.30', time: '09:32:15', status: 'ĐÃ KHỚP', filled: true },
    { side: 'BÁN', qty: '100', price: '82.00', time: '10:15:40', status: 'CHỜ KHỚP', filled: false },
  ],
}

const BUYING_POWER = 45280000

function TradingPanelInner() {
  const [symbol, setSymbol] = useState('VCB')
  const [symbolInput, setSymbolInput] = useState('VCB')
  const [showSuggest, setShowSuggest] = useState(false)
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY')
  const [orderType, setOrderType] = useState('LO')
  const [price, setPrice] = useState('81.50')
  const [qty, setQty] = useState(100)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderConfirmText, setOrderConfirmText] = useState('')

  const d = STOCK_DB[symbol] || STOCK_DB.VCB

  const th = useMemo(() => ({
    pageBg: 'var(--ds-color-bg-app)',
    cardBg: 'var(--ds-color-bg-nav)',
    cardBorder: 'var(--ds-color-border-default)',
    inputBg: 'var(--ds-color-bg-input)',
    rowBg: 'var(--ds-color-bg-row-odd)',
    iconBg: 'var(--ds-color-bg-elevated)',
    text: 'var(--ds-color-text-primary)',
    textMuted: 'var(--ds-color-text-muted)',
  }), [])

  const isUp = d.price >= d.ref
  const color = isUp ? 'var(--ds-color-market-up)' : 'var(--ds-color-market-down)'
  const change = d.price - d.ref
  const changePct = (change / d.ref) * 100
  const ceiling = (d.ref * 1.07).toFixed(2)
  const floor = (d.ref * 0.93).toFixed(2)
  const tickSize = d.price < 10 ? '0.01' : d.price < 50 ? '0.05' : '0.1'

  const priceNum = parseFloat(price) || 0
  const priceValid = priceNum >= parseFloat(floor) && priceNum <= parseFloat(ceiling)
  const orderValueNum = priceNum * qty
  const feeNum = orderValueNum * 0.0015
  const totalNum = side === 'BUY' ? orderValueNum + feeNum : orderValueNum - feeNum
  const holdingQty = POSITION_DB[symbol]?.qty || 0
  const canSubmit = qty > 0 && priceValid && (side === 'SELL' ? holdingQty >= qty : totalNum <= BUYING_POWER)

  const handleSymbolInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase()
    setSymbolInput(val)
    setShowSuggest(val.length > 0)
  }, [])

  const pickSymbol = useCallback((sym: string) => {
    const stock = STOCK_DB[sym]
    setSymbol(sym)
    setSymbolInput(sym)
    setShowSuggest(false)
    setPrice(stock.ref.toFixed(2))
  }, [])

  const handleSideChange = useCallback((newSide: 'BUY' | 'SELL') => setSide(newSide), [])

  const handlePriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setPrice(e.target.value), [])
  const handleQtyChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQty(parseInt(e.target.value.replace(/\D/g, '')) || 0)
  }, [])

  const incPrice = useCallback(() => setPrice(p => (parseFloat(p) + 0.05).toFixed(2)), [])
  const decPrice = useCallback(() => setPrice(p => Math.max(0, parseFloat(p) - 0.05).toFixed(2)), [])
  const incQty = useCallback(() => setQty(q => q + 100), [])
  const decQty = useCallback(() => setQty(q => Math.max(0, q - 100)), [])
  const setLot = useCallback((n: number) => setQty(n), [])
  const useFloor = useCallback(() => setPrice((d.ref * 0.93).toFixed(2)), [d.ref])
  const useRefPrice = useCallback(() => setPrice(d.ref.toFixed(2)), [d.ref])
  const useCeiling = useCallback(() => setPrice((d.ref * 1.07).toFixed(2)), [d.ref])

  const submitOrder = useCallback(() => {
    setOrderPlaced(true)
    setOrderConfirmText(`${side === 'BUY' ? 'Mua' : 'Bán'} ${qty.toLocaleString()} ${symbol} @ ${price}đ`)
    setTimeout(() => setOrderPlaced(false), 3500)
  }, [side, qty, symbol, price])

  useEffect(() => {
    const urlSym = new URLSearchParams(window.location.search).get('symbol')
    if (urlSym && STOCK_DB[urlSym]) {
      setSymbol(urlSym)
      setSymbolInput(urlSym)
      setPrice(STOCK_DB[urlSym].ref.toFixed(2))
    }
  }, [])

  const suggestions = useMemo(() =>
    Object.keys(STOCK_DB)
      .filter(s => s.includes(symbolInput))
      .map(s => ({ symbol: s, name: STOCK_DB[s].name.split(' ').slice(0, 3).join(' ') })),
    [symbolInput]
  )

  const orderTypes = useMemo(() => [
    { key: 'LO', label: 'LO' },
    { key: 'ATO', label: 'ATO' },
    { key: 'ATC', label: 'ATC' },
    { key: 'MP', label: 'MP' },
    { key: 'MTL', label: 'MTL' },
  ], [])

  const lotBtns = useMemo(() => [100, 500, 1000, 2000], [])

  const bids = useMemo(() => [0, 1, 2].map(i => {
    const p = (d.price - (i + 1) * parseFloat(tickSize)).toFixed(2)
    const vol = Math.floor(8000 + Math.random() * 40000)
    return { price: p, vol: (vol / 1000).toFixed(1) + 'k', barW: `${30 + Math.random() * 60}%` }
  }), [d.price, tickSize])

  const asks = useMemo(() => [0, 1, 2].map(i => {
    const p = (d.price + (i + 1) * parseFloat(tickSize)).toFixed(2)
    const vol = Math.floor(8000 + Math.random() * 40000)
    return { price: p, vol: (vol / 1000).toFixed(1) + 'k', barW: `${30 + Math.random() * 60}%` }
  }), [d.price, tickSize])

  const matchedTrades = useMemo(() => Array.from({ length: 8 }).map((_, i) => {
    const up = Math.random() > 0.5
    const p = (d.price + (Math.random() - 0.5) * parseFloat(tickSize) * 2).toFixed(2)
    const vol = Math.floor(500 + Math.random() * 9000)
    const mins = 32 - i
    return { time: `10:${String(Math.max(0, mins)).padStart(2, '0')}:0${i}`, price: p, vol: vol.toLocaleString(), color: up ? 'var(--ds-color-market-up)' : 'var(--ds-color-market-down)' }
  }), [d.price, tickSize])

  const positionRaw = POSITION_DB[symbol]
  const position = useMemo(() => {
    if (!positionRaw) return null
    const mv = positionRaw.qty * d.price
    const cost = positionRaw.qty * positionRaw.avgCost
    const pl = mv - cost
    return {
      qty: positionRaw.qty.toLocaleString(),
      avgCost: positionRaw.avgCost.toFixed(2) + 'đ',
      marketValue: mv.toLocaleString() + 'đ',
      pl: (pl >= 0 ? '+' : '') + pl.toLocaleString() + 'đ',
      plPct: (pl >= 0 ? '+' : '') + (pl / cost * 100).toFixed(1) + '%',
      plColor: pl >= 0 ? 'var(--ds-color-market-up)' : 'var(--ds-color-market-down)',
    }
  }, [positionRaw, d.price])

  const todayOrders = useMemo(() => {
    const raw = ORDERS_DB[symbol] || []
    return raw.map(o => ({
      ...o,
      sideColor: o.side === 'MUA' ? 'var(--ds-color-market-up)' : 'var(--ds-color-market-down)',
      statusColor: o.filled ? 'var(--ds-color-market-up)' : 'var(--ds-color-warning)',
      statusBg: o.filled ? 'rgba(34,197,94,.15)' : 'rgba(245,158,11,.15)',
    }))
  }, [symbol])

  const totalBidVol = useMemo(() => bids.reduce((s, b) => s + parseFloat(b.vol), 0).toFixed(1) + 'k', [bids])
  const totalAskVol = useMemo(() => asks.reduce((s, a) => s + parseFloat(a.vol), 0).toFixed(1) + 'k', [asks])

  const isLO = orderType === 'LO' || orderType === 'MTL'

  return (
    <div style={{ width: '100%', minHeight: '100%', background: th.pageBg, padding: 18, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ maxWidth: 1680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* SYMBOL HEADER */}
        <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 22 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <input
              type="text"
              value={symbolInput}
              onChange={handleSymbolInputChange}
              placeholder="Nhập mã..."
              style={{ width: 120, padding: '8px 10px', border: `1px solid ${th.cardBorder}`, borderRadius: 7, background: th.inputBg, color: th.text, fontSize: 14, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', outline: 'none' }}
              onFocus={() => symbolInput.length > 0 && setShowSuggest(true)}
              onBlur={() => setTimeout(() => setShowSuggest(false), 150)}
            />
            {showSuggest && suggestions.length > 0 && (
              <div style={{ position: 'absolute', top: 38, left: 0, background: 'var(--ds-color-bg-input)', border: `1px solid ${th.cardBorder}`, borderRadius: 8, overflow: 'hidden', zIndex: 50, width: 180, boxShadow: '0 12px 30px rgba(0,0,0,.5)' }}>
                {suggestions.map(sg => (
                  <div key={sg.symbol} onMouseDown={() => pickSymbol(sg.symbol)} style={{ padding: '8px 12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ds-color-text-link)', fontFamily: "'JetBrains Mono', monospace" }}>{sg.symbol}</span>
                    <span style={{ fontSize: 10, color: th.textMuted }}>{sg.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
            <span style={{ fontSize: 10.5, color: th.textMuted, fontWeight: 600 }}>{d.name}</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: th.textMuted, background: th.iconBg, padding: '2px 7px', borderRadius: 4, width: 'fit-content' }}>{d.exchange}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexShrink: 0 }}>
            <span style={{ fontSize: 28, fontWeight: 800, color, fontFamily: "'JetBrains Mono', monospace" }}>{d.price.toFixed(2)}</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color }}>{(change >= 0 ? '+' : '') + change.toFixed(2)}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color }}>{(changePct >= 0 ? '+' : '') + changePct.toFixed(2)}%</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 18, marginLeft: 'auto', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}><span style={{ fontSize: 9, color: 'var(--ds-color-purple-500)', display: 'block', fontWeight: 700 }}>TRẦN</span><span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ds-color-purple-500)', fontFamily: "'JetBrains Mono', monospace" }}>{ceiling}</span></div>
            <div style={{ textAlign: 'center' }}><span style={{ fontSize: 9, color: 'var(--ds-color-yellow-400)', display: 'block', fontWeight: 700 }}>TC</span><span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ds-color-yellow-400)', fontFamily: "'JetBrains Mono', monospace" }}>{d.ref.toFixed(2)}</span></div>
            <div style={{ textAlign: 'center' }}><span style={{ fontSize: 9, color: 'var(--ds-color-cyan-400)', display: 'block', fontWeight: 700 }}>SÀN</span><span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ds-color-cyan-400)', fontFamily: "'JetBrains Mono', monospace" }}>{floor}</span></div>
            <div style={{ width: 1, background: th.cardBorder }} />
            <div style={{ textAlign: 'center' }}><span style={{ fontSize: 9, color: th.textMuted, display: 'block', fontWeight: 700 }}>TỔNG KL</span><span style={{ fontSize: 12.5, fontWeight: 700, color: th.text, fontFamily: "'JetBrains Mono', monospace" }}>{d.totalVol}</span></div>
            <div style={{ textAlign: 'center' }}><span style={{ fontSize: 9, color: th.textMuted, display: 'block', fontWeight: 700 }}>CAO/THẤP</span><span style={{ fontSize: 12.5, fontWeight: 700, color: th.text, fontFamily: "'JetBrains Mono', monospace" }}>{d.high.toFixed(2)}/{d.low.toFixed(2)}</span></div>
            <div style={{ textAlign: 'center' }}><span style={{ fontSize: 9, color: th.textMuted, display: 'block', fontWeight: 700 }}>NN MUA/BÁN</span><span style={{ fontSize: 12.5, fontWeight: 700, color: th.text, fontFamily: "'JetBrains Mono', monospace" }}>{d.fBuy}/{d.fSell}</span></div>
          </div>
        </div>

        {/* MAIN 3-COLUMN LAYOUT */}
        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr 300px', gap: 12, alignItems: 'start' }}>

          {/* COL A: ORDER FORM */}
          <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* BUY/SELL buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              <button onClick={() => handleSideChange('BUY')} style={{ background: side === 'BUY' ? 'var(--ds-color-market-up)' : th.iconBg, color: side === 'BUY' ? '#fff' : th.textMuted, border: `1px solid ${side === 'BUY' ? 'var(--ds-color-green-600)' : th.cardBorder}`, borderRadius: 8, padding: 11, fontSize: 13, fontWeight: 800, cursor: 'pointer', transition: 'all .15s' }}>MUA</button>
              <button onClick={() => handleSideChange('SELL')} style={{ background: side === 'SELL' ? 'var(--ds-color-market-down)' : th.iconBg, color: side === 'SELL' ? '#fff' : th.textMuted, border: `1px solid ${side === 'SELL' ? 'var(--ds-color-red-600)' : th.cardBorder}`, borderRadius: 8, padding: 11, fontSize: 13, fontWeight: 800, cursor: 'pointer', transition: 'all .15s' }}>BÁN</button>
            </div>

            {/* ORDER TYPE CHIPS */}
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {orderTypes.map(ot => (
                <button key={ot.key} onClick={() => setOrderType(ot.key)} style={{ background: orderType === ot.key ? 'var(--ds-color-blue-500)' : th.iconBg, color: orderType === ot.key ? '#fff' : th.textMuted, border: `1px solid ${orderType === ot.key ? 'var(--ds-color-blue-600)' : th.cardBorder}`, borderRadius: 6, padding: '5px 10px', fontSize: 10.5, fontWeight: 700, cursor: 'pointer' }}>{ot.label}</button>
              ))}
            </div>

            {/* PRICE STEPPER (LO / MTL only) */}
            {isLO && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: th.textMuted, textTransform: 'uppercase' }}>Giá đặt</label>
                  <span style={{ fontSize: 9.5, color: th.textMuted }}>Bước giá: {tickSize}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'stretch', gap: 0, border: `1px solid ${th.cardBorder}`, borderRadius: 8, overflow: 'hidden' }}>
                  <button onClick={decPrice} style={{ width: 36, background: th.iconBg, border: 'none', borderRight: `1px solid ${th.cardBorder}`, color: th.text, cursor: 'pointer', fontSize: 16, fontWeight: 700 }}>−</button>
                  <input type="text" value={price} onChange={handlePriceChange} style={{ flex: 1, textAlign: 'center', padding: '9px 4px', border: 'none', background: th.inputBg, color: priceValid ? th.text : 'var(--ds-color-market-down)', fontSize: 15, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", outline: 'none' }} />
                  <button onClick={incPrice} style={{ width: 36, background: th.iconBg, border: 'none', borderLeft: `1px solid ${th.cardBorder}`, color: th.text, cursor: 'pointer', fontSize: 16, fontWeight: 700 }}>+</button>
                </div>
                <div style={{ display: 'flex', gap: 5 }}>
                  <button onClick={useFloor} style={{ flex: 1, background: th.iconBg, border: `1px solid ${th.cardBorder}`, color: 'var(--ds-color-cyan-400)', borderRadius: 5, padding: 5, fontSize: 9.5, fontWeight: 700, cursor: 'pointer' }}>Sàn {floor}</button>
                  <button onClick={useRefPrice} style={{ flex: 1, background: th.iconBg, border: `1px solid ${th.cardBorder}`, color: 'var(--ds-color-yellow-400)', borderRadius: 5, padding: 5, fontSize: 9.5, fontWeight: 700, cursor: 'pointer' }}>TC {d.ref.toFixed(2)}</button>
                  <button onClick={useCeiling} style={{ flex: 1, background: th.iconBg, border: `1px solid ${th.cardBorder}`, color: 'var(--ds-color-purple-500)', borderRadius: 5, padding: 5, fontSize: 9.5, fontWeight: 700, cursor: 'pointer' }}>Trần {ceiling}</button>
                </div>
              </div>
            )}

            {/* QUANTITY STEPPER */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: th.textMuted, textTransform: 'uppercase' }}>Khối lượng</label>
              <div style={{ display: 'flex', alignItems: 'stretch', border: `1px solid ${th.cardBorder}`, borderRadius: 8, overflow: 'hidden' }}>
                <button onClick={decQty} style={{ width: 36, background: th.iconBg, border: 'none', borderRight: `1px solid ${th.cardBorder}`, color: th.text, cursor: 'pointer', fontSize: 16, fontWeight: 700 }}>−</button>
                <input type="text" value={qty} onChange={handleQtyChange} style={{ flex: 1, textAlign: 'center', padding: '9px 4px', border: 'none', background: th.inputBg, color: th.text, fontSize: 15, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", outline: 'none' }} />
                <button onClick={incQty} style={{ width: 36, background: th.iconBg, border: 'none', borderLeft: `1px solid ${th.cardBorder}`, color: th.text, cursor: 'pointer', fontSize: 16, fontWeight: 700 }}>+</button>
              </div>
              <div style={{ display: 'flex', gap: 5 }}>
                {lotBtns.map(n => (
                  <button key={n} onClick={() => setLot(n)} style={{ flex: 1, background: th.iconBg, border: `1px solid ${th.cardBorder}`, color: th.textMuted, borderRadius: 5, padding: 5, fontSize: 9.5, fontWeight: 700, cursor: 'pointer' }}>{n.toLocaleString()}</button>
                ))}
              </div>
            </div>

            {/* SUMMARY */}
            <div style={{ background: th.inputBg, borderRadius: 8, padding: 11, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}><span style={{ color: th.textMuted }}>Giá trị lệnh</span><span style={{ color: th.text, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{orderValueNum.toLocaleString()}đ</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}><span style={{ color: th.textMuted }}>Phí giao dịch (0.15%)</span><span style={{ color: 'var(--ds-color-warning)', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{feeNum.toLocaleString(undefined, { maximumFractionDigits: 0 })}đ</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, borderTop: `1px solid ${th.cardBorder}`, paddingTop: 6 }}><span style={{ color: th.text, fontWeight: 700 }}>{side === 'BUY' ? 'Tổng thanh toán' : 'Tổng nhận về'}</span><span style={{ color, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>{totalNum.toLocaleString(undefined, { maximumFractionDigits: 0 })}đ</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10 }}><span style={{ color: th.textMuted }}>{side === 'BUY' ? 'Sức mua khả dụng' : 'Số lượng khả dụng'}</span><span style={{ color: side === 'BUY' ? (totalNum <= BUYING_POWER ? 'var(--ds-color-market-up)' : 'var(--ds-color-market-down)') : (qty <= holdingQty ? 'var(--ds-color-market-up)' : 'var(--ds-color-market-down)'), fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{side === 'BUY' ? BUYING_POWER.toLocaleString() + 'đ' : holdingQty.toLocaleString() + ' CP'}</span></div>
            </div>

            {/* SUBMIT BUTTON */}
            <button onClick={submitOrder} disabled={!canSubmit} style={{ background: !canSubmit ? 'var(--ds-color-neutral-800)' : side === 'BUY' ? 'var(--ds-color-market-up)' : 'var(--ds-color-market-down)', border: 'none', color: '#fff', borderRadius: 9, padding: 13, fontSize: 14, fontWeight: 800, cursor: canSubmit ? 'pointer' : 'not-allowed', boxShadow: `0 8px 22px ${side === 'BUY' ? 'rgba(34,197,94,.3)' : 'rgba(244,63,94,.3)'}`, letterSpacing: 0.3 }}>
              {side === 'BUY' ? `✓ ĐẶT MUA ${symbol}` : `✓ ĐẶT BÁN ${symbol}`}
            </button>

            {/* ORDER CONFIRMATION */}
            {orderPlaced && (
              <div style={{ background: 'rgba(34,197,94,.1)', border: '1px solid var(--ds-color-market-up)', borderRadius: 8, padding: 10, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 14 }}>✓</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ds-color-market-up)' }}>Đặt lệnh thành công</span>
                  <span style={{ fontSize: 10, color: th.textMuted }}>{orderConfirmText}</span>
                </div>
              </div>
            )}
          </div>

          {/* COL B: DEPTH LADDER + MATCHED TRADES */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h3 style={{ margin: 0, fontSize: 11, fontWeight: 700, color: th.text, textTransform: 'uppercase' }}>Sổ lệnh thị trường (Order Book)</h3>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ds-color-market-up)', animation: 'pulse 2s infinite' }} />
                  <span style={{ fontSize: 9, color: th.textMuted, fontWeight: 700 }}>LIVE</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {/* BID */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', fontSize: 9, color: th.textMuted, fontWeight: 700, padding: '0 2px' }}><span>GIÁ MUA</span><span style={{ textAlign: 'right' }}>KL</span></div>
                  {bids.map((b, i) => (
                    <div key={i} onClick={() => setPrice(b.price)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', position: 'relative', cursor: 'pointer', borderRadius: 5, overflow: 'hidden', background: th.rowBg }}>
                      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: b.barW, background: 'rgba(34,197,94,.18)' }} />
                      <span style={{ position: 'relative', padding: '6px 8px', fontSize: 12, fontWeight: 800, color: 'var(--ds-color-market-up)', fontFamily: "'JetBrains Mono', monospace" }}>{b.price}</span>
                      <span style={{ position: 'relative', padding: '6px 8px', textAlign: 'right', fontSize: 11, color: th.text, fontFamily: "'JetBrains Mono', monospace" }}>{b.vol}</span>
                    </div>
                  ))}
                </div>
                {/* ASK */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', fontSize: 9, color: th.textMuted, fontWeight: 700, padding: '0 2px' }}><span>GIÁ BÁN</span><span style={{ textAlign: 'right' }}>KL</span></div>
                  {asks.map((a, i) => (
                    <div key={i} onClick={() => setPrice(a.price)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', position: 'relative', cursor: 'pointer', borderRadius: 5, overflow: 'hidden', background: th.rowBg }}>
                      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: a.barW, background: 'rgba(244,63,94,.18)' }} />
                      <span style={{ position: 'relative', padding: '6px 8px', fontSize: 12, fontWeight: 800, color: 'var(--ds-color-market-down)', fontFamily: "'JetBrains Mono', monospace" }}>{a.price}</span>
                      <span style={{ position: 'relative', padding: '6px 8px', textAlign: 'right', fontSize: 11, color: th.text, fontFamily: "'JetBrains Mono', monospace" }}>{a.vol}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: `1px solid ${th.cardBorder}` }}>
                <span style={{ fontSize: 9.5, color: th.textMuted }}>Tổng dư mua: <b style={{ color: 'var(--ds-color-market-up)' }}>{totalBidVol}</b></span>
                <span style={{ fontSize: 9.5, color: th.textMuted }}>Tổng dư bán: <b style={{ color: 'var(--ds-color-market-down)' }}>{totalAskVol}</b></span>
              </div>
            </div>

            {/* MATCHED TRADES TICKER */}
            <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: '14px 16px' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: 11, fontWeight: 700, color: th.text, textTransform: 'uppercase' }}>Khớp lệnh gần nhất</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 170, overflowY: 'auto' }}>
                {matchedTrades.map((m, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '5px 6px', fontSize: 10.5, fontFamily: "'JetBrains Mono', monospace" }}>
                    <span style={{ color: th.textMuted }}>{m.time}</span>
                    <span style={{ textAlign: 'center', fontWeight: 700, color: m.color }}>{m.price}</span>
                    <span style={{ textAlign: 'right', color: th.textMuted }}>{m.vol}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COL C: ACCOUNT + POSITION */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: 16 }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: 11, fontWeight: 700, color: th.text, textTransform: 'uppercase' }}>Tài khoản 069C123456</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 10.5, color: th.textMuted }}>Sức mua</span><span style={{ fontSize: 12, fontWeight: 800, color: 'var(--ds-color-market-up)', fontFamily: "'JetBrains Mono', monospace" }}>{BUYING_POWER.toLocaleString()}đ</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 10.5, color: th.textMuted }}>Tiền mặt</span><span style={{ fontSize: 11.5, fontWeight: 700, color: th.text, fontFamily: "'JetBrains Mono', monospace" }}>18,450,000đ</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 10.5, color: th.textMuted }}>Giá trị CK</span><span style={{ fontSize: 11.5, fontWeight: 700, color: th.text, fontFamily: "'JetBrains Mono', monospace" }}>62,300,000đ</span></div>
                <div style={{ height: 1, background: th.cardBorder, margin: '2px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 10.5, color: th.textMuted }}>Tỷ lệ ký quỹ</span><span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ds-color-market-up)', fontFamily: "'JetBrains Mono', monospace" }}>14%</span></div>
                <div style={{ height: 5, background: th.iconBg, borderRadius: 3, overflow: 'hidden' }}><div style={{ height: '100%', width: '14%', background: 'var(--ds-color-market-up)' }} /></div>
              </div>
            </div>

            {position && (
              <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: 16 }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: 11, fontWeight: 700, color: th.text, textTransform: 'uppercase' }}>Vị thế {symbol} hiện có</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 10.5, color: th.textMuted }}>Số lượng</span><span style={{ fontSize: 11.5, fontWeight: 700, color: th.text, fontFamily: "'JetBrains Mono', monospace" }}>{position.qty}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 10.5, color: th.textMuted }}>Giá vốn TB</span><span style={{ fontSize: 11.5, fontWeight: 700, color: th.text, fontFamily: "'JetBrains Mono', monospace" }}>{position.avgCost}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 10.5, color: th.textMuted }}>Giá trị hiện tại</span><span style={{ fontSize: 11.5, fontWeight: 700, color: th.text, fontFamily: "'JetBrains Mono', monospace" }}>{position.marketValue}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${th.cardBorder}`, paddingTop: 7 }}><span style={{ fontSize: 10.5, color: th.textMuted }}>Lãi/Lỗ</span><span style={{ fontSize: 12, fontWeight: 800, color: position.plColor, fontFamily: "'JetBrains Mono', monospace" }}>{position.pl} ({position.plPct})</span></div>
                </div>
              </div>
            )}

            <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: 16 }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: 11, fontWeight: 700, color: th.text, textTransform: 'uppercase' }}>Lệnh trong ngày — {symbol}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {todayOrders.length > 0 ? todayOrders.map((o, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 9px', background: th.rowBg, borderRadius: 6 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <span style={{ fontSize: 10.5, fontWeight: 700, color: o.sideColor }}>{o.side} {o.qty} @ {o.price}</span>
                      <span style={{ fontSize: 9, color: th.textMuted }}>{o.time}</span>
                    </div>
                    <span style={{ fontSize: 8.5, fontWeight: 700, color: o.statusColor, background: o.statusBg, padding: '2px 7px', borderRadius: 10 }}>{o.status}</span>
                  </div>
                )) : (
                  <span style={{ fontSize: 10.5, color: th.textMuted, textAlign: 'center', padding: '10px 0' }}>Chưa có lệnh nào hôm nay</span>
                )}
              </div>
              <div style={{ display: 'block', textAlign: 'center', marginTop: 10, fontSize: 10, color: 'var(--ds-color-text-link)', fontWeight: 700, cursor: 'pointer' }}>Xem tất cả lịch sử lệnh →</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const TradingPanel = memo(TradingPanelInner)
export default TradingPanel
