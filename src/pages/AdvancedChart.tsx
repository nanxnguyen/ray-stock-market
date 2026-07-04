import { memo, useState, useMemo, useCallback } from 'react'

const FONT = "'Inter', system-ui, sans-serif"
const MONO = "'JetBrains Mono', monospace"

const th = {
  pageBg: 'var(--ds-color-bg-app)',
  cardBg: 'var(--ds-color-bg-elevated)',
  cardBorder: 'var(--ds-color-border-strong)',
  text: 'var(--ds-color-text-primary)',
  textMuted: 'var(--ds-color-text-secondary)',
  iconBg: 'var(--ds-color-bg-input)',
  gridColor: '#1c2530',
}

const SYMBOLS = ['VCB', 'ACB', 'FPT', 'HPG', 'BID'] as const
const TIMEFRAMES = ['1D', '1W', '1M', '3M', '1Y', '5Y'] as const
const INDICATORS = [
  { key: 'RSI' as const, label: 'RSI' },
  { key: 'MACD' as const, label: 'MACD' },
  { key: 'BB' as const, label: 'Bollinger Bands' },
]

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

interface Candle {
  open: number
  close: number
  high: number
  low: number
  vol: number
}

function genCandles(base: number, n: number, seed: number): Candle[] {
  const rand = seededRandom(seed)
  let price = base
  const out: Candle[] = []
  for (let i = 0; i < n; i++) {
    const open = price
    const vol = (rand() - 0.48) * base * 0.025
    const close = Math.max(base * 0.7, open + vol)
    const high = Math.max(open, close) + rand() * base * 0.008
    const low = Math.min(open, close) - rand() * base * 0.008
    out.push({ open, close, high, low, vol: 50000 + rand() * 500000 })
    price = close
  }
  return out
}

function calcEMA(arr: number[], period: number): number[] {
  const k = 2 / (period + 1)
  let prev = arr[0]
  return arr.map((v, i) => (i === 0 ? v : (prev = v * k + prev * (1 - k))))
}

function AdvancedChartInner() {
  const [symbol, setSymbol] = useState('VCB')
  const [timeframe, setTimeframe] = useState('1D')
  const [maOn, setMaOn] = useState(true)
  const [indicator, setIndicator] = useState<'RSI' | 'MACD' | 'BB' | null>('RSI')

  const toggleMA = useCallback(() => setMaOn((p) => !p), [])
  const setIndicatorTab = useCallback(
    (ind: 'RSI' | 'MACD' | 'BB') => setIndicator((p) => (p === ind ? null : ind)),
    [],
  )

  const chartData = useMemo(() => {
    const priceMap: Record<string, number> = { VCB: 81.5, ACB: 22.65, FPT: 137.5, HPG: 24.1, BID: 45.8 }
    const basePrice = priceMap[symbol] || 50
    const seed = symbol.split('').reduce((a, c) => a + c.charCodeAt(0), 0) + 42
    const N = 60
    const raw = genCandles(basePrice, N, seed)

    const closes = raw.map((c) => c.close)
    const highs = raw.map((c) => c.high)
    const lows = raw.map((c) => c.low)
    const maxP = Math.max(...highs) * 1.01
    const minP = Math.min(...lows) * 0.99
    const range = maxP - minP || 1
    const chartH = 340
    const chartW = 1000
    const slotW = chartW / N

    const yOf = (p: number) => chartH - ((p - minP) / range) * chartH

    const candles = raw.map((c, i) => {
      const x = i * slotW + slotW / 2
      const up = c.close >= c.open
      const color = up ? 'var(--ds-color-market-up)' : 'var(--ds-color-market-down)'
      const bodyTop = yOf(Math.max(c.open, c.close))
      const bodyBot = yOf(Math.min(c.open, c.close))
      return {
        x,
        wickTop: yOf(c.high),
        wickBot: yOf(c.low),
        bodyX: x - slotW * 0.32,
        bodyY: bodyTop,
        bodyW: slotW * 0.64,
        bodyH: Math.max(1.5, bodyBot - bodyTop),
        color,
      }
    })

    const maVals = closes.map((_, i) => {
      const s = Math.max(0, i - 9)
      const slice = closes.slice(s, i + 1)
      return slice.reduce((a, b) => a + b, 0) / slice.length
    })
    const maLine = maVals.map((v, i) => `${i * slotW + slotW / 2},${yOf(v)}`).join(' ')

    const maxVol = Math.max(...raw.map((c) => c.vol))
    const volBars = raw.map((c, i) => {
      const x = i * slotW + slotW * 0.18
      const h = (c.vol / maxVol) * 68
      return { x, y: 70 - h, w: slotW * 0.64, h, color: c.close >= c.open ? 'var(--ds-color-market-up)' : 'var(--ds-color-market-down)' }
    })

    const gridLines = [0, 1, 2, 3, 4].map((i) => ({ y: (chartH / 4) * i }))
    const yLabels = [0, 1, 2, 3, 4].map((i) => (maxP - (range / 4) * i).toFixed(1))

    // RSI
    let gains = 0
    let losses = 0
    const rsiSeries = closes.map((c, i) => {
      if (i === 0) return 50
      const diff = c - closes[i - 1]
      gains = (gains * 13 + Math.max(diff, 0)) / 14
      losses = (losses * 13 + Math.max(-diff, 0)) / 14
      const rs = losses === 0 ? 100 : gains / losses
      return 100 - 100 / (1 + rs)
    })
    const rsiLine = rsiSeries.map((v, i) => `${i * slotW + slotW / 2},${80 - (v / 100) * 80}`).join(' ')
    const rsiVal = rsiSeries[rsiSeries.length - 1].toFixed(1)
    const rsiColor = Number(rsiVal) > 70 ? 'var(--ds-color-market-down)' : Number(rsiVal) < 30 ? 'var(--ds-color-market-up)' : 'var(--ds-color-purple-400)'

    // MACD
    const ema12 = calcEMA(closes, 12)
    const ema26 = calcEMA(closes, 26)
    const macdArr = ema12.map((v, i) => v - ema26[i])
    const signalArr = calcEMA(macdArr, 9)
    const histArr = macdArr.map((v, i) => v - signalArr[i])
    const maxMacd = Math.max(...macdArr.map(Math.abs), ...histArr.map(Math.abs), 0.01)
    const macdLinePoints = macdArr.map((v, i) => `${i * slotW + slotW / 2},${40 - (v / maxMacd) * 36}`).join(' ')
    const signalLinePoints = signalArr.map((v, i) => `${i * slotW + slotW / 2},${40 - (v / maxMacd) * 36}`).join(' ')
    const macdBars = histArr.map((v, i) => {
      const h = Math.abs((v / maxMacd) * 36)
      return { x: i * slotW + slotW * 0.3, y: v >= 0 ? 40 - h : 40, w: slotW * 0.4, h, color: v >= 0 ? 'var(--ds-color-market-up)' : 'var(--ds-color-market-down)' }
    })

    // Bollinger
    const period = 20
    const lastSlice = closes.slice(-period)
    const mid = lastSlice.reduce((a, b) => a + b, 0) / lastSlice.length
    const variance = lastSlice.reduce((a, b) => a + (b - mid) ** 2, 0) / lastSlice.length
    const sd = Math.sqrt(variance)

    const lastClose = closes[closes.length - 1]
    const firstClose = closes[0]
    const isUp = lastClose >= firstClose
    const priceColor = isUp ? 'var(--ds-color-market-up)' : 'var(--ds-color-market-down)'
    const changeVal = lastClose - firstClose
    const changePctVal = (changeVal / firstClose) * 100

    return {
      lastClose,
      priceColor,
      priceBg: isUp ? 'rgba(34,197,94,.15)' : 'rgba(244,63,94,.15)',
      change: (changeVal >= 0 ? '+' : '') + changeVal.toFixed(2),
      changePct: (changePctVal >= 0 ? '+' : '') + changePctVal.toFixed(2) + '%',
      candles,
      maLine,
      gridLines,
      yLabels,
      volBars,
      rsiLine,
      rsiVal,
      rsiColor,
      macdLinePoints,
      signalLinePoints,
      macdBars,
      bbUpper: (mid + 2 * sd).toFixed(2),
      bbMid: mid.toFixed(2),
      bbLower: (mid - 2 * sd).toFixed(2),
    }
  }, [symbol])

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: th.pageBg, padding: 24, fontFamily: FONT }}>
      <div style={{ maxWidth: 1680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* ══ HEADER ══ */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: th.text, fontFamily: MONO }}>{symbol}</h1>
            <span style={{ fontSize: 20, fontWeight: 800, color: chartData.priceColor, fontFamily: MONO }}>
              {chartData.lastClose.toFixed(2)}đ
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: chartData.priceColor, background: chartData.priceBg, padding: '3px 9px', borderRadius: 6 }}>
              {chartData.change} ({chartData.changePct})
            </span>
          </div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {SYMBOLS.map((s) => (
              <button
                key={s}
                onClick={() => setSymbol(s)}
                style={{
                  background: s === symbol ? 'var(--ds-color-blue-600)' : th.iconBg,
                  border: `1px solid ${s === symbol ? 'var(--ds-color-blue-600)' : th.cardBorder}`,
                  color: s === symbol ? '#fff' : th.textMuted,
                  borderRadius: 6,
                  padding: '5px 11px',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* ══ TOOLBAR ══ */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 10, padding: '8px 12px', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {TIMEFRAMES.map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                style={{
                  background: t === timeframe ? 'var(--ds-color-blue-600)' : 'transparent',
                  color: t === timeframe ? '#fff' : th.textMuted,
                  border: `1px solid ${t === timeframe ? 'var(--ds-color-blue-600)' : th.cardBorder}`,
                  borderRadius: 5,
                  padding: '5px 11px',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {t}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 10, color: th.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>Vẽ:</span>
            <button style={{ background: th.iconBg, border: `1px solid ${th.cardBorder}`, color: th.textMuted, borderRadius: 5, width: 28, height: 28, cursor: 'pointer', fontSize: 13 }} title="Trendline">📐</button>
            <button style={{ background: th.iconBg, border: `1px solid ${th.cardBorder}`, color: th.textMuted, borderRadius: 5, width: 28, height: 28, cursor: 'pointer', fontSize: 13 }} title="Fibonacci">🌀</button>
            <button style={{ background: th.iconBg, border: `1px solid ${th.cardBorder}`, color: th.textMuted, borderRadius: 5, width: 28, height: 28, cursor: 'pointer', fontSize: 13 }} title="Xóa vẽ">🗑</button>
            <div style={{ width: 1, height: 18, background: th.cardBorder }} />
            <button
              onClick={toggleMA}
              style={{
                background: maOn ? 'var(--ds-color-blue-500)' : th.iconBg,
                border: `1px solid ${maOn ? 'var(--ds-color-blue-600)' : th.cardBorder}`,
                color: maOn ? '#fff' : th.textMuted,
                borderRadius: 5,
                padding: '5px 10px',
                fontSize: 10.5,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              MA
            </button>
          </div>
        </div>

        {/* ══ MAIN CANDLESTICK CHART ══ */}
        <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 10, padding: 14 }}>
          <svg viewBox="0 0 1000 340" preserveAspectRatio="none" style={{ width: '100%', height: 340, display: 'block' }}>
            {chartData.gridLines.map((gl, i) => (
              <line key={i} x1={0} y1={gl.y} x2={1000} y2={gl.y} stroke={th.gridColor} strokeWidth={1} />
            ))}
            {chartData.candles.map((c, i) => (
              <g key={i}>
                <line x1={c.x} y1={c.wickTop} x2={c.x} y2={c.wickBot} stroke={c.color} strokeWidth={1} />
                <rect x={c.bodyX} y={c.bodyY} width={c.bodyW} height={c.bodyH} fill={c.color} />
              </g>
            ))}
            {maOn && (
              <polyline points={chartData.maLine} fill="none" stroke="#fbbf24" strokeWidth={1.6} opacity={0.9} />
            )}
          </svg>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            {chartData.yLabels.map((_, i) => (
              <span key={i} />
            ))}
            <span style={{ fontSize: 9, color: th.textMuted, fontFamily: MONO }}>01/06/2026</span>
            <span style={{ fontSize: 9, color: th.textMuted, fontFamily: MONO }}>03/07/2026</span>
          </div>
        </div>

        {/* ══ VOLUME CHART ══ */}
        <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 10, padding: '10px 14px' }}>
          <span style={{ fontSize: 10, color: th.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>Khối lượng</span>
          <svg viewBox="0 0 1000 70" preserveAspectRatio="none" style={{ width: '100%', height: 70, display: 'block', marginTop: 4 }}>
            {chartData.volBars.map((vb, i) => (
              <rect key={i} x={vb.x} y={vb.y} width={vb.w} height={vb.h} fill={vb.color} opacity={0.7} />
            ))}
          </svg>
        </div>

        {/* ══ INDICATOR TABS ══ */}
        <div style={{ display: 'flex', gap: 6 }}>
          {INDICATORS.map((it) => (
            <button
              key={it.key}
              onClick={() => setIndicatorTab(it.key)}
              style={{
                background: indicator === it.key ? 'var(--ds-color-blue-500)' : th.iconBg,
                color: indicator === it.key ? '#fff' : th.textMuted,
                border: `1px solid ${indicator === it.key ? 'var(--ds-color-blue-600)' : th.cardBorder}`,
                borderRadius: 6,
                padding: '6px 14px',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {it.label}
            </button>
          ))}
        </div>

        {/* ══ RSI PANEL ══ */}
        {indicator === 'RSI' && (
          <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 10, padding: '10px 14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 10, color: th.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>RSI (14)</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: chartData.rsiColor, fontFamily: MONO }}>{chartData.rsiVal}</span>
            </div>
            <svg viewBox="0 0 1000 80" preserveAspectRatio="none" style={{ width: '100%', height: 80, display: 'block', marginTop: 4 }}>
              <line x1={0} y1={24} x2={1000} y2={24} stroke="var(--ds-color-market-down)" strokeWidth={1} strokeDasharray="4,4" opacity={0.5} />
              <line x1={0} y1={56} x2={1000} y2={56} stroke="var(--ds-color-market-up)" strokeWidth={1} strokeDasharray="4,4" opacity={0.5} />
              <polyline points={chartData.rsiLine} fill="none" stroke="var(--ds-color-purple-400)" strokeWidth={1.6} />
            </svg>
          </div>
        )}

        {/* ══ MACD PANEL ══ */}
        {indicator === 'MACD' && (
          <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 10, padding: '10px 14px' }}>
            <span style={{ fontSize: 10, color: th.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>MACD (12,26,9)</span>
            <svg viewBox="0 0 1000 80" preserveAspectRatio="none" style={{ width: '100%', height: 80, display: 'block', marginTop: 4 }}>
              <line x1={0} y1={40} x2={1000} y2={40} stroke={th.gridColor} strokeWidth={1} />
              {chartData.macdBars.map((mb, i) => (
                <rect key={i} x={mb.x} y={mb.y} width={mb.w} height={mb.h} fill={mb.color} opacity={0.7} />
              ))}
              <polyline points={chartData.macdLinePoints} fill="none" stroke="var(--ds-color-text-link)" strokeWidth={1.4} />
              <polyline points={chartData.signalLinePoints} fill="none" stroke="var(--ds-color-yellow-400)" strokeWidth={1.4} />
            </svg>
          </div>
        )}

        {/* ══ BOLLINGER INFO ══ */}
        {indicator === 'BB' && (
          <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 10, padding: '10px 14px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            <div>
              <span style={{ fontSize: 9, color: th.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>Upper Band</span>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ds-color-market-down)', fontFamily: MONO }}>{chartData.bbUpper}đ</div>
            </div>
            <div>
              <span style={{ fontSize: 9, color: th.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>Middle (MA20)</span>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ds-color-yellow-400)', fontFamily: MONO }}>{chartData.bbMid}đ</div>
            </div>
            <div>
              <span style={{ fontSize: 9, color: th.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>Lower Band</span>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ds-color-market-up)', fontFamily: MONO }}>{chartData.bbLower}đ</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const AdvancedChart = memo(AdvancedChartInner)
export default AdvancedChart
