import { memo, useState } from 'react'

const allStocks = [
  { symbol: 'VCB', price: 81.50, change: '+2.98%', pe: 11.2, pb: 1.45, eps: 7.28, dividend: '3.2%', roe: '23.5%', sector: 'banking' },
  { symbol: 'ACB', price: 22.65, change: '-1.95%', pe: 8.9, pb: 1.12, eps: 2.54, dividend: '4.1%', roe: '21.2%', sector: 'banking' },
  { symbol: 'FPT', price: 137.50, change: '+0.88%', pe: 18.5, pb: 3.2, eps: 7.43, dividend: '1.8%', roe: '18.5%', sector: 'tech' },
  { symbol: 'MWG', price: 95.20, change: '+4.25%', pe: 12.8, pb: 1.85, eps: 7.43, dividend: '2.5%', roe: '15.2%', sector: 'consumer' },
  { symbol: 'HPG', price: 24.10, change: '-1.23%', pe: 6.5, pb: 0.95, eps: 3.70, dividend: '2.5%', roe: '20.8%', sector: 'energy' },
  { symbol: 'BID', price: 45.80, change: '+1.77%', pe: 13.2, pb: 1.68, eps: 3.47, dividend: '2.1%', roe: '16.5%', sector: 'banking' },
  { symbol: 'VNM', price: 88.50, change: '+2.15%', pe: 22.5, pb: 4.2, eps: 3.93, dividend: '2.8%', roe: '12.5%', sector: 'consumer' },
  { symbol: 'PVD', price: 18.50, change: '-3.45%', pe: 5.2, pb: 0.68, eps: 3.55, dividend: '3.5%', roe: '18.2%', sector: 'energy' },
]

function StockScreenerInner() {
  const [filters, setFilters] = useState({
    peMin: '', peMax: '', pbMin: '', pbMax: '', epsMin: '',
    changeMin: '', changeMax: '', divMin: '', roeMin: '', selectedSector: '',
  })
  const [results, setResults] = useState<typeof allStocks>([])

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const runScreener = () => {
    const { peMin, peMax, pbMin, pbMax, epsMin, changeMin, changeMax, divMin, roeMin, selectedSector } = filters

    const filtered = allStocks.filter((s) => {
      if (selectedSector && s.sector !== selectedSector) return false
      if (peMin && s.pe < parseFloat(peMin)) return false
      if (peMax && s.pe > parseFloat(peMax)) return false
      if (pbMin && s.pb < parseFloat(pbMin)) return false
      if (pbMax && s.pb > parseFloat(pbMax)) return false
      if (epsMin && s.eps < parseFloat(epsMin)) return false
      if (changeMin && parseFloat(s.change) < parseFloat(changeMin)) return false
      if (changeMax && parseFloat(s.change) > parseFloat(changeMax)) return false
      if (divMin && parseFloat(s.dividend) < parseFloat(divMin)) return false
      if (roeMin && parseFloat(s.roe) < parseFloat(roeMin)) return false
      return true
    })

    setResults(filtered)
  }

  const resetScreener = () => {
    setFilters({ peMin: '', peMax: '', pbMin: '', pbMax: '', epsMin: '', changeMin: '', changeMax: '', divMin: '', roeMin: '', selectedSector: '' })
    setResults([])
  }

  const exportResults = () => {
    const csv = [
      'Symbol,Price,Change,P/E,P/B,EPS,Dividend,ROE',
      ...results.map((r) => `${r.symbol},${r.price},${r.change},${r.pe},${r.pb},${r.eps},${r.dividend},${r.roe}`),
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `screener-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const resultsData = results.map((r) => ({
    symbol: r.symbol,
    symColor: '#60a5fa',
    price: r.price.toFixed(2) + 'đ',
    change: r.change,
    changeColor: r.change.startsWith('+') ? '#22c55e' : '#f43f5e',
    pe: r.pe.toFixed(1) + 'x',
    peColor: r.pe < 12 ? '#22c55e' : r.pe > 18 ? '#f43f5e' : '#f59e0b',
    pb: r.pb.toFixed(2) + 'x',
    pbColor: r.pb < 1.5 ? '#22c55e' : r.pb > 2.5 ? '#f43f5e' : '#f59e0b',
    eps: r.eps.toFixed(2) + 'đ',
    dividend: r.dividend,
    divColor: parseFloat(r.dividend) > 3 ? '#22c55e' : '#f59e0b',
    roe: r.roe,
    roeColor: parseFloat(r.roe) > 18 ? '#22c55e' : '#f59e0b',
  }))

  const inputStyle = {
    flex: 1, padding: '4px 6px', border: '1px solid #2a3139', borderRadius: 3,
    background: '#0f1419', color: '#e4e6eb', fontSize: 9, boxSizing: 'border-box' as const,
  }

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
          <h2 style={{ margin: '0 0 8px 0', fontSize: 16, fontWeight: 700, color: '#e4e6eb' }}>SCREENER (LỌC CỔ PHIẾU)</h2>
          <p style={{ margin: 0, fontSize: 10, color: '#8a92a0' }}>Tìm cơ hội giao dịch dựa trên các tiêu chí kết hợp</p>
        </div>

        {/* Filter Panel */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, padding: 12, background: '#1a1f26', borderRadius: 4, border: '1px solid #2a3139' }}>

          {/* P/E Ratio */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 10, background: '#0f1419', borderRadius: 3, border: '1px solid #2a3139' }}>
            <label style={{ fontSize: 10, fontWeight: 700, color: '#8a92a0', textTransform: 'uppercase' }}>P/E Ratio</label>
            <div style={{ display: 'flex', gap: 4 }}>
              <input type="number" placeholder="Min" value={filters.peMin} onChange={(e) => updateFilter('peMin', e.target.value)} style={inputStyle} />
              <input type="number" placeholder="Max" value={filters.peMax} onChange={(e) => updateFilter('peMax', e.target.value)} style={inputStyle} />
            </div>
          </div>

          {/* P/B Ratio */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 10, background: '#0f1419', borderRadius: 3, border: '1px solid #2a3139' }}>
            <label style={{ fontSize: 10, fontWeight: 700, color: '#8a92a0', textTransform: 'uppercase' }}>P/B Ratio</label>
            <div style={{ display: 'flex', gap: 4 }}>
              <input type="number" placeholder="Min" value={filters.pbMin} onChange={(e) => updateFilter('pbMin', e.target.value)} style={inputStyle} />
              <input type="number" placeholder="Max" value={filters.pbMax} onChange={(e) => updateFilter('pbMax', e.target.value)} style={inputStyle} />
            </div>
          </div>

          {/* EPS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 10, background: '#0f1419', borderRadius: 3, border: '1px solid #2a3139' }}>
            <label style={{ fontSize: 10, fontWeight: 700, color: '#8a92a0', textTransform: 'uppercase' }}>EPS (TTM)</label>
            <input type="number" placeholder="Min EPS" value={filters.epsMin} onChange={(e) => updateFilter('epsMin', e.target.value)} style={{ width: '100%', padding: '4px 6px', border: '1px solid #2a3139', borderRadius: 3, background: '#0f1419', color: '#e4e6eb', fontSize: 9 }} />
          </div>

          {/* % Thay đổi */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 10, background: '#0f1419', borderRadius: 3, border: '1px solid #2a3139' }}>
            <label style={{ fontSize: 10, fontWeight: 700, color: '#8a92a0', textTransform: 'uppercase' }}>% Thay đổi</label>
            <div style={{ display: 'flex', gap: 4 }}>
              <input type="number" placeholder="Min" value={filters.changeMin} onChange={(e) => updateFilter('changeMin', e.target.value)} style={inputStyle} />
              <input type="number" placeholder="Max" value={filters.changeMax} onChange={(e) => updateFilter('changeMax', e.target.value)} style={inputStyle} />
            </div>
          </div>

          {/* Dividend Yield */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 10, background: '#0f1419', borderRadius: 3, border: '1px solid #2a3139' }}>
            <label style={{ fontSize: 10, fontWeight: 700, color: '#8a92a0', textTransform: 'uppercase' }}>Dividend Yield</label>
            <input type="number" placeholder="Min %" value={filters.divMin} onChange={(e) => updateFilter('divMin', e.target.value)} style={{ width: '100%', padding: '4px 6px', border: '1px solid #2a3139', borderRadius: 3, background: '#0f1419', color: '#e4e6eb', fontSize: 9 }} />
          </div>

          {/* ROE */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 10, background: '#0f1419', borderRadius: 3, border: '1px solid #2a3139' }}>
            <label style={{ fontSize: 10, fontWeight: 700, color: '#8a92a0', textTransform: 'uppercase' }}>ROE %</label>
            <input type="number" placeholder="Min ROE" value={filters.roeMin} onChange={(e) => updateFilter('roeMin', e.target.value)} style={{ width: '100%', padding: '4px 6px', border: '1px solid #2a3139', borderRadius: 3, background: '#0f1419', color: '#e4e6eb', fontSize: 9 }} />
          </div>

          {/* Sector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 10, background: '#0f1419', borderRadius: 3, border: '1px solid #2a3139' }}>
            <label style={{ fontSize: 10, fontWeight: 700, color: '#8a92a0', textTransform: 'uppercase' }}>Ngành</label>
            <select value={filters.selectedSector} onChange={(e) => updateFilter('selectedSector', e.target.value)} style={{ padding: '4px 6px', border: '1px solid #2a3139', borderRadius: 3, background: '#0f1419', color: '#e4e6eb', fontSize: 9 }}>
              <option value="">Tất cả</option>
              <option value="banking">Ngân hàng</option>
              <option value="tech">Công nghệ</option>
              <option value="energy">Năng lượng</option>
              <option value="realestate">BĐS</option>
              <option value="consumer">Tiêu dùng</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end' }}>
            <button onClick={runScreener} style={{ flex: 1, background: '#3b82f6', border: '1px solid #2563eb', color: '#fff', borderRadius: 3, padding: 6, fontSize: 9, fontWeight: 700, cursor: 'pointer' }}>🔍 Lọc</button>
            <button onClick={resetScreener} style={{ flex: 1, background: '#1a1f26', border: '1px solid #2a3139', color: '#8a92a0', borderRadius: 3, padding: 6, fontSize: 9, fontWeight: 700, cursor: 'pointer' }}>Reset</button>
          </div>
        </div>

        {/* Results Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#e4e6eb', textTransform: 'uppercase' }}>Kết quả: {resultsData.length} cổ phiếu</span>
          <div style={{ display: 'flex', gap: 4 }}>
            <button style={{ background: '#1a1f26', border: '1px solid #2a3139', color: '#8a92a0', borderRadius: 3, padding: '4px 8px', fontSize: 9, fontWeight: 700, cursor: 'pointer' }}>📊 Chart</button>
            <button onClick={exportResults} style={{ background: '#1a1f26', border: '1px solid #2a3139', color: '#8a92a0', borderRadius: 3, padding: '4px 8px', fontSize: 9, fontWeight: 700, cursor: 'pointer' }}>⬇ CSV</button>
          </div>
        </div>

        {/* Results Table */}
        <div style={{ overflowX: 'auto', border: '1px solid #2a3139', borderRadius: 4 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 9, fontFamily: "'JetBrains Mono', monospace" }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2a3139', height: 28, background: '#1a1f26' }}>
                <th style={{ textAlign: 'left', padding: 6, color: '#8a92a0', fontWeight: 700, textTransform: 'uppercase' }}>Mã</th>
                <th style={{ textAlign: 'right', padding: 6, color: '#8a92a0', fontWeight: 700, textTransform: 'uppercase' }}>Giá</th>
                <th style={{ textAlign: 'right', padding: 6, color: '#8a92a0', fontWeight: 700, textTransform: 'uppercase' }}>% Thay đổi</th>
                <th style={{ textAlign: 'right', padding: 6, color: '#8a92a0', fontWeight: 700, textTransform: 'uppercase' }}>P/E</th>
                <th style={{ textAlign: 'right', padding: 6, color: '#8a92a0', fontWeight: 700, textTransform: 'uppercase' }}>P/B</th>
                <th style={{ textAlign: 'right', padding: 6, color: '#8a92a0', fontWeight: 700, textTransform: 'uppercase' }}>EPS</th>
                <th style={{ textAlign: 'right', padding: 6, color: '#8a92a0', fontWeight: 700, textTransform: 'uppercase' }}>Dividend</th>
                <th style={{ textAlign: 'right', padding: 6, color: '#8a92a0', fontWeight: 700, textTransform: 'uppercase' }}>ROE</th>
                <th style={{ textAlign: 'center', padding: 6, color: '#8a92a0', fontWeight: 700, textTransform: 'uppercase' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {resultsData.map((res) => (
                <tr key={res.symbol} style={{ borderBottom: '1px solid #2a3139', height: 28 }}>
                  <td style={{ padding: 6, color: res.symColor, fontWeight: 700 }}>{res.symbol}</td>
                  <td style={{ padding: 6, textAlign: 'right', color: '#e4e6eb' }}>{res.price}</td>
                  <td style={{ padding: 6, textAlign: 'right', color: res.changeColor, fontWeight: 700 }}>{res.change}</td>
                  <td style={{ padding: 6, textAlign: 'right', color: res.peColor }}>{res.pe}</td>
                  <td style={{ padding: 6, textAlign: 'right', color: res.pbColor }}>{res.pb}</td>
                  <td style={{ padding: 6, textAlign: 'right', color: '#8a92a0' }}>{res.eps}</td>
                  <td style={{ padding: 6, textAlign: 'right', color: res.divColor }}>{res.dividend}</td>
                  <td style={{ padding: 6, textAlign: 'right', color: res.roeColor }}>{res.roe}</td>
                  <td style={{ padding: 6, textAlign: 'center' }}>
                    <button style={{ background: 'rgba(34, 197, 94, 0.2)', border: '1px solid #22c55e', color: '#22c55e', borderRadius: 2, padding: '2px 4px', fontSize: 8, fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase' }}>Mua</button>
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

const StockScreener = memo(StockScreenerInner)
export default StockScreener
