import { memo } from 'react'
import type { ICellRendererParams } from 'ag-grid-community'
import type { StockRow } from '../../types/priceboard'

function formatFuturesSymbol(sym: string): string {
  // Parse futures codes like 41I1G7000 -> VN30F1M
  const match = sym.match(/^(\d{2})(I\d)(G)(\w+)$/)
  if (match) {
    const monthNum = parseInt(match[2][1])
    return `VN30F${monthNum}M`
  }
  return sym
}

function SymbolCellRendererInner(props: ICellRendererParams<StockRow>) {
  const data = props.data
  if (!data) return null

  const displaySym = /^\d{2}I\dG/.test(data.sym) ? formatFuturesSymbol(data.sym) : data.sym

  return (
    <span
      onClick={(e) => {
        e.stopPropagation()
        data.onChart()
      }}
      style={{
        fontWeight: 700,
        fontSize: '11.5px',
        color: 'var(--ds-color-blue-400)',
        cursor: 'pointer',
        letterSpacing: '.3px',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {displaySym}
    </span>
  )
}

export const SymbolCellRenderer = memo(SymbolCellRendererInner)

function WatchlistCellRendererInner(props: ICellRendererParams<StockRow>) {
  const data = props.data
  if (!data) return null

  return (
    <span
      onClick={(e) => {
        e.stopPropagation()
        data.onToggleWatchlist?.()
      }}
      style={{ cursor: 'pointer', fontSize: 13 }}
    >
      {data.watchlisted ? '\u2665' : '\u2661'}
    </span>
  )
}

export const WatchlistCellRenderer = memo(WatchlistCellRendererInner)

function PriceCellRendererInner(props: ICellRendererParams<StockRow>) {
  const data = props.data
  if (!data) return null

  const colorField = props.colDef?.colId
  const color = data[colorField as keyof StockRow] as string | undefined

  return (
    <span style={{ color: color || 'inherit' }}>
      {props.valueFormatted || props.value}
    </span>
  )
}

export const PriceCellRenderer = memo(PriceCellRendererInner)
