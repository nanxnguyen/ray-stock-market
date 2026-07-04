import { memo, useState } from 'react'

const flowData = [
  { sector: 'Ngân hàng', buy: 450, sell: 380, net: 70 },
  { sector: 'Công nghệ', buy: 120, sell: 95, net: 25 },
  { sector: 'BĐS', buy: 85, sell: 120, net: -35 },
  { sector: 'Năng lượng', buy: 45, sell: 65, net: -20 },
  { sector: 'Tiêu dùng', buy: 110, sell: 88, net: 22 },
  { sector: 'Y tế', buy: 75, sell: 55, net: 20 },
  { sector: 'Vật liệu', buy: 38, sell: 52, net: -14 },
  { sector: 'Viễn thông', buy: 28, sell: 35, net: -7 },
]

const th = {
  pageBg: 'var(--ds-color-bg-app)',
  cardBg: 'var(--ds-color-bg-card)',
  cardBorder: 'var(--ds-color-border-default)',
  text: 'var(--ds-color-text-primary)',
  textMuted: 'var(--ds-color-text-secondary)',
  inputBg: 'var(--ds-color-bg-input)',
  rowBg: 'var(--ds-color-bg-row-odd)',
}

function MoneyFlowInner() {
  const [timeframe, setTimeframe] = useState('1W')

  const maxFlow = Math.max(...flowData.map(d => Math.abs(d.net)))

  const netFlowBars = flowData.map(d => ({
    sector: d.sector,
    value: (d.net > 0 ? '+' : '') + d.net + 'T',
    color: d.net > 0 ? 'var(--ds-color-market-up)' : 'var(--ds-color-market-down)',
    height: `${(Math.abs(d.net) / maxFlow) * 100}%`,
  }))

  const buyData = [...flowData]
    .sort((a, b) => b.buy - a.buy)
    .slice(0, 6)
    .map(d => ({ sector: d.sector, value: d.buy }))

  const sellData = [...flowData]
    .sort((a, b) => b.sell - a.sell)
    .slice(0, 6)
    .map(d => ({ sector: d.sector, value: d.sell }))

  const sectorSummary = flowData.map(d => ({
    sector: d.sector,
    buy: d.buy + 'T',
    sell: d.sell + 'T',
    net: (d.net > 0 ? '+' : '') + d.net + 'T',
    netColor: d.net > 0 ? 'var(--ds-color-market-up)' : 'var(--ds-color-market-down)',
    pct: (d.net > 0 ? '+' : '') + ((d.net / (d.buy + d.sell)) * 100).toFixed(1) + '%',
  }))

  return (
    <div style={{ width: '100%', minHeight: '100vh', boxSizing: 'border-box', background: th.pageBg, padding: '32px 16px', display: 'flex', justifyContent: 'center', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16, background: th.cardBg, borderRadius: 12, border: `1px solid ${th.cardBorder}`, maxWidth: 1680, width: '100%', margin: '0 auto', height: 'fit-content' }}>

        <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '10px 18px', borderBottom: `1px solid ${th.cardBorder}`, overflowX: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
              <div style={{ width: 24, height: 24, background: 'linear-gradient(135deg, var(--ds-color-market-up), var(--ds-color-green-600))', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="12" height="10" viewBox="0 0 14 12"><polygon points="7,0 14,12 0,12" fill="#fff" /></svg>
              </div>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#fff', whiteSpace: 'nowrap' }}>Ray <span style={{ color: 'var(--ds-color-market-up)' }}>Stock</span></span>
            </div>
            <div style={{ display: 'flex', flexShrink: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', padding: '0 16px', borderRight: `1px solid ${th.cardBorder}`, minWidth: 118 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}><span style={{ fontSize: 9.5, fontWeight: 700, color: th.textMuted, letterSpacing: 0.3 }}>VNINDEX</span><span style={{ fontSize: 13, fontWeight: 800, color: 'var(--ds-color-market-up)', fontFamily: "'JetBrains Mono', monospace" }}>1,862.08</span></div>
                <span style={{ fontSize: 9.5, color: 'var(--ds-color-market-up)', fontWeight: 700 }}>+4.27 +0.23%</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', padding: '0 16px', borderRight: `1px solid ${th.cardBorder}`, minWidth: 118 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}><span style={{ fontSize: 9.5, fontWeight: 700, color: th.textMuted, letterSpacing: 0.3 }}>HNX</span><span style={{ fontSize: 13, fontWeight: 800, color: 'var(--ds-color-market-up)', fontFamily: "'JetBrains Mono', monospace" }}>307.57</span></div>
                <span style={{ fontSize: 9.5, color: 'var(--ds-color-market-up)', fontWeight: 700 }}>+0.84 +0.27%</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', padding: '0 16px', minWidth: 118 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}><span style={{ fontSize: 9.5, fontWeight: 700, color: th.textMuted, letterSpacing: 0.3 }}>UPCOM</span><span style={{ fontSize: 13, fontWeight: 800, color: 'var(--ds-color-market-down)', fontFamily: "'JetBrains Mono', monospace" }}>128.01</span></div>
                <span style={{ fontSize: 9.5, color: 'var(--ds-color-market-down)', fontWeight: 700 }}>-0.66 -0.51%</span>
              </div>
            </div>
            <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--ds-color-text-muted)', fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 }}>04/07/2026 · 15:00:00</span>
          </div>
          <div style={{ display: 'flex', gap: 6, padding: '8px 14px', overflowX: 'auto' }}>
            {['🏠 Trang chủ', '💼 Danh mục', '💰 Đặt lệnh', '📖 Sổ lệnh', '🗺️ Heatmap', '📊 So sánh', '🔍 Screener', '📰 Tin tức', '📅 Sự kiện', '⚙️ Cài đặt'].map((label) => (
              <a key={label} href="#" style={{ textDecoration: 'none', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5, background: th.rowBg, border: `1px solid ${th.cardBorder}`, color: 'var(--ds-color-neutral-300)', borderRadius: 7, padding: '6px 12px', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>{label}</a>
            ))}
          </div>
        </div>

        <div style={{ borderBottom: `1px solid ${th.cardBorder}`, paddingBottom: 10 }}>
          <h2 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: th.text }}>DÒNG TIỀN NHÀ NƯỚC THEO NGÀNH</h2>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 10 }}>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <span style={{ background: 'var(--ds-color-market-up)', width: 12, height: 8, borderRadius: 2 }} />
              <span style={{ color: th.text }}>Mua NN</span>
            </div>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <span style={{ background: 'var(--ds-color-market-down)', width: 12, height: 8, borderRadius: 2 }} />
              <span style={{ color: th.text }}>Bán NN</span>
            </div>
            <span style={{ marginLeft: 'auto', color: th.textMuted, fontWeight: 700 }}>Dữ liệu realtime | Tính bằng tỷ VNĐ</span>
          </div>
        </div>

        <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 4, padding: 16, height: 250, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: th.textMuted, textTransform: 'uppercase' }}>Dòng tiền ròng (Net Flow)</span>
            <div style={{ display: 'flex', gap: 4 }}>
              {(['1D', '1W', '1M'] as const).map((tf) => (
                <button key={tf} onClick={() => setTimeframe(tf)} style={{ background: timeframe === tf ? 'var(--ds-color-blue-500)' : th.inputBg, border: timeframe === tf ? '1px solid var(--ds-color-blue-600)' : `1px solid ${th.cardBorder}`, color: timeframe === tf ? '#fff' : th.textMuted, borderRadius: 3, padding: '3px 8px', fontSize: 9, fontWeight: 700, cursor: 'pointer' }}>{tf}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: 8, flex: 1 }}>
            {netFlowBars.map((bar) => (
              <div key={bar.sector} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
                <div style={{ width: '100%', height: bar.height, background: bar.color, borderRadius: 2, opacity: 0.8, transition: 'all .3s' }} />
                <span style={{ fontSize: 9, color: th.textMuted, textAlign: 'center', wordBreak: 'break-word' }}>{bar.sector}</span>
                <span style={{ fontSize: 9, fontWeight: 700, color: bar.color, fontFamily: "'JetBrains Mono', monospace" }}>{bar.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 4, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <h3 style={{ margin: 0, fontSize: 11, fontWeight: 700, color: 'var(--ds-color-market-up)', textTransform: 'uppercase' }}>💰 Mua NN</h3>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
              {buyData.map((buy) => (
                <div key={buy.sector} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 6, background: 'rgba(34,197,94,.1)', borderRadius: 3, fontSize: 9, borderLeft: '2px solid var(--ds-color-market-up)' }}>
                  <span style={{ color: th.text, fontWeight: 700 }}>{buy.sector}</span>
                  <span style={{ color: 'var(--ds-color-market-up)', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>+{buy.value}T</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 4, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <h3 style={{ margin: 0, fontSize: 11, fontWeight: 700, color: 'var(--ds-color-market-down)', textTransform: 'uppercase' }}>📉 Bán NN</h3>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
              {sellData.map((sell) => (
                <div key={sell.sector} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 6, background: 'rgba(244,63,94,.1)', borderRadius: 3, fontSize: 9, borderLeft: '2px solid var(--ds-color-market-down)' }}>
                  <span style={{ color: th.text, fontWeight: 700 }}>{sell.sector}</span>
                  <span style={{ color: 'var(--ds-color-market-down)', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>-{sell.value}T</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${th.cardBorder}`, paddingTop: 10 }}>
          <h3 style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, color: th.text, textTransform: 'uppercase' }}>Tóm tắt theo ngành</h3>
          <div style={{ overflowX: 'auto', border: `1px solid ${th.cardBorder}`, borderRadius: 4 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 9, fontFamily: "'JetBrains Mono', monospace" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${th.cardBorder}`, height: 24, background: th.inputBg }}>
                  <th style={{ textAlign: 'left', padding: '4px 6px', color: th.textMuted, fontWeight: 700 }}>Ngành</th>
                  <th style={{ textAlign: 'right', padding: '4px 6px', color: th.textMuted, fontWeight: 700 }}>Mua (T)</th>
                  <th style={{ textAlign: 'right', padding: '4px 6px', color: th.textMuted, fontWeight: 700 }}>Bán (T)</th>
                  <th style={{ textAlign: 'right', padding: '4px 6px', color: th.textMuted, fontWeight: 700 }}>Net (T)</th>
                  <th style={{ textAlign: 'right', padding: '4px 6px', color: th.textMuted, fontWeight: 700 }}>% Net</th>
                </tr>
              </thead>
              <tbody>
                {sectorSummary.map((sum) => (
                  <tr key={sum.sector} style={{ borderBottom: `1px solid ${th.cardBorder}`, height: 24 }}>
                    <td style={{ padding: '4px 6px', color: th.text, fontWeight: 700 }}>{sum.sector}</td>
                    <td style={{ padding: '4px 6px', textAlign: 'right', color: 'var(--ds-color-market-up)' }}>{sum.buy}</td>
                    <td style={{ padding: '4px 6px', textAlign: 'right', color: 'var(--ds-color-market-down)' }}>{sum.sell}</td>
                    <td style={{ padding: '4px 6px', textAlign: 'right', color: sum.netColor, fontWeight: 700 }}>{sum.net}</td>
                    <td style={{ padding: '4px 6px', textAlign: 'right', color: sum.netColor, fontWeight: 700 }}>{sum.pct}</td>
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

const MoneyFlow = memo(MoneyFlowInner)
export default MoneyFlow
