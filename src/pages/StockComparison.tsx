import { memo, useState } from 'react'

const stockPrices: Record<string, { price: number; change: string; pe: number; pb: number; div: string; h52: number; l52: number; ytd: string }> = {
  VCB: { price: 81.50, change: '+2.98%', pe: 11.2, pb: 1.45, div: '3.2%', h52: 95.0, l52: 72.5, ytd: '+18.5%' },
  ACB: { price: 22.65, change: '-1.95%', pe: 8.9, pb: 1.12, div: '4.1%', h52: 26.5, l52: 20.5, ytd: '+12.3%' },
  FPT: { price: 137.50, change: '+0.88%', pe: 18.5, pb: 3.2, div: '1.8%', h52: 156.0, l52: 115.5, ytd: '+25.7%' },
  HPG: { price: 24.10, change: '-1.23%', pe: 6.5, pb: 0.95, div: '2.5%', h52: 28.5, l52: 21.0, ytd: '-5.3%' },
  BID: { price: 45.80, change: '+1.77%', pe: 13.2, pb: 1.68, div: '2.1%', h52: 52.0, l52: 38.5, ytd: '+8.2%' },
}

const colors = ['#60a5fa', '#22c55e', '#f59e0b', '#f43f5e', '#8b5cf6']

function StockComparisonInner() {
  const [selectedStocks, setSelectedStocks] = useState<string[]>(['VCB', 'ACB'])
  const [showAddStock, setShowAddStock] = useState(false)
  const [timeframe, setTimeframe] = useState('1M')

  const addStock = (sym: string) => {
    if (!selectedStocks.includes(sym) && selectedStocks.length < 5) {
      setSelectedStocks([...selectedStocks, sym])
    }
    setShowAddStock(false)
  }

  const removeStock = (sym: string) => {
    setSelectedStocks(selectedStocks.filter((s) => s !== sym))
  }

  const selectedData = selectedStocks.map((sym, i) => ({
    symbol: sym,
    ...stockPrices[sym],
    color: colors[i],
  }))

  const comparisonData = selectedData.map((s) => ({
    symbol: s.symbol,
    symbolColor: s.color,
    price: s.price.toFixed(2) + 'đ',
    priceColor: '#e4e6eb',
    change: s.change,
    changeColor: s.change.startsWith('+') ? '#22c55e' : '#f43f5e',
    pe: s.pe.toFixed(1) + 'x',
    pb: s.pb.toFixed(2) + 'x',
    dividend: s.div,
    dividendColor: '#f59e0b',
    h52: s.h52.toFixed(1) + 'đ',
    l52: s.l52.toFixed(1) + 'đ',
  }))

  const chartBars = Array.from({ length: 20 }, (_, i) => {
    const stockIdx = i % selectedStocks.length
    return {
      height: `${30 + Math.random() * 50}%`,
      color: selectedData[stockIdx]?.color || '#60a5fa',
    }
  })

  const availableStocks = Object.keys(stockPrices)
    .filter((s) => !selectedStocks.includes(s))
    .map((s) => ({
      symbol: s,
    }))

  const timeframes = ['1D', '1W', '1M', '3M', '1Y']

  const maxPrice = (Math.max(...selectedData.map((s) => s.price)) * 1.1).toFixed(2)
  const minPrice = (Math.min(...selectedData.map((s) => s.price)) * 0.9).toFixed(2)
  const midPrice = ((parseFloat(maxPrice) + parseFloat(minPrice)) / 2).toFixed(2)

  return (
    <div style={{
      width: '100%', minHeight: '100vh', boxSizing: 'border-box',
      background: '#060c18', padding: '32px 16px', display: 'flex', justifyContent: 'center',
    }}>
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 12, padding: 16,
        background: '#1a1f26', borderRadius: 12, border: '1px solid #2a3139',
        maxWidth: 1680, width: '100%', margin: '0 auto', height: 'fit-content',
      }}>

        {/* Navigation Header */}
        <div style={{ background: '#0d1420', border: '1px solid #1c2534', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '10px 18px', borderBottom: '1px solid #1c2534', overflowX: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
              <div style={{ width: 24, height: 24, background: 'linear-gradient(135deg, #22c55e, #16a34a)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="12" height="10" viewBox="0 0 14 12"><polygon points="7,0 14,12 0,12" fill="#fff" /></svg>
              </div>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#fff', whiteSpace: 'nowrap' }}>Ray <span style={{ color: '#22c55e' }}>Stock</span></span>
            </div>
            <div style={{ display: 'flex', flexShrink: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', padding: '0 16px', borderRight: '1px solid #1c2534', minWidth: 118 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}><span style={{ fontSize: 9.5, fontWeight: 700, color: '#8a94a6', letterSpacing: '.3px' }}>VNINDEX</span><span style={{ fontSize: 13, fontWeight: 800, color: '#22c55e', fontFamily: "'JetBrains Mono', monospace" }}>1,862.08</span></div>
                <span style={{ fontSize: 9.5, color: '#22c55e', fontWeight: 700 }}>+4.27 +0.23%</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', padding: '0 16px', borderRight: '1px solid #1c2534', minWidth: 118 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}><span style={{ fontSize: 9.5, fontWeight: 700, color: '#8a94a6', letterSpacing: '.3px' }}>HNX</span><span style={{ fontSize: 13, fontWeight: 800, color: '#22c55e', fontFamily: "'JetBrains Mono', monospace" }}>307.57</span></div>
                <span style={{ fontSize: 9.5, color: '#22c55e', fontWeight: 700 }}>+0.84 +0.27%</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', padding: '0 16px', minWidth: 118 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}><span style={{ fontSize: 9.5, fontWeight: 700, color: '#8a94a6', letterSpacing: '.3px' }}>UPCOM</span><span style={{ fontSize: 13, fontWeight: 800, color: '#f43f5e', fontFamily: "'JetBrains Mono', monospace" }}>128.01</span></div>
                <span style={{ fontSize: 9.5, color: '#f43f5e', fontWeight: 700 }}>-0.66 -0.51%</span>
              </div>
            </div>
            <span style={{ marginLeft: 'auto', fontSize: 10, color: '#4a6080', fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 }}>04/07/2026 · 15:00:00</span>
          </div>
          <div style={{ display: 'flex', gap: 6, padding: '8px 14px', overflowX: 'auto' }}>
            {['🏠 Trang chủ', '💼 Danh mục', '💰 Đặt lệnh', '📖 Sổ lệnh', '🗺️ Heatmap', '📊 So sánh', '🔍 Screener', '📰 Tin tức', '📅 Sự kiện', '⚙️ Cài đặt'].map((label) => (
              <a key={label} href="#" style={{ textDecoration: 'none', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5, background: '#141d2e', border: '1px solid #1c2534', color: '#c3ccd9', borderRadius: 7, padding: '6px 12px', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>{label}</a>
            ))}
          </div>
        </div>

        {/* Header */}
        <div style={{ borderBottom: '1px solid #2a3139', paddingBottom: 10 }}>
          <h2 style={{ margin: '0 0 8px 0', fontSize: 16, fontWeight: 700, color: '#e4e6eb' }}>SO SÁNH CỔ PHIẾU</h2>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {selectedData.map((stock) => (
              <div key={stock.symbol} style={{ display: 'flex', alignItems: 'center', gap: 6, background: `rgba(${parseInt(stock.color.slice(1, 3), 16)}, ${parseInt(stock.color.slice(3, 5), 16)}, ${parseInt(stock.color.slice(5, 7), 16)}, 0.1)`, padding: '6px 10px', borderRadius: 4, border: `1px solid ${stock.color}` }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: stock.color, fontFamily: "'JetBrains Mono', monospace" }}>{stock.symbol}</span>
                <button onClick={() => removeStock(stock.symbol)} style={{ background: 'transparent', border: 'none', color: stock.color, cursor: 'pointer', fontSize: 12, padding: 0 }}>✕</button>
              </div>
            ))}
            {selectedStocks.length < 5 && (
              <button onClick={() => setShowAddStock(!showAddStock)} style={{ background: '#1a1f26', border: '1px solid #2a3139', color: '#8a92a0', borderRadius: 4, padding: '6px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>+ Thêm</button>
            )}
          </div>
        </div>

        {/* Add Stock Dropdown */}
        {showAddStock && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, padding: 10, background: '#1a1f26', borderRadius: 4, border: '1px solid #2a3139' }}>
            {availableStocks.map((astk) => (
              <button key={astk.symbol} onClick={() => addStock(astk.symbol)} style={{ background: '#1a1f26', border: '1px solid #2a3139', color: '#8a92a0', borderRadius: 4, padding: '4px 8px', fontSize: 9, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>{astk.symbol}</button>
            ))}
          </div>
        )}

        {/* Price Chart */}
        <div style={{ background: '#1a1f26', border: '1px solid #2a3139', borderRadius: 4, padding: 12, height: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: 2, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 8, pointerEvents: 'none', fontSize: 9, color: '#8a92a0' }}>
            <span>{maxPrice}</span>
            <span>{midPrice}</span>
            <span>{minPrice}</span>
          </div>
          {chartBars.map((bar, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
              <div style={{ width: '100%', background: bar.color, height: bar.height, borderRadius: 2, opacity: 0.8, transition: 'all .2s' }} />
            </div>
          ))}
        </div>

        {/* Legend & Timeframe */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {selectedData.map((leg) => (
              <div key={leg.symbol} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10 }}>
                <span style={{ width: 8, height: 8, background: leg.color, borderRadius: 2 }} />
                <span style={{ color: '#e4e6eb', fontWeight: 700 }}>{leg.symbol}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {timeframes.map((tf) => (
              <button key={tf} onClick={() => setTimeframe(tf)} style={{ background: timeframe === tf ? '#3b82f6' : '#1a1f26', border: timeframe === tf ? '1px solid #3b82f6' : '1px solid #2a3139', color: timeframe === tf ? '#fff' : '#8a92a0', borderRadius: 3, padding: '4px 8px', fontSize: 9, fontWeight: 700, cursor: 'pointer' }}>{tf}</button>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2a3139', height: 28, background: '#1a1f26' }}>
                <th style={{ textAlign: 'left', padding: 6, color: '#8a92a0', fontWeight: 700, textTransform: 'uppercase', minWidth: 80 }}>Mã CK</th>
                <th style={{ textAlign: 'right', padding: 6, color: '#8a92a0', fontWeight: 700, textTransform: 'uppercase' }}>Giá</th>
                <th style={{ textAlign: 'right', padding: 6, color: '#8a92a0', fontWeight: 700, textTransform: 'uppercase' }}>% Thay đổi</th>
                <th style={{ textAlign: 'right', padding: 6, color: '#8a92a0', fontWeight: 700, textTransform: 'uppercase' }}>P/E</th>
                <th style={{ textAlign: 'right', padding: 6, color: '#8a92a0', fontWeight: 700, textTransform: 'uppercase' }}>P/B</th>
                <th style={{ textAlign: 'right', padding: 6, color: '#8a92a0', fontWeight: 700, textTransform: 'uppercase' }}>Dividend</th>
                <th style={{ textAlign: 'right', padding: 6, color: '#8a92a0', fontWeight: 700, textTransform: 'uppercase' }}>52W High</th>
                <th style={{ textAlign: 'right', padding: 6, color: '#8a92a0', fontWeight: 700, textTransform: 'uppercase' }}>52W Low</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((cmp) => (
                <tr key={cmp.symbol} style={{ borderBottom: '1px solid #2a3139', height: 32 }}>
                  <td style={{ padding: 6, color: cmp.symbolColor, fontWeight: 700 }}>{cmp.symbol}</td>
                  <td style={{ padding: 6, textAlign: 'right', color: cmp.priceColor, fontWeight: 700 }}>{cmp.price}</td>
                  <td style={{ padding: 6, textAlign: 'right', color: cmp.changeColor, fontWeight: 700 }}>{cmp.change}</td>
                  <td style={{ padding: 6, textAlign: 'right', color: '#e4e6eb' }}>{cmp.pe}</td>
                  <td style={{ padding: 6, textAlign: 'right', color: '#e4e6eb' }}>{cmp.pb}</td>
                  <td style={{ padding: 6, textAlign: 'right', color: cmp.dividendColor }}>{cmp.dividend}</td>
                  <td style={{ padding: 6, textAlign: 'right', color: '#8a92a0' }}>{cmp.h52}</td>
                  <td style={{ padding: 6, textAlign: 'right', color: '#8a92a0' }}>{cmp.l52}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Performance Stats */}
        <div style={{ borderTop: '1px solid #2a3139', paddingTop: 10, marginTop: 6 }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: 11, fontWeight: 700, color: '#e4e6eb', textTransform: 'uppercase' }}>So sánh hiệu suất (từ đầu năm)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 8 }}>
            {selectedData.map((stock) => {
              const ytdVal = parseFloat(stock.ytd)
              const ytdColor = stock.ytd.startsWith('+') ? '#22c55e' : '#f43f5e'
              const ytdBar = Math.abs(ytdVal) > 0 ? Math.min(100, Math.abs(ytdVal) * 2) : 0
              return (
                <div key={stock.symbol} style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: 10, background: '#1a1f26', borderRadius: 4, border: '1px solid #2a3139' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: stock.color }}>{stock.symbol}</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: ytdColor, fontFamily: "'JetBrains Mono', monospace" }}>{stock.ytd}</span>
                    <span style={{ fontSize: 9, color: '#8a92a0' }}>YTD</span>
                  </div>
                  <div style={{ width: '100%', height: 4, background: '#1a1f26', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${ytdBar}%`, background: ytdColor, borderRadius: 2 }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

const StockComparison = memo(StockComparisonInner)
export default StockComparison
