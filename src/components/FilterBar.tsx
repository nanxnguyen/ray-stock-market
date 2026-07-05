import { memo, useMemo } from 'react'
import type { ThemeTokens, TradeHistoryItem } from '../types/priceboard'
import type { VietcapFilterGroup, FilterGroupConfig } from '../types/vietcap'
import SymbolSearch from './SymbolSearch'
import FilterDropdown from './FilterDropdown'
import filterOptionsData from '../data/generated/filter-options.json'
import { resolveTopGroup } from '../lib/filterStocks'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Separator } from './ui/separator'
import { cn } from '../lib/utils'

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

const VIEW_ICONS: Record<string, string> = {
  table: '\u2630',
  grid: '\u229E',
  heat: '\u25A6',
  movers: '\u{1F4CA}',
}

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

  const inputCls = useMemo(() => cn(
    'h-7 w-[60px] rounded-md border text-center',
  ), [])

  return (
    <div>
      {/* Main filter bar */}
      <div
        className="flex items-center gap-1 overflow-x-auto shrink-0"
        style={{ background: th.navBg, borderBottom: `1px solid ${th.navBorder}`, padding: '5px 14px', height: 42 }}
      >
        {/* View mode buttons */}
        <div className="flex gap-0.5 shrink-0">
          {(['table', 'grid', 'heat', 'movers'] as const).map((mode) => (
            <Button
              key={mode}
              variant="ghost"
              size="icon-xs"
              onClick={() => onViewModeChange?.(mode)}
              className={cn(
                'shrink-0 transition-all',
                viewMode === mode
                  ? 'bg-[var(--ds-color-blue-600)] text-[var(--ds-color-text-inverse)] hover:bg-[var(--ds-color-blue-700)]'
                  : 'hover:bg-[var(--ds-color-surface-hover)]',
              )}
              style={{ width: 26, height: 26, border: `1px solid ${th.navBorder}`, borderRadius: 5 }}
            >
              {VIEW_ICONS[mode]}
            </Button>
          ))}
        </div>

        {/* Search */}
        <SymbolSearch th={th} onSelect={onSymbolAdd} />

        <Separator orientation="vertical" className="shrink-0" style={{ height: 20, background: th.navBorder }} />

        {/* Filter tabs */}
        <div className="flex gap-1 items-center overflow-x-auto flex-1 min-w-0">
          {filterGroups.map((group) => {
            if (group.id === 'WL' || !group.hasDropdown) {
              const isActive = displayGroup === group.id
              return (
                <Button
                  key={group.id}
                  variant="ghost"
                  size="xs"
                  onClick={() => onFilterChange(group.id as VietcapFilterGroup)}
                  className={cn(
                    'shrink-0 transition-all',
                    isActive
                      ? 'bg-[var(--ds-color-blue-600)] text-[var(--ds-color-text-inverse)] hover:bg-[var(--ds-color-blue-700)] font-bold'
                      : 'font-medium hover:bg-[var(--ds-color-surface-hover)]',
                  )}
                  style={{ border: isActive ? 'none' : th.tabBorder, borderRadius: 6 }}
                >
                  {group.label}
                </Button>
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
        <div className="ml-auto flex gap-1.5 items-center shrink-0">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onToggleAdvFilter}
            title="Bộ lọc nâng cao"
            className={cn(
              'shrink-0 transition-all',
              showAdvFilter
                ? 'bg-[var(--ds-color-orange-500)] text-[var(--ds-color-text-inverse)] hover:bg-[var(--ds-color-orange-400)]'
                : 'hover:bg-[var(--ds-color-surface-hover)]',
            )}
            style={{ width: 26, height: 26, border: `1px solid ${showAdvFilter ? '#ea580c' : th.navBorder}`, borderRadius: 5 }}
          >
            {'\u{1F50D}'}
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onToggleTradeHist}
            title="Lịch sử giao dịch"
            className={cn(
              'shrink-0 transition-all',
              showTradeHist
                ? 'bg-[var(--ds-color-orange-500)] text-[var(--ds-color-text-inverse)] hover:bg-[var(--ds-color-orange-400)]'
                : 'hover:bg-[var(--ds-color-surface-hover)]',
            )}
            style={{ width: 26, height: 26, border: `1px solid ${showTradeHist ? '#ea580c' : th.navBorder}`, borderRadius: 5 }}
          >
            {'\u{1F4CB}'}
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onExportCSV}
            title="Xuất CSV"
            className="shrink-0 hover:bg-[var(--ds-color-surface-hover)] transition-all"
            style={{ width: 26, height: 26, border: `1px solid ${th.navBorder}`, borderRadius: 5, background: th.iconBg, color: th.textMuted }}
          >
            {'\u2B07'}
          </Button>
        </div>
      </div>

      {/* Sector filter panel */}
      {showSector && (
        <div
          className="flex flex-wrap gap-1.5 shrink-0"
          style={{ background: th.navBg, borderBottom: `1px solid ${th.navBorder}`, padding: '7px 14px', animation: 'fadeUp .15s ease' }}
        >
          {SECTOR_LIST.map((sec) => (
            <Badge
              key={sec}
              variant="outline"
              render={<button />}
              onClick={() => onSectorChange?.(sec)}
              className={cn(
                'cursor-pointer rounded-full transition-all text-[10.5px] px-2.5 py-0.5',
                activeSector === sec
                  ? 'bg-[var(--ds-color-blue-600)] text-[var(--ds-color-text-inverse)] border-[var(--ds-color-blue-600)] font-bold'
                  : 'hover:bg-[var(--ds-color-surface-hover)]',
              )}
              style={{
                background: activeSector === sec ? 'var(--ds-color-blue-600)' : th.iconBg,
                color: activeSector === sec ? 'var(--ds-color-text-inverse)' : th.textMuted,
                borderColor: activeSector === sec ? 'var(--ds-color-blue-600)' : th.navBorder,
                fontWeight: activeSector === sec ? 700 : 400,
                borderRadius: 16,
              }}
            >
              {sec}
            </Badge>
          ))}
        </div>
      )}

      {/* Advanced filter panel */}
      {showAdvFilter && (
        <div
          className="flex gap-3 items-end shrink-0 flex-wrap"
          style={{ background: th.navBg, borderBottom: `1px solid ${th.navBorder}`, padding: '10px 14px', animation: 'fadeUp .15s ease' }}
        >
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold uppercase" style={{ color: th.textMuted }}>% Thay đổi</label>
            <div className="flex gap-1 items-center">
              <Input
                type="number"
                placeholder="Từ"
                value={filterPctFrom || ''}
                onChange={(e) => onSetPctFrom?.(e.target.value)}
                className={inputCls}
                style={{ background: th.appBg, color: th.text, fontSize: 10, width: 60 }}
              />
              <span style={{ color: th.textMuted, padding: '4px 0' }}>{'\u2192'}</span>
              <Input
                type="number"
                placeholder="Đến"
                value={filterPctTo || ''}
                onChange={(e) => onSetPctTo?.(e.target.value)}
                className={inputCls}
                style={{ background: th.appBg, color: th.text, fontSize: 10, width: 60 }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold uppercase" style={{ color: th.textMuted }}>KLGD (triệu)</label>
            <Input
              type="number"
              placeholder="Tối thiểu"
              value={filterVolMin || ''}
              onChange={(e) => onSetVolMin?.(e.target.value)}
              className={cn(inputCls, 'w-[100px]')}
              style={{ background: th.appBg, color: th.text, fontSize: 10, width: 100 }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold uppercase" style={{ color: th.textMuted }}>Giá (từ-đến)</label>
            <div className="flex gap-1">
              <Input
                type="number"
                placeholder="Min"
                value={filterPriceMin || ''}
                onChange={(e) => onSetPriceMin?.(e.target.value)}
                className={inputCls}
                style={{ background: th.appBg, color: th.text, fontSize: 10, width: 60 }}
              />
              <Input
                type="number"
                placeholder="Max"
                value={filterPriceMax || ''}
                onChange={(e) => onSetPriceMax?.(e.target.value)}
                className={inputCls}
                style={{ background: th.appBg, color: th.text, fontSize: 10, width: 60 }}
              />
            </div>
          </div>
          <Button
            variant="outline"
            size="xs"
            onClick={onResetFilters}
            className="shrink-0 font-bold"
            style={{ color: th.textMuted, fontSize: 10 }}
          >
            Reset
          </Button>
        </div>
      )}

      {/* Trade history panel */}
      {showTradeHist && (
        <div
          className="flex flex-col gap-1.5 shrink-0 overflow-y-auto"
          style={{ background: th.navBg, borderBottom: `1px solid ${th.navBorder}`, padding: '10px 14px', animation: 'fadeUp .15s ease', maxHeight: 200 }}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] font-bold tracking-wider" style={{ color: 'var(--ds-color-blue-400)' }}>LỊCH SỬ GIAO DỊCH KHỚP LỆNH</span>
            <span className="text-[9px]" style={{ color: th.textMuted }}>Realtime</span>
          </div>
          {(tradeHistory || []).map((item, i) => (
            <div
              key={i}
              className="grid gap-2 py-1.5 px-1.5 rounded text-[9px]"
              style={{
                gridTemplateColumns: '60px 50px 60px 60px 70px',
                background: th.appBg,
                border: `1px solid ${th.cellBorder}`,
                fontFamily: "var(--ds-font-mono)",
              }}
            >
              <div className="font-bold" style={{ color: 'var(--ds-color-blue-400)' }}>{item.sym}</div>
              <div className="text-right" style={{ color: item.timeColor }}>{item.time}</div>
              <div className="text-right font-bold" style={{ color: item.priceColor }}>{item.price}</div>
              <div className="text-right" style={{ color: item.volColor }}>{item.qty}</div>
              <div className="text-center font-bold" style={{ color: item.sideColor }}>{item.side}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const FilterBar = memo(FilterBarInner)
export default FilterBar
