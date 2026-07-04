import { memo, useState } from 'react'

type Alert = {
  id: number
  symbol: string
  condition: string
  createdAt: string
  active: boolean
  triggered: boolean
  triggeredAt?: string
}

function AlertsManagementInner() {
  const [newSymbol, setNewSymbol] = useState('')
  const [newCondition, setNewCondition] = useState('above')
  const [newValue, setNewValue] = useState('')
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: 1, symbol: 'VCB', condition: 'Giá lên trên 85.00đ', createdAt: '01/07 09:00', active: true, triggered: false },
    { id: 2, symbol: 'ACB', condition: 'Giá xuống dưới 21.00đ', createdAt: '01/07 09:15', active: true, triggered: false },
    { id: 3, symbol: 'FPT', condition: 'Tăng ≥ 5% trong phiên', createdAt: '30/06 14:20', active: true, triggered: true, triggeredAt: '10:32 hôm nay' },
    { id: 4, symbol: 'HPG', condition: 'Giá xuống dưới 22.50đ', createdAt: '29/06 11:00', active: false, triggered: false },
    { id: 5, symbol: 'MWG', condition: 'Giá lên trên 100.00đ', createdAt: '28/06 16:45', active: true, triggered: false },
    { id: 6, symbol: 'VNM', condition: 'Giảm ≥ 3% trong phiên', createdAt: '27/06 08:30', active: true, triggered: true, triggeredAt: '09:48 hôm nay' },
  ])

  const th = {
    pageBg: 'var(--ds-color-bg-app)',
    cardBg: 'var(--ds-color-bg-elevated)',
    cardBorder: 'var(--ds-color-border-strong)',
    inputBg: 'var(--ds-color-bg-input)',
    text: 'var(--ds-color-text-primary)',
    textMuted: 'var(--ds-color-text-secondary)',
  }

  const addAlert = () => {
    if (!newSymbol || !newValue) return
    const condLabel: Record<string, string> = { above: 'Giá lên trên', below: 'Giá xuống dưới', pct_up: 'Tăng ≥', pct_down: 'Giảm ≥' }
    const suffix = newCondition.startsWith('pct') ? '%' : 'đ'
    setAlerts(prev => [
      { id: Date.now(), symbol: newSymbol, condition: `${condLabel[newCondition]} ${newValue}${suffix}`, createdAt: 'Vừa xong', active: true, triggered: false },
      ...prev,
    ])
    setNewSymbol('')
    setNewValue('')
  }

  const toggleAlert = (id: number) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a))
  const deleteAlert = (id: number) => setAlerts(prev => prev.filter(a => a.id !== id))

  const activeCount = alerts.filter(a => a.active).length
  const triggeredCount = alerts.filter(a => a.triggered).length

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: th.pageBg, padding: 24 }}>
      <div style={{ maxWidth: 1680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: th.text }}>QUẢN LÝ CẢNH BÁO GIÁ</h1>

        {/* Add New Alert */}
        <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: 16 }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: 11, fontWeight: 700, color: th.text, textTransform: 'uppercase' }}>Đặt cảnh báo mới</h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 9, color: th.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>Mã CK</label>
              <input
                type="text"
                value={newSymbol}
                onChange={e => setNewSymbol(e.target.value.toUpperCase())}
                placeholder="VCB"
                style={{ width: 90, padding: '8px 10px', border: `1px solid ${th.cardBorder}`, borderRadius: 7, background: th.inputBg, color: th.text, fontSize: 12 }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 9, color: th.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>Điều kiện</label>
              <select
                value={newCondition}
                onChange={e => setNewCondition(e.target.value)}
                style={{ padding: '8px 10px', border: `1px solid ${th.cardBorder}`, borderRadius: 7, background: th.inputBg, color: th.text, fontSize: 12 }}
              >
                <option value="above">Giá lên trên</option>
                <option value="below">Giá xuống dưới</option>
                <option value="pct_up">Tăng &gt;= %</option>
                <option value="pct_down">Giảm &gt;= %</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 9, color: th.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>Giá trị</label>
              <input
                type="text"
                value={newValue}
                onChange={e => setNewValue(e.target.value)}
                placeholder="85.0"
                style={{ width: 100, padding: '8px 10px', border: `1px solid ${th.cardBorder}`, borderRadius: 7, background: th.inputBg, color: th.text, fontSize: 12 }}
              />
            </div>
            <button onClick={addAlert} style={{ background: 'var(--ds-color-blue-500)', border: 'none', color: '#fff', borderRadius: 7, padding: '9px 18px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>+ Thêm cảnh báo</button>
          </div>
        </div>

        {/* Summary */}
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 10, padding: '12px 16px' }}>
            <span style={{ fontSize: 9, color: th.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>Đang hoạt động</span>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ds-color-market-up)', fontFamily: "'JetBrains Mono', monospace" }}>{activeCount}</div>
          </div>
          <div style={{ flex: 1, background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 10, padding: '12px 16px' }}>
            <span style={{ fontSize: 9, color: th.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>Đã kích hoạt hôm nay</span>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ds-color-warning)', fontFamily: "'JetBrains Mono', monospace" }}>{triggeredCount}</div>
          </div>
        </div>

        {/* Alerts List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {alerts.map(a => {
            const borderColor = a.triggered ? 'var(--ds-color-warning)' : th.cardBorder
            const statusLabel = a.triggered ? 'ĐÃ KÍCH HOẠT' : a.active ? 'ĐANG THEO DÕI' : 'TẠM DỪNG'
            const statusColor = a.triggered ? 'var(--ds-color-warning)' : a.active ? 'var(--ds-color-market-up)' : th.textMuted
            const statusBg = a.triggered ? 'rgba(245,158,11,.15)' : a.active ? 'rgba(34,197,94,.15)' : 'rgba(138,148,166,.15)'
            const toggleBg = a.active ? 'var(--ds-color-market-up)' : 'var(--ds-color-bg-input)'
            const toggleLeft = a.active ? 18 : 2
            const triggeredAt = a.triggeredAt ? ` · Kích hoạt ${a.triggeredAt}` : ''

            return (
              <div key={a.id} style={{
                background: th.cardBg, border: `1px solid ${borderColor}`,
                borderRadius: 10, padding: '13px 16px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ds-color-text-link)', fontFamily: "'JetBrains Mono', monospace", width: 44 }}>{a.symbol}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontSize: 11.5, color: th.text, fontWeight: 600 }}>{a.condition}</span>
                    <span style={{ fontSize: 9.5, color: th.textMuted }}>Tạo lúc {a.createdAt}{triggeredAt}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    fontSize: 9, fontWeight: 700, color: statusColor, background: statusBg,
                    padding: '3px 9px', borderRadius: 12,
                  }}>{statusLabel}</span>
                  <div
                    onClick={() => toggleAlert(a.id)}
                    style={{
                      width: 36, height: 20, borderRadius: 10, background: toggleBg,
                      position: 'relative', cursor: 'pointer', transition: 'background .2s',
                    }}
                  >
                    <div style={{
                      width: 16, height: 16, borderRadius: '50%', background: '#fff',
                      position: 'absolute', top: 2, left: toggleLeft, transition: 'left .2s',
                    }} />
                  </div>
                  <button onClick={() => deleteAlert(a.id)} style={{ background: 'transparent', border: 'none', color: th.textMuted, cursor: 'pointer', fontSize: 15, padding: 2 }}>🗑</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const AlertsManagement = memo(AlertsManagementInner)
export default AlertsManagement
