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
  onSearchTextChange: (text: string) => void
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
  th, filter, onFilterChange, onSearchTextChange, onSymbolAdd,
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
    'h-7 w-[60px] rounded border',
  ), [])

  return (
    <div>
      {/* Main filter bar */}
      <div
        className="flex items-center gap-1 overflow-x-auto shrink-0 bg-nav border-b border-line px-3.5 py-[5px] h-[42px]"
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
                'shrink-0 transition-all w-[26px] h-[26px] rounded-[5px] border border-line',
                viewMode === mode
                  ? 'bg-blue-600 text-txt-inverse hover:bg-blue-700 border-blue-600'
                  : 'hover:bg-row-hover',
              )}
            >
              {VIEW_ICONS[mode]}
            </Button>
          ))}
        </div>

        {/* Search */}
        <SymbolSearch th={th} value={filter.searchText} onChange={onSearchTextChange} />

        <Separator orientation="vertical" className="shrink-0 h-5 bg-line" />

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
                    'shrink-0 transition-all rounded-[6px] border',
                    isActive
                      ? 'bg-blue-600 text-txt-inverse hover:bg-blue-700 font-bold border-blue-600'
                      : 'font-medium hover:bg-row-hover border-line',
                  )}
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
              'shrink-0 transition-all w-[26px] h-[26px] rounded-[5px] border border-line',
              showAdvFilter
                ? 'bg-orange-500 text-txt-inverse hover:bg-orange-400 border-orange-500'
                : 'hover:bg-row-hover',
            )}
          >
            {'\u{1F50D}'}
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onToggleTradeHist}
            title="Lịch sử giao dịch"
            className={cn(
              'shrink-0 transition-all w-[26px] h-[26px] rounded-[5px] border border-line',
              showTradeHist
                ? 'bg-orange-500 text-txt-inverse hover:bg-orange-400 border-orange-500'
                : 'hover:bg-row-hover',
            )}
          >
            {'\u{1F4CB}'}
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onExportCSV}
            title="Xuất CSV"
            className="shrink-0 hover:bg-row-hover transition-all w-[26px] h-[26px] rounded-[5px] border border-line bg-nav text-txt-muted"
          >
            {'\u2B07'}
          </Button>
        </div>
      </div>

      {/* Sector filter panel */}
      {showSector && (
        <div
          className="flex flex-wrap gap-1.5 shrink-0 bg-nav border-b border-line px-3.5 py-[7px] animate-[fadeUp_0.15s_ease]"
        >
          {SECTOR_LIST.map((sec) => (
            <Badge
              key={sec}
              variant="outline"
              render={<button />}
              onClick={() => onSectorChange?.(sec)}
              className={cn(
                'cursor-pointer rounded-full transition-all text-[10.5px] px-2.5 py-0.5 border',
                activeSector === sec
                  ? 'bg-blue-600 text-txt-inverse border-blue-600 font-bold'
                  : 'bg-nav text-txt-muted border-line hover:bg-row-hover',
              )}
            >
              {sec}
            </Badge>
          ))}
        </div>
      )}

      {/* Advanced filter panel */}
      {showAdvFilter && (
        <div
          className="flex gap-3 items-end shrink-0 flex-wrap bg-nav border-b border-line px-3.5 py-[10px] animate-[fadeUp_0.15s_ease]"
        >
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold uppercase text-txt-muted">% Thay đổi</label>
            <div className="flex gap-1 items-center">
              <Input
                type="number"
                placeholder="Từ"
                value={filterPctFrom || ''}
                onChange={(e) => onSetPctFrom?.(e.target.value)}
                className={cn(inputCls, 'bg-app text-txt-primary text-[10px] w-[60px]')}
              />
              <span className="text-txt-muted py-1 px-0">{'\u2192'}</span>
              <Input
                type="number"
                placeholder="Đến"
                value={filterPctTo || ''}
                onChange={(e) => onSetPctTo?.(e.target.value)}
                className={cn(inputCls, 'bg-app text-txt-primary text-[10px] w-[60px]')}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold uppercase text-txt-muted">KLGD (triệu)</label>
            <Input
              type="number"
              placeholder="Tối thiểu"
              value={filterVolMin || ''}
              onChange={(e) => onSetVolMin?.(e.target.value)}
              className={cn(inputCls, 'w-[100px] bg-app text-txt-primary text-[10px]')}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold uppercase text-txt-muted">Giá (từ-đến)</label>
            <div className="flex gap-1">
              <Input
                type="number"
                placeholder="Min"
                value={filterPriceMin || ''}
                onChange={(e) => onSetPriceMin?.(e.target.value)}
                className={cn(inputCls, 'bg-app text-txt-primary text-[10px] w-[60px]')}
              />
              <Input
                type="number"
                placeholder="Max"
                value={filterPriceMax || ''}
                onChange={(e) => onSetPriceMax?.(e.target.value)}
                className={cn(inputCls, 'bg-app text-txt-primary text-[10px] w-[60px]')}
              />
            </div>
          </div>
          <Button
            variant="outline"
            size="xs"
            onClick={onResetFilters}
            className="shrink-0 font-bold text-txt-muted text-[10px]"
          >
            Reset
          </Button>
        </div>
      )}

      {/* Trade history panel */}
      {showTradeHist && (
        <div
          className="flex flex-col gap-1.5 shrink-0 overflow-y-auto bg-nav border-b border-line px-3.5 py-[10px] animate-[fadeUp_0.15s_ease] max-h-[200px]"
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] font-bold tracking-wider text-blue-400">LỊCH SỬ GIAO DỊCH KHỚP LỆNH</span>
            <span className="text-[9px] text-txt-muted">Realtime</span>
          </div>
          {(tradeHistory || []).map((item, i) => (
            <div
              key={i}
              className="grid gap-2 py-1.5 px-1.5 rounded text-[9px] bg-app border border-line"
              style={{
                gridTemplateColumns: '60px 50px 60px 60px 70px',
                fontFamily: "var(--ds-font-mono)",
              }}
            >
              <div className="font-bold text-blue-400">{item.sym}</div>
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
