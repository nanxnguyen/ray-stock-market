import { memo, useState, useMemo } from 'react'

const th = {
  pageBg: 'var(--ds-color-bg-app)',
  cardBg: 'var(--ds-color-bg-elevated)',
  cardBorder: 'var(--ds-color-border-strong)',
  headBg: 'var(--ds-color-bg-elevated)',
  text: 'var(--ds-color-text-primary)',
  textMuted: 'var(--ds-color-text-secondary)',
  iconBg: 'var(--ds-color-bg-elevated)',
}

type TxType = 'deposit' | 'withdraw' | 'buy' | 'sell' | 'fee' | 'dividend'

const txTypeMap: Record<TxType, { label: string; bg: string; color: string }> = {
  deposit:  { label: 'NẠP TIỀN',  bg: 'rgba(34,197,94,.15)',  color: 'var(--ds-color-market-up)' },
  withdraw: { label: 'RÚT TIỀN',  bg: 'rgba(244,63,94,.15)',   color: 'var(--ds-color-market-down)' },
  buy:      { label: 'MUA CK',    bg: 'rgba(96,165,250,.15)',  color: 'var(--ds-color-text-link)' },
  sell:     { label: 'BÁN CK',    bg: 'rgba(168,85,247,.15)',  color: '#a855f7' },
  fee:      { label: 'PHÍ',       bg: 'rgba(245,158,11,.15)',  color: 'var(--ds-color-warning)' },
  dividend: { label: 'CỔ TỨC',    bg: 'rgba(34,211,238,.15)', color: '#22d3ee' },
}

const allTransactions = [
  { date: '04/07/2026', type: 'deposit' as TxType,  desc: 'Chuyển khoản từ VCB ***1234',                   amount: '+50,000,000',  amountColor: 'var(--ds-color-market-up)',   balance: '125,450,000' },
  { date: '04/07/2026', type: 'buy' as TxType,      desc: 'Mua 500 VCB @ 81,300',                         amount: '-40,650,000',  amountColor: 'var(--ds-color-market-down)',  balance: '84,800,000' },
  { date: '03/07/2026', type: 'sell' as TxType,     desc: 'Bán 1,000 ACB @ 22,700',                       amount: '+22,700,000',  amountColor: 'var(--ds-color-market-up)',   balance: '125,450,000' },
  { date: '03/07/2026', type: 'fee' as TxType,      desc: 'Phí giao dịch bán ACB',                        amount: '-340,500',     amountColor: 'var(--ds-color-warning)',     balance: '102,750,000' },
  { date: '02/07/2026', type: 'dividend' as TxType, desc: 'Cổ tức tiền VNM quý 2/2026',                  amount: '+2,400,000',   amountColor: '#22d3ee',                     balance: '103,090,500' },
  { date: '02/07/2026', type: 'withdraw' as TxType, desc: 'Rút về VCB ***1234',                           amount: '-10,000,000',  amountColor: 'var(--ds-color-market-down)',  balance: '100,690,500' },
  { date: '01/07/2026', type: 'buy' as TxType,      desc: 'Mua 200 FPT @ 137,000',                        amount: '-27,400,000',  amountColor: 'var(--ds-color-market-down)',  balance: '110,690,500' },
  { date: '01/07/2026', type: 'fee' as TxType,      desc: 'Phí giao dịch mua FPT',                        amount: '-411,000',     amountColor: 'var(--ds-color-warning)',     balance: '138,090,500' },
]

function AccountStatementInner() {
  const [filterTab, setFilterTab] = useState('all')

  const tabs = [
    { key: 'all',      label: 'Tất cả' },
    { key: 'cash',     label: 'Nạp/Rút' },
    { key: 'trading',  label: 'Giao dịch CK' },
    { key: 'fee',      label: 'Phí & Cổ tức' },
  ]

  const filtered = useMemo(() => {
    if (filterTab === 'cash')     return allTransactions.filter(t => t.type === 'deposit' || t.type === 'withdraw')
    if (filterTab === 'trading')  return allTransactions.filter(t => t.type === 'buy' || t.type === 'sell')
    if (filterTab === 'fee')      return allTransactions.filter(t => t.type === 'fee' || t.type === 'dividend')
    return allTransactions
  }, [filterTab])

  const rows = filtered.map(t => {
    const tp = txTypeMap[t.type]
    return { ...t, typeLabel: tp.label, typeBg: tp.bg, typeColor: tp.color }
  })

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: th.pageBg, padding: 24, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ maxWidth: 1680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>

        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: th.text }}>SƠ ĐỒ TÀI KHOẢN</h1>

        {/* Filter tabs + action buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setFilterTab(t.key)}
                style={{
                  background: filterTab === t.key ? 'var(--ds-color-blue-600)' : th.iconBg,
                  color: filterTab === t.key ? '#fff' : th.textMuted,
                  border: `1px solid ${filterTab === t.key ? 'var(--ds-color-blue-600)' : th.cardBorder}`,
                  borderRadius: 7,
                  padding: '6px 14px',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button style={{ background: '#22c55e', border: 'none', color: '#fff', borderRadius: 7, padding: '7px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
              💰 Nạp tiền
            </button>
            <button style={{ background: th.iconBg, border: `1px solid ${th.cardBorder}`, color: th.text, borderRadius: 7, padding: '7px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
              💸 Rút tiền
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 10, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${th.cardBorder}`, height: 34, background: th.headBg }}>
                <th style={{ textAlign: 'left', padding: '8px 10px', color: th.textMuted, fontWeight: 700 }}>Ngày</th>
                <th style={{ textAlign: 'left', padding: '8px 10px', color: th.textMuted, fontWeight: 700 }}>Loại giao dịch</th>
                <th style={{ textAlign: 'left', padding: '8px 10px', color: th.textMuted, fontWeight: 700 }}>Diễn giải</th>
                <th style={{ textAlign: 'right', padding: '8px 10px', color: th.textMuted, fontWeight: 700 }}>Số tiền</th>
                <th style={{ textAlign: 'right', padding: '8px 10px', color: th.textMuted, fontWeight: 700 }}>Số dư sau GD</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${th.cardBorder}`, height: 38 }}>
                  <td style={{ padding: '8px 10px', color: th.textMuted }}>{r.date}</td>
                  <td style={{ padding: '8px 10px' }}>
                    <span style={{ background: r.typeBg, color: r.typeColor, padding: '2px 8px', borderRadius: 5, fontWeight: 700, fontSize: 9.5 }}>{r.typeLabel}</span>
                  </td>
                  <td style={{ padding: '8px 10px', color: th.text, fontFamily: "'Inter', sans-serif", fontSize: 10.5 }}>{r.desc}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', color: r.amountColor, fontWeight: 700 }}>{r.amount}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', color: th.text }}>{r.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const AccountStatement = memo(AccountStatementInner)
export default AccountStatement
