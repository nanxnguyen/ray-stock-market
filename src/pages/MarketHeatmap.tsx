import { memo } from 'react'

function MarketHeatmapPageInner() {
  return (
    <div style={{
      background: 'var(--ds-color-bg-app)', color: 'var(--ds-color-text-primary)', minHeight: '100%',
      padding: 16, fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Bản đồ nhiệt</h1>
      <p style={{ color: 'var(--ds-color-text-secondary)', fontSize: 13, marginTop: 8 }}>Trang đang được xây dựng...</p>
    </div>
  )
}

const MarketHeatmapPage = memo(MarketHeatmapPageInner)
export default MarketHeatmapPage
