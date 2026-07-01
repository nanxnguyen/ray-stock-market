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
}

export default function FilterBar({ th, filter, onFilterChange, onSymbolAdd }: Props) {
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
    <div style={{ background: th.navBg, borderBottom: `1px solid ${th.navBorder}`, display: 'flex', alignItems: 'center', padding: '4px 10px', gap: 4, flexShrink: 0, height: 38, position: 'relative' }}>
      <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
        <button style={{ background: th.iconBg, border: 'none', width: 24, height: 24, borderRadius: 4, cursor: 'pointer', color: th.iconColor, fontSize: 12 }}>☰</button>
        <button style={{ background: th.iconBg, border: 'none', width: 24, height: 24, borderRadius: 4, cursor: 'pointer', color: th.iconColor, fontSize: 12 }}>⊞</button>
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
        <span style={{ fontSize: 14, color: '#94a3b8', cursor: 'pointer' }}>▶</span>
        <span style={{ fontSize: 14, color: '#94a3b8', cursor: 'pointer' }}>⚙</span>
        <span style={{ fontSize: 14, color: '#94a3b8', cursor: 'pointer' }}>⬇</span>
      </div>
    </div>
  )
}
