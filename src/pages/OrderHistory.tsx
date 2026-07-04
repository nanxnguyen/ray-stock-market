import { memo, useState, useMemo } from 'react'

const th = {
  pageBg: '#060c18',
  cardBg: '#131a24',
  cardBorder: '#232b38',
  headBg: '#1a212c',
  text: '#eef1f6',
  textMuted: '#8a94a6',
  iconBg: '#1a212c',
}

const allOrders = [
  { time: '09:32:15', symbol: 'VCB', side: 'MUA', price: '81.30', qty: '500', filled: '500', status: 'filled' },
  { time: '09:45:22', symbol: 'ACB', side: 'BÁN', price: '22.70', qty: '1,000', filled: '1,000', status: 'filled' },
  { time: '10:12:08', symbol: 'FPT', side: 'MUA', price: '137.00', qty: '200', filled: '0', status: 'pending' },
  { time: '10:30:44', symbol: 'HPG', side: 'BÁN', price: '24.20', qty: '800', filled: '350', status: 'partial' },
  { time: '11:05:19', symbol: 'BID', side: 'MUA', price: '45.60', qty: '300', filled: '300', status: 'filled' },
  { time: '11:20:31', symbol: 'MWG', side: 'MUA', price: '94.50', qty: '150', filled: '0', status: 'pending' },
  { time: '13:41:07', symbol: 'VNM', side: 'BÁN', price: '88.20', qty: '400', filled: '0', status: 'cancelled' },
  { time: '14:02:53', symbol: 'TCB', side: 'MUA', price: '35.10', qty: '600', filled: '600', status: 'filled' },
]

const statusMap: Record<string, { label: string; bg: string; color: string }> = {
  filled: { label: 'ĐÃ KHỚP', bg: 'rgba(34,197,94,.15)', color: '#22c55e' },
  pending: { label: 'CHỜ KHỚP', bg: 'rgba(245,158,11,.15)', color: '#f59e0b' },
  partial: { label: 'KHỚP 1 PHẦN', bg: 'rgba(96,165,250,.15)', color: '#60a5fa' },
  cancelled: { label: 'ĐÃ HỦY', bg: 'rgba(138,148,166,.15)', color: '#8a94a6' },
}

function OrderHistoryInner() {
  const [filterTab, setFilterTab] = useState('all')

  const filtered = useMemo(() => {
    if (filterTab === 'filled') return allOrders.filter(o => o.status === 'filled')
    if (filterTab === 'pending') return allOrders.filter(o => o.status === 'pending' || o.status === 'partial')
    if (filterTab === 'cancelled') return allOrders.filter(o => o.status === 'cancelled')
    return allOrders
  }, [filterTab])

  const orders = filtered.map(o => {
    const st = statusMap[o.status]
    return {
      ...o,
      sideBg: o.side === 'MUA' ? 'rgba(34,197,94,.15)' : 'rgba(244,63,94,.15)',
      sideColor: o.side === 'MUA' ? '#22c55e' : '#f43f5e',
      statusLabel: st.label,
      statusBg: st.bg,
      statusColor: st.color,
      canEdit: o.status === 'pending' || o.status === 'partial',
    }
  })

  const filledCount = allOrders.filter(o => o.status === 'filled').length
  const pendingCount = allOrders.filter(o => o.status === 'pending' || o.status === 'partial').length

  const tabs = [
    { key: 'all', label: 'Tất cả' },
    { key: 'filled', label: 'Đã khớp' },
    { key: 'pending', label: 'Chờ khớp' },
    { key: 'cancelled', label: 'Đã hủy' },
  ]

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: th.pageBg, padding: 24, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ maxWidth: 1680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Header bar */}
        <div style={{ background: '#0d1420', border: '1px solid #1c2534', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '10px 18px', borderBottom: '1px solid #1c2534', overflowX: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
              <div style={{ width: 24, height: 24, background: 'linear-gradient(135deg,#22c55e,#16a34a)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="12" height="10" viewBox="0 0 14 12"><polygon points="7,0 14,12 0,12" fill="#fff" /></svg>
              </div>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#fff', whiteSpace: 'nowrap' }}>Ray <span style={{ color: '#22c55e' }}>Stock</span></span>
            </div>
            <div style={{ display: 'flex', flexShrink: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', padding: '0 16px', borderRight: '1px solid #1c2534', minWidth: 118 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}><span style={{ fontSize: 9.5, fontWeight: 700, color: '#8a94a6', letterSpacing: 0.3 }}>VNINDEX</span><span style={{ fontSize: 13, fontWeight: 800, color: '#22c55e', fontFamily: "'JetBrains Mono', monospace" }}>1,862.08</span></div>
                <span style={{ fontSize: 9.5, color: '#22c55e', fontWeight: 700 }}>+4.27 +0.23%</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', padding: '0 16px', borderRight: '1px solid #1c2534', minWidth: 118 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}><span style={{ fontSize: 9.5, fontWeight: 700, color: '#8a94a6', letterSpacing: 0.3 }}>HNX</span><span style={{ fontSize: 13, fontWeight: 800, color: '#22c55e', fontFamily: "'JetBrains Mono', monospace" }}>307.57</span></div>
                <span style={{ fontSize: 9.5, color: '#22c55e', fontWeight: 700 }}>+0.84 +0.27%</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', padding: '0 16px', minWidth: 118 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}><span style={{ fontSize: 9.5, fontWeight: 700, color: '#8a94a6', letterSpacing: 0.3 }}>UPCOM</span><span style={{ fontSize: 13, fontWeight: 800, color: '#f43f5e', fontFamily: "'JetBrains Mono', monospace" }}>128.01</span></div>
                <span style={{ fontSize: 9.5, color: '#f43f5e', fontWeight: 700 }}>-0.66 -0.51%</span>
              </div>
            </div>
            <span style={{ marginLeft: 'auto', fontSize: 10, color: '#4a6080', fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 }}>04/07/2026 · 15:00:00</span>
          </div>
          <div style={{ display: 'flex', gap: 6, padding: '8px 14px', overflowX: 'auto' }}>
            {['🏠 Trang chủ', '💼 Danh mục', '💰 Đặt lệnh', '📖 Sổ lệnh', '🗺️ Heatmap', '📊 So sánh', '🔍 Screener', '📰 Tin tức', '📅 Sự kiện', '⚙️ Cài đặt'].map(label => (
              <a key={label} href="#" style={{ textDecoration: 'none', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5, background: '#141d2e', border: '1px solid #1c2534', color: '#c3ccd9', borderRadius: 7, padding: '6px 12px', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>{label}</a>
            ))}
          </div>
        </div>

        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: th.text }}>LỊCH SỬ LỆNH</h1>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 10, padding: 14 }}>
            <span style={{ fontSize: 9, color: th.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>Tổng lệnh hôm nay</span>
            <div style={{ fontSize: 20, fontWeight: 800, color: th.text, fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>{allOrders.length}</div>
          </div>
          <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 10, padding: 14 }}>
            <span style={{ fontSize: 9, color: th.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>Đã khớp</span>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#22c55e', fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>{filledCount}</div>
          </div>
          <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 10, padding: 14 }}>
            <span style={{ fontSize: 9, color: th.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>Chờ khớp</span>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#f59e0b', fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>{pendingCount}</div>
          </div>
          <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 10, padding: 14 }}>
            <span style={{ fontSize: 9, color: th.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>Giá trị khớp</span>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#60a5fa', fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>186.4M</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6 }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setFilterTab(t.key)} style={{ background: filterTab === t.key ? '#2563eb' : th.iconBg, color: filterTab === t.key ? '#fff' : th.textMuted, border: `1px solid ${filterTab === t.key ? '#2563eb' : th.cardBorder}`, borderRadius: 7, padding: '7px 16px', fontSize: 11.5, fontWeight: 700, cursor: 'pointer' }}>{t.label}</button>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 10, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${th.cardBorder}`, height: 34, background: th.headBg }}>
                <th style={{ textAlign: 'left', padding: '8px 10px', color: th.textMuted, fontWeight: 700 }}>Thời gian</th>
                <th style={{ textAlign: 'left', padding: '8px 10px', color: th.textMuted, fontWeight: 700 }}>Mã CK</th>
                <th style={{ textAlign: 'center', padding: '8px 10px', color: th.textMuted, fontWeight: 700 }}>Lệnh</th>
                <th style={{ textAlign: 'right', padding: '8px 10px', color: th.textMuted, fontWeight: 700 }}>Giá đặt</th>
                <th style={{ textAlign: 'right', padding: '8px 10px', color: th.textMuted, fontWeight: 700 }}>KL đặt</th>
                <th style={{ textAlign: 'right', padding: '8px 10px', color: th.textMuted, fontWeight: 700 }}>KL khớp</th>
                <th style={{ textAlign: 'center', padding: '8px 10px', color: th.textMuted, fontWeight: 700 }}>Trạng thái</th>
                <th style={{ textAlign: 'center', padding: '8px 10px', color: th.textMuted, fontWeight: 700 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${th.cardBorder}`, height: 38 }}>
                  <td style={{ padding: '8px 10px', color: th.textMuted }}>{o.time}</td>
                  <td style={{ padding: '8px 10px', color: '#60a5fa', fontWeight: 700 }}>{o.symbol}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'center' }}><span style={{ background: o.sideBg, color: o.sideColor, padding: '2px 8px', borderRadius: 5, fontWeight: 700, fontSize: 10 }}>{o.side}</span></td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', color: th.text }}>{o.price}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', color: th.text }}>{o.qty}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', color: th.text }}>{o.filled}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'center' }}><span style={{ background: o.statusBg, color: o.statusColor, padding: '2px 8px', borderRadius: 5, fontWeight: 700, fontSize: 9.5 }}>{o.statusLabel}</span></td>
                  <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                    {o.canEdit ? (
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                        <button style={{ background: th.iconBg, border: `1px solid ${th.cardBorder}`, color: '#60a5fa', borderRadius: 4, padding: '2px 7px', fontSize: 9, fontWeight: 700, cursor: 'pointer' }}>Sửa</button>
                        <button style={{ background: 'rgba(244,63,94,.15)', border: '1px solid #f43f5e', color: '#f43f5e', borderRadius: 4, padding: '2px 7px', fontSize: 9, fontWeight: 700, cursor: 'pointer' }}>Hủy</button>
                      </div>
                    ) : null}
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

const OrderHistory = memo(OrderHistoryInner)
export default OrderHistory
