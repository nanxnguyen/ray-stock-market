import type { ThemeTokens, StockRow } from '../types/priceboard'

type Props = { rows: StockRow[]; th: ThemeTokens }

export default function StockTable({ rows, th }: Props) {
  return (
    <div style={{ flex: 1, overflow: 'auto', background: th.tableBg }}>
      <table style={{ width: 'max-content', minWidth: '100%', fontSize: 11, fontVariantNumeric: 'tabular-nums', fontFamily: "'JetBrains Mono', monospace" }}>
        <thead style={{ position: 'sticky', top: 0, zIndex: 20 }}>
          <tr style={{ background: '#080f1c', color: '#4a7090', fontSize: 9.5, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', fontFamily: "'Inter', sans-serif" }}>
            <th style={{ position: 'sticky', left: 0, top: 0, zIndex: 31, background: '#080f1c', padding: '5px 8px', textAlign: 'center', borderRight: '1px solid #0f1e36', minWidth: 58 }} rowSpan={2}>Mã CK</th>
            <th style={{ position: 'sticky', left: 58, top: 0, zIndex: 31, background: '#080f1c', padding: '5px 6px', textAlign: 'right', borderRight: '1px solid #0f1e36', minWidth: 48, color: '#b07ef8' }} rowSpan={2}>Trần</th>
            <th style={{ position: 'sticky', left: 106, top: 0, zIndex: 31, background: '#080f1c', padding: '5px 6px', textAlign: 'right', borderRight: '1px solid #0f1e36', minWidth: 48, color: '#fbbf24' }} rowSpan={2}>TC</th>
            <th style={{ position: 'sticky', left: 154, top: 0, zIndex: 31, background: '#080f1c', padding: '5px 6px', textAlign: 'right', borderRight: '2px solid #1a3050', minWidth: 48, color: '#38bdf8' }} rowSpan={2}>Sàn</th>
            <th colSpan={6} style={{ textAlign: 'center', background: '#05111e', color: '#60a5fa', borderRight: '2px solid #1a3050', padding: 5, letterSpacing: '.8px' }}>── DƯ MUA ──</th>
            <th colSpan={5} style={{ textAlign: 'center', borderRight: '2px solid #1a3050', padding: 5, color: '#e2e8f0', letterSpacing: '.5px' }}>KHỚP LỆNH</th>
            <th colSpan={6} style={{ textAlign: 'center', background: '#1a0808', color: '#f87171', borderRight: '2px solid #1a3050', padding: 5, letterSpacing: '.8px' }}>── DƯ BÁN ──</th>
            <th style={{ padding: '5px 6px', textAlign: 'right', borderRight: '1px solid #0f1e36', minWidth: 48 }} rowSpan={2}>Cao</th>
            <th style={{ padding: '5px 6px', textAlign: 'right', borderRight: '1px solid #0f1e36', minWidth: 48 }} rowSpan={2}>TB</th>
            <th style={{ padding: '5px 6px', textAlign: 'right', borderRight: '2px solid #1a3050', minWidth: 48 }} rowSpan={2}>Thấp</th>
            <th colSpan={4} style={{ textAlign: 'center', padding: 5, color: '#a78bfa', borderRight: '2px solid #1a3050', letterSpacing: '.5px' }}>NN</th>
            <th style={{ padding: '5px 8px', textAlign: 'right', minWidth: 90, color: '#94a3b8' }} rowSpan={2}>KLGD TT</th>
          </tr>
          <tr style={{ background: '#080f1c', color: '#3a6080', fontSize: 9, fontFamily: "'Inter', sans-serif", letterSpacing: '.3px' }}>
            <th style={{ background: '#05111e', padding: '3px 6px', textAlign: 'right', borderRight: '1px solid #0f1e36', minWidth: 46, color: '#3b7fc4' }}>Giá 3</th>
            <th style={{ background: '#05111e', padding: '3px 6px', textAlign: 'right', borderRight: '1px solid #0f1e36', minWidth: 58, color: '#3b7fc4' }}>KL 3</th>
            <th style={{ background: '#05111e', padding: '3px 6px', textAlign: 'right', borderRight: '1px solid #0f1e36', minWidth: 46, color: '#3b7fc4' }}>Giá 2</th>
            <th style={{ background: '#05111e', padding: '3px 6px', textAlign: 'right', borderRight: '1px solid #0f1e36', minWidth: 58, color: '#3b7fc4' }}>KL 2</th>
            <th style={{ background: '#05111e', padding: '3px 6px', textAlign: 'right', borderRight: '1px solid #0f1e36', minWidth: 46, color: '#3b7fc4' }}>Giá 1</th>
            <th style={{ background: '#05111e', padding: '3px 6px', textAlign: 'right', borderRight: '2px solid #1a3050', minWidth: 58, color: '#3b7fc4' }}>KL 1</th>
            <th style={{ padding: '3px 6px', textAlign: 'right', borderRight: '1px solid #0f1e36', minWidth: 46 }}>Giá</th>
            <th style={{ padding: '3px 6px', textAlign: 'right', borderRight: '1px solid #0f1e36', minWidth: 64 }}>KL</th>
            <th style={{ padding: '3px 6px', textAlign: 'right', borderRight: '1px solid #0f1e36', minWidth: 54 }}>%</th>
            <th style={{ padding: '3px 6px', textAlign: 'right', borderRight: '1px solid #0f1e36', minWidth: 46 }}>↕</th>
            <th style={{ padding: '3px 6px', textAlign: 'right', borderRight: '2px solid #1a3050', minWidth: 74 }}>KLGD</th>
            <th style={{ background: '#1a0808', padding: '3px 6px', textAlign: 'right', borderRight: '1px solid #0f1e36', minWidth: 46, color: '#c04040' }}>Giá 1</th>
            <th style={{ background: '#1a0808', padding: '3px 6px', textAlign: 'right', borderRight: '1px solid #0f1e36', minWidth: 58, color: '#c04040' }}>KL 1</th>
            <th style={{ background: '#1a0808', padding: '3px 6px', textAlign: 'right', borderRight: '1px solid #0f1e36', minWidth: 46, color: '#c04040' }}>Giá 2</th>
            <th style={{ background: '#1a0808', padding: '3px 6px', textAlign: 'right', borderRight: '1px solid #0f1e36', minWidth: 58, color: '#c04040' }}>KL 2</th>
            <th style={{ background: '#1a0808', padding: '3px 6px', textAlign: 'right', borderRight: '1px solid #0f1e36', minWidth: 46, color: '#c04040' }}>Giá 3</th>
            <th style={{ background: '#1a0808', padding: '3px 6px', textAlign: 'right', borderRight: '2px solid #1a3050', minWidth: 58, color: '#c04040' }}>KL 3</th>
            <th style={{ padding: '3px 6px', textAlign: 'right', borderRight: '1px solid #0f1e36', minWidth: 74, color: '#a78bfa' }}>Mua</th>
            <th style={{ padding: '3px 6px', textAlign: 'right', borderRight: '1px solid #0f1e36', minWidth: 74, color: '#a78bfa' }}>Bán</th>
            <th style={{ padding: '3px 6px', textAlign: 'right', borderRight: '1px solid #0f1e36', minWidth: 74, color: '#a78bfa' }}>↕</th>
            <th style={{ padding: '3px 6px', textAlign: 'right', borderRight: '2px solid #1a3050', minWidth: 90, color: '#a78bfa' }}>Room</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((s) => (
            <tr
              key={s.sym}
              onMouseEnter={(e) => { e.currentTarget.style.background = th.rowHover }}
              onMouseLeave={(e) => { e.currentTarget.style.background = s.bg }}
              style={{ background: s.bg, borderBottom: `1px solid ${th.rowBorder}`, height: 26, transition: 'background .5s' }}
            >
              <td onClick={s.onChart} style={{ position: 'sticky', left: 0, zIndex: 5, background: s.bg, padding: '3px 8px', textAlign: 'center', borderRight: `1px solid ${th.cellBorder}`, fontWeight: 700, fontSize: '11.5px', color: '#60a5fa', cursor: 'pointer', letterSpacing: '.3px', fontFamily: "'Inter', sans-serif" }}>{s.sym}</td>
              <td style={{ position: 'sticky', left: 58, zIndex: 5, background: s.bg, padding: '3px 6px', textAlign: 'right', borderRight: `1px solid ${th.cellBorder}`, color: '#b07ef8' }}>{s.ceil}</td>
              <td style={{ position: 'sticky', left: 106, zIndex: 5, background: s.bg, padding: '3px 6px', textAlign: 'right', borderRight: `1px solid ${th.cellBorder}`, color: '#fbbf24' }}>{s.tc}</td>
              <td style={{ position: 'sticky', left: 154, zIndex: 5, background: s.bg, padding: '3px 6px', textAlign: 'right', borderRight: `2px solid ${th.cellBorder}`, color: '#38bdf8' }}>{s.floor}</td>
              <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.b3c, opacity: .75 }}>{s.b3p}</td>
              <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.b3c, opacity: .75 }}>{s.b3q}</td>
              <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.b2c, opacity: .85 }}>{s.b2p}</td>
              <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.b2c, opacity: .85 }}>{s.b2q}</td>
              <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.b1c }}>{s.b1p}</td>
              <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `2px solid ${th.cellBorder}`, color: s.b1c }}>{s.b1q}</td>
              <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, fontWeight: 700, fontSize: 12, color: s.lc }}>{s.lp}</td>
              <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.lc, opacity: .9 }}>{s.lq}</td>
              <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, fontWeight: 700, color: s.pc }}>{s.pct}</td>
              <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.pc }}>{s.chg}</td>
              <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `2px solid ${th.cellBorder}`, color: th.volColor }}>{s.tvol}</td>
              <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.a1c }}>{s.a1p}</td>
              <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.a1c }}>{s.a1q}</td>
              <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.a2c, opacity: .85 }}>{s.a2p}</td>
              <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.a2c, opacity: .85 }}>{s.a2q}</td>
              <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.a3c, opacity: .75 }}>{s.a3p}</td>
              <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `2px solid ${th.cellBorder}`, color: s.a3c, opacity: .75 }}>{s.a3q}</td>
              <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.hc }}>{s.hi}</td>
              <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.ac, opacity: .7 }}>{s.avg}</td>
              <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `2px solid ${th.cellBorder}`, color: s.oc }}>{s.lo}</td>
              <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: '#22d3a5' }}>{s.fbuy}</td>
              <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: '#f87171' }}>{s.fsell}</td>
              <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.fbc }}>{s.fbal}</td>
              <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: `2px solid ${th.cellBorder}`, color: '#64748b' }}>{s.room}</td>
              <td style={{ padding: '3px 8px', textAlign: 'right', color: th.volColor }}>{s.kltt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
