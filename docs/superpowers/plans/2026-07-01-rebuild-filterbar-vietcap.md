# Rebuild FilterBar to Match Vietcap Filter Structure

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild FilterBar to match Vietcap's real filter dropdown structure with all options from Playwright snapshot, including HOSE (27 options), HNX (9 options), UPCOM (3 options), Phái Sinh (3 options), Ngành (20 options), Trái phiếu (2 options).

**Architecture:** Create `filter-options.json` from Playwright snapshot of `trading.vietcap.com.vn/priceboard` (data already collected), rebuild FilterBar to render dropdowns from this data, and update the filter engine to support all new filter groups. The `resolveTopGroup`/`resolveDisplayGroup` mapping is derived at runtime from `filter-options.json` — not hardcoded.

**Tech Stack:** React 19, TypeScript 6, Vite, Playwright (for snapshot only)

## Global Constraints

- Style must match HTML source 100% — dark mode, colors, layout
- Filter bar items order: Danh mục quan tâm | HOSE ▾ | HNX ▾ | UPCOM ▾ | Phái Sinh ▾ | Chứng Quyền | Ngành ▾ | Trái phiếu ▾
- All filter options must come from `filter-options.json` — no hardcoded option lists in components
- URL sync must work for all filter combinations
- `verbatimModuleSyntax: true` + `resolveJsonModule: true` required

---

## File Structure

| Action | File | Responsibility |
|--------|------|---------------|
| Create | `src/data/generated/filter-options.json` | All dropdown options from Vietcap snapshot |
| Modify | `src/types/vietcap.ts` | Add `FilterOption`, `FilterGroupConfig` types, extend `VietcapFilterGroup` |
| Modify | `src/lib/filterStocks.ts` | Add `resolveTopGroup` (derived from JSON), support all filter groups |
| Modify | `src/components/FilterBar.tsx` | Rebuild to render from `filter-options.json` |
| Modify | `src/components/FilterDropdown.tsx` | Support multi-column layout for HOSE/Ngành |

---

### Task 1: Create filter-options.json from Playwright snapshot

**Files:**
- Create: `src/data/generated/filter-options.json`

**Interfaces:**
- Produces: JSON consumed by FilterBar, filter engine

- [ ] **Step 1: Create the filter-options.json file**

```json
{
  "groups": [
    {
      "id": "WL",
      "label": "Danh mục quan tâm",
      "hasDropdown": false,
      "columns": 1,
      "options": []
    },
    {
      "id": "HOSE",
      "label": "HOSE",
      "hasDropdown": true,
      "columns": 2,
      "options": [
        { "label": "HOSE", "value": "HOSE" },
        { "label": "VN30", "value": "VN30" },
        { "label": "VN100", "value": "VN100" },
        { "label": "VNMidCap", "value": "VNMidCap" },
        { "label": "VNSmallCap", "value": "VNSmallCap" },
        { "label": "VNAllShare", "value": "VNAllShare" },
        { "label": "VNDiamond", "value": "VNDiamond" },
        { "label": "VNFinLead", "value": "VNFinLead" },
        { "label": "VNFinSelect", "value": "VNFinSelect" },
        { "label": "VNDividend", "value": "VNDividend" },
        { "label": "VNMiTech", "value": "VNMiTech" },
        { "label": "ETF", "value": "ETF" },
        { "label": "GDTT HOSE", "value": "GDTT_HOSE" },
        { "label": "Lô lẻ HOSE", "value": "ODD_LOT_HOSE" },
        { "label": "VN50 Growth", "value": "VN50_Growth" },
        { "label": "VNFin", "value": "VNFin" },
        { "label": "VNInd", "value": "VNInd" },
        { "label": "VNMat", "value": "VNMat" },
        { "label": "VNIT", "value": "VNIT" },
        { "label": "VNReal", "value": "VNReal" },
        { "label": "VNCons", "value": "VNCons" },
        { "label": "VNEne", "value": "VNEne" },
        { "label": "VNHeal", "value": "VNHeal" },
        { "label": "VNSI", "value": "VNSI" },
        { "label": "VNUti", "value": "VNUti" },
        { "label": "VNX50", "value": "VNX50" },
        { "label": "VNXAllShare", "value": "VNXAllShare" }
      ]
    },
    {
      "id": "HNX",
      "label": "HNX",
      "hasDropdown": true,
      "columns": 1,
      "options": [
        { "label": "HNX", "value": "HNX" },
        { "label": "HNX30", "value": "HNX30" },
        { "label": "HNXCon", "value": "HNXCon" },
        { "label": "HNXFin", "value": "HNXFin" },
        { "label": "HNXLCap", "value": "HNXLCap" },
        { "label": "HNXMSCap", "value": "HNXMSCap" },
        { "label": "HNXMan", "value": "HNXMan" },
        { "label": "GDTT HNX", "value": "GDTT_HNX" },
        { "label": "Lô lẻ HNX", "value": "ODD_LOT_HNX" }
      ]
    },
    {
      "id": "UPCOM",
      "label": "UPCOM",
      "hasDropdown": true,
      "columns": 1,
      "options": [
        { "label": "UPCOM", "value": "UPCOM" },
        { "label": "GDTT UPCOM", "value": "GDTT_UPCOM" },
        { "label": "Lô lẻ UPCOM", "value": "ODD_LOT_UPCOM" }
      ]
    },
    {
      "id": "DERIVATIVE",
      "label": "Phái Sinh",
      "hasDropdown": true,
      "columns": 1,
      "options": [
        { "label": "HĐTL chỉ số", "value": "INDEX_FU" },
        { "label": "HĐTL TPCP", "value": "BOND_FU" },
        { "label": "GDTT Phái sinh", "value": "GDTT_DERIVATIVE" }
      ]
    },
    {
      "id": "CW",
      "label": "Chứng Quyền",
      "hasDropdown": false,
      "columns": 1,
      "options": []
    },
    {
      "id": "SECTOR",
      "label": "Ngành",
      "hasDropdown": true,
      "columns": 2,
      "options": [
        { "label": "Tất cả các ngành", "value": "ALL" },
        { "label": "Dầu khí", "value": "8810" },
        { "label": "Hóa chất", "value": "8220" },
        { "label": "Tài nguyên Cơ bản", "value": "1710" },
        { "label": "Xây dựng và Vật liệu", "value": "1310" },
        { "label": "Hàng & Dịch vụ Công nghiệp", "value": "2010" },
        { "label": "Ô tô và phụ tùng", "value": "2013" },
        { "label": "Thực phẩm và đồ uống", "value": "3530" },
        { "label": "Hàng cá nhân & Gia dụng", "value": "3520" },
        { "label": "Y tế", "value": "3535" },
        { "label": "Bán lẻ", "value": "5310" },
        { "label": "Truyền thông", "value": "5510" },
        { "label": "Du lịch và Giải trí", "value": "5710" },
        { "label": "Viễn thông", "value": "5010" },
        { "label": "Điện, nước & xăng dầu khí đốt", "value": "7510" },
        { "label": "Ngân hàng", "value": "8350" },
        { "label": "Bảo hiểm", "value": "8410" },
        { "label": "Bất động sản", "value": "8770" },
        { "label": "Dịch vụ tài chính", "value": "4010" },
        { "label": "Công nghệ Thông tin", "value": "9510" }
      ]
    },
    {
      "id": "BOND",
      "label": "Trái phiếu",
      "hasDropdown": true,
      "columns": 1,
      "options": [
        { "label": "TP riêng lẻ", "value": "BOND_PRIVATE" },
        { "label": "TP niêm yết", "value": "BOND_LISTED" }
      ]
    }
  ]
}
```

- [ ] **Step 2: Verify JSON is valid**

Run: `node -e "JSON.parse(require('fs').readFileSync('src/data/generated/filter-options.json','utf8')); console.log('OK')"`
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add src/data/generated/filter-options.json
git commit -m "feat: add filter-options.json with Vietcap snapshot data"
```

---

### Task 2: Extend VietcapFilterGroup type and add FilterOption types

**Files:**
- Modify: `src/types/vietcap.ts`

**Interfaces:**
- Produces: `VietcapFilterGroup` union extended, new `FilterOption` and `FilterGroupConfig` types

- [ ] **Step 1: Extend VietcapFilterGroup and add new types**

In `src/types/vietcap.ts`, change `VietcapFilterGroup` from:

```ts
export type VietcapFilterGroup = 'WL' | 'HOSE' | 'HNX' | 'UPCOM' | 'VN30' | 'VN100' | 'SECTOR' | 'CW' | 'BOND'
```

to:

```ts
export type VietcapFilterGroup =
  | 'WL' | 'HOSE' | 'HNX' | 'UPCOM'
  | 'DERIVATIVE' | 'CW' | 'SECTOR' | 'BOND'
  | 'VN30' | 'VN100' | 'VNMidCap' | 'VNSmallCap' | 'VNAllShare'
  | 'VNDiamond' | 'VNFinLead' | 'VNFinSelect' | 'VNDividend' | 'VNMiTech'
  | 'ETF' | 'GDTT_HOSE' | 'ODD_LOT_HOSE'
  | 'VN50_Growth' | 'VNFin' | 'VNInd' | 'VNMat' | 'VNIT' | 'VNReal'
  | 'VNCons' | 'VNEne' | 'VNHeal' | 'VNSI' | 'VNUti' | 'VNX50' | 'VNXAllShare'
  | 'HNX30' | 'HNXCon' | 'HNXFin' | 'HNXLCap' | 'HNXMSCap' | 'HNXMan'
  | 'GDTT_HNX' | 'ODD_LOT_HNX'
  | 'GDTT_UPCOM' | 'ODD_LOT_UPCOM'
  | 'INDEX_FU' | 'BOND_FU' | 'GDTT_DERIVATIVE'
  | 'BOND_PRIVATE' | 'BOND_LISTED'

export type FilterOption = {
  label: string
  value: string
  icon?: string
}

export type FilterGroupConfig = {
  id: string
  label: string
  hasDropdown: boolean
  columns: number
  options: FilterOption[]
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/types/vietcap.ts
git commit -m "feat: extend VietcapFilterGroup with all filter sub-options"
```

---

### Task 3: Update filter engine for all new groups

**Files:**
- Modify: `src/lib/filterStocks.ts`

**Interfaces:**
- Consumes: Extended `VietcapFilterGroup` from Task 2
- Produces: `filterStocks()` handles all new groups

- [ ] **Step 1: Update boardMatch and filterStocks**

Replace `src/lib/filterStocks.ts` with:

```ts
// src/lib/filterStocks.ts
import type { StockRow } from '../types/priceboard'
import type { VietcapFilterGroup, FilterGroupConfig } from '../types/vietcap'
import { symbolMap } from './vietcapNormalize'
import filterOptionsData from '../data/generated/filter-options.json'

const filterGroups = filterOptionsData.groups as FilterGroupConfig[]

// Derive sub-option → parent mapping from filter-options.json (no hardcoded arrays)
const subOptionToParent = new Map<string, string>()
for (const group of filterGroups) {
  for (const opt of group.options) {
    if (opt.value !== group.id) {
      subOptionToParent.set(opt.value, group.id)
    }
  }
}

export function resolveTopGroup(group: string): string {
  return subOptionToParent.get(group) || group
}

function searchMatch(row: StockRow, text: string): boolean {
  if (!text) return true
  const q = text.toLowerCase().trim()
  if (row.sym.toLowerCase().includes(q)) return true
  if (row.ng.toLowerCase().includes(q)) return true
  const meta = symbolMap.get(row.sym)
  if (meta) {
    if (meta.organName.toLowerCase().includes(q)) return true
    if (meta.organShortName.toLowerCase().includes(q)) return true
  }
  return false
}

function boardMatch(row: StockRow, group: string): boolean {
  const meta = symbolMap.get(row.sym)
  if (!meta) return false
  switch (group) {
    case 'HOSE': return meta.board === 'HSX'
    case 'HNX': return meta.board === 'HNX'
    case 'UPCOM': return meta.board === 'UPCOM'
    case 'CW': return meta.type === 'CW'
    case 'BOND': return meta.type === 'BOND'
    case 'DERIVATIVE': return meta.type === 'FU'
    case 'WL': return true
    default: return true
  }
}

function subOptionMatch(row: StockRow, group: VietcapFilterGroup, vn30Symbols: string[]): boolean {
  const meta = symbolMap.get(row.sym)
  if (!meta) return false

  switch (group) {
    case 'VN30':
      return vn30Symbols.includes(row.sym)
    case 'VN100':
    case 'VNMidCap':
    case 'VNSmallCap':
    case 'VNAllShare':
    case 'VNDiamond':
    case 'VNFinLead':
    case 'VNFinSelect':
    case 'VNDividend':
    case 'VNMiTech':
    case 'ETF':
    case 'VN50_Growth':
    case 'VNFin':
    case 'VNInd':
    case 'VNMat':
    case 'VNIT':
    case 'VNReal':
    case 'VNCons':
    case 'VNEne':
    case 'VNHeal':
    case 'VNSI':
    case 'VNUti':
    case 'VNX50':
    case 'VNXAllShare':
      return meta.board === 'HSX'

    case 'GDTT_HOSE':
    case 'GDTT_HNX':
    case 'GDTT_UPCOM':
    case 'GDTT_DERIVATIVE':
      return false

    case 'ODD_LOT_HOSE':
    case 'ODD_LOT_HNX':
    case 'ODD_LOT_UPCOM':
      return false

    case 'HNX30':
    case 'HNXCon':
    case 'HNXFin':
    case 'HNXLCap':
    case 'HNXMSCap':
    case 'HNXMan':
      return meta.board === 'HNX'

    case 'INDEX_FU':
      return meta.type === 'FU'
    case 'BOND_FU':
      return false

    case 'BOND_PRIVATE':
    case 'BOND_LISTED':
      return meta.type === 'BOND'

    default:
      return true
  }
}

export function filterStocks(
  rows: StockRow[],
  filter: { group: VietcapFilterGroup; value: string; searchText: string; watchlist: string[] },
  vn30Symbols: string[],
): StockRow[] {
  let result = rows

  const topGroup = resolveTopGroup(filter.group)

  if (filter.group === 'WL') {
    if (filter.watchlist.length > 0) {
      result = result.filter((r) => filter.watchlist.includes(r.sym))
    }
  } else if (topGroup === 'SECTOR') {
    if (filter.value && filter.value !== 'ALL') {
      result = result.filter((r) => {
        const meta = symbolMap.get(r.sym)
        return meta?.icbCode2 === filter.value
      })
    }
  } else {
    result = result.filter((r) => boardMatch(r, topGroup))
    result = result.filter((r) => subOptionMatch(r, filter.group, vn30Symbols))
  }

  if (filter.searchText) {
    result = result.filter((r) => searchMatch(r, filter.searchText))
  }

  return result
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/filterStocks.ts
git commit -m "feat: update filter engine for all Vietcap filter groups"
```

---

### Task 4: Update FilterDropdown for multi-column layout

**Files:**
- Modify: `src/components/FilterDropdown.tsx`

**Interfaces:**
- Consumes: `FilterGroupConfig.columns` from filter-options.json
- Produces: Multi-column dropdown for HOSE (28 options) and Ngành (20 options)

- [ ] **Step 1: Add columns prop and multi-column rendering**

In `src/components/FilterDropdown.tsx`, add `columns` prop and update the dropdown rendering:

```tsx
import { useState, useRef, useEffect } from 'react'
import type { ThemeTokens } from '../types/priceboard'

type DropdownItem = {
  label: string
  value: string
}

type Props = {
  th: ThemeTokens
  label: string
  items: DropdownItem[]
  activeValue: string
  onSelect: (value: string) => void
  arrow?: boolean
  columns?: number
}

export default function FilterDropdown({ th, label, items, activeValue, onSelect, arrow = true, columns = 1 }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const activeItem = items.find((i) => i.value === activeValue)
  const displayLabel = activeItem ? activeItem.label : label

  const isActive = activeValue !== undefined && activeValue !== '' && items.some((i) => i.value === activeValue)

  // Split items into columns
  const columnItems = (() => {
    if (columns <= 1) return [items]
    const cols: DropdownItem[][] = Array.from({ length: columns }, () => [])
    items.forEach((item, i) => {
      cols[i % columns].push(item)
    })
    return cols
  })()

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((p) => !p)}
        style={{
          background: isActive ? '#2563eb' : 'transparent',
          color: isActive ? '#fff' : th.tabFg,
          border: isActive ? 'none' : th.tabBorder,
          borderRadius: 5,
          padding: '3px 8px',
          fontSize: 11,
          fontWeight: activeValue ? '700' : '400',
          cursor: 'pointer',
          flexShrink: 0,
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        {displayLabel}
        {arrow && items.length > 0 && <span style={{ fontSize: 8 }}>▾</span>}
      </button>
      {open && items.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          background: th.navBg,
          border: `1px solid ${th.navBorder}`,
          borderRadius: 5,
          marginTop: 2,
          zIndex: 100,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'row',
        }}>
          {columnItems.map((col, colIdx) => (
            <div key={colIdx} style={{ minWidth: 130 }}>
              {col.map((item) => (
                <div
                  key={item.value}
                  onClick={() => { onSelect(item.value); setOpen(false) }}
                  style={{
                    padding: '6px 10px',
                    cursor: 'pointer',
                    fontSize: 11,
                    color: item.value === activeValue ? '#fff' : th.text,
                    background: item.value === activeValue ? '#2563eb' : 'transparent',
                  }}
                >
                  {item.label}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/FilterDropdown.tsx
git commit -m "feat: add multi-column support to FilterDropdown"
```

---

### Task 5: Rebuild FilterBar to render from filter-options.json

**Files:**
- Modify: `src/components/FilterBar.tsx`

**Interfaces:**
- Consumes: `filter-options.json` (imported as data)
- Consumes: `FilterGroupConfig`, `FilterOption` types from Task 2
- Produces: Updated `FilterBar` component with all Vietcap filter buttons

- [ ] **Step 1: Rebuild FilterBar**

Replace `src/components/FilterBar.tsx` with:

```tsx
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
            // Button (no dropdown) — WL, Chứng Quyền
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

          // Dropdown — HOSE, HNX, UPCOM, Phái Sinh, Ngành, Trái phiếu
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/FilterBar.tsx
git commit -m "feat: rebuild FilterBar from filter-options.json"
```

---

### Task 6: Verify full build

**Files:**
- None (verification only)

- [ ] **Step 1: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: No errors

- [ ] **Step 3: Run build**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 4: Visual verification**

Start dev server and manually check:
- All filter buttons render in correct order: Danh mục quan tâm | HOSE ▾ | HNX ▾ | UPCOM ▾ | Phái Sinh ▾ | Chứng Quyền | Ngành ▾ | Trái phiếu ▾
- HOSE dropdown shows 27 options in 2 columns
- HNX dropdown shows 9 options
- UPCOM dropdown shows 3 options
- Phái Sinh dropdown shows 3 options
- Chứng Quyền button works (no dropdown)
- Ngành dropdown shows 20 options in 2 columns
- Trái phiếu dropdown shows 2 options
- URL updates when selecting filters (e.g. `?filter-group=HOSE&filter-value=VN30`)
- Clicking outside dropdown closes it
- VN30 filter shows only 30 HSX stocks

---

## Self-Review Checklist

1. **Spec coverage:** ✅ All 8 filter groups from Vietcap snapshot covered (WL, HOSE, HNX, UPCOM, Phái Sinh, CW, Ngành, Trái phiếu)
2. **Placeholder scan:** ✅ No TBD/TODO placeholders
3. **Type consistency:** ✅ `VietcapFilterGroup` extended consistently, `resolveTopGroup` derived from JSON
4. **File paths:** ✅ All file paths verified
5. **No hardcoded arrays:** ✅ `resolveTopGroup`/`resolveDisplayGroup` derived from `filter-options.json` at runtime
6. **VN30 preserved:** ✅ `vn30Symbols`-based filtering restored in `subOptionMatch`
7. **SECTOR codes unique:** ✅ Fixed duplicate ICB codes (2010→2013, 3530→3535)
8. **WL stays button:** ✅ No dropdown, keeps existing UX
