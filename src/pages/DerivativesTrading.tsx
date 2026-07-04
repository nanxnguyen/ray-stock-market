import { memo, useState, useCallback, useMemo } from 'react'

const FONT = "'Inter', system-ui, sans-serif"
const MONO = "'JetBrains Mono', monospace"

const th = {
  pageBg: '#0a0e14',
  cardBg: '#131a24',
  cardBorder: '#232b38',
  inputBg: '#0f1419',
  text: '#eef1f6',
  textMuted: '#8a94a6',
  iconBg: '#1a212c',
}

const POSITIONS_DATA = [
  { symbol: 'VN30F2607', side: 'LONG', sideBg: 'rgba(34,197,94,.15)', sideColor: '#22c55e', qty: '3', entry: '1,990.2', market: '1,998.5', pnl: '+2,490,000', pnlColor: '#22c55e' },
  { symbol: 'VN30F2608', side: 'SHORT', sideBg: 'rgba(244,63,94,.15)', sideColor: '#f43f5e', qty: '1', entry: '2,005.0', market: '1,998.5', pnl: '+650,000', pnlColor: '#22c55e' },
]

function DerivativesTradingInner() {
  const [side, setSide] = useState<'LONG' | 'SHORT'>('LONG')
  const [price, setPrice] = useState('1,998.5')
  const [qty, setQty] = useState(2)
  const [orderPlaced, setOrderPlaced] = useState(false)

  const toggleSide = useCallback(() => setSide((p) => (p === 'LONG' ? 'SHORT' : 'LONG')), [])
  const incQty = useCallback(() => setQty((p) => p + 1), [])
  const decQty = useCallback(() => setQty((p) => Math.max(0, p - 1)), [])

  const submitOrder = useCallback(() => {
    setOrderPlaced(true)
    setTimeout(() => setOrderPlaced(false), 3000)
  }, [])

  const orderData = useMemo(() => {
    const priceNum = parseFloat(price.replace(/,/g, ''))
    const contractValue = priceNum * qty * 100000
    const requiredMargin = contractValue * 0.175
    return {
      contractValue: contractValue.toLocaleString() + 'đ',
      requiredMargin: requiredMargin.toLocaleString() + 'đ',
      submitBg: side === 'LONG' ? '#22c55e' : '#f43f5e',
      submitShadow: side === 'LONG' ? 'rgba(34,197,94,.3)' : 'rgba(244,63,94,.3)',
      submitLabel: side === 'LONG' ? '✓ MỞ VỊ THẾ LONG' : '✓ MỞ VỊ THẾ SHORT',
    }
  }, [price, qty, side])

  const sideBtnStyles = useMemo(
    () => ({
      LONG: {
        bg: side === 'LONG' ? '#22c55e' : th.iconBg,
        fg: side === 'LONG' ? '#fff' : th.textMuted,
        border: side === 'LONG' ? '#16a34a' : th.cardBorder,
      },
      SHORT: {
        bg: side === 'SHORT' ? '#f43f5e' : th.iconBg,
        fg: side === 'SHORT' ? '#fff' : th.textMuted,
        border: side === 'SHORT' ? '#dc2626' : th.cardBorder,
      },
    }),
    [side],
  )

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: th.pageBg, padding: 24, fontFamily: FONT }}>
      <div style={{ maxWidth: 1680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* ══ HEADER ══ */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 10, padding: '14px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: th.text, fontFamily: MONO }}>VN30F2607</h1>
                <span style={{ fontSize: 8, fontWeight: 700, color: '#fff', background: '#f97316', padding: '2px 6px', borderRadius: 4 }}>FUTURES</span>
              </div>
              <span style={{ fontSize: 10, color: th.textMuted }}>Hợp đồng tương lai VN30 · Đáo hạn 17/07/2026</span>
            </div>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#22c55e', fontFamily: MONO }}>1,998.5</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#22c55e' }}>+4.3 (+0.22%)</span>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 9, color: th.textMuted, display: 'block', textTransform: 'uppercase' }}>Cơ sở VN30</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: th.text, fontFamily: MONO }}>1,994.99</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 9, color: th.textMuted, display: 'block', textTransform: 'uppercase' }}>Basis</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#22c55e', fontFamily: MONO }}>+3.51</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 9, color: th.textMuted, display: 'block', textTransform: 'uppercase' }}>OI</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: th.text, fontFamily: MONO }}>28,450</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 14, alignItems: 'start' }}>

          {/* ══ LEFT: POSITIONS ══ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 10, padding: 16 }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: 12, fontWeight: 700, color: th.text, textTransform: 'uppercase' }}>Vị thế đang mở (T+0)</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10.5, fontFamily: MONO }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${th.cardBorder}`, height: 26 }}>
                    <th style={{ textAlign: 'left', color: th.textMuted, fontWeight: 700 }}>Hợp đồng</th>
                    <th style={{ textAlign: 'center', color: th.textMuted, fontWeight: 700 }}>Vị thế</th>
                    <th style={{ textAlign: 'right', color: th.textMuted, fontWeight: 700 }}>SL</th>
                    <th style={{ textAlign: 'right', color: th.textMuted, fontWeight: 700 }}>Giá vốn</th>
                    <th style={{ textAlign: 'right', color: th.textMuted, fontWeight: 700 }}>Giá TT</th>
                    <th style={{ textAlign: 'right', color: th.textMuted, fontWeight: 700 }}>Lãi/Lỗ</th>
                  </tr>
                </thead>
                <tbody>
                  {POSITIONS_DATA.map((p, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${th.cardBorder}`, height: 34 }}>
                      <td style={{ color: '#60a5fa', fontWeight: 700 }}>{p.symbol}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ background: p.sideBg, color: p.sideColor, padding: '2px 8px', borderRadius: 4, fontWeight: 700, fontSize: 9.5 }}>{p.side}</span>
                      </td>
                      <td style={{ textAlign: 'right', color: th.text }}>{p.qty}</td>
                      <td style={{ textAlign: 'right', color: th.textMuted }}>{p.entry}</td>
                      <td style={{ textAlign: 'right', color: th.text }}>{p.market}</td>
                      <td style={{ textAlign: 'right', color: p.pnlColor, fontWeight: 700 }}>{p.pnl}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MARGIN INFO */}
            <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 10, padding: 16 }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: 12, fontWeight: 700, color: th.text, textTransform: 'uppercase' }}>Thông tin ký quỹ</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                <div>
                  <span style={{ fontSize: 9, color: th.textMuted, textTransform: 'uppercase' }}>Ký quỹ ban đầu</span>
                  <div style={{ fontSize: 14, fontWeight: 700, color: th.text, fontFamily: MONO }}>87,500,000đ</div>
                </div>
                <div>
                  <span style={{ fontSize: 9, color: th.textMuted, textTransform: 'uppercase' }}>Ký quỹ đã dùng</span>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#f59e0b', fontFamily: MONO }}>61,250,000đ</div>
                </div>
                <div>
                  <span style={{ fontSize: 9, color: th.textMuted, textTransform: 'uppercase' }}>Sức mua còn lại</span>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#22c55e', fontFamily: MONO }}>26,250,000đ</div>
                </div>
              </div>
              <div style={{ marginTop: 10, height: 6, background: th.iconBg, borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '70%', background: '#f59e0b' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ fontSize: 9, color: th.textMuted }}>Tỷ lệ sử dụng ký quỹ: 70%</span>
                <span style={{ fontSize: 9, color: '#f59e0b', fontWeight: 700 }}>Đòn bẩy x5.7</span>
              </div>
            </div>
          </div>

          {/* ══ RIGHT: ORDER FORM ══ */}
          <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 10, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={toggleSide}
                style={{
                  flex: 1,
                  background: sideBtnStyles.LONG.bg,
                  color: sideBtnStyles.LONG.fg,
                  border: `1px solid ${sideBtnStyles.LONG.border}`,
                  borderRadius: 6,
                  padding: 9,
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                LONG (MUA)
              </button>
              <button
                onClick={toggleSide}
                style={{
                  flex: 1,
                  background: sideBtnStyles.SHORT.bg,
                  color: sideBtnStyles.SHORT.fg,
                  border: `1px solid ${sideBtnStyles.SHORT.border}`,
                  borderRadius: 6,
                  padding: 9,
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                SHORT (BÁN)
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: th.textMuted, textTransform: 'uppercase' }}>Giá đặt</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={{ padding: '9px 10px', border: `1px solid ${th.cardBorder}`, borderRadius: 7, background: th.inputBg, color: th.text, fontSize: 12, fontFamily: MONO, outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: th.textMuted, textTransform: 'uppercase' }}>Số lượng hợp đồng</label>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <button
                  onClick={decQty}
                  style={{ background: th.iconBg, border: `1px solid ${th.cardBorder}`, color: th.textMuted, borderRadius: 6, width: 30, height: 30, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  −
                </button>
                <input
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(parseInt(e.target.value) || 0)}
                  style={{ flex: 1, padding: '9px 10px', border: `1px solid ${th.cardBorder}`, borderRadius: 7, background: th.inputBg, color: th.text, fontSize: 12, fontFamily: MONO, textAlign: 'center', outline: 'none' }}
                />
                <button
                  onClick={incQty}
                  style={{ background: th.iconBg, border: `1px solid ${th.cardBorder}`, color: th.textMuted, borderRadius: 6, width: 30, height: 30, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  +
                </button>
              </div>
            </div>

            <div style={{ background: th.inputBg, borderRadius: 7, padding: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5 }}>
                <span style={{ color: th.textMuted }}>Ký quỹ yêu cầu</span>
                <span style={{ color: th.text, fontWeight: 700, fontFamily: MONO }}>{orderData.requiredMargin}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5 }}>
                <span style={{ color: th.textMuted }}>Giá trị hợp đồng</span>
                <span style={{ color: th.text, fontWeight: 700, fontFamily: MONO }}>{orderData.contractValue}</span>
              </div>
            </div>

            <button
              onClick={submitOrder}
              style={{
                background: orderData.submitBg,
                border: 'none',
                color: '#fff',
                borderRadius: 7,
                padding: 12,
                fontSize: 13,
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: `0 8px 20px ${orderData.submitShadow}`,
              }}
            >
              {orderData.submitLabel}
            </button>

            {orderPlaced && (
              <div style={{ background: 'rgba(34,197,94,.1)', border: '1px solid #22c55e', borderRadius: 7, padding: 9, fontSize: 10.5, color: '#22c55e', fontWeight: 700 }}>
                ✓ Đã đặt lệnh {side} {qty} hợp đồng @ {price}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const DerivativesTrading = memo(DerivativesTradingInner)
export default DerivativesTrading
