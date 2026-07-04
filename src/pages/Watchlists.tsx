import { memo, useState } from 'react'

const stockData: Record<string, { price: string; change: string; up: boolean; volume: string; cap: string }> = {
  VCB: { price: '81.50đ', change: '+2.98%', up: true, volume: '1.2M', cap: '850.5T' },
  ACB: { price: '22.65đ', change: '-1.95%', up: false, volume: '3.4M', cap: '226.5T' },
  FPT: { price: '137.50đ', change: '+0.88%', up: true, volume: '0.8M', cap: '187.2T' },
  HPG: { price: '24.10đ', change: '-1.23%', up: false, volume: '5.6M', cap: '140.8T' },
  BID: { price: '45.80đ', change: '+1.77%', up: true, volume: '2.1M', cap: '260.4T' },
  MWG: { price: '94.50đ', change: '+4.25%', up: true, volume: '1.5M', cap: '64.3T' },
  TCB: { price: '35.10đ', change: '+2.05%', up: true, volume: '2.8M', cap: '123.6T' },
  CTG: { price: '38.20đ', change: '-0.55%', up: false, volume: '1.9M', cap: '145.2T' },
  DGW: { price: '45.60đ', change: '+3.15%', up: true, volume: '0.6M', cap: '8.4T' },
  VNM: { price: '88.50đ', change: '+2.15%', up: true, volume: '1.1M', cap: '185.6T' },
  GAS: { price: '70.20đ', change: '-0.85%', up: false, volume: '0.5M', cap: '134.8T' },
  PLX: { price: '42.10đ', change: '+1.05%', up: true, volume: '0.9M', cap: '54.2T' },
}

const listDefs: Record<string, { name: string; symbols: string[] }> = {
  default: { name: 'Danh mục của tôi', symbols: ['VCB', 'ACB', 'FPT', 'HPG', 'BID', 'MWG'] },
  banking: { name: 'Cổ phiếu ngân hàng', symbols: ['VCB', 'ACB', 'BID', 'TCB', 'CTG'] },
  tech: { name: 'Công nghệ & Bán lẻ', symbols: ['FPT', 'MWG', 'DGW'] },
  dividend: { name: 'Cổ tức cao', symbols: ['VNM', 'GAS', 'PLX', 'ACB'] },
}

function WatchlistsInner() {
  const [activeList, setActiveList] = useState('default')

  const lists = Object.keys(listDefs).map((key) => ({
    key,
    name: listDefs[key].name,
    count: listDefs[key].symbols.length,
    active: activeList === key,
  }))

  const items = listDefs[activeList].symbols.map((sym) => {
    const d = stockData[sym]
    return {
      symbol: sym,
      price: d.price,
      change: d.change,
      changeColor: d.up ? '#22c55e' : '#f43f5e',
      volume: d.volume,
      cap: d.cap,
    }
  })

  return (
    <div style={{
      width: '100%', minHeight: '100vh', background: 'var(--ds-color-bg-app)',
      padding: 24, boxSizing: 'border-box',
    }}>
      <div style={{ maxWidth: 1680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--ds-color-text-primary)' }}>DANH MỤC THEO DÕI</h1>

        {/* Watchlist Tabs */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          {lists.map((l) => (
            <button
              key={l.key}
              onClick={() => setActiveList(l.key)}
              style={{
                background: l.active ? 'var(--ds-color-blue-600)' : 'var(--ds-color-bg-input)',
                color: l.active ? '#fff' : 'var(--ds-color-text-secondary)',
                border: `1px solid ${l.active ? 'var(--ds-color-blue-600)' : 'var(--ds-color-border-strong)'}`,
                borderRadius: 8, padding: '8px 14px', fontSize: 11.5, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              {l.name}
              <span style={{ fontSize: 9, opacity: 0.7 }}>({l.count})</span>
            </button>
          ))}
          <button style={{ background: 'transparent', border: '1px dashed var(--ds-color-border-strong)', color: 'var(--ds-color-text-secondary)', borderRadius: 8, padding: '8px 14px', fontSize: 11.5, fontWeight: 700, cursor: 'pointer' }}>+ Danh mục mới</button>
        </div>

        {/* Table */}
        <div style={{ background: 'var(--ds-color-bg-elevated)', border: '1px solid var(--ds-color-border-strong)', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--ds-color-border-strong)', height: 34, background: 'var(--ds-color-bg-input)' }}>
                <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--ds-color-text-secondary)', fontWeight: 700 }}>⠿</th>
                <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--ds-color-text-secondary)', fontWeight: 700 }}>Mã CK</th>
                <th style={{ textAlign: 'right', padding: '8px 12px', color: 'var(--ds-color-text-secondary)', fontWeight: 700 }}>Giá</th>
                <th style={{ textAlign: 'right', padding: '8px 12px', color: 'var(--ds-color-text-secondary)', fontWeight: 700 }}>% Thay đổi</th>
                <th style={{ textAlign: 'right', padding: '8px 12px', color: 'var(--ds-color-text-secondary)', fontWeight: 700 }}>KLGD</th>
                <th style={{ textAlign: 'right', padding: '8px 12px', color: 'var(--ds-color-text-secondary)', fontWeight: 700 }}>Vốn hóa</th>
                <th style={{ textAlign: 'center', padding: '8px 12px', color: 'var(--ds-color-text-secondary)', fontWeight: 700 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.symbol} style={{ borderBottom: '1px solid var(--ds-color-border-strong)', height: 38 }}>
                  <td style={{ padding: '8px 12px', color: 'var(--ds-color-text-secondary)', cursor: 'grab' }}>⠿</td>
                  <td style={{ padding: '8px 12px', color: 'var(--ds-color-text-link)', fontWeight: 700 }}>{it.symbol}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--ds-color-text-primary)', fontWeight: 700 }}>{it.price}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: it.changeColor, fontWeight: 700 }}>{it.change}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--ds-color-text-secondary)' }}>{it.volume}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--ds-color-text-secondary)' }}>{it.cap}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                    <button style={{ background: 'transparent', border: 'none', color: 'var(--ds-color-text-secondary)', cursor: 'pointer', fontSize: 13 }}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const Watchlists = memo(WatchlistsInner)
export default Watchlists
