import type { StockState } from '../types/priceboard'

type Props = {
  stock: StockState
  onClose: () => void
}

export default function StockDetailModal({ stock, onClose }: Props) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 400,
        background: 'rgba(4,8,14,.72)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(1560px, 97vw)',
          height: '93vh',
          background: '#0b1420',
          border: '1px solid #1e2c3d',
          borderRadius: 12,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 40px 120px rgba(0,0,0,.7)',
        }}
      >
        {/* Title bar */}
        <div style={{
          flexShrink: 0,
          height: 52,
          background: 'linear-gradient(180deg, #243347, #1b2838)',
          borderBottom: '1px solid #1e2c3d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
        }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#eef3f9' }}>
            Phân tích chuyên sâu cổ phiếu
          </span>
          <div
            onClick={onClose}
            style={{
              cursor: 'pointer',
              width: 30,
              height: 30,
              borderRadius: 7,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#93a4b8',
              fontSize: 18,
            }}
          >
            ✕
          </div>
        </div>

        {/* Symbol row */}
        <div style={{
          flexShrink: 0,
          padding: '12px 20px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          borderBottom: '1px solid #14202e',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: '#111c29',
            border: '1px solid #24344a',
            borderRadius: 7,
            padding: '7px 12px',
            minWidth: 120,
          }}>
            <span style={{
              fontSize: 15,
              fontWeight: 800,
              color: '#eef3f9',
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: '.5px',
            }}>
              {stock.s}
            </span>
          </div>
          <span style={{
            fontSize: 26,
            fontWeight: 800,
            color: stock.lp >= stock.r ? '#22c55e' : '#f43f5e',
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {stock.lp.toFixed(2)}
          </span>
          <span style={{
            fontSize: 14,
            fontWeight: 700,
            color: stock.lp >= stock.r ? '#22c55e' : '#f43f5e',
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {stock.lp >= stock.r ? '+' : ''}{(stock.lp - stock.r).toFixed(2)}
          </span>
          <span style={{
            fontSize: 14,
            fontWeight: 700,
            color: stock.lp >= stock.r ? '#22c55e' : '#f43f5e',
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {stock.pct >= 0 ? '+' : ''}{stock.pct.toFixed(2)}%
          </span>
        </div>

        {/* Tab bar placeholder */}
        <div style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'stretch',
          gap: 2,
          padding: '0 20px',
          borderBottom: '1px solid #1a2736',
          background: '#0b1420',
        }}>
          {['Tổng quan', 'Thống kê', 'Biểu đồ kỹ thuật', 'Tâm lý kỹ thuật', 'Tài chính', 'Khuyến nghị', 'Sự kiện'].map((label, i) => (
            <div key={label} style={{
              cursor: 'pointer',
              padding: '12px 4px',
              marginRight: 22,
              fontSize: 13.5,
              fontWeight: i === 0 ? 700 : 500,
              color: i === 0 ? '#fff' : '#8296ab',
              borderBottom: i === 0 ? '2px solid #2f7fff' : '2px solid transparent',
              whiteSpace: 'nowrap',
            }}>
              {label}
            </div>
          ))}
        </div>

        {/* Body placeholder */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          background: '#08111b',
          padding: '16px 20px 22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#5f7488',
          fontSize: 14,
        }}>
          Stock Detail Modal — Coming in Tasks 3-8
        </div>
      </div>
    </div>
  )
}
