import type { ThemeTokens } from '../types/priceboard'
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
  viewMode?: 'table' | 'grid' | 'heat'
  onViewModeChange?: (mode: 'table' | 'grid' | 'heat') => void
  showSector?: boolean
  onToggleSector?: () => void
  activeSector?: string
  onSectorChange?: (sector: string) => void
}

const SECTOR_LIST = ['Tất cả','VN30','Ngân hàng','BĐS','Thực phẩm','Chứng khoán','Thép','Năng lượng','Công nghệ','Dược phẩm','Bảo hiểm','Bán lẻ','Vận tải','Hóa chất','Cao su','Thủy sản','Dệt may']

export default function FilterBar({ th, filter, onFilterChange, onSymbolAdd, viewMode = 'table', onViewModeChange, showSector, onToggleSector, activeSector = 'Tất cả', onSectorChange }: Props) {
  const displayGroup = resolveTopGroup(filter.group)

  const tabStyle = (active: boolean): React.CSSProperties => ({
    background: active ? '#2563eb' : 'transparent',
    color: active ? '#fff' : th.tabFg,
    border: active ? 'none' : th.tabBorder,
    borderRadius: 5,
    padding: '3px 8px',
    fontSize: 11,
    fontWeight: active ? '700' : '400',
    cursor: 'pointer',
    flexShrink: 0,
    whiteSpace: 'nowrap',
  })

  return (
    <div>
      <div style={{ background: th.navBg, borderBottom: `1px solid ${th.navBorder}`, display: 'flex', alignItems: 'center', padding: '4px 10px', gap: 4, flexShrink: 0, height: 38, position: 'relative' }}>
      <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
        <button onClick={() => onViewModeChange?.('table')} style={{ background: viewMode === 'table' ? '#2563eb' : th.iconBg, border: `1px solid ${th.navBorder}`, width: 26, height: 26, borderRadius: 5, cursor: 'pointer', color: viewMode === 'table' ? '#fff' : th.textMuted, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{'\u2630'}</button>
        <button onClick={() => onViewModeChange?.('grid')} style={{ background: viewMode === 'grid' ? '#2563eb' : th.iconBg, border: `1px solid ${th.navBorder}`, width: 26, height: 26, borderRadius: 5, cursor: 'pointer', color: viewMode === 'grid' ? '#fff' : th.textMuted, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{'\u229E'}</button>
        <button onClick={() => onViewModeChange?.('heat')} style={{ background: viewMode === 'heat' ? '#2563eb' : th.iconBg, border: `1px solid ${th.navBorder}`, width: 26, height: 26, borderRadius: 5, cursor: 'pointer', color: viewMode === 'heat' ? '#fff' : th.textMuted, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{'\u25A6'}</button>
      </div>

      <SymbolSearch th={th} onSelect={onSymbolAdd} />

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

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
        <span onClick={onToggleSector} style={{ fontSize: 14, color: showSector ? '#3b82f6' : '#94a3b8', cursor: 'pointer' }}>▶</span>
        <span style={{ fontSize: 14, color: '#94a3b8', cursor: 'pointer' }}>⚙</span>
        <span style={{ fontSize: 14, color: '#94a3b8', cursor: 'pointer' }}>⬇</span>
      </div>
    </div>
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
              background: activeSector === sec ? '#2563eb' : th.iconBg,
              color: activeSector === sec ? '#fff' : th.textMuted,
              border: `1px solid ${activeSector === sec ? '#2563eb' : th.navBorder}`,
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
    </div>
  )
}
