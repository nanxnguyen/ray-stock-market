import { memo, useState, useMemo } from 'react'

const th = {
  pageBg: 'var(--ds-color-bg-app)',
  cardBg: 'var(--ds-color-bg-elevated)',
  cardBorder: 'var(--ds-color-border-strong)',
  rowHover: 'var(--ds-color-bg-row-hover)',
  iconBg: 'var(--ds-color-bg-elevated)',
  gridColor: 'var(--ds-color-border-default)',
  text: 'var(--ds-color-text-primary)',
  textMuted: 'var(--ds-color-text-secondary)',
  heroGradient: 'linear-gradient(135deg,var(--ds-color-market-flash-up) 0%,var(--ds-color-bg-nav) 55%,var(--ds-color-bg-elevated) 100%)',
  glowColor: 'var(--ds-color-market-up)',
}

const posData = [
  { symbol: 'VCB', qty: 500, cost: 79.50, current: 83.90 },
  { symbol: 'ACB', qty: 800, cost: 23.20, current: 22.65 },
  { symbol: 'FPT', qty: 200, cost: 135.00, current: 137.50 },
  { symbol: 'HPG', qty: 1200, cost: 24.50, current: 24.10 },
  { symbol: 'BID', qty: 400, cost: 44.80, current: 45.80 },
  { symbol: 'MWG', qty: 150, cost: 90.20, current: 94.50 },
]

function genSeries(n: number, start: number, drift: number, vol: number): number[] {
  let v = start
  const out = [v]
  for (let i = 1; i < n; i++) {
    v = Math.max(1, v + drift + (((i * 7919 + 1234) % 100) / 100 - 0.48) * vol)
    out.push(v)
  }
  return out
}

function PortfolioInner() {
  const [navTimeframe, setNavTimeframe] = useState('1Y')
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  const positions = useMemo(() => {
    const result = posData.map((p) => {
      const value = p.qty * p.current * 1000
      const cost = p.qty * p.cost * 1000
      const pl = value - cost
      const plPct = (pl / cost) * 100
      const spark = genSeries(12, p.cost, (p.current - p.cost) / 12, Math.abs(p.current - p.cost) * 0.4 + 0.3)
      const maxS = Math.max(...spark), minS = Math.min(...spark)
      const rangeS = maxS - minS || 1
      const sparkline = spark.map((v, i) => `${(i / 11) * 60},${20 - ((v - minS) / rangeS) * 18}`).join(' ')
      return {
        symbol: p.symbol,
        quantity: p.qty.toLocaleString(),
        costPrice: p.cost.toFixed(2) + 'đ',
        currentPrice: { value: p.current.toFixed(2) + 'đ', color: p.current >= p.cost ? 'var(--ds-color-market-up)' : 'var(--ds-color-market-down)' },
        value: value.toLocaleString() + 'đ',
        rawValue: value,
        pl: (pl >= 0 ? '+' : '') + pl.toLocaleString(undefined, { maximumFractionDigits: 0 }) + 'đ',
        plPct: (pl >= 0 ? '+' : '') + plPct.toFixed(1) + '%',
        plColor: pl >= 0 ? 'var(--ds-color-market-up)' : 'var(--ds-color-market-down)',
        sparkline,
        weightPct: 0,
      }
    })
    const totalStockValue = result.reduce((s, p) => s + p.rawValue, 0)
    result.forEach(p => { p.weightPct = parseFloat(((p.rawValue / totalStockValue) * 100).toFixed(1)) })
    return result
  }, [])

  const totalStockValue = positions.reduce((s, p) => s + p.rawValue, 0)
  const totalCost = posData.reduce((s, p) => s + p.qty * p.cost * 1000, 0)
  const totalPL = totalStockValue - totalCost
  const cash = 24650000
  const marginUsed = 8200000
  const nav = totalStockValue + cash

  const navPoints = useMemo(() => {
    const pts = genSeries(60, nav * 0.72, (nav * 0.28) / 60, nav * 0.012)
    pts[pts.length - 1] = nav
    return pts
  }, [nav])
  const maxNav = Math.max(...navPoints), minNav = Math.min(...navPoints)
  const rangeNav = maxNav - minNav || 1
  const yOf = (v: number) => 220 - ((v - minNav) / rangeNav) * 210 - 5
  const navLine = navPoints.map((v, i) => `${(i / 59) * 1000},${yOf(v)}`).join(' ')
  const navFillPath = `M0,220 L${navPoints.map((v, i) => `${(i / 59) * 1000},${yOf(v)}`).join(' L')} L1000,220 Z`
  const navGridLines = [0, 1, 2, 3].map(i => ({ y: (220 / 3) * i }))

  const navTimeframes = ['1M', '3M', '6M', '1Y']

  const allocData = [
    { label: 'Cổ phiếu', value: totalStockValue, color: 'var(--ds-color-blue-500)' },
    { label: 'Tiền mặt', value: cash, color: 'var(--ds-color-market-up)' },
    { label: 'Ký quỹ (Margin)', value: marginUsed, color: 'var(--ds-color-warning)' },
  ]
  const allocTotal = allocData.reduce((s, a) => s + a.value, 0)
  const circumference = 2 * Math.PI * 46
  let cumOffset = 0
  const donutSegments = allocData.map(a => {
    const pct = a.value / allocTotal
    const dashLen = pct * circumference
    const seg = { color: a.color, dash: `${dashLen} ${circumference - dashLen}`, offset: -cumOffset }
    cumOffset += dashLen
    return seg
  })
  const allocationLegend = allocData.map(a => ({
    label: a.label, color: a.color,
    pct: ((a.value / allocTotal) * 100).toFixed(1),
    value: a.value.toLocaleString() + 'đ',
  }))

  const sectorAlloc = [
    { name: 'Ngân hàng', pct: 52, color: 'var(--ds-color-blue-500)' },
    { name: 'Công nghệ', pct: 18, color: 'var(--ds-color-purple-400)' },
    { name: 'Thép & Vật liệu', pct: 16, color: 'var(--ds-color-warning)' },
    { name: 'Bán lẻ', pct: 9, color: '#ec4899' },
    { name: 'Khác', pct: 5, color: 'var(--ds-color-neutral-500)' },
  ]

  const cashFlow = ['02/26', '03/26', '04/26', '05/26', '06/26', '07/26'].map((m, i) => ({
    label: m,
    inH: `${(5 + ((i * 7919 + 1234) % 20)) / 30 * 130}px`,
    outH: `${(4 + ((i * 3571 + 5678) % 18)) / 30 * 130}px`,
  }))

  const summary = {
    nav: (nav / 1000000).toFixed(1) + 'M',
    dayChange: '+1,240,000đ',
    dayColor: 'var(--ds-color-market-up)',
    dayPct: '+0.85%',
    totalPL: (totalPL >= 0 ? '+' : '') + totalPL.toLocaleString(undefined, { maximumFractionDigits: 0 }) + 'đ',
    plColor: totalPL >= 0 ? 'var(--ds-color-market-up)' : 'var(--ds-color-market-down)',
    roi: (totalPL >= 0 ? '+' : '') + (totalPL / totalCost * 100).toFixed(1) + '%',
    cash: cash.toLocaleString() + 'đ',
    stockValue: totalStockValue.toLocaleString() + 'đ',
    marginPct: (marginUsed / nav * 100).toFixed(1) + '%',
    marginColor: 'var(--ds-color-warning)',
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: th.pageBg, padding: 20, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ maxWidth: 1680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* NAV SUMMARY HEADER */}
        <div style={{ background: th.heroGradient, border: `1px solid ${th.cardBorder}`, borderRadius: 14, padding: '22px 26px', display: 'flex', flexWrap: 'wrap', gap: 28, alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -60, right: -40, width: 220, height: 220, borderRadius: '50%', background: th.glowColor, filter: 'blur(60px)', opacity: 0.28, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: th.textMuted, textTransform: 'uppercase', letterSpacing: 0.4 }}>Tổng tài sản (NAV)</span>
            <span style={{ fontSize: 32, fontWeight: 800, color: '#fff', fontFamily: "'JetBrains Mono', monospace", letterSpacing: -0.5 }}>{summary.nav}</span>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: summary.dayColor }}>{summary.dayChange} ({summary.dayPct}) hôm nay</span>
            </div>
          </div>
          <div style={{ width: 1, alignSelf: 'stretch', background: th.cardBorder, position: 'relative' }} />
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: th.textMuted, textTransform: 'uppercase' }}>Lãi/Lỗ toàn danh mục</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: summary.plColor, fontFamily: "'JetBrains Mono', monospace" }}>{summary.totalPL}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: summary.plColor }}>ROI {summary.roi}</span>
          </div>
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: th.textMuted, textTransform: 'uppercase' }}>Tiền mặt</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--ds-color-text-link)', fontFamily: "'JetBrains Mono', monospace" }}>{summary.cash}</span>
          </div>
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: th.textMuted, textTransform: 'uppercase' }}>Giá trị CK</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: th.text, fontFamily: "'JetBrains Mono', monospace" }}>{summary.stockValue}</span>
          </div>
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: th.textMuted, textTransform: 'uppercase' }}>Tỷ lệ ký quỹ</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: summary.marginColor, fontFamily: "'JetBrains Mono', monospace" }}>{summary.marginPct}</span>
          </div>
        </div>

        {/* NAV CHART + ALLOCATION DONUT */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 14, alignItems: 'stretch' }}>
          {/* NAV GROWTH CHART */}
          <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <h3 style={{ margin: 0, fontSize: 12, fontWeight: 700, color: th.text, textTransform: 'uppercase' }}>Tăng trưởng tài sản (NAV)</h3>
              <div style={{ display: 'flex', gap: 4 }}>
                {navTimeframes.map(t => (
                  <button key={t} onClick={() => setNavTimeframe(t)} style={{ background: navTimeframe === t ? 'var(--ds-color-blue-600)' : th.iconBg, color: navTimeframe === t ? '#fff' : th.textMuted, border: `1px solid ${navTimeframe === t ? 'var(--ds-color-blue-600)' : th.cardBorder}`, borderRadius: 5, padding: '4px 10px', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>{t}</button>
                ))}
              </div>
            </div>
            <svg viewBox="0 0 1000 220" preserveAspectRatio="none" style={{ width: '100%', height: 220, display: 'block' }}>
              <defs>
                <linearGradient id="navFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--ds-color-market-up)" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="var(--ds-color-market-up)" stopOpacity={0} />
                </linearGradient>
              </defs>
              {navGridLines.map((gl, i) => (
                <line key={i} x1="0" y1={gl.y} x2="1000" y2={gl.y} stroke={th.gridColor} strokeWidth="1" />
              ))}
              <path d={navFillPath} fill="url(#navFill)" />
              <polyline points={navLine} fill="none" stroke="var(--ds-color-market-up)" strokeWidth="2.2" />
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontSize: 9, color: th.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>01/07/2025</span>
              <span style={{ fontSize: 9, color: th.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>03/07/2026</span>
            </div>
          </div>

          {/* ASSET ALLOCATION DONUT */}
          <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: 18, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: 12, fontWeight: 700, color: th.text, textTransform: 'uppercase' }}>Phân bổ tài sản</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
              <svg viewBox="0 0 120 120" style={{ width: 120, height: 120, flexShrink: 0 }}>
                {donutSegments.map((seg, i) => (
                  <circle key={i} cx="60" cy="60" r="46" fill="none" stroke={seg.color} strokeWidth="18" strokeDasharray={seg.dash} strokeDashoffset={seg.offset} transform="rotate(-90 60 60)" />
                ))}
                <text x="60" y="56" textAnchor="middle" fontSize="15" fontWeight="800" fill="var(--ds-color-text-primary)" fontFamily="JetBrains Mono, monospace">{summary.nav}</text>
                <text x="60" y="72" textAnchor="middle" fontSize="8" fill="var(--ds-color-text-secondary)">TỔNG NAV</text>
              </svg>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9, flex: 1 }}>
                {allocationLegend.map((al, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}><span style={{ width: 9, height: 9, borderRadius: 2, background: al.color }} /><span style={{ fontSize: 11, color: th.text, fontWeight: 600 }}>{al.label}</span></div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: th.text, fontFamily: "'JetBrains Mono', monospace" }}>{al.pct}%</span>
                    </div>
                    <span style={{ fontSize: 9.5, color: th.textMuted, marginLeft: 15 }}>{al.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTOR ALLOCATION + CASH FLOW */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 14 }}>
          {/* SECTOR ALLOCATION BARS */}
          <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: 18 }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: 12, fontWeight: 700, color: th.text, textTransform: 'uppercase' }}>Phân bổ theo ngành</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {sectorAlloc.map((sec, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: th.text, fontWeight: 600 }}>{sec.name}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: sec.color, fontFamily: "'JetBrains Mono', monospace" }}>{sec.pct}%</span>
                  </div>
                  <div style={{ width: '100%', height: 7, background: th.iconBg, borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${sec.pct}%`, background: sec.color, borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CASH FLOW CHART */}
          <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <h3 style={{ margin: 0, fontSize: 12, fontWeight: 700, color: th.text, textTransform: 'uppercase' }}>Dòng tiền theo tháng</h3>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}><span style={{ width: 9, height: 9, borderRadius: 2, background: 'var(--ds-color-market-up)' }} /><span style={{ fontSize: 9.5, color: th.textMuted }}>Nạp/Bán</span></div>
                <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}><span style={{ width: 9, height: 9, borderRadius: 2, background: 'var(--ds-color-market-down)' }} /><span style={{ fontSize: 9.5, color: th.textMuted }}>Rút/Mua</span></div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: 10, height: 170 }}>
              {cashFlow.map((cf, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1, height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 130 }}>
                    <div style={{ width: 14, height: cf.inH, background: 'var(--ds-color-market-up)', borderRadius: '2px 2px 0 0' }} />
                    <div style={{ width: 14, height: cf.outH, background: 'var(--ds-color-market-down)', borderRadius: '2px 2px 0 0' }} />
                  </div>
                  <span style={{ fontSize: 9, color: th.textMuted, fontWeight: 700 }}>{cf.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* HOLDINGS TABLE */}
        <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: 12, fontWeight: 700, color: th.text, textTransform: 'uppercase' }}>Danh mục nắm giữ</h3>
            <span style={{ fontSize: 10, color: th.textMuted }}>{positions.length} mã cổ phiếu</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${th.cardBorder}`, height: 30 }}>
                  <th style={{ textAlign: 'left', padding: '6px 10px', color: th.textMuted, fontWeight: 700 }}>Mã CK</th>
                  <th style={{ textAlign: 'right', padding: '6px 10px', color: th.textMuted, fontWeight: 700 }}>Số lượng</th>
                  <th style={{ textAlign: 'right', padding: '6px 10px', color: th.textMuted, fontWeight: 700 }}>Giá vốn</th>
                  <th style={{ textAlign: 'right', padding: '6px 10px', color: th.textMuted, fontWeight: 700 }}>Giá hiện tại</th>
                  <th style={{ textAlign: 'center', padding: '6px 10px', color: th.textMuted, fontWeight: 700 }}>Xu hướng</th>
                  <th style={{ textAlign: 'right', padding: '6px 10px', color: th.textMuted, fontWeight: 700 }}>Giá trị</th>
                  <th style={{ textAlign: 'right', padding: '6px 10px', color: th.textMuted, fontWeight: 700 }}>Tỷ trọng</th>
                  <th style={{ textAlign: 'right', padding: '6px 10px', color: th.textMuted, fontWeight: 700 }}>Lãi/Lỗ</th>
                  <th style={{ textAlign: 'center', padding: '6px 10px', color: th.textMuted, fontWeight: 700 }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((pos) => (
                  <tr key={pos.symbol} style={{ borderBottom: `1px solid ${th.cardBorder}`, height: 44, background: hoveredRow === pos.symbol ? th.rowHover : 'transparent', transition: 'background .15s' }} onMouseEnter={() => setHoveredRow(pos.symbol)} onMouseLeave={() => setHoveredRow(null)}>
                    <td style={{ padding: '6px 10px', color: 'var(--ds-color-text-link)', fontWeight: 700, fontSize: 12 }}>{pos.symbol}</td>
                    <td style={{ padding: '6px 10px', textAlign: 'right', color: th.text }}>{pos.quantity}</td>
                    <td style={{ padding: '6px 10px', textAlign: 'right', color: th.textMuted }}>{pos.costPrice}</td>
                    <td style={{ padding: '6px 10px', textAlign: 'right', color: pos.currentPrice.color, fontWeight: 700 }}>{pos.currentPrice.value}</td>
                    <td style={{ padding: '6px 10px', textAlign: 'center' }}>
                      <svg viewBox="0 0 60 20" preserveAspectRatio="none" style={{ width: 60, height: 20, display: 'inline-block' }}>
                        <polyline points={pos.sparkline} fill="none" stroke={pos.plColor} strokeWidth="1.6" />
                      </svg>
                    </td>
                    <td style={{ padding: '6px 10px', textAlign: 'right', color: th.text, fontWeight: 700 }}>{pos.value}</td>
                    <td style={{ padding: '6px 10px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                        <div style={{ width: 36, height: 5, background: th.iconBg, borderRadius: 3, overflow: 'hidden' }}><div style={{ height: '100%', width: `${pos.weightPct}%`, background: 'var(--ds-color-text-link)' }} /></div>
                        <span style={{ color: th.textMuted, width: 32 }}>{pos.weightPct}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '6px 10px', textAlign: 'right' }}>
                      <div style={{ color: pos.plColor, fontWeight: 700 }}>{pos.pl}</div>
                      <div style={{ color: pos.plColor, fontSize: 9.5 }}>{pos.plPct}</div>
                    </td>
                    <td style={{ padding: '6px 10px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                        <button style={{ background: 'rgba(34,197,94,.15)', border: '1px solid var(--ds-color-market-up)', color: 'var(--ds-color-market-up)', borderRadius: 4, padding: '3px 8px', fontSize: 9, fontWeight: 700, cursor: 'pointer' }}>Mua</button>
                        <button style={{ background: 'rgba(244,63,94,.15)', border: '1px solid var(--ds-color-market-down)', color: 'var(--ds-color-market-down)', borderRadius: 4, padding: '3px 8px', fontSize: 9, fontWeight: 700, cursor: 'pointer' }}>Bán</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

const Portfolio = memo(PortfolioInner)
export default Portfolio
