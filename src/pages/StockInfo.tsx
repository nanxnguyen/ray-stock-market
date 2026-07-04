import { memo, useState } from 'react'

const th = {
  pageBg: 'var(--ds-color-bg-app)',
  cardBg: 'var(--ds-color-bg-card)',
  cardBorder: 'var(--ds-color-border-strong)',
  rowBg: 'var(--ds-color-bg-row-odd)',
  trackBg: 'var(--ds-color-border-strong)',
  text: 'var(--ds-color-text-primary)',
  textMuted: 'var(--ds-color-text-secondary)',
}

const stockData: Record<string, {
  company: string; sector: string; exchange: string; price: number;
  change: string; changePct: string; pe: number; peAvg: number;
  pb: number; pbAvg: number; eps: number; epsYoY: string;
  dividend: string; dividendDate: string; marketCap: string;
  capRank: string; equity: string; debtRatio: string;
  roe: string; roa: string; margin: string; priceTarget: string;
  recommendation: string; ratingBuy: number; ratingHold: number; ratingSell: number;
}> = {
  VCB: {
    company: 'Ngân hàng TMCP Ngoại thương Việt Nam', sector: 'Ngân hàng', exchange: 'HOSE',
    price: 81.50, change: '+2.35', changePct: '+2.98%', pe: 11.2, peAvg: 12.5,
    pb: 1.45, pbAvg: 1.50, eps: 7.28, epsYoY: '+15.2%', dividend: '3.2%',
    dividendDate: '15/05/2026', marketCap: '850.5 nghìn tỷ', capRank: 'Large cap',
    equity: '586.2 nghìn tỷ', debtRatio: '8.2%', roe: '23.5%', roa: '2.1%',
    margin: '42.3%', priceTarget: '95.0đ', recommendation: 'MUA',
    ratingBuy: 6, ratingHold: 3, ratingSell: 1,
  },
  ACB: {
    company: 'Ngân hàng TMCP Á Châu', sector: 'Ngân hàng', exchange: 'HOSE',
    price: 22.65, change: '-0.45', changePct: '-1.95%', pe: 8.9, peAvg: 12.5,
    pb: 1.12, pbAvg: 1.50, eps: 2.54, epsYoY: '+8.5%', dividend: '4.1%',
    dividendDate: '20/05/2026', marketCap: '226.5 nghìn tỷ', capRank: 'Mid cap',
    equity: '202.0 nghìn tỷ', debtRatio: '12.1%', roe: '21.2%', roa: '1.8%',
    margin: '38.5%', priceTarget: '26.5đ', recommendation: 'GIỮ',
    ratingBuy: 3, ratingHold: 5, ratingSell: 1,
  },
}

function StockInfoInner() {
  const [symbol] = useState('VCB')

  const data = stockData[symbol] || stockData['VCB']

  const isUp = data.change.startsWith('+')
  const priceColor = isUp ? 'var(--ds-color-market-up)' : 'var(--ds-color-market-down)'
  const trendIcon = isUp ? '▲' : '▼'
  const heroGradient = isUp
    ? 'linear-gradient(135deg,#0d2818 0%,#122d1c 45%,#151b24 100%)'
    : 'linear-gradient(135deg,#2d1216 0%,#2d151a 45%,#151b24 100%)'
  const glowColor = isUp ? 'var(--ds-color-market-up)' : 'var(--ds-color-market-down)'
  const exchBadgeBg = isUp ? 'rgba(34,197,94,.35)' : 'rgba(244,63,94,.35)'

  const peColor = data.pe < data.peAvg ? 'var(--ds-color-market-up)' : data.pe > data.peAvg * 1.2 ? 'var(--ds-color-market-down)' : 'var(--ds-color-warning)'
  const peStatus = data.pe < data.peAvg ? 'RẺ' : data.pe > data.peAvg * 1.2 ? 'ĐẮT' : 'HỢP LÝ'
  const peBarPct = Math.min(100, (data.pe / (data.peAvg * 1.5)) * 100)

  const pbColor = data.pb < data.pbAvg ? 'var(--ds-color-market-up)' : data.pb > data.pbAvg * 1.2 ? 'var(--ds-color-market-down)' : 'var(--ds-color-warning)'
  const pbStatus = data.pb < data.pbAvg ? 'RẺ' : data.pb > data.pbAvg * 1.2 ? 'ĐẮT' : 'HỢP LÝ'
  const pbBarPct = Math.min(100, (data.pb / (data.pbAvg * 1.5)) * 100)

  const debtColor = parseFloat(data.debtRatio) < 10 ? 'var(--ds-color-market-up)' : parseFloat(data.debtRatio) < 20 ? 'var(--ds-color-warning)' : 'var(--ds-color-market-down)'
  const priceTargetColor = parseFloat(data.priceTarget) > data.price ? 'var(--ds-color-market-up)' : 'var(--ds-color-market-down)'
  const epsYoyColor = data.epsYoY.startsWith('+') ? 'var(--ds-color-market-up)' : 'var(--ds-color-market-down)'

  const total = data.ratingBuy + data.ratingHold + data.ratingSell
  const ratingBar = {
    buy: (data.ratingBuy / total * 100).toFixed(0),
    hold: (data.ratingHold / total * 100).toFixed(0),
    sell: (data.ratingSell / total * 100).toFixed(0),
  }
  const recommendationBg = data.recommendation === 'MUA' ? 'var(--ds-color-market-up)' : data.recommendation === 'GIỮ' ? 'var(--ds-color-warning)' : 'var(--ds-color-market-down)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, padding: 28, background: th.pageBg, minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 1200, margin: 'auto', width: '100%' }}>

        {/* Header bar */}
        <div style={{ background: 'var(--ds-color-bg-card)', border: '1px solid var(--ds-color-border-default)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '10px 18px', borderBottom: '1px solid var(--ds-color-border-default)', overflowX: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
              <div style={{ width: 24, height: 24, background: 'linear-gradient(135deg,var(--ds-color-market-up),var(--ds-color-green-600))', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="12" height="10" viewBox="0 0 14 12"><polygon points="7,0 14,12 0,12" fill="#fff" /></svg>
              </div>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#fff', whiteSpace: 'nowrap' }}>Ray <span style={{ color: 'var(--ds-color-market-up)' }}>Stock</span></span>
            </div>
            <div style={{ display: 'flex', flexShrink: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', padding: '0 16px', borderRight: '1px solid var(--ds-color-border-default)', minWidth: 118 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}><span style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--ds-color-text-secondary)', letterSpacing: 0.3 }}>VNINDEX</span><span style={{ fontSize: 13, fontWeight: 800, color: 'var(--ds-color-market-up)', fontFamily: "'JetBrains Mono', monospace" }}>1,862.08</span></div>
                <span style={{ fontSize: 9.5, color: 'var(--ds-color-market-up)', fontWeight: 700 }}>+4.27 +0.23%</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', padding: '0 16px', borderRight: '1px solid var(--ds-color-border-default)', minWidth: 118 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}><span style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--ds-color-text-secondary)', letterSpacing: 0.3 }}>HNX</span><span style={{ fontSize: 13, fontWeight: 800, color: 'var(--ds-color-market-up)', fontFamily: "'JetBrains Mono', monospace" }}>307.57</span></div>
                <span style={{ fontSize: 9.5, color: 'var(--ds-color-market-up)', fontWeight: 700 }}>+0.84 +0.27%</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', padding: '0 16px', minWidth: 118 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}><span style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--ds-color-text-secondary)', letterSpacing: 0.3 }}>UPCOM</span><span style={{ fontSize: 13, fontWeight: 800, color: 'var(--ds-color-market-down)', fontFamily: "'JetBrains Mono', monospace" }}>128.01</span></div>
                <span style={{ fontSize: 9.5, color: 'var(--ds-color-market-down)', fontWeight: 700 }}>-0.66 -0.51%</span>
              </div>
            </div>
            <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--ds-color-text-muted)', fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 }}>04/07/2026 · 15:00:00</span>
          </div>
          <div style={{ display: 'flex', gap: 6, padding: '8px 14px', overflowX: 'auto' }}>
            {['🏠 Trang chủ', '💼 Danh mục', '💰 Đặt lệnh', '📖 Sổ lệnh', '🗺️ Heatmap', '📊 So sánh', '🔍 Screener', '📰 Tin tức', '📅 Sự kiện', '⚙️ Cài đặt'].map(label => (
              <a key={label} href="#" style={{ textDecoration: 'none', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5, background: 'var(--ds-color-bg-row-odd)', border: '1px solid var(--ds-color-border-default)', color: 'var(--ds-color-neutral-300)', borderRadius: 7, padding: '6px 12px', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>{label}</a>
            ))}
          </div>
        </div>

        {/* Hero header */}
        <div style={{ position: 'relative', background: heroGradient, borderRadius: 16, padding: '24px 26px', overflow: 'hidden', border: `1px solid ${th.cardBorder}`, boxShadow: '0 8px 32px rgba(0,0,0,.28)' }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: glowColor, filter: 'blur(50px)', opacity: 0.35, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#fff', fontFamily: "'JetBrains Mono', monospace", letterSpacing: -0.5 }}>{symbol}</h1>
                <span style={{ fontSize: 9, fontWeight: 700, color: '#fff', background: exchBadgeBg, padding: '3px 8px', borderRadius: 5, letterSpacing: 0.5 }}>{data.exchange}</span>
              </div>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,.65)', fontWeight: 500 }}>{data.company}</span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,.45)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>{data.sector}</span>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#fff', fontFamily: "'JetBrains Mono', monospace", letterSpacing: -0.5 }}>{data.price.toFixed(2)}đ</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'flex-end' }}>
                <span style={{ fontSize: 12 }}>{trendIcon}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: priceColor }}>{data.change} ({data.changePct})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', marginTop: 2 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ds-color-market-up)', animation: 'pulse 2s infinite' }} />
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,.5)', fontWeight: 600, letterSpacing: 0.3 }}>CẬP NHẬT REALTIME</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key metrics grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 16, background: th.cardBg, borderRadius: 12, border: `1px solid ${th.cardBorder}`, transition: 'all .2s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 10, color: th.textMuted, textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.4 }}>P/E Ratio</span>
              <span style={{ fontSize: 9, color: '#fff', fontWeight: 700, background: peColor, padding: '2px 7px', borderRadius: 20 }}>{peStatus}</span>
            </div>
            <span style={{ fontSize: 22, fontWeight: 800, color: th.text, fontFamily: "'JetBrains Mono', monospace" }}>{data.pe.toFixed(1)}x</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ flex: 1, height: 4, background: th.trackBg, borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${peBarPct}%`, background: peColor, borderRadius: 2 }} />
              </div>
              <span style={{ fontSize: 9, color: th.textMuted, whiteSpace: 'nowrap' }}>TB: {data.peAvg.toFixed(1)}x</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 16, background: th.cardBg, borderRadius: 12, border: `1px solid ${th.cardBorder}`, transition: 'all .2s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 10, color: th.textMuted, textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.4 }}>P/B Ratio</span>
              <span style={{ fontSize: 9, color: '#fff', fontWeight: 700, background: pbColor, padding: '2px 7px', borderRadius: 20 }}>{pbStatus}</span>
            </div>
            <span style={{ fontSize: 22, fontWeight: 800, color: th.text, fontFamily: "'JetBrains Mono', monospace" }}>{data.pb.toFixed(2)}x</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ flex: 1, height: 4, background: th.trackBg, borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pbBarPct}%`, background: pbColor, borderRadius: 2 }} />
              </div>
              <span style={{ fontSize: 9, color: th.textMuted, whiteSpace: 'nowrap' }}>TB: {data.pbAvg.toFixed(2)}x</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 16, background: th.cardBg, borderRadius: 12, border: `1px solid ${th.cardBorder}` }}>
            <span style={{ fontSize: 10, color: th.textMuted, textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.4 }}>EPS (TTM)</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--ds-color-text-link)', fontFamily: "'JetBrains Mono', monospace" }}>{data.eps.toFixed(2)}đ</span>
            <span style={{ fontSize: 10, color: epsYoyColor, fontWeight: 700 }}>↗ {data.epsYoY} so với năm trước</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 16, background: th.cardBg, borderRadius: 12, border: `1px solid ${th.cardBorder}` }}>
            <span style={{ fontSize: 10, color: th.textMuted, textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.4 }}>Dividend Yield</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--ds-color-warning)', fontFamily: "'JetBrains Mono', monospace" }}>{data.dividend}</span>
            <span style={{ fontSize: 10, color: th.textMuted, fontWeight: 600 }}>Chi trả gần nhất: {data.dividendDate}</span>
          </div>
        </div>

        {/* Company size */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 14, background: th.cardBg, borderRadius: 12, border: `1px solid ${th.cardBorder}` }}>
            <span style={{ fontSize: 9, color: th.textMuted, textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.3 }}>Vốn hóa</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: th.text, fontFamily: "'JetBrains Mono', monospace" }}>{data.marketCap}</span>
            <span style={{ fontSize: 9, color: '#818cf8', fontWeight: 700, background: 'rgba(129,140,248,.15)', padding: '2px 6px', borderRadius: 10, width: 'fit-content' }}>{data.capRank}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 14, background: th.cardBg, borderRadius: 12, border: `1px solid ${th.cardBorder}` }}>
            <span style={{ fontSize: 9, color: th.textMuted, textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.3 }}>Vốn chủ sở hữu</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: th.text, fontFamily: "'JetBrains Mono', monospace" }}>{data.equity}</span>
            <span style={{ fontSize: 9, color: th.textMuted, fontWeight: 600 }}>Book value</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 14, background: th.cardBg, borderRadius: 12, border: `1px solid ${th.cardBorder}` }}>
            <span style={{ fontSize: 9, color: th.textMuted, textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.3 }}>Nợ/Vốn</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: debtColor, fontFamily: "'JetBrains Mono', monospace" }}>{data.debtRatio}</span>
            <span style={{ fontSize: 9, color: th.textMuted, fontWeight: 600 }}>Mức tài chính</span>
          </div>
        </div>

        {/* Financial highlights */}
        <div style={{ background: th.cardBg, borderRadius: 12, border: `1px solid ${th.cardBorder}`, padding: 18 }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: 12, fontWeight: 700, color: th.text, textTransform: 'uppercase', letterSpacing: 0.4, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 3, height: 12, background: 'var(--ds-color-text-link)', borderRadius: 2, display: 'inline-block' }} />
            Tổng quan tài chính
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: th.rowBg, borderRadius: 8, fontSize: 11 }}>
              <span style={{ color: th.textMuted, fontWeight: 600 }}>ROE</span>
              <span style={{ color: th.text, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{data.roe}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: th.rowBg, borderRadius: 8, fontSize: 11 }}>
              <span style={{ color: th.textMuted, fontWeight: 600 }}>ROA</span>
              <span style={{ color: th.text, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{data.roa}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: th.rowBg, borderRadius: 8, fontSize: 11 }}>
              <span style={{ color: th.textMuted, fontWeight: 600 }}>Biên lợi nhuận</span>
              <span style={{ color: th.text, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{data.margin}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: th.rowBg, borderRadius: 8, fontSize: 11 }}>
              <span style={{ color: th.textMuted, fontWeight: 600 }}>Mục tiêu giá 12T</span>
              <span style={{ color: priceTargetColor, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{data.priceTarget}</span>
            </div>
          </div>
        </div>

        {/* Analyst rating */}
        <div style={{ background: th.cardBg, borderRadius: 12, border: `1px solid ${th.cardBorder}`, padding: 18 }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: 12, fontWeight: 700, color: th.text, textTransform: 'uppercase', letterSpacing: 0.4, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 3, height: 12, background: 'var(--ds-color-warning)', borderRadius: 2, display: 'inline-block' }} />
            Đánh giá nhà phân tích
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${ratingBar.buy}%`, background: 'var(--ds-color-market-up)' }} />
              <div style={{ width: `${ratingBar.hold}%`, background: 'var(--ds-color-warning)' }} />
              <div style={{ width: `${ratingBar.sell}%`, background: 'var(--ds-color-market-down)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 14 }}>
                <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                  <span style={{ background: 'var(--ds-color-market-up)', width: 8, height: 8, borderRadius: '50%' }} />
                  <span style={{ fontSize: 10, color: th.text, fontWeight: 600 }}><strong>{data.ratingBuy}</strong> Mua</span>
                </div>
                <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                  <span style={{ background: 'var(--ds-color-warning)', width: 8, height: 8, borderRadius: '50%' }} />
                  <span style={{ fontSize: 10, color: th.text, fontWeight: 600 }}><strong>{data.ratingHold}</strong> Giữ</span>
                </div>
                <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                  <span style={{ background: 'var(--ds-color-market-down)', width: 8, height: 8, borderRadius: '50%' }} />
                  <span style={{ fontSize: 10, color: th.text, fontWeight: 600 }}><strong>{data.ratingSell}</strong> Bán</span>
                </div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#fff', background: recommendationBg, padding: '5px 12px', borderRadius: 20, letterSpacing: 0.5 }}>{data.recommendation}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{ flex: 1, background: th.cardBg, border: `1px solid ${th.cardBorder}`, color: th.text, borderRadius: 10, padding: 13, fontSize: 11, fontWeight: 700, cursor: 'pointer', transition: 'all .2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <span>⭐</span> Watchlist
          </button>
          <button style={{ flex: 1, background: th.cardBg, border: `1px solid ${th.cardBorder}`, color: th.text, borderRadius: 10, padding: 13, fontSize: 11, fontWeight: 700, cursor: 'pointer', transition: 'all .2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <span>🔔</span> Alert
          </button>
          <button style={{ flex: 1.3, background: 'linear-gradient(135deg,var(--ds-color-market-up),var(--ds-color-green-600))', border: 'none', color: '#fff', borderRadius: 10, padding: 13, fontSize: 11, fontWeight: 800, cursor: 'pointer', transition: 'all .2s', boxShadow: '0 6px 20px rgba(34,197,94,.35)', letterSpacing: 0.3 }}>
            ✓ MUA NGAY
          </button>
        </div>
      </div>
    </div>
  )
}

const StockInfo = memo(StockInfoInner)
export default StockInfo
