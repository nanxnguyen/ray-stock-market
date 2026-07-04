import { memo } from 'react'

function MarketHeatmapPageInner() {
  return (
    <div style={{
      background: '#060c18', color: '#d4e0ee', minHeight: '100%',
      padding: 16, fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Bản đồ nhiệt</h1>
      <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 8 }}>Trang đang được xây dựng...</p>
    </div>
  )
}

const MarketHeatmapPage = memo(MarketHeatmapPageInner)
export default MarketHeatmapPage
