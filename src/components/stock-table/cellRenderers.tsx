import { memo } from 'react'
import type { ICellRendererParams } from 'ag-grid-community'
import type { StockRow } from '../../types/priceboard'

function formatFuturesSymbol(sym: string): string {
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
      onDoubleClick={(e) => {
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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span
        onClick={(e) => {
          e.stopPropagation()
          data.onToggleWatchlist?.()
        }}
        style={{ cursor: 'pointer', fontSize: 14, lineHeight: 1, color: data.watchlisted ? 'var(--ds-color-red-400)' : 'var(--ds-color-blue-400)' }}
      >
        {data.watchlisted ? '\u2665' : '\u2661'}
      </span>
    </div>
  )
}

export const WatchlistCellRenderer = memo(WatchlistCellRendererInner)

function SparklineCellRendererInner(props: ICellRendererParams<StockRow>) {
  const data = props.data
  if (!data || !data.sparkPts) return null

  return (
    <svg viewBox="0 0 80 24" preserveAspectRatio="none" style={{ width: 64, height: 20, display: 'inline-block', verticalAlign: 'middle' }}>
      <path d={data.sparkFill} fill={data.lc} opacity={0.15} />
      <polyline points={data.sparkPts} fill="none" stroke={data.lc} strokeWidth={1.4} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

export const SparklineCellRenderer = memo(SparklineCellRendererInner)

function RoomCellRendererInner(props: ICellRendererParams<StockRow>) {
  const data = props.data
  if (!data) return null
  const pct = data.roomPct ?? 50

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-end' }}>
      <span>{data.room}</span>
      <div style={{ width: 44, height: 3, background: 'var(--ds-color-border-subtle)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: 'var(--ds-color-purple-400)' }} />
      </div>
    </div>
  )
}

export const RoomCellRenderer = memo(RoomCellRendererInner)

function CompareCellRendererInner(props: ICellRendererParams<StockRow>) {
  const data = props.data
  if (!data) return null

  return (
    <input
      type="checkbox"
      checked={!!data.isSelected}
      onChange={(e) => {
        e.stopPropagation()
        data.onToggleCompare?.()
      }}
      style={{ width: 11, height: 11, cursor: 'pointer', accentColor: 'var(--ds-color-blue-500)' }}
    />
  )
}

export const CompareCellRenderer = memo(CompareCellRendererInner)

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
