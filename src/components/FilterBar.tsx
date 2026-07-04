import { memo, useMemo } from 'react'
import type { ThemeTokens, TradeHistoryItem } from '../types/priceboard'
import type { VietcapFilterGroup, FilterGroupConfig } from '../types/vietcap'
import SymbolSearch from './SymbolSearch'
import FilterDropdown from './FilterDropdown'
import filterOptionsData from '../data/generated/filter-options.json'
import { resolveTopGroup } from '../lib/filterStocks'

const filterGroups = filterOptionsData.groups as FilterGroupConfig[]

type Props = {
  th: ThemeTokens
  filter: { group: VietcapFilterGroup; value: string; searchText: string }
  onFilterChange: (group: VietcapFilterGroup, value?: string) => void
  onSymbolAdd: (symbol: string) => void
  viewMode?: 'table' | 'grid' | 'heat' | 'movers'
  onViewModeChange?: (mode: 'table' | 'grid' | 'heat' | 'movers') => void
  showSector?: boolean
  onToggleSector?: () => void
  activeSector?: string
  onSectorChange?: (sector: string) => void
  showAdvFilter?: boolean
  onToggleAdvFilter?: () => void
  showTradeHist?: boolean
  onToggleTradeHist?: () => void
  onExportCSV?: () => void
  filterPctFrom?: string
  filterPctTo?: string
  filterVolMin?: string
  filterPriceMin?: string
  filterPriceMax?: string
  onSetPctFrom?: (v: string) => void
  onSetPctTo?: (v: string) => void
  onSetVolMin?: (v: string) => void
  onSetPriceMin?: (v: string) => void
  onSetPriceMax?: (v: string) => void
  onResetFilters?: () => void
  tradeHistory?: TradeHistoryItem[]
}

const SECTOR_LIST = ['Tất cả','VN30','Ngân hàng','BĐS','Thực phẩm','Chứng khoán','Thép','Năng lượng','Công nghệ','Dược phẩm','Bảo hiểm','Bán lẻ','Vận tải','Hóa chất','Cao su','Thủy sản','Dệt may']

function FilterBarInner({
  th, filter, onFilterChange, onSymbolAdd,
  viewMode = 'table', onViewModeChange,
  showSector, activeSector = 'Tất cả', onSectorChange,
  showAdvFilter, onToggleAdvFilter,
  showTradeHist, onToggleTradeHist, onExportCSV,
  filterPctFrom, filterPctTo, filterVolMin, filterPriceMin, filterPriceMax,
  onSetPctFrom, onSetPctTo, onSetVolMin, onSetPriceMin, onSetPriceMax, onResetFilters,
  tradeHistory,
}: Props) {
  const displayGroup = resolveTopGroup(filter.group)

  const tabStyle = useMemo(() => (active: boolean): React.CSSProperties => ({
    background: active ? 'var(--ds-color-blue-600)' : 'transparent',
    color: active ? 'var(--ds-color-text-inverse)' : th.tabFg,
    border: active ? 'none' : th.tabBorder,
    borderRadius: 6,
    padding: '4px 11px',
    fontSize: 11,
    fontWeight: active ? '700' : '500',
    cursor: 'pointer',
    flexShrink: 0,
    whiteSpace: 'nowrap',
    letterSpacing: 0.2,
    transition: 'all .15s',
  }), [th.tabFg, th.tabBorder])

  const iconBtn = useMemo(() => (active: boolean): React.CSSProperties => ({
    background: active ? 'var(--ds-color-orange-500)' : th.iconBg,
    border: `1px solid ${active ? '#ea580c' : th.navBorder}`,
    color: active ? 'var(--ds-color-text-inverse)' : th.textMuted,
    borderRadius: 5,
    width: 26,
    height: 26,
    cursor: 'pointer',
    fontSize: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }), [th.iconBg, th.navBorder, th.textMuted])

  return (
    <div>
      {/* Main filter bar */}
      <div style={{ background: th.navBg, borderBottom: `1px solid ${th.navBorder}`, display: 'flex', alignItems: 'center', padding: '5px 14px', gap: 5, flexShrink: 0, height: 42, overflowX: 'auto' }}>
        {/* View mode buttons */}
        <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
          <button onClick={() => onViewModeChange?.('table')} style={{ background: viewMode === 'table' ? 'var(--ds-color-blue-600)' : th.iconBg, border: `1px solid ${th.navBorder}`, width: 26, height: 26, borderRadius: 5, cursor: 'pointer', color: viewMode === 'table' ? 'var(--ds-color-text-inverse)' : th.textMuted, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{'\u2630'}</button>
          <button onClick={() => onViewModeChange?.('grid')} style={{ background: viewMode === 'grid' ? 'var(--ds-color-blue-600)' : th.iconBg, border: `1px solid ${th.navBorder}`, width: 26, height: 26, borderRadius: 5, cursor: 'pointer', color: viewMode === 'grid' ? 'var(--ds-color-text-inverse)' : th.textMuted, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{'\u229E'}</button>
          <button onClick={() => onViewModeChange?.('heat')} style={{ background: viewMode === 'heat' ? 'var(--ds-color-blue-600)' : th.iconBg, border: `1px solid ${th.navBorder}`, width: 26, height: 26, borderRadius: 5, cursor: 'pointer', color: viewMode === 'heat' ? 'var(--ds-color-text-inverse)' : th.textMuted, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{'\u25A6'}</button>
          <button onClick={() => onViewModeChange?.('movers')} style={{ background: viewMode === 'movers' ? 'var(--ds-color-blue-600)' : th.iconBg, border: `1px solid ${th.navBorder}`, width: 26, height: 26, borderRadius: 5, cursor: 'pointer', color: viewMode === 'movers' ? 'var(--ds-color-text-inverse)' : th.textMuted, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{'\u{1F4CA}'}</button>
        </div>

        {/* Search */}
        <SymbolSearch th={th} onSelect={onSymbolAdd} />

        <div style={{ width: 1, height: 20, background: th.navBorder, flexShrink: 0 }} />

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', overflowX: 'auto', flex: 1, minWidth: 0 }}>
          {filterGroups.map((group) => {
            if (group.id === 'WL' || !group.hasDropdown) {
              return (
                <button
                  key={group.id}
                  onClick={() => onFilterChange(group.id as VietcapFilterGroup)}
                  style={tabStyle(displayGroup === group.id)}
                >
                  {group.label}
                </button>
              )
            }

            const isActive = displayGroup === group.id
            const activeValue = isActive ? filter.value : ''

            return (
              <FilterDropdown
                key={group.id}
                th={th}
                label={group.label}
                items={group.options}
                activeValue={activeValue}
                columns={group.columns}
                onSelect={(val) => {
                  onFilterChange(group.id as VietcapFilterGroup, val)
                }}
              />
            )
          })}
        </div>

        {/* Action buttons */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
          <button onClick={onToggleAdvFilter} style={iconBtn(!!showAdvFilter)} title="Bộ lọc nâng cao">{'\u{1F50D}'}</button>
          <button onClick={onToggleTradeHist} style={iconBtn(!!showTradeHist)} title="Lịch sử giao dịch">{'\u{1F4CB}'}</button>
          <button onClick={onExportCSV} style={{ ...iconBtn(false), background: th.iconBg, border: `1px solid ${th.navBorder}`, color: th.textMuted }} title="Xuất CSV">{'\u2B07'}</button>
        </div>
      </div>

      {/* Sector filter panel */}
      {showSector && (
        <div style={{
          background: th.navBg, borderBottom: `1px solid ${th.navBorder}`,
          padding: '7px 14px', display: 'flex', flexWrap: 'wrap', gap: 5, flexShrink: 0,
          animation: 'fadeUp .15s ease',
        }}>
          {SECTOR_LIST.map((sec) => (
            <button
              key={sec}
              onClick={() => onSectorChange?.(sec)}
              style={{
                background: activeSector === sec ? 'var(--ds-color-blue-600)' : th.iconBg,
                color: activeSector === sec ? 'var(--ds-color-text-inverse)' : th.textMuted,
                border: `1px solid ${activeSector === sec ? 'var(--ds-color-blue-600)' : th.navBorder}`,
                borderRadius: 16, padding: '3px 11px', fontSize: 10.5,
                fontWeight: activeSector === sec ? 700 : 400,
                cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .15s',
              }}
            >
              {sec}
            </button>
          ))}
        </div>
      )}

      {/* Advanced filter panel */}
      {showAdvFilter && (
        <div style={{ background: th.navBg, borderBottom: `1px solid ${th.navBorder}`, padding: '10px 14px', display: 'flex', gap: 12, alignItems: 'flex-end', flexShrink: 0, animation: 'fadeUp .15s ease', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 9, fontWeight: 700, color: th.textMuted, textTransform: 'uppercase' }}>% Thay đổi</label>
            <div style={{ display: 'flex', gap: 4 }}>
              <input type="number" placeholder="Từ" value={filterPctFrom || ''} onChange={(e) => onSetPctFrom?.(e.target.value)} style={{ width: 60, padding: '4px 6px', border: `1px solid ${th.cellBorder}`, borderRadius: 4, background: th.appBg, color: th.text, fontSize: 10 }} />
              <span style={{ color: th.textMuted, padding: '4px 0' }}>{'\u2192'}</span>
              <input type="number" placeholder="Đến" value={filterPctTo || ''} onChange={(e) => onSetPctTo?.(e.target.value)} style={{ width: 60, padding: '4px 6px', border: `1px solid ${th.cellBorder}`, borderRadius: 4, background: th.appBg, color: th.text, fontSize: 10 }} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 9, fontWeight: 700, color: th.textMuted, textTransform: 'uppercase' }}>KLGD (triệu)</label>
            <input type="number" placeholder="Tối thiểu" value={filterVolMin || ''} onChange={(e) => onSetVolMin?.(e.target.value)} style={{ width: 100, padding: '4px 6px', border: `1px solid ${th.cellBorder}`, borderRadius: 4, background: th.appBg, color: th.text, fontSize: 10 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 9, fontWeight: 700, color: th.textMuted, textTransform: 'uppercase' }}>Giá (từ-đến)</label>
            <div style={{ display: 'flex', gap: 4 }}>
              <input type="number" placeholder="Min" value={filterPriceMin || ''} onChange={(e) => onSetPriceMin?.(e.target.value)} style={{ width: 60, padding: '4px 6px', border: `1px solid ${th.cellBorder}`, borderRadius: 4, background: th.appBg, color: th.text, fontSize: 10 }} />
              <input type="number" placeholder="Max" value={filterPriceMax || ''} onChange={(e) => onSetPriceMax?.(e.target.value)} style={{ width: 60, padding: '4px 6px', border: `1px solid ${th.cellBorder}`, borderRadius: 4, background: th.appBg, color: th.text, fontSize: 10 }} />
            </div>
          </div>
          <button onClick={onResetFilters} style={{ background: th.iconBg, border: `1px solid ${th.cellBorder}`, color: th.textMuted, borderRadius: 4, padding: '4px 10px', fontSize: 10, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>Reset</button>
        </div>
      )}

      {/* Trade history panel */}
      {showTradeHist && (
        <div style={{ background: th.navBg, borderBottom: `1px solid ${th.navBorder}`, padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0, animation: 'fadeUp .15s ease', maxHeight: 200, overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ds-color-blue-400)', letterSpacing: 0.5 }}>LỊCH SỬ GIAO DỊCH KHỚP LỆNH</span>
            <span style={{ fontSize: 9, color: th.textMuted }}>Realtime</span>
          </div>
          {(tradeHistory || []).map((item, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 50px 60px 60px 70px', gap: 8, padding: 6, background: th.appBg, borderRadius: 4, border: `1px solid ${th.cellBorder}`, fontSize: 9, fontFamily: "'JetBrains Mono', monospace" }}>
              <div style={{ fontWeight: 700, color: 'var(--ds-color-blue-400)' }}>{item.sym}</div>
              <div style={{ color: item.timeColor, textAlign: 'right' }}>{item.time}</div>
              <div style={{ color: item.priceColor, textAlign: 'right', fontWeight: 700 }}>{item.price}</div>
              <div style={{ color: item.volColor, textAlign: 'right' }}>{item.qty}</div>
              <div style={{ color: item.sideColor, textAlign: 'center', fontWeight: 700 }}>{item.side}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const FilterBar = memo(FilterBarInner)
export default FilterBar
