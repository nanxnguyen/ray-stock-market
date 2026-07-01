import type { ThemeTokens, StockRow } from '../types/priceboard'

type Props = { rows: StockRow[]; th: ThemeTokens }

export default function StockTable({ rows, th }: Props) {
  return (
    <div style={{ flex: 1, overflow: 'auto', background: th.tableBg }}>
      <table style={{ width: 'max-content', minWidth: '100%', fontSize: 11, fontVariantNumeric: 'tabular-nums' }}>
        <thead style={{ position: 'sticky', top: 0, zIndex: 20 }}>
          <tr style={{ background: '#1a2d45', color: '#7fa8cc', fontSize: 10, fontWeight: 600 }}>
            <th style={{ position: 'sticky', left: 0, top: 0, zIndex: 31, background: '#1a2d45', padding: '4px 6px', textAlign: 'center', borderRight: '1px solid #2a3f5f', minWidth: 54 }} rowSpan={2}>Mã CK</th>
            <th style={{ position: 'sticky', left: 54, top: 0, zIndex: 31, background: '#1a2d45', padding: '4px 5px', textAlign: 'right', borderRight: '1px solid #2a3f5f', minWidth: 46, color: '#c084fc' }} rowSpan={2}>Trần</th>
            <th style={{ position: 'sticky', left: 100, top: 0, zIndex: 31, background: '#1a2d45', padding: '4px 5px', textAlign: 'right', borderRight: '1px solid #2a3f5f', minWidth: 46, color: '#facc15' }} rowSpan={2}>TC</th>
            <th style={{ position: 'sticky', left: 146, top: 0, zIndex: 31, background: '#1a2d45', padding: '4px 5px', textAlign: 'right', borderRight: '2px solid #2a3f5f', minWidth: 46, color: '#38bdf8' }} rowSpan={2}>Sàn</th>
            <th colSpan={6} style={{ textAlign: 'center', background: '#0d2a4a', color: '#60a5fa', borderRight: '2px solid #2a3f5f', padding: 4 }}>Dư mua</th>
            <th colSpan={5} style={{ textAlign: 'center', borderRight: '2px solid #2a3f5f', padding: 4 }}>Khớp lệnh</th>
            <th colSpan={6} style={{ textAlign: 'center', background: '#3d1a1a', color: '#f87171', borderRight: '2px solid #2a3f5f', padding: 4 }}>Dư bán</th>
            <th style={{ padding: '4px 5px', textAlign: 'right', borderRight: '1px solid #2a3f5f', minWidth: 46 }} rowSpan={2}>Cao</th>
            <th style={{ padding: '4px 5px', textAlign: 'right', borderRight: '1px solid #2a3f5f', minWidth: 46 }} rowSpan={2}>TB</th>
            <th style={{ padding: '4px 5px', textAlign: 'right', borderRight: '2px solid #2a3f5f', minWidth: 46 }} rowSpan={2}>Thấp</th>
            <th colSpan={4} style={{ textAlign: 'center', padding: 4, color: '#a78bfa', borderRight: '2px solid #2a3f5f' }}>NN</th>
            <th style={{ padding: '4px 6px', textAlign: 'right', minWidth: 86 }} rowSpan={2}>↕↕ KLGD TT</th>
          </tr>
          <tr style={{ background: '#1a2d45', color: '#7fa8cc', fontSize: '9.5px' }}>
            <th style={{ background: '#0d2a4a', padding: '3px 5px', textAlign: 'right', borderRight: '1px solid #2a3f5f', minWidth: 44, color: '#60a5fa' }}>Giá 3</th>
            <th style={{ background: '#0d2a4a', padding: '3px 5px', textAlign: 'right', borderRight: '1px solid #2a3f5f', minWidth: 56, color: '#60a5fa' }}>KL 3</th>
            <th style={{ background: '#0d2a4a', padding: '3px 5px', textAlign: 'right', borderRight: '1px solid #2a3f5f', minWidth: 44, color: '#60a5fa' }}>Giá 2</th>
            <th style={{ background: '#0d2a4a', padding: '3px 5px', textAlign: 'right', borderRight: '1px solid #2a3f5f', minWidth: 56, color: '#60a5fa' }}>KL 2</th>
            <th style={{ background: '#0d2a4a', padding: '3px 5px', textAlign: 'right', borderRight: '1px solid #2a3f5f', minWidth: 44, color: '#60a5fa' }}>Giá 1</th>
            <th style={{ background: '#0d2a4a', padding: '3px 5px', textAlign: 'right', borderRight: '2px solid #2a3f5f', minWidth: 56, color: '#60a5fa' }}>KL 1</th>
            <th style={{ padding: '3px 5px', textAlign: 'right', borderRight: '1px solid #2a3f5f', minWidth: 44 }}>Giá</th>
            <th style={{ padding: '3px 5px', textAlign: 'right', borderRight: '1px solid #2a3f5f', minWidth: 62 }}>KL</th>
            <th style={{ padding: '3px 5px', textAlign: 'right', borderRight: '1px solid #2a3f5f', minWidth: 52 }}>%</th>
            <th style={{ padding: '3px 5px', textAlign: 'right', borderRight: '1px solid #2a3f5f', minWidth: 44 }}>↕</th>
            <th style={{ padding: '3px 5px', textAlign: 'right', borderRight: '2px solid #2a3f5f', minWidth: 72 }}>KLGD</th>
            <th style={{ background: '#3d1a1a', padding: '3px 5px', textAlign: 'right', borderRight: '1px solid #2a3f5f', minWidth: 44, color: '#f87171' }}>Giá 1</th>
            <th style={{ background: '#3d1a1a', padding: '3px 5px', textAlign: 'right', borderRight: '1px solid #2a3f5f', minWidth: 56, color: '#f87171' }}>KL 1</th>
            <th style={{ background: '#3d1a1a', padding: '3px 5px', textAlign: 'right', borderRight: '1px solid #2a3f5f', minWidth: 44, color: '#f87171' }}>Giá 2</th>
            <th style={{ background: '#3d1a1a', padding: '3px 5px', textAlign: 'right', borderRight: '1px solid #2a3f5f', minWidth: 56, color: '#f87171' }}>KL 2</th>
            <th style={{ background: '#3d1a1a', padding: '3px 5px', textAlign: 'right', borderRight: '1px solid #2a3f5f', minWidth: 44, color: '#f87171' }}>Giá 3</th>
            <th style={{ background: '#3d1a1a', padding: '3px 5px', textAlign: 'right', borderRight: '2px solid #2a3f5f', minWidth: 56, color: '#f87171' }}>KL 3</th>
            <th style={{ padding: '3px 5px', textAlign: 'right', borderRight: '1px solid #2a3f5f', minWidth: 72, color: '#a78bfa' }}>Mua</th>
            <th style={{ padding: '3px 5px', textAlign: 'right', borderRight: '1px solid #2a3f5f', minWidth: 72, color: '#a78bfa' }}>Bán</th>
            <th style={{ padding: '3px 5px', textAlign: 'right', borderRight: '1px solid #2a3f5f', minWidth: 72, color: '#a78bfa' }}>↕</th>
            <th style={{ padding: '3px 5px', textAlign: 'right', borderRight: '2px solid #2a3f5f', minWidth: 88, color: '#a78bfa' }}>Room</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((s) => (
            <tr key={s.sym} style={{ background: s.bg, transition: 'background .5s', borderBottom: `1px solid ${th.rowBorder}`, height: 23 }}>
              <td onClick={s.onChart} style={{ position: 'sticky', left: 0, zIndex: 5, background: s.bg, transition: 'background .5s', padding: '2px 6px', textAlign: 'center', borderRight: `1px solid ${th.cellBorder}`, fontWeight: 700, fontSize: '11.5px', color: th.symColor, cursor: 'pointer', textDecoration: 'underline dotted' }}>{s.sym}</td>
              <td style={{ position: 'sticky', left: 54, zIndex: 5, background: s.bg, transition: 'background .5s', padding: '2px 5px', textAlign: 'right', borderRight: `1px solid ${th.cellBorder}`, color: '#c084fc' }}>{s.ceil}</td>
              <td style={{ position: 'sticky', left: 100, zIndex: 5, background: s.bg, transition: 'background .5s', padding: '2px 5px', textAlign: 'right', borderRight: `1px solid ${th.cellBorder}`, color: '#facc15' }}>{s.tc}</td>
              <td style={{ position: 'sticky', left: 146, zIndex: 5, background: s.bg, transition: 'background .5s', padding: '2px 5px', textAlign: 'right', borderRight: `2px solid ${th.cellBorder}`, color: '#38bdf8' }}>{s.floor}</td>
              <td style={{ padding: '2px 5px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.b3c }}>{s.b3p}</td>
              <td style={{ padding: '2px 5px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.b3c }}>{s.b3q}</td>
              <td style={{ padding: '2px 5px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.b2c }}>{s.b2p}</td>
              <td style={{ padding: '2px 5px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.b2c }}>{s.b2q}</td>
              <td style={{ padding: '2px 5px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.b1c }}>{s.b1p}</td>
              <td style={{ padding: '2px 5px', textAlign: 'right', borderRight: `2px solid ${th.cellBorder}`, color: s.b1c }}>{s.b1q}</td>
              <td style={{ padding: '2px 5px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, fontWeight: 700, fontSize: 12, color: s.lc }}>{s.lp}</td>
              <td style={{ padding: '2px 5px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.lc }}>{s.lq}</td>
              <td style={{ padding: '2px 5px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, fontWeight: 600, color: s.pc }}>{s.pct}</td>
              <td style={{ padding: '2px 5px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.pc }}>{s.chg}</td>
              <td style={{ padding: '2px 5px', textAlign: 'right', borderRight: `2px solid ${th.cellBorder}`, color: th.volColor }}>{s.tvol}</td>
              <td style={{ padding: '2px 5px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.a1c }}>{s.a1p}</td>
              <td style={{ padding: '2px 5px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.a1c }}>{s.a1q}</td>
              <td style={{ padding: '2px 5px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.a2c }}>{s.a2p}</td>
              <td style={{ padding: '2px 5px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.a2c }}>{s.a2q}</td>
              <td style={{ padding: '2px 5px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.a3c }}>{s.a3p}</td>
              <td style={{ padding: '2px 5px', textAlign: 'right', borderRight: `2px solid ${th.cellBorder}`, color: s.a3c }}>{s.a3q}</td>
              <td style={{ padding: '2px 5px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.hc }}>{s.hi}</td>
              <td style={{ padding: '2px 5px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.ac }}>{s.avg}</td>
              <td style={{ padding: '2px 5px', textAlign: 'right', borderRight: `2px solid ${th.cellBorder}`, color: s.oc }}>{s.lo}</td>
              <td style={{ padding: '2px 5px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: '#4ade80' }}>{s.fbuy}</td>
              <td style={{ padding: '2px 5px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: '#f87171' }}>{s.fsell}</td>
              <td style={{ padding: '2px 5px', textAlign: 'right', borderRight: `1px solid ${th.cellBorderL}`, color: s.fbc }}>{s.fbal}</td>
              <td style={{ padding: '2px 5px', textAlign: 'right', borderRight: `2px solid ${th.cellBorder}`, color: '#64748b' }}>{s.room}</td>
              <td style={{ padding: '2px 6px', textAlign: 'right', color: th.volColor }}>{s.kltt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
