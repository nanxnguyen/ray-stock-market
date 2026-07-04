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
    symColor: 'var(--ds-color-text-link)',
    price: r.price.toFixed(2) + 'đ',
    change: r.change,
    changeColor: r.change.startsWith('+') ? 'var(--ds-color-market-up)' : 'var(--ds-color-market-down)',
    pe: r.pe.toFixed(1) + 'x',
    peColor: r.pe < 12 ? 'var(--ds-color-market-up)' : r.pe > 18 ? 'var(--ds-color-market-down)' : 'var(--ds-color-warning)',
    pb: r.pb.toFixed(2) + 'x',
    pbColor: r.pb < 1.5 ? 'var(--ds-color-market-up)' : r.pb > 2.5 ? 'var(--ds-color-market-down)' : 'var(--ds-color-warning)',
    eps: r.eps.toFixed(2) + 'đ',
    dividend: r.dividend,
    divColor: parseFloat(r.dividend) > 3 ? 'var(--ds-color-market-up)' : 'var(--ds-color-warning)',
    roe: r.roe,
    roeColor: parseFloat(r.roe) > 18 ? 'var(--ds-color-market-up)' : 'var(--ds-color-warning)',
  }))

  const inputStyle = {
    flex: 1, padding: '4px 6px', border: '1px solid var(--ds-color-border-strong)', borderRadius: 3,
    background: 'var(--ds-color-bg-input)', color: 'var(--ds-color-text-primary)', fontSize: 9, boxSizing: 'border-box' as const,
  }

  return (
    <div style={{
      width: '100%', minHeight: '100vh', boxSizing: 'border-box',
      background: 'var(--ds-color-bg-app)', padding: '32px 16px', display: 'flex', justifyContent: 'center',
    }}>
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 12, padding: 16,
        background: 'var(--ds-color-bg-card)', borderRadius: 12, border: '1px solid var(--ds-color-border-strong)',
        maxWidth: 1680, width: '100%', margin: '0 auto', height: 'fit-content',
      }}>

        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--ds-color-border-strong)', paddingBottom: 10 }}>
          <h2 style={{ margin: '0 0 8px 0', fontSize: 16, fontWeight: 700, color: 'var(--ds-color-text-primary)' }}>SCREENER (LỌC CỔ PHIẾU)</h2>
          <p style={{ margin: 0, fontSize: 10, color: 'var(--ds-color-text-secondary)' }}>Tìm cơ hội giao dịch dựa trên các tiêu chí kết hợp</p>
        </div>

        {/* Filter Panel */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, padding: 12, background: 'var(--ds-color-bg-card)', borderRadius: 4, border: '1px solid var(--ds-color-border-strong)' }}>

          {/* P/E Ratio */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 10, background: 'var(--ds-color-bg-input)', borderRadius: 3, border: '1px solid var(--ds-color-border-strong)' }}>
            <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--ds-color-text-secondary)', textTransform: 'uppercase' }}>P/E Ratio</label>
            <div style={{ display: 'flex', gap: 4 }}>
              <input type="number" placeholder="Min" value={filters.peMin} onChange={(e) => updateFilter('peMin', e.target.value)} style={inputStyle} />
              <input type="number" placeholder="Max" value={filters.peMax} onChange={(e) => updateFilter('peMax', e.target.value)} style={inputStyle} />
            </div>
          </div>

          {/* P/B Ratio */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 10, background: 'var(--ds-color-bg-input)', borderRadius: 3, border: '1px solid var(--ds-color-border-strong)' }}>
            <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--ds-color-text-secondary)', textTransform: 'uppercase' }}>P/B Ratio</label>
            <div style={{ display: 'flex', gap: 4 }}>
              <input type="number" placeholder="Min" value={filters.pbMin} onChange={(e) => updateFilter('pbMin', e.target.value)} style={inputStyle} />
              <input type="number" placeholder="Max" value={filters.pbMax} onChange={(e) => updateFilter('pbMax', e.target.value)} style={inputStyle} />
            </div>
          </div>

          {/* EPS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 10, background: 'var(--ds-color-bg-input)', borderRadius: 3, border: '1px solid var(--ds-color-border-strong)' }}>
            <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--ds-color-text-secondary)', textTransform: 'uppercase' }}>EPS (TTM)</label>
            <input type="number" placeholder="Min EPS" value={filters.epsMin} onChange={(e) => updateFilter('epsMin', e.target.value)} style={{ width: '100%', padding: '4px 6px', border: '1px solid var(--ds-color-border-strong)', borderRadius: 3, background: 'var(--ds-color-bg-input)', color: 'var(--ds-color-text-primary)', fontSize: 9 }} />
          </div>

          {/* % Thay đổi */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 10, background: 'var(--ds-color-bg-input)', borderRadius: 3, border: '1px solid var(--ds-color-border-strong)' }}>
            <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--ds-color-text-secondary)', textTransform: 'uppercase' }}>% Thay đổi</label>
            <div style={{ display: 'flex', gap: 4 }}>
              <input type="number" placeholder="Min" value={filters.changeMin} onChange={(e) => updateFilter('changeMin', e.target.value)} style={inputStyle} />
              <input type="number" placeholder="Max" value={filters.changeMax} onChange={(e) => updateFilter('changeMax', e.target.value)} style={inputStyle} />
            </div>
          </div>

          {/* Dividend Yield */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 10, background: 'var(--ds-color-bg-input)', borderRadius: 3, border: '1px solid var(--ds-color-border-strong)' }}>
            <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--ds-color-text-secondary)', textTransform: 'uppercase' }}>Dividend Yield</label>
            <input type="number" placeholder="Min %" value={filters.divMin} onChange={(e) => updateFilter('divMin', e.target.value)} style={{ width: '100%', padding: '4px 6px', border: '1px solid var(--ds-color-border-strong)', borderRadius: 3, background: 'var(--ds-color-bg-input)', color: 'var(--ds-color-text-primary)', fontSize: 9 }} />
          </div>

          {/* ROE */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 10, background: 'var(--ds-color-bg-input)', borderRadius: 3, border: '1px solid var(--ds-color-border-strong)' }}>
            <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--ds-color-text-secondary)', textTransform: 'uppercase' }}>ROE %</label>
            <input type="number" placeholder="Min ROE" value={filters.roeMin} onChange={(e) => updateFilter('roeMin', e.target.value)} style={{ width: '100%', padding: '4px 6px', border: '1px solid var(--ds-color-border-strong)', borderRadius: 3, background: 'var(--ds-color-bg-input)', color: 'var(--ds-color-text-primary)', fontSize: 9 }} />
          </div>

          {/* Sector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 10, background: 'var(--ds-color-bg-input)', borderRadius: 3, border: '1px solid var(--ds-color-border-strong)' }}>
            <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--ds-color-text-secondary)', textTransform: 'uppercase' }}>Ngành</label>
            <select value={filters.selectedSector} onChange={(e) => updateFilter('selectedSector', e.target.value)} style={{ padding: '4px 6px', border: '1px solid var(--ds-color-border-strong)', borderRadius: 3, background: 'var(--ds-color-bg-input)', color: 'var(--ds-color-text-primary)', fontSize: 9 }}>
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
            <button onClick={runScreener} style={{ flex: 1, background: 'var(--ds-color-blue-500)', border: '1px solid var(--ds-color-blue-600)', color: '#fff', borderRadius: 3, padding: 6, fontSize: 9, fontWeight: 700, cursor: 'pointer' }}>🔍 Lọc</button>
            <button onClick={resetScreener} style={{ flex: 1, background: 'var(--ds-color-bg-card)', border: '1px solid var(--ds-color-border-strong)', color: 'var(--ds-color-text-secondary)', borderRadius: 3, padding: 6, fontSize: 9, fontWeight: 700, cursor: 'pointer' }}>Reset</button>
          </div>
        </div>

        {/* Results Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--ds-color-text-primary)', textTransform: 'uppercase' }}>Kết quả: {resultsData.length} cổ phiếu</span>
          <div style={{ display: 'flex', gap: 4 }}>
            <button style={{ background: 'var(--ds-color-bg-card)', border: '1px solid var(--ds-color-border-strong)', color: 'var(--ds-color-text-secondary)', borderRadius: 3, padding: '4px 8px', fontSize: 9, fontWeight: 700, cursor: 'pointer' }}>📊 Chart</button>
            <button onClick={exportResults} style={{ background: 'var(--ds-color-bg-card)', border: '1px solid var(--ds-color-border-strong)', color: 'var(--ds-color-text-secondary)', borderRadius: 3, padding: '4px 8px', fontSize: 9, fontWeight: 700, cursor: 'pointer' }}>⬇ CSV</button>
          </div>
        </div>

        {/* Results Table */}
        <div style={{ overflowX: 'auto', border: '1px solid var(--ds-color-border-strong)', borderRadius: 4 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 9, fontFamily: "'JetBrains Mono', monospace" }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--ds-color-border-strong)', height: 28, background: 'var(--ds-color-bg-card)' }}>
                <th style={{ textAlign: 'left', padding: 6, color: 'var(--ds-color-text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Mã</th>
                <th style={{ textAlign: 'right', padding: 6, color: 'var(--ds-color-text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Giá</th>
                <th style={{ textAlign: 'right', padding: 6, color: 'var(--ds-color-text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>% Thay đổi</th>
                <th style={{ textAlign: 'right', padding: 6, color: 'var(--ds-color-text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>P/E</th>
                <th style={{ textAlign: 'right', padding: 6, color: 'var(--ds-color-text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>P/B</th>
                <th style={{ textAlign: 'right', padding: 6, color: 'var(--ds-color-text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>EPS</th>
                <th style={{ textAlign: 'right', padding: 6, color: 'var(--ds-color-text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Dividend</th>
                <th style={{ textAlign: 'right', padding: 6, color: 'var(--ds-color-text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>ROE</th>
                <th style={{ textAlign: 'center', padding: 6, color: 'var(--ds-color-text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {resultsData.map((res) => (
                <tr key={res.symbol} style={{ borderBottom: '1px solid var(--ds-color-border-strong)', height: 28 }}>
                  <td style={{ padding: 6, color: res.symColor, fontWeight: 700 }}>{res.symbol}</td>
                  <td style={{ padding: 6, textAlign: 'right', color: 'var(--ds-color-text-primary)' }}>{res.price}</td>
                  <td style={{ padding: 6, textAlign: 'right', color: res.changeColor, fontWeight: 700 }}>{res.change}</td>
                  <td style={{ padding: 6, textAlign: 'right', color: res.peColor }}>{res.pe}</td>
                  <td style={{ padding: 6, textAlign: 'right', color: res.pbColor }}>{res.pb}</td>
                  <td style={{ padding: 6, textAlign: 'right', color: 'var(--ds-color-text-secondary)' }}>{res.eps}</td>
                  <td style={{ padding: 6, textAlign: 'right', color: res.divColor }}>{res.dividend}</td>
                  <td style={{ padding: 6, textAlign: 'right', color: res.roeColor }}>{res.roe}</td>
                  <td style={{ padding: 6, textAlign: 'center' }}>
                    <button style={{ background: 'rgba(34, 197, 94, 0.2)', border: '1px solid var(--ds-color-market-up)', color: 'var(--ds-color-market-up)', borderRadius: 2, padding: '2px 4px', fontSize: 8, fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase' }}>Mua</button>
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
