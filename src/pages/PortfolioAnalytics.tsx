import { memo, useState } from 'react'

const th = {
  pageBg: 'var(--ds-color-bg-app)',
  cardBg: 'var(--ds-color-bg-card)',
  cardBorder: 'var(--ds-color-border-default)',
  text: 'var(--ds-color-text-primary)',
  textMuted: 'var(--ds-color-text-secondary)',
  inputBg: 'var(--ds-color-bg-input)',
  rowBg: 'var(--ds-color-bg-nav)',
  gridColor: 'var(--ds-color-border-subtle)',
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
    { label: 'Beta', value: '0.87', color: 'var(--ds-color-text-link)', hint: 'So với VN-Index' },
    { label: 'Sharpe Ratio', value: '1.42', color: 'var(--ds-color-market-up)', hint: 'Lợi nhuận điều chỉnh rủi ro' },
    { label: 'Max Drawdown', value: '-12.4%', color: 'var(--ds-color-market-down)', hint: 'Mức sụt giảm lớn nhất' },
    { label: 'Độ biến động', value: '18.6%', color: 'var(--ds-color-warning)', hint: 'Volatility hàng năm' },
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

        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: th.text }}>PHÂN TÍCH DANH MỤC</h1>

        <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: 12, fontWeight: 700, color: th.text, textTransform: 'uppercase' }}>Hiệu suất danh mục so với VN-Index (YTD)</h3>
            <div style={{ display: 'flex', gap: 14 }}>
              <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}><span style={{ width: 9, height: 9, borderRadius: 2, background: 'var(--ds-color-market-up)', display: 'inline-block' }} /><span style={{ fontSize: 10, color: th.textMuted }}>Danh mục {(pReturnNum >= 0 ? '+' : '') + pReturn}%</span></div>
              <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}><span style={{ width: 9, height: 9, borderRadius: 2, background: 'var(--ds-color-text-link)', display: 'inline-block' }} /><span style={{ fontSize: 10, color: th.textMuted }}>VN-Index {(iReturnNum >= 0 ? '+' : '') + iReturn}%</span></div>
            </div>
          </div>
          <svg viewBox="0 0 1000 220" preserveAspectRatio="none" style={{ width: '100%', height: 220, display: 'block' }}>
            <line x1="0" y1="110" x2="1000" y2="110" stroke={th.gridColor} strokeWidth="1" strokeDasharray="4,4" />
            <polyline points={indexLine} fill="none" stroke="var(--ds-color-text-link)" strokeWidth="1.6" opacity="0.8" />
            <polyline points={portfolioLine} fill="none" stroke="var(--ds-color-market-up)" strokeWidth="2.2" />
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
            <button onClick={runBacktest} style={{ background: 'var(--ds-color-blue-500)', border: 'none', color: '#fff', borderRadius: 7, padding: '9px 20px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>▶ Chạy Backtest</button>
          </div>

          {hasResult && (
            <div style={{ borderTop: `1px solid ${th.cardBorder}`, paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                <div><span style={{ fontSize: 9, color: th.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>Tổng lợi nhuận</span><div style={{ fontSize: 16, fontWeight: 800, color: 'var(--ds-color-market-up)', fontFamily: "'JetBrains Mono', monospace" }}>{backtestResult.totalReturn}</div></div>
                <div><span style={{ fontSize: 9, color: th.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>Tỷ lệ thắng</span><div style={{ fontSize: 16, fontWeight: 800, color: th.text, fontFamily: "'JetBrains Mono', monospace" }}>{backtestResult.winRate}</div></div>
                <div><span style={{ fontSize: 9, color: th.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>Số lệnh</span><div style={{ fontSize: 16, fontWeight: 800, color: th.text, fontFamily: "'JetBrains Mono', monospace" }}>{backtestResult.trades}</div></div>
                <div><span style={{ fontSize: 9, color: th.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>Max Drawdown</span><div style={{ fontSize: 16, fontWeight: 800, color: 'var(--ds-color-market-down)', fontFamily: "'JetBrains Mono', monospace" }}>{backtestResult.maxDD}</div></div>
              </div>
              <div>
                <span style={{ fontSize: 10, color: th.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>Đường vốn (Equity Curve)</span>
                <svg viewBox="0 0 1000 100" preserveAspectRatio="none" style={{ width: '100%', height: 100, display: 'block', marginTop: 6 }}>
                  <polyline points={equityCurve} fill="none" stroke="var(--ds-color-purple-400)" strokeWidth="2" />
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
