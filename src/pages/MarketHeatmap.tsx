import { memo, useMemo, useState } from 'react'

/* ───────────────────── types ───────────────────── */

interface Stock {
  symbol: string
  name: string
  sector: string
  marketCap: number // billion VND
  price: number
  priceChange: number // percent
}

interface Cell {
  stock: Stock
  x: number
  y: number
  w: number
  h: number
  color: string
  fontSize: number
  pctFontSize: number
  showPct: boolean
}

/* ───────────────────── mock data ───────────────────── */

const MOCK_STOCKS: Stock[] = [
  { symbol: 'VIC', name: 'Vingroup', sector: 'Bất động sản', marketCap: 145000, price: 48.5, priceChange: 4.5 },
  { symbol: 'VHM', name: 'Vinhomes', sector: 'Bất động sản', marketCap: 130000, price: 42.3, priceChange: 3.2 },
  { symbol: 'VRE', name: 'Vincom Retail', sector: 'Bất động sản', marketCap: 65000, price: 31.2, priceChange: 1.8 },
  { symbol: 'HPG', name: 'Hòa Phát', sector: 'Thép', marketCap: 120000, price: 28.7, priceChange: 5.8 },
  { symbol: 'NVL', name: 'Novaland', sector: 'Bất động sản', marketCap: 45000, price: 18.9, priceChange: -2.1 },
  { symbol: 'PDR', name: 'Phát Đạt', sector: 'Bất động sản', marketCap: 22000, price: 32.1, priceChange: -4.3 },
  { symbol: 'KDH', name: 'Đầu tư Kinh doanh Nhà', sector: 'Bất động sản', marketCap: 35000, price: 56.4, priceChange: 2.7 },
  { symbol: 'VNM', name: 'Vinamilk', sector: 'Thực phẩm', marketCap: 115000, price: 78.5, priceChange: 0.5 },
  { symbol: 'MSN', name: 'Masan Group', sector: 'Thực phẩm', marketCap: 95000, price: 72.3, priceChange: -1.2 },
  { symbol: 'MWG', name: 'Thế Giới Di Động', sector: 'Bán lẻ', marketCap: 85000, price: 58.9, priceChange: 7.0 },
  { symbol: 'FPT', name: 'FPT Corporation', sector: 'Công nghệ', marketCap: 105000, price: 128.5, priceChange: 3.8 },
  { symbol: 'VCB', name: 'Vietcombank', sector: 'Ngân hàng', marketCap: 140000, price: 92.3, priceChange: 1.5 },
  { symbol: 'BID', name: 'BIDV', sector: 'Ngân hàng', marketCap: 95000, price: 48.7, priceChange: 0.8 },
  { symbol: 'CTG', name: 'VietinBank', sector: 'Ngân hàng', marketCap: 88000, price: 42.1, priceChange: 1.2 },
  { symbol: 'TCB', name: 'Techcombank', sector: 'Ngân hàng', marketCap: 72000, price: 38.5, priceChange: -0.8 },
  { symbol: 'MBB', name: 'MB Bank', sector: 'Ngân hàng', marketCap: 55000, price: 32.4, priceChange: 2.3 },
  { symbol: 'ACB', name: 'ACB', sector: 'Ngân hàng', marketCap: 48000, price: 28.9, priceChange: 1.1 },
  { symbol: 'VPB', name: 'VPBank', sector: 'Ngân hàng', marketCap: 42000, price: 22.3, priceChange: -1.5 },
  { symbol: 'HDB', name: 'HDBank', sector: 'Ngân hàng', marketCap: 35000, price: 26.8, priceChange: 0.9 },
  { symbol: 'TPB', name: 'TPBank', sector: 'Ngân hàng', marketCap: 30000, price: 32.1, priceChange: -0.5 },
  { symbol: 'VIB', name: 'VIB', sector: 'Ngân hàng', marketCap: 22000, price: 18.5, priceChange: 1.8 },
  { symbol: 'STB', name: 'Sacombank', sector: 'Ngân hàng', marketCap: 38000, price: 24.6, priceChange: 0.7 },
  { symbol: 'EIB', name: 'Eximbank', sector: 'Ngân hàng', marketCap: 28000, price: 22.4, priceChange: -0.3 },
  { symbol: 'GAS', name: 'PV Gas', sector: 'Năng lượng', marketCap: 75000, price: 98.2, priceChange: 2.1 },
  { symbol: 'PLX', name: 'Petrolimex', sector: 'Năng lượng', marketCap: 42000, price: 38.5, priceChange: -1.8 },
  { symbol: 'POW', name: 'PV Power', sector: 'Năng lượng', marketCap: 25000, price: 12.3, priceChange: 3.5 },
  { symbol: 'VSH', name: 'Vinamilk', sector: 'Điện lực', marketCap: 18000, price: 15.2, priceChange: 1.2 },
  { symbol: 'NLG', name: 'Nam Long', sector: 'Bất động sản', marketCap: 16000, price: 22.8, priceChange: -3.2 },
  { symbol: 'DGW', name: 'Đầu tư Dầu khí', sector: 'Năng lượng', marketCap: 12000, price: 8.5, priceChange: 5.2 },
  { symbol: 'PC1', name: 'Phúc Lộc An', sector: 'Xây dựng', marketCap: 20000, price: 45.3, priceChange: 4.8 },
  { symbol: 'VCG', name: 'Vinaconex', sector: 'Xây dựng', marketCap: 15000, price: 28.9, priceChange: 2.5 },
  { symbol: 'HBC', name: 'Hòa Bình', sector: 'Xây dựng', marketCap: 8000, price: 12.4, priceChange: -5.1 },
  { symbol: 'CII', name: 'Đầu tư Hạ tầng Cầu', sector: 'Xây dựng', marketCap: 10000, price: 18.7, priceChange: 1.9 },
  { symbol: 'VJC', name: 'Vietjet Air', sector: 'Hàng không', marketCap: 55000, price: 108.5, priceChange: -2.8 },
  { symbol: 'ACV', name: 'Tổng Cảng Hàng không', sector: 'Hàng không', marketCap: 65000, price: 78.3, priceChange: 1.4 },
  { symbol: 'SAB', name: 'Sabeco', sector: 'Đồ uống', marketCap: 48000, price: 168.5, priceChange: 0.8 },
  { symbol: 'PNJ', name: 'Phú Nhuận Jewelry', sector: 'Quà tặng', marketCap: 22000, price: 128.3, priceChange: 3.1 },
  { symbol: 'MWG', name: 'Thế Giới Di Động', sector: 'Bán lẻ', marketCap: 85000, price: 58.9, priceChange: 7.0 },
  { symbol: 'DGW', name: 'Digiworld', sector: 'Bán lẻ', marketCap: 8000, price: 42.5, priceChange: 5.2 },
  { symbol: 'FRT', name: 'FPT Retail', sector: 'Bán lẻ', marketCap: 12000, price: 98.3, priceChange: -1.5 },
  { symbol: 'PNJ', name: 'Phú Nhuận Jewelry', sector: 'Bán lẻ', marketCap: 22000, price: 128.3, priceChange: 3.1 },
  { symbol: 'SAB', name: 'Sabeco', sector: 'Đồ uống', marketCap: 48000, price: 168.5, priceChange: 0.8 },
  { symbol: 'VNM', name: 'Vinamilk', sector: 'Thực phẩm', marketCap: 115000, price: 78.5, priceChange: 0.5 },
  { symbol: 'MSN', name: 'Masan Group', sector: 'Thực phẩm', marketCap: 95000, price: 72.3, priceChange: -1.2 },
  { symbol: 'QNS', name: 'Quảng Ngãi Sugar', sector: 'Thực phẩm', marketCap: 15000, price: 68.2, priceChange: 2.8 },
  { symbol: 'SJD', name: 'Cấp nước Bà Rịa', sector: 'Nước', marketCap: 5000, price: 32.1, priceChange: 0.3 },
  { symbol: 'VSH', name: 'Vinaconex Water', sector: 'Nước', marketCap: 4500, price: 28.5, priceChange: 1.2 },
  { symbol: 'CVC', name: 'Cấp nước Cần Thơ', sector: 'Nước', marketCap: 2000, price: 18.3, priceChange: -0.8 },
  { symbol: 'CTR', name: 'Công nghệ Viễn thông', sector: 'Viễn thông', marketCap: 32000, price: 48.5, priceChange: 2.4 },
  { symbol: 'VTL', name: 'Vận tải Biển', sector: 'Vận tải', marketCap: 8000, price: 22.3, priceChange: -3.5 },
  { symbol: 'VOS', name: 'Vận tải Oto Sài Gòn', sector: 'Vận tải', marketCap: 5000, price: 18.9, priceChange: 1.8 },
  { symbol: 'GMD', name: 'Gemadept', sector: 'Cảng biển', marketCap: 18000, price: 52.3, priceChange: 3.2 },
  { symbol: 'PHP', name: 'Petrolimex Hải Phòng', sector: 'Cảng biển', marketCap: 6000, price: 28.5, priceChange: 0.9 },
  { symbol: 'HAP', name: 'Hải Phát', sector: 'Cảng biển', marketCap: 4000, price: 15.2, priceChange: -1.2 },
  { symbol: 'DPR', name: 'Đồng Phước', sector: 'Giày dép', marketCap: 8000, price: 42.3, priceChange: 4.1 },
  { symbol: 'GVR', name: 'Cao su Việt Nam', sector: 'Cao su', marketCap: 12000, price: 18.5, priceChange: -2.5 },
  { symbol: 'PHR', name: 'Phú Riềng Đỏ', sector: 'Cao su', marketCap: 10000, price: 32.1, priceChange: 1.5 },
  { symbol: 'VHC', name: 'Vĩnh Hòa', sector: 'Thuỷ sản', marketCap: 8000, price: 82.3, priceChange: 3.8 },
  { symbol: 'ANV', name: 'Sao Ta', sector: 'Thuỷ sản', marketCap: 5000, price: 48.5, priceChange: 2.1 },
  { symbol: 'FMC', name: 'Fishery', sector: 'Thuỷ sản', marketCap: 4000, price: 32.8, priceChange: -1.8 },
  { symbol: 'HVG', name: 'Hùng Vương', sector: 'Thuỷ sản', marketCap: 3000, price: 12.5, priceChange: 5.5 },
  { symbol: 'MSN', name: 'Masan Group', sector: 'Thực phẩm', marketCap: 95000, price: 72.3, priceChange: -1.2 },
  { symbol: 'QNS', name: 'Quảng Ngãi Sugar', sector: 'Thực phẩm', marketCap: 15000, price: 68.2, priceChange: 2.8 },
  { symbol: 'SAB', name: 'Sabeco', sector: 'Đồ uống', marketCap: 48000, price: 168.5, priceChange: 0.8 },
  { symbol: 'VNM', name: 'Vinamilk', sector: 'Thực phẩm', marketCap: 115000, price: 78.5, priceChange: 0.5 },
  { symbol: 'MSN', name: 'Masan Group', sector: 'Thực phẩm', marketCap: 95000, price: 72.3, priceChange: -1.2 },
  { symbol: 'QNS', name: 'Quảng Ngãi Sugar', sector: 'Thực phẩm', marketCap: 15000, price: 68.2, priceChange: 2.8 },
  { symbol: 'VHC', name: 'Vĩnh Hòa', sector: 'Thuỷ sản', marketCap: 8000, price: 82.3, priceChange: 3.8 },
  { symbol: 'ANV', name: 'Sao Ta', sector: 'Thuỷ sản', marketCap: 5000, price: 48.5, priceChange: 2.1 },
  { symbol: 'FMC', name: 'Fishery', sector: 'Thuỷ sản', marketCap: 4000, price: 32.8, priceChange: -1.8 },
  { symbol: 'HVG', name: 'Hùng Vương', sector: 'Thuỷ sản', marketCap: 3000, price: 12.5, priceChange: 5.5 },
  { symbol: 'VGC', name: 'Viglacera', sector: 'Vật liệu xây dựng', marketCap: 12000, price: 38.5, priceChange: 2.8 },
  { symbol: 'NHT', name: 'Nhôm Hòa Phát', sector: 'Vật liệu xây dựng', marketCap: 8000, price: 22.3, priceChange: 4.2 },
  { symbol: 'DPM', name: 'Đạm Phú Mỹ', sector: 'Hóa chất', marketCap: 10000, price: 35.2, priceChange: -0.8 },
  { symbol: 'DGC', name: 'Duc Giang Chemical', sector: 'Hóa chất', marketCap: 15000, price: 128.5, priceChange: 5.8 },
  { symbol: 'CSV', name: 'Caustic Soda', sector: 'Hóa chất', marketCap: 8000, price: 42.3, priceChange: 1.2 },
  { symbol: 'PVT', name: 'PV Tank', sector: 'Hóa chất', marketCap: 6000, price: 32.1, priceChange: 3.5 },
  { symbol: 'PVD', name: 'PV Drilling', sector: 'Dầu khí', marketCap: 12000, price: 28.5, priceChange: -4.2 },
  { symbol: 'PVS', name: 'PV Shipbuilding', sector: 'Dầu khí', marketCap: 10000, price: 35.2, priceChange: 2.1 },
  { symbol: 'PVB', name: 'PV Coating', sector: 'Dầu khí', marketCap: 5000, price: 18.9, priceChange: 1.8 },
  { symbol: 'PVC', name: 'PV Drilling', sector: 'Dầu khí', marketCap: 4000, price: 12.3, priceChange: -2.5 },
  { symbol: 'VGC', name: 'Viglacera', sector: 'Vật liệu xây dựng', marketCap: 12000, price: 38.5, priceChange: 2.8 },
  { symbol: 'NHT', name: 'Nhôm Hòa Phát', sector: 'Vật liệu xây dựng', marketCap: 8000, price: 22.3, priceChange: 4.2 },
  { symbol: 'DPM', name: 'Đạm Phú Mỹ', sector: 'Hóa chất', marketCap: 10000, price: 35.2, priceChange: -0.8 },
  { symbol: 'DGC', name: 'Duc Giang Chemical', sector: 'Hóa chất', marketCap: 15000, price: 128.5, priceChange: 5.8 },
  { symbol: 'CSV', name: 'Caustic Soda', sector: 'Hóa chất', marketCap: 8000, price: 42.3, priceChange: 1.2 },
  { symbol: 'PVT', name: 'PV Tank', sector: 'Hóa chất', marketCap: 6000, price: 32.1, priceChange: 3.5 },
  { symbol: 'PVD', name: 'PV Drilling', sector: 'Dầu khí', marketCap: 12000, price: 28.5, priceChange: -4.2 },
  { symbol: 'PVS', name: 'PV Shipbuilding', sector: 'Dầu khí', marketCap: 10000, price: 35.2, priceChange: 2.1 },
  { symbol: 'PVB', name: 'PV Coating', sector: 'Dầu khí', marketCap: 5000, price: 18.9, priceChange: 1.8 },
  { symbol: 'PVC', name: 'PV Drilling', sector: 'Dầu khí', marketCap: 4000, price: 12.3, priceChange: -2.5 },
]

// Remove duplicates by symbol
const STOCKS: Stock[] = Array.from(
  new Map(MOCK_STOCKS.map((s) => [s.symbol, s])).values(),
).sort((a, b) => b.marketCap - a.marketCap)

/* ───────────────────── color mapping ───────────────────── */

function getPriceColor(pct: number): string {
  if (pct >= 7) return '#9333ea'   // tăng trần
  if (pct >= 3) return '#16a34a'   // tăng mạnh
  if (pct > 0) return '#4ade80'    // tăng nhẹ
  if (pct === 0) return '#eab308'  // tham chiếu
  if (pct > -3) return '#f97316'   // giảm nhẹ
  if (pct > -7) return '#ef4444'   // giảm mạnh
  return '#991b1b'                  // giảm sàn
}

/* ───────────────────── squarified treemap ───────────────────── */

interface Rect {
  x: number
  y: number
  w: number
  h: number
}

function squarify(
  items: { value: number; data: Stock }[],
  rect: Rect,
): { stock: Stock; rect: Rect }[] {
  if (items.length === 0) return []
  const total = items.reduce((s, i) => s + i.value, 0)
  if (total <= 0) return []

  const result: { stock: Stock; rect: Rect }[] = []
  layoutRow(items, rect, total, result)
  return result
}

function layoutRow(
  items: { value: number; data: Stock }[],
  rect: Rect,
  total: number,
  result: { stock: Stock; rect: Rect }[],
): void {
  if (items.length === 0) return
  if (items.length === 1) {
    result.push({ stock: items[0].data, rect })
    return
  }

  const { x, y, w, h } = rect
  const isHorizontal = w >= h
  const mainSize = isHorizontal ? h : w

  let row: { value: number; data: Stock }[] = []
  let rowArea = 0
  let bestAspect = Infinity

  for (let i = 0; i < items.length; i++) {
    const candidate = [...row, items[i]]
    const candidateArea = rowArea + items[i].value
    const aspect = worstAspect(candidate, candidateArea, mainSize, total)

    if (aspect <= bestAspect && i < items.length - 1) {
      row = candidate
      rowArea = candidateArea
      bestAspect = aspect
    } else {
      // Lay out current row
      const rowFraction = rowArea / total
      if (isHorizontal) {
        const rowW = w * rowFraction
        let cy = y
        for (const item of row) {
          const itemH = (item.value / rowArea) * h
          result.push({ stock: item.data, rect: { x, y: cy, w: rowW, h: itemH } })
          cy += itemH
        }
        const remaining = items.slice(i)
        const remainingTotal = remaining.reduce((s, it) => s + it.value, 0)
        layoutRow(
          remaining,
          { x: x + rowW, y, w: w - rowW, h },
          remainingTotal,
          result,
        )
        return
      } else {
        const rowH = h * rowFraction
        let cx = x
        for (const item of row) {
          const itemW = (item.value / rowArea) * w
          result.push({ stock: item.data, rect: { x: cx, y, w: itemW, h: rowH } })
          cx += itemW
        }
        const remaining = items.slice(i)
        const remainingTotal = remaining.reduce((s, it) => s + it.value, 0)
        layoutRow(
          remaining,
          { x, y: y + rowH, w, h: h - rowH },
          remainingTotal,
          result,
        )
        return
      }
    }
  }

  // All items fit in one row
  const rowFraction = rowArea / total
  if (isHorizontal) {
    const rowW = w * rowFraction
    let cy = y
    for (const item of row) {
      const itemH = (item.value / rowArea) * h
      result.push({ stock: item.data, rect: { x, y: cy, w: rowW, h: itemH } })
      cy += itemH
    }
  } else {
    const rowH = h * rowFraction
    let cx = x
    for (const item of row) {
      const itemW = (item.value / rowArea) * w
      result.push({ stock: item.data, rect: { x: cx, y, w: itemW, h: rowH } })
      cx += itemW
    }
  }
}

function worstAspect(
  row: { value: number }[],
  rowArea: number,
  mainSize: number,
  total: number,
): number {
  const rowFraction = rowArea / total
  const rowMain = mainSize * rowFraction
  let worst = 0
  for (const item of row) {
    const itemArea = (item.value / rowArea) * rowFraction
    const itemSide = mainSize * itemArea
    const aspect = Math.max(rowMain / itemSide, itemSide / rowMain)
    worst = Math.max(worst, aspect)
  }
  return worst
}

/* ───────────────────── component ───────────────────── */

function MarketHeatmapPageInner() {
  const [hoveredSymbol, setHoveredSymbol] = useState<string | null>(null)

  const cells: Cell[] = useMemo(() => {
    const items = STOCKS.map((s) => ({ value: s.marketCap, data: s }))
    const rects = squarify(items, { x: 0, y: 0, w: 1000, h: 640 })

    return rects.map(({ stock, rect }) => {
      const area = rect.w * rect.h
      const side = Math.sqrt(area)
      const fontSize = Math.max(8, Math.min(18, side / 6))
      const pctFontSize = Math.max(7, Math.min(14, side / 8))
      const showPct = side > 50

      return {
        stock,
        x: rect.x,
        y: rect.y,
        w: rect.w,
        h: rect.h,
        color: getPriceColor(stock.priceChange),
        fontSize,
        pctFontSize,
        showPct,
      }
    })
  }, [])

  const topGainers = useMemo(
    () =>
      [...STOCKS]
        .filter((s) => s.priceChange > 0)
        .sort((a, b) => b.priceChange - a.priceChange)
        .slice(0, 6),
    [],
  )

  const topLosers = useMemo(
    () =>
      [...STOCKS]
        .filter((s) => s.priceChange < 0)
        .sort((a, b) => a.priceChange - b.priceChange)
        .slice(0, 6),
    [],
  )

  const formatPct = (pct: number) => {
    const sign = pct > 0 ? '+' : ''
    return `${sign}${pct.toFixed(1)}%`
  }

  return (
    <div
      style={{
        background: 'var(--ds-color-bg-app)',
        color: 'var(--ds-color-text-primary)',
        minHeight: '100%',
        padding: 16,
        fontFamily: "'Inter', system-ui, sans-serif",
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Bản đồ nhiệt thị trường</h1>
        <span
          style={{
            fontSize: 11,
            color: 'var(--ds-color-text-secondary)',
            background: 'var(--ds-color-bg-subtle)',
            padding: '3px 8px',
            borderRadius: 6,
          }}
        >
          {STOCKS.length} cổ phiếu
        </span>
      </div>

      {/* Treemap */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 640,
          background: 'var(--ds-color-bg-card)',
          border: '1px solid var(--ds-color-border)',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <svg
          viewBox="0 0 1000 640"
          style={{ width: '100%', height: '100%', display: 'block' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {cells.map((cell) => {
            const isHovered = hoveredSymbol === cell.stock.symbol
            return (
              <g
                key={cell.stock.symbol}
                onMouseEnter={() => setHoveredSymbol(cell.stock.symbol)}
                onMouseLeave={() => setHoveredSymbol(null)}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  x={cell.x}
                  y={cell.y}
                  width={cell.w}
                  height={cell.h}
                  fill={cell.color}
                  stroke="var(--ds-color-bg-app)"
                  strokeWidth={1}
                  opacity={isHovered ? 0.85 : 1}
                  style={{ transition: 'opacity 0.15s' }}
                />
                {cell.w > 28 && cell.h > 18 && (
                  <text
                    x={cell.x + 8}
                    y={cell.y + cell.fontSize + 4}
                    fill="#fff"
                    fontSize={cell.fontSize}
                    fontWeight={800}
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
                  >
                    {cell.stock.symbol}
                  </text>
                )}
                {cell.showPct && cell.w > 35 && cell.h > 30 && (
                  <text
                    x={cell.x + 8}
                    y={cell.y + cell.fontSize + cell.pctFontSize + 6}
                    fill="rgba(255,255,255,0.92)"
                    fontSize={cell.pctFontSize}
                    fontWeight={700}
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
                  >
                    {formatPct(cell.stock.priceChange)}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* Gradient legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 9, color: 'var(--ds-color-text-secondary)', fontWeight: 700 }}>
          -7%
        </span>
        <div
          style={{
            flex: 1,
            height: 8,
            borderRadius: 4,
            background:
              'linear-gradient(90deg, #991b1b 0%, #ef4444 15%, #f97316 30%, #eab308 50%, #4ade80 70%, #16a34a 85%, #9333ea 100%)',
          }}
        />
        <span style={{ fontSize: 9, color: 'var(--ds-color-text-secondary)', fontWeight: 700 }}>
          +7%+
        </span>
      </div>

      {/* Top movers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {/* Top tăng mạnh */}
        <div
          style={{
            background: 'var(--ds-color-bg-card)',
            border: '1px solid var(--ds-color-border)',
            borderRadius: 12,
            padding: 16,
          }}
        >
          <h3
            style={{
              margin: '0 0 10px 0',
              fontSize: 11,
              fontWeight: 700,
              color: '#9333ea',
              textTransform: 'uppercase',
            }}
          >
            🔥 Tăng trần / Tăng mạnh
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {topGainers.map((g) => (
              <div
                key={g.symbol}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '50px 1fr 70px',
                  gap: 8,
                  padding: '7px 8px',
                  background: 'var(--ds-color-bg-subtle)',
                  borderRadius: 6,
                  fontSize: 10.5,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                <span style={{ fontWeight: 700, color: 'var(--ds-color-text-primary)' }}>
                  {g.symbol}
                </span>
                <span
                  style={{
                    color: 'var(--ds-color-text-secondary)',
                    textAlign: 'center',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {g.sector}
                </span>
                <span style={{ fontWeight: 700, color: '#9333ea', textAlign: 'right' }}>
                  {formatPct(g.priceChange)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top giảm mạnh */}
        <div
          style={{
            background: 'var(--ds-color-bg-card)',
            border: '1px solid var(--ds-color-border)',
            borderRadius: 12,
            padding: 16,
          }}
        >
          <h3
            style={{
              margin: '0 0 10px 0',
              fontSize: 11,
              fontWeight: 700,
              color: '#ef4444',
              textTransform: 'uppercase',
            }}
          >
            ❄️ Giảm sàn / Giảm mạnh
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {topLosers.map((l) => (
              <div
                key={l.symbol}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '50px 1fr 70px',
                  gap: 8,
                  padding: '7px 8px',
                  background: 'var(--ds-color-bg-subtle)',
                  borderRadius: 6,
                  fontSize: 10.5,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                <span style={{ fontWeight: 700, color: 'var(--ds-color-text-primary)' }}>
                  {l.symbol}
                </span>
                <span
                  style={{
                    color: 'var(--ds-color-text-secondary)',
                    textAlign: 'center',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {l.sector}
                </span>
                <span style={{ fontWeight: 700, color: '#ef4444', textAlign: 'right' }}>
                  {formatPct(l.priceChange)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const MarketHeatmapPage = memo(MarketHeatmapPageInner)
export default MarketHeatmapPage
