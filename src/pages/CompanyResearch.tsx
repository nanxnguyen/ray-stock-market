import { memo, useState } from 'react'

const th = {
  pageBg: 'var(--ds-color-bg-app)',
  cardBg: 'var(--ds-color-bg-card)',
  cardBorder: 'var(--ds-color-border-default)',
  text: 'var(--ds-color-text-primary)',
  textMuted: 'var(--ds-color-text-secondary)',
  rowBg: 'var(--ds-color-bg-nav)',
  iconBg: 'var(--ds-color-bg-nav)',
}

const quarters = [
  { label: 'Q3/24', rev: 8200, profit: 2800 },
  { label: 'Q4/24', rev: 9100, profit: 3200 },
  { label: 'Q1/25', rev: 8700, profit: 2950 },
  { label: 'Q2/25', rev: 9800, profit: 3600 },
  { label: 'Q3/25', rev: 10200, profit: 3800 },
  { label: 'Q4/25', rev: 11500, profit: 4200 },
  { label: 'Q1/26', rev: 11000, profit: 4050 },
  { label: 'Q2/26', rev: 12500, profit: 4700 },
]

const maxRev = Math.max(...quarters.map(q => q.rev))
const quartersOut = quarters.map(q => ({
  label: q.label,
  revH: `${(q.rev / maxRev) * 150}px`,
  profitH: `${(q.profit / maxRev) * 150}px`,
}))

const ratios = [
  { label: 'P/E', value: '11.2x' },
  { label: 'P/B', value: '1.45x' },
  { label: 'ROE', value: '23.5%' },
  { label: 'ROA', value: '2.1%' },
  { label: 'Biên LN gộp', value: '42.3%' },
  { label: 'Nợ/Vốn CSH', value: '8.2%' },
]

const growthData = [
  { label: 'Doanh thu', value: '+13.6%', color: 'var(--ds-color-market-up)', barPct: 68 },
  { label: 'Lợi nhuận sau thuế', value: '+19.4%', color: 'var(--ds-color-market-up)', barPct: 78 },
  { label: 'Tổng tài sản', value: '+8.2%', color: 'var(--ds-color-text-link)', barPct: 41 },
  { label: 'Chi phí hoạt động', value: '+4.5%', color: 'var(--ds-color-warning)', barPct: 22 },
]

const recommendationsData = [
  { firm: 'SSI Research', rating: 'MUA', target: '95,000đ', upside: '+16.6%', date: '28/06/2026' },
  { firm: 'VNDirect', rating: 'MUA', target: '92,500đ', upside: '+13.5%', date: '25/06/2026' },
  { firm: 'HSC', rating: 'GIỮ', target: '85,000đ', upside: '+4.3%', date: '20/06/2026' },
  { firm: 'VCSC', rating: 'MUA', target: '98,000đ', upside: '+20.2%', date: '15/06/2026' },
  { firm: 'MBS', rating: 'GIỮ', target: '83,000đ', upside: '+1.8%', date: '10/06/2026' },
]

function getRatingStyle(rating: string) {
  if (rating === 'MUA') return { bg: 'rgba(34,197,94,.15)', color: 'var(--ds-color-market-up)' }
  if (rating === 'BÁN') return { bg: 'rgba(244,63,94,.15)', color: 'var(--ds-color-market-down)' }
  return { bg: 'rgba(245,158,11,.15)', color: 'var(--ds-color-warning)' }
}

function CompanyResearchInner() {
  const [symbol, setSymbol] = useState('VCB')
  const quickSyms = ['VCB', 'ACB', 'FPT', 'HPG']

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: th.pageBg, padding: 24, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <div style={{ maxWidth: 1680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: th.text }}>NGHIÊN CỨU DOANH NGHIỆP — {symbol}</h1>
          <div style={{ display: 'flex', gap: 4 }}>
            {quickSyms.map((s) => (
              <button key={s} onClick={() => setSymbol(s)} style={{ background: s === symbol ? 'var(--ds-color-blue-600)' : th.iconBg, border: s === symbol ? '1px solid var(--ds-color-blue-600)' : `1px solid ${th.cardBorder}`, color: s === symbol ? '#fff' : th.textMuted, borderRadius: 6, padding: '5px 11px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>{s}</button>
            ))}
          </div>
        </div>

        <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: 12, fontWeight: 700, color: th.text, textTransform: 'uppercase' }}>Doanh thu & Lợi nhuận theo quý</h3>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}><span style={{ width: 9, height: 9, borderRadius: 2, background: 'var(--ds-color-blue-500)', display: 'inline-block' }} /><span style={{ fontSize: 10, color: th.textMuted }}>Doanh thu</span></div>
              <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}><span style={{ width: 9, height: 9, borderRadius: 2, background: 'var(--ds-color-market-up)', display: 'inline-block' }} /><span style={{ fontSize: 10, color: th.textMuted }}>LNST</span></div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: 16, height: 180 }}>
            {quartersOut.map((q) => (
              <div key={q.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 150 }}>
                  <div style={{ width: 16, height: q.revH, background: 'var(--ds-color-blue-500)', borderRadius: '3px 3px 0 0' }} />
                  <div style={{ width: 16, height: q.profitH, background: 'var(--ds-color-market-up)', borderRadius: '3px 3px 0 0' }} />
                </div>
                <span style={{ fontSize: 9, color: th.textMuted, fontWeight: 700 }}>{q.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: 18 }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 700, color: th.text, textTransform: 'uppercase' }}>Chỉ số tài chính</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {ratios.map((r) => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: th.rowBg, borderRadius: 7 }}>
                  <span style={{ fontSize: 10.5, color: th.textMuted, fontWeight: 600 }}>{r.label}</span>
                  <span style={{ fontSize: 11, color: th.text, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: 18 }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 700, color: th.text, textTransform: 'uppercase' }}>Tăng trưởng so với cùng kỳ (YoY)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {growthData.map((g) => (
                <div key={g.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 10.5, color: th.textMuted, fontWeight: 600 }}>{g.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: g.color, fontFamily: "'JetBrains Mono', monospace" }}>{g.value}</span>
                  </div>
                  <div style={{ height: 5, background: th.rowBg, borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${g.barPct}%`, background: g.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: 18 }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 700, color: th.text, textTransform: 'uppercase' }}>Khuyến nghị từ công ty chứng khoán</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${th.cardBorder}`, height: 28 }}>
                <th style={{ textAlign: 'left', color: th.textMuted, fontWeight: 700 }}>CTCK</th>
                <th style={{ textAlign: 'center', color: th.textMuted, fontWeight: 700 }}>Khuyến nghị</th>
                <th style={{ textAlign: 'right', color: th.textMuted, fontWeight: 700 }}>Giá mục tiêu</th>
                <th style={{ textAlign: 'right', color: th.textMuted, fontWeight: 700 }}>Upside</th>
                <th style={{ textAlign: 'right', color: th.textMuted, fontWeight: 700 }}>Ngày</th>
              </tr>
            </thead>
            <tbody>
              {recommendationsData.map((rec) => {
                const rs = getRatingStyle(rec.rating)
                return (
                  <tr key={rec.firm} style={{ borderBottom: `1px solid ${th.cardBorder}`, height: 36 }}>
                    <td style={{ color: th.text, fontWeight: 600 }}>{rec.firm}</td>
                    <td style={{ textAlign: 'center' }}><span style={{ background: rs.bg, color: rs.color, padding: '2px 10px', borderRadius: 5, fontWeight: 700, fontSize: 10 }}>{rec.rating}</span></td>
                    <td style={{ textAlign: 'right', color: th.text, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{rec.target}</td>
                    <td style={{ textAlign: 'right', color: rec.upside.startsWith('+') ? 'var(--ds-color-market-up)' : 'var(--ds-color-market-down)', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{rec.upside}</td>
                    <td style={{ textAlign: 'right', color: th.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>{rec.date}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}

const CompanyResearch = memo(CompanyResearchInner)
export default CompanyResearch
