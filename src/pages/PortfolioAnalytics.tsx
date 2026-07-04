import { memo, useState } from 'react'

const th = {
  pageBg: '#060c18',
  cardBg: '#0d1420',
  cardBorder: '#1a3050',
  text: '#d4e0ee',
  textMuted: '#8a94a6',
  inputBg: '#0f1419',
  rowBg: '#141d2e',
  gridColor: '#1c2530',
}

function genLine(n: number, vol: number, drift: number, seedStart: number) {
  let seed = seedStart
  const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }
  let v = 100
  const pts: number[] = []
  for (let i = 0; i < n; i++) {
    v += (rand() - 0.42) * vol + drift
    pts.push(v)
  }
  return pts
}

function PortfolioAnalyticsInner() {
  const [strategy, setStrategy] = useState('ma_cross')
  const [hasResult, setHasResult] = useState(false)
  const [fromDate, setFromDate] = useState('2025-01-01')
  const [toDate, setToDate] = useState('2026-07-01')

  const runBacktest = () => setHasResult(true)

  const N = 60
  const portfolioVals = genLine(N, 3.2, 0.55, 11)
  const indexVals = genLine(N, 2.4, 0.28, 77)
  const allVals = [...portfolioVals, ...indexVals]
  const maxV = Math.max(...allVals)
  const minV = Math.min(...allVals)
  const range = maxV - minV || 1
  const yOf = (v: number) => 220 - ((v - minV) / range) * 220
  const portfolioLine = portfolioVals.map((v, i) => `${(i / (N - 1)) * 1000},${yOf(v)}`).join(' ')
  const indexLine = indexVals.map((v, i) => `${(i / (N - 1)) * 1000},${yOf(v)}`).join(' ')

  const pReturn = ((portfolioVals[N - 1] - 100) / 100 * 100).toFixed(1)
  const iReturn = ((indexVals[N - 1] - 100) / 100 * 100).toFixed(1)
  const pReturnNum = parseFloat(pReturn)
  const iReturnNum = parseFloat(iReturn)

  const riskMetrics = [
    { label: 'Beta', value: '0.87', color: '#60a5fa', hint: 'So với VN-Index' },
    { label: 'Sharpe Ratio', value: '1.42', color: '#22c55e', hint: 'Lợi nhuận điều chỉnh rủi ro' },
    { label: 'Max Drawdown', value: '-12.4%', color: '#f43f5e', hint: 'Mức sụt giảm lớn nhất' },
    { label: 'Độ biến động', value: '18.6%', color: '#f59e0b', hint: 'Volatility hàng năm' },
  ]

  const equityVals = genLine(50, 1.8, 0.42, 33)
  const eMax = Math.max(...equityVals)
  const eMin = Math.min(...equityVals)
  const eRange = eMax - eMin || 1
  const equityCurve = equityVals.map((v, i) => `${(i / 49) * 1000},${100 - ((v - eMin) / eRange) * 95}`).join(' ')

  const backtestResult = { totalReturn: '+34.6%', winRate: '64.2%', trades: '38', maxDD: '-9.8%' }

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: th.pageBg, padding: 24, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <div style={{ maxWidth: 1680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

        <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '10px 18px', borderBottom: `1px solid ${th.cardBorder}`, overflowX: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
              <div style={{ width: 24, height: 24, background: 'linear-gradient(135deg, #22c55e, #16a34a)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="12" height="10" viewBox="0 0 14 12"><polygon points="7,0 14,12 0,12" fill="#fff" /></svg>
              </div>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#fff', whiteSpace: 'nowrap' }}>Ray <span style={{ color: '#22c55e' }}>Stock</span></span>
            </div>
            <div style={{ display: 'flex', flexShrink: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', padding: '0 16px', borderRight: `1px solid ${th.cardBorder}`, minWidth: 118 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}><span style={{ fontSize: 9.5, fontWeight: 700, color: th.textMuted, letterSpacing: 0.3 }}>VNINDEX</span><span style={{ fontSize: 13, fontWeight: 800, color: '#22c55e', fontFamily: "'JetBrains Mono', monospace" }}>1,862.08</span></div>
                <span style={{ fontSize: 9.5, color: '#22c55e', fontWeight: 700 }}>+4.27 +0.23%</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', padding: '0 16px', borderRight: `1px solid ${th.cardBorder}`, minWidth: 118 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}><span style={{ fontSize: 9.5, fontWeight: 700, color: th.textMuted, letterSpacing: 0.3 }}>HNX</span><span style={{ fontSize: 13, fontWeight: 800, color: '#22c55e', fontFamily: "'JetBrains Mono', monospace" }}>307.57</span></div>
                <span style={{ fontSize: 9.5, color: '#22c55e', fontWeight: 700 }}>+0.84 +0.27%</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', padding: '0 16px', minWidth: 118 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}><span style={{ fontSize: 9.5, fontWeight: 700, color: th.textMuted, letterSpacing: 0.3 }}>UPCOM</span><span style={{ fontSize: 13, fontWeight: 800, color: '#f43f5e', fontFamily: "'JetBrains Mono', monospace" }}>128.01</span></div>
                <span style={{ fontSize: 9.5, color: '#f43f5e', fontWeight: 700 }}>-0.66 -0.51%</span>
              </div>
            </div>
            <span style={{ marginLeft: 'auto', fontSize: 10, color: '#4a6080', fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 }}>04/07/2026 · 15:00:00</span>
          </div>
          <div style={{ display: 'flex', gap: 6, padding: '8px 14px', overflowX: 'auto' }}>
            {['🏠 Trang chủ', '💼 Danh mục', '💰 Đặt lệnh', '📖 Sổ lệnh', '🗺️ Heatmap', '📊 So sánh', '🔍 Screener', '📰 Tin tức', '📅 Sự kiện', '⚙️ Cài đặt'].map((label) => (
              <a key={label} href="#" style={{ textDecoration: 'none', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5, background: th.rowBg, border: `1px solid ${th.cardBorder}`, color: '#c3ccd9', borderRadius: 7, padding: '6px 12px', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>{label}</a>
            ))}
          </div>
        </div>

        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: th.text }}>PHÂN TÍCH DANH MỤC</h1>

        <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: 12, fontWeight: 700, color: th.text, textTransform: 'uppercase' }}>Hiệu suất danh mục so với VN-Index (YTD)</h3>
            <div style={{ display: 'flex', gap: 14 }}>
              <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}><span style={{ width: 9, height: 9, borderRadius: 2, background: '#22c55e', display: 'inline-block' }} /><span style={{ fontSize: 10, color: th.textMuted }}>Danh mục {(pReturnNum >= 0 ? '+' : '') + pReturn}%</span></div>
              <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}><span style={{ width: 9, height: 9, borderRadius: 2, background: '#60a5fa', display: 'inline-block' }} /><span style={{ fontSize: 10, color: th.textMuted }}>VN-Index {(iReturnNum >= 0 ? '+' : '') + iReturn}%</span></div>
            </div>
          </div>
          <svg viewBox="0 0 1000 220" preserveAspectRatio="none" style={{ width: '100%', height: 220, display: 'block' }}>
            <line x1="0" y1="110" x2="1000" y2="110" stroke={th.gridColor} strokeWidth="1" strokeDasharray="4,4" />
            <polyline points={indexLine} fill="none" stroke="#60a5fa" strokeWidth="1.6" opacity="0.8" />
            <polyline points={portfolioLine} fill="none" stroke="#22c55e" strokeWidth="2.2" />
          </svg>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {riskMetrics.map((rm) => (
            <div key={rm.label} style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 10, padding: 14 }}>
              <span style={{ fontSize: 9, color: th.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>{rm.label}</span>
              <div style={{ fontSize: 19, fontWeight: 800, color: rm.color, fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>{rm.value}</div>
              <span style={{ fontSize: 9, color: th.textMuted }}>{rm.hint}</span>
            </div>
          ))}
        </div>

        <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: 18 }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 700, color: th.text, textTransform: 'uppercase' }}>Backtest chiến lược</h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 9, color: th.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>Chiến lược</label>
              <select value={strategy} onChange={(e) => { setStrategy(e.target.value); setHasResult(false) }} style={{ padding: '8px 10px', border: `1px solid ${th.cardBorder}`, borderRadius: 7, background: th.inputBg, color: th.text, fontSize: 12, width: 220 }}>
                <option value="ma_cross">Giao cắt MA (10/50)</option>
                <option value="rsi">RSI Oversold/Overbought</option>
                <option value="momentum">Momentum theo quý</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 9, color: th.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>Từ ngày</label>
              <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={{ padding: '8px 10px', border: `1px solid ${th.cardBorder}`, borderRadius: 7, background: th.inputBg, color: th.text, fontSize: 11 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 9, color: th.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>Đến ngày</label>
              <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} style={{ padding: '8px 10px', border: `1px solid ${th.cardBorder}`, borderRadius: 7, background: th.inputBg, color: th.text, fontSize: 11 }} />
            </div>
            <button onClick={runBacktest} style={{ background: '#3b82f6', border: 'none', color: '#fff', borderRadius: 7, padding: '9px 20px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>▶ Chạy Backtest</button>
          </div>

          {hasResult && (
            <div style={{ borderTop: `1px solid ${th.cardBorder}`, paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                <div><span style={{ fontSize: 9, color: th.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>Tổng lợi nhuận</span><div style={{ fontSize: 16, fontWeight: 800, color: '#22c55e', fontFamily: "'JetBrains Mono', monospace" }}>{backtestResult.totalReturn}</div></div>
                <div><span style={{ fontSize: 9, color: th.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>Tỷ lệ thắng</span><div style={{ fontSize: 16, fontWeight: 800, color: th.text, fontFamily: "'JetBrains Mono', monospace" }}>{backtestResult.winRate}</div></div>
                <div><span style={{ fontSize: 9, color: th.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>Số lệnh</span><div style={{ fontSize: 16, fontWeight: 800, color: th.text, fontFamily: "'JetBrains Mono', monospace" }}>{backtestResult.trades}</div></div>
                <div><span style={{ fontSize: 9, color: th.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>Max Drawdown</span><div style={{ fontSize: 16, fontWeight: 800, color: '#f43f5e', fontFamily: "'JetBrains Mono', monospace" }}>{backtestResult.maxDD}</div></div>
              </div>
              <div>
                <span style={{ fontSize: 10, color: th.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>Đường vốn (Equity Curve)</span>
                <svg viewBox="0 0 1000 100" preserveAspectRatio="none" style={{ width: '100%', height: 100, display: 'block', marginTop: 6 }}>
                  <polyline points={equityCurve} fill="none" stroke="#a78bfa" strokeWidth="2" />
                </svg>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

const PortfolioAnalytics = memo(PortfolioAnalyticsInner)
export default PortfolioAnalytics
