# Vietcap Data Migration + Filter/Search Rebuild

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace hardcoded mock data with real Vietcap API data and rebuild filter/search to match `trading.vietcap.com.vn/priceboard` UX.

**Architecture:** Offline sync script fetches Vietcap API data → generates static JSON files → React app imports normalized data → FilterBar rebuilt with Vietnamese search, dropdowns, URL query sync.

**Tech Stack:** React 19, TypeScript 6, Vite 8, Node.js (sync script), `fetch` API (no extra deps)

## Global Constraints

- Style must match HTML source 100% — pixel-perfect dark mode
- Logo: "Raycap" (not Vietcap)
- No shadcn-ui, no AG Grid — native HTML table
- No test runner configured — skip unit tests, verify via lint + build + manual
- `CLAUDE.md`: type safety, easy maintenance, easy extension
- CORS: `priceboard/tickers/price` only allows `*.vietcap.com.vn` — use static sync, not browser fetch

---

## File Structure

| File | Responsibility |
|---|---|
| `scripts/sync-vietcap-data.mjs` | Fetch Vietcap API → write JSON to `src/data/generated/` |
| `src/data/generated/manifest.json` | Metadata: sync timestamp, version |
| `src/data/generated/symbols.json` | All 3466 symbols with board/sector/type |
| `src/data/generated/prices.json` | Price data for all symbols |
| `src/data/generated/index-config.json` | Index configurations (HOSE/HNX/UPCOM/VN30/VN100) |
| `src/data/generated/sectors.json` | ICB sector codes |
| `src/data/generated/bonds.json` | Bond symbols |
| `src/types/vietcap.ts` | TypeScript types for raw Vietcap API responses |
| `src/lib/vietcapNormalize.ts` | Normalize raw API data → app StockState format |
| `src/lib/filterStocks.ts` | Filter engine: search, board, sector, watchlist |
| `src/components/SymbolSearch.tsx` | Autocomplete search input (Vietcap UX) |
| `src/components/FilterDropdown.tsx` | Reusable dropdown with outside-click close |
| `src/components/FilterBar.tsx` | **Modify** — rebuild with mode icons, search, dropdowns |
| `src/data/mockMarket.ts` | **Modify** — replace hardcode with generated data import |
| `src/App.tsx` | **Modify** — add URL sync, wire new filter state |
| `src/types/priceboard.ts` | **Modify** — add VietcapFilterState type |
| `package.json` | **Modify** — add `sync:vietcap-data` script |

---

### Task 1: Sync Script + Generated Data

**Files:**
- Create: `scripts/sync-vietcap-data.mjs`
- Create: `src/data/generated/` (directory)

**Interfaces:**
- Produces: `symbols.json`, `prices.json`, `index-config.json`, `sectors.json`, `bonds.json`, `manifest.json`

- [ ] **Step 1: Create sync script**

```javascript
#!/usr/bin/env node
// scripts/sync-vietcap-data.mjs
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'src', 'data', 'generated')

const API_BASE = 'https://trading-api.vietcap.com.vn'

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' },
    ...options,
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return res.json()
}

async function syncSymbols() {
  console.log('Fetching symbols...')
  const data = await fetchJSON(`${API_BASE}/api/price/symbols/getAll`)
  writeFileSync(join(OUT, 'symbols.json'), JSON.stringify(data, null, 2))
  console.log(`  → ${Array.isArray(data) ? data.length : '?'} symbols`)
  return data
}

async function syncPrices(symbols) {
  console.log('Fetching prices...')
  const symbolsToFetch = symbols
    .filter(s => s.type === 'STOCK' || s.type === 'ETF')
    .map(s => s.symbol)
  
  // Batch in chunks of 100
  const chunks = []
  for (let i = 0; i < symbolsToFetch.length; i += 100) {
    chunks.push(symbolsToFetch.slice(i, i + 100))
  }
  
  const allPrices = {}
  for (const chunk of chunks) {
    const data = await fetchJSON(`${API_BASE}/api/price/v1/w/priceboard/tickers/price`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbols: chunk }),
    })
    if (data && typeof data === 'object') {
      Object.assign(allPrices, data)
    }
  }
  writeFileSync(join(OUT, 'prices.json'), JSON.stringify(allPrices, null, 2))
  console.log(`  → ${Object.keys(allPrices).length} prices`)
  return allPrices
}

async function syncIndexConfig() {
  console.log('Fetching index config...')
  const data = await fetchJSON(`${API_BASE}/api/market-data-service/v1/index-configuration/config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  })
  writeFileSync(join(OUT, 'index-config.json'), JSON.stringify(data, null, 2))
  console.log(`  → ${Array.isArray(data) ? data.length : '?'} index configs`)
  return data
}

async function syncSectors() {
  console.log('Fetching sectors...')
  const data = await fetchJSON(`${API_BASE}/api/iq-insight-service/v1/sectors/icb-codes`)
  writeFileSync(join(OUT, 'sectors.json'), JSON.stringify(data, null, 2))
  console.log(`  → ${Array.isArray(data) ? data.length : '?'} sectors`)
  return data
}

async function syncBonds() {
  console.log('Fetching bonds...')
  const data = await fetchJSON(`${API_BASE}/api/hnx-bond-api-service/v1/symbols`)
  writeFileSync(join(OUT, 'bonds.json'), JSON.stringify(data, null, 2))
  console.log(`  → ${Array.isArray(data) ? data.length : '?'} bonds`)
  return data
}

async function main() {
  mkdirSync(OUT, { recursive: true })
  
  const [symbols, indexConfig, sectors, bonds] = await Promise.all([
    syncSymbols(),
    syncIndexConfig(),
    syncSectors(),
    syncBonds(),
  ])
  
  const prices = await syncPrices(symbols)
  
  const manifest = {
    syncedAt: new Date().toISOString(),
    version: '1.0.0',
    counts: {
      symbols: Array.isArray(symbols) ? symbols.length : 0,
      prices: Object.keys(prices).length,
      indexConfig: Array.isArray(indexConfig) ? indexConfig.length : 0,
      sectors: Array.isArray(sectors) ? sectors.length : 0,
      bonds: Array.isArray(bonds) ? bonds.length : 0,
    },
  }
  writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2))
  
  console.log('\n✅ Sync complete!')
  console.log(`   Symbols: ${manifest.counts.symbols}`)
  console.log(`   Prices: ${manifest.counts.prices}`)
  console.log(`   Index configs: ${manifest.counts.indexConfig}`)
  console.log(`   Sectors: ${manifest.counts.sectors}`)
  console.log(`   Bonds: ${manifest.counts.bonds}`)
}

main().catch(err => {
  console.error('❌ Sync failed:', err.message)
  process.exit(1)
})
```

- [ ] **Step 2: Run sync script**

Run: `node scripts/sync-vietcap-data.mjs`
Expected: Output shows counts for each endpoint, `src/data/generated/` contains 6 JSON files

- [ ] **Step 3: Verify generated files exist**

Run: `ls -la src/data/generated/`
Expected: `manifest.json`, `symbols.json`, `prices.json`, `index-config.json`, `sectors.json`, `bonds.json`

---

### Task 2: Vietcap Types + Normalize Layer

**Files:**
- Create: `src/types/vietcap.ts`
- Create: `src/lib/vietcapNormalize.ts`

**Interfaces:**
- Consumes: `symbols.json`, `prices.json`, `index-config.json`, `sectors.json` from Task 1
- Produces: `VietcapSymbol`, `VietcapPrice`, `VietcapIndexConfig`, `VietcapSector` types; `normalizeSymbols()`, `normalizePrices()`, `normalizeIndexConfig()`, `normalizeSectors()` functions

- [ ] **Step 1: Create Vietcap types**

```typescript
// src/types/vietcap.ts

export type VietcapSymbol = {
  id: number
  sid: string
  symbol: string
  type: 'STOCK' | 'CW' | 'BOND' | 'FU' | 'ETF'
  board: 'HSX' | 'HNX' | 'UPCOM' | 'BOND' | 'DELISTED'
  organName: string
  organShortName: string
  icbCode2: string
  productGrpID: number
}

export type VietcapPrice = {
  co: string        // ceiling
  s: string         // status
  cei: string       // ?
  flo: string       // floor
  ref: string       // reference
  c: string         // last price
  vo: string        // volume
  va: string        // value
  bp1: string       // bid price 1
  bv1: string       // bid vol 1
  bp2: string       // bid price 2
  bv2: string       // bid vol 2
  bp3: string       // bid price 3
  bv3: string       // bid vol 3
  ap1: string       // ask price 1
  av1: string       // ask vol 1
  ap2: string       // ask price 2
  av2: string       // ask vol 2
  ap3: string       // ask price 3
  av3: string       // ask vol 3
  frbv: string      // foreign buy vol
  frsv: string      // foreign sell vol
  orgn: string      // org name
  enorgn: string    // english org name
  bo: string        // buy orders
  bc: string        // buy count
  ac: string        // ask count
  st: string        // status code
  lsh: string       // lot size
}

export type VietcapIndexConfig = {
  boardPriority: number
  columnNumber: number
  enBoardName: string
  enIndexName: string
  group: string
  indexMapping: string
  isOddLot: boolean
  isPutThrough: boolean
  platform: string
  type: string
  viBoardName: string
  viIndexName: string
}

export type VietcapSector = {
  icbCode: string
  icbName: string
  icbNameEn: string
  level: number
  parentIcbCode: string
}

export type VietcapFilterGroup = 'WL' | 'HOSE' | 'HNX' | 'UPCOM' | 'VN30' | 'VN100' | 'SECTOR' | 'CW' | 'BOND'

export type VietcapFilterState = {
  group: VietcapFilterGroup
  value: string
  searchText: string
  watchlist: string[]
}
```

- [ ] **Step 2: Create normalize layer**

```typescript
// src/lib/vietcapNormalize.ts
import type { RawStock, MarketIndexState } from '../types/priceboard'
import type { VietcapSymbol, VietcapPrice, VietcapIndexConfig, VietcapSector } from '../types/vietcap'

export function normalizeSymbols(raw: VietcapSymbol[]): Map<string, VietcapSymbol> {
  const map = new Map<string, VietcapSymbol>()
  for (const s of raw) {
    map.set(s.symbol, s)
  }
  return map
}

// Singleton symbolMap — imported by filterStocks.ts and SymbolSearch.tsx
import symbolsData from '../data/generated/symbols.json'
export const symbolMap: Map<string, VietcapSymbol> = normalizeSymbols(symbolsData as any)

export function getBoardName(board: string): string {
  switch (board) {
    case 'HSX': return 'HOSE'
    case 'HNX': return 'HNX'
    case 'UPCOM': return 'UPCOM'
    case 'BOND': return 'Trái phiếu'
    default: return board
  }
}

export function getTypeName(type: string): string {
  switch (type) {
    case 'STOCK': return 'Cổ phiếu'
    case 'CW': return 'Chứng quyền'
    case 'BOND': return 'Trái phiếu'
    case 'FU': return 'Phái sinh'
    case 'ETF': return 'Quỹ ETF'
    default: return type
  }
}

export function normalizePrice(
  symbol: string,
  price: VietcapPrice,
  symbolMeta?: VietcapSymbol,
): RawStock | null {
  const ref = parseFloat(price.ref)
  const lp = parseFloat(price.c)
  const cl = parseFloat(price.co)
  const fl = parseFloat(price.flo)
  
  if (isNaN(ref) || ref === 0) return null
  
  const pct = ref > 0 ? +((lp - ref) / ref * 100).toFixed(1) : 0
  
  return {
    s: symbol,
    ng: symbolMeta?.organShortName || symbolMeta?.organName || symbolMeta?.icbCode2 || '',
    cl,
    r: ref,
    fl,
    lp,
    lq: parseInt(price.vo) || 0,
    pct,
    tv: parseFloat(price.va) || 0,
    hi: lp,
    lo: lp,
    fb: parseInt(price.frbv) || 0,
    fs: parseInt(price.frsv) || 0,
    rm: 0,
  }
}

export function normalizeStocks(
  priceData: Record<string, VietcapPrice>,
  symbolMap: Map<string, VietcapSymbol>,
): RawStock[] {
  const stocks: RawStock[] = []
  for (const [symbol, price] of Object.entries(priceData)) {
    const meta = symbolMap.get(symbol)
    const raw = normalizePrice(symbol, price, meta)
    if (raw) stocks.push(raw)
  }
  return stocks.sort((a, b) => a.s.localeCompare(b.s))
}

export function normalizeIndices(
  indexConfig: VietcapIndexConfig[],
): { name: string; board: string; viIndexName: string }[] {
  return indexConfig.map((cfg) => ({
    name: cfg.enIndexName,
    board: cfg.enBoardName,
    viIndexName: cfg.viIndexName,
  }))
}

export function getVN30Symbols(symbols: VietcapSymbol[]): string[] {
  return symbols
    .filter((s) => s.type === 'STOCK' && s.board === 'HSX')
    .map((s) => s.symbol)
    .slice(0, 30) // fallback if no VN30 config available
}

export function getSectorMap(sectors: VietcapSector[]): Map<string, string> {
  const map = new Map<string, string>()
  for (const sec of sectors) {
    map.set(sec.icbCode, sec.icbName)
  }
  return map
}
```

- [ ] **Step 3: Verify types compile**

Run: `npx tsc --noEmit`
Expected: No errors

---

### Task 3: Replace Mock Data with Generated Data

**Files:**
- Modify: `src/data/mockMarket.ts`
- Modify: `tsconfig.app.json` — add `resolveJsonModule: true`

**Interfaces:**
- Consumes: `normalizeStocks()`, `normalizeSymbols()` from Task 2
- Produces: `RAW_STOCKS` (now sourced from generated JSON), `VN30_SYMBOLS`, `createInitialIndices()`

- [ ] **Step 1: Add resolveJsonModule to tsconfig**

Add to `tsconfig.app.json` compilerOptions:
```json
"resolveJsonModule": true
```

Note: `verbatimModuleSyntax: true` is already set. JSON default imports (`import data from './file.json'`) work with Vite's bundler mode + `resolveJsonModule: true`. If tsc complains, use `// @ts-ignore` or switch to `import data = require(...)` syntax. Test in Step 3.

- [ ] **Step 2: Update mockMarket.ts to import generated data**

```typescript
// src/data/mockMarket.ts
import type { RawStock, MarketIndexState } from '../types/priceboard'
import symbolsData from './generated/symbols.json'
import pricesData from './generated/prices.json'
import { normalizeSymbols, normalizeStocks, getVN30Symbols } from '../lib/vietcapNormalize'

const symbolMap = normalizeSymbols(symbolsData as any)

export const RAW_STOCKS: RawStock[] = normalizeStocks(
  pricesData as Record<string, any>,
  symbolMap,
)

export const VN30_SYMBOLS: string[] = getVN30Symbols(symbolsData as any)

export function createInitialIndices(): MarketIndexState[] {
  const rw = (n: number, a: number, b: number): number[] => {
    const pts = [a]
    for (let i = 1; i < n - 1; i++) {
      const l = pts[pts.length - 1]
      pts.push(+(l + (b - l) / (n - i) * 0.5 + (Math.random() - 0.5) * Math.abs(b - a) * 0.4).toFixed(2))
    }
    pts.push(b)
    return pts
  }
  return [
    {n:'VN-Index',   v:1860.01, ch:5.04,  pct:0.27,  vol:'692,765,051', up:146, dn:74,  nc:148, h:rw(40,1855,1865)},
    {n:'VN30-Index', v:1995.71, ch:5.06,  pct:0.25,  vol:'312,451,165', up:14,  dn:2,   nc:14,  h:rw(40,1990,2000)},
    {n:'HNX-Index',  v:313.16,  ch:-8.58, pct:-0.43, vol:'41,602,865',  up:61,  dn:68,  nc:63,  h:rw(40,315,310)},
    {n:'HNX30',      v:513.44,  ch:0.14,  pct:0.03,  vol:'26,266,277',  up:15,  dn:6,   nc:9,   h:rw(40,512,514)},
    {n:'UPCOM',      v:129.94,  ch:0.62,  pct:0.48,  vol:'21,599,770',  up:121, dn:90,  nc:81,  h:rw(40,129,130.5)},
  ]
}
```

- [ ] **Step 3: Verify build compiles**

Run: `npm run build`
Expected: Build succeeds, no JSON import errors

---

### Task 4: Filter Engine

**Files:**
- Create: `src/lib/filterStocks.ts`

**Interfaces:**
- Consumes: `StockRow[]`, `VietcapFilterState`
- Produces: `filterStocks()` function

- [ ] **Step 1: Create filter engine**

```typescript
// src/lib/filterStocks.ts
import type { StockRow } from '../types/priceboard'
import type { VietcapFilterState, VietcapFilterGroup } from '../types/vietcap'
import { symbolMap } from './vietcapNormalize'

function searchMatch(row: StockRow, text: string): boolean {
  if (!text) return true
  const q = text.toLowerCase().trim()
  if (row.sym.toLowerCase().includes(q)) return true
  if (row.ng.toLowerCase().includes(q)) return true
  // Search by board name
  const meta = symbolMap.get(row.sym)
  if (meta) {
    if (meta.organName.toLowerCase().includes(q)) return true
    if (meta.organShortName.toLowerCase().includes(q)) return true
  }
  return false
}

function boardMatch(row: StockRow, group: VietcapFilterGroup): boolean {
  const meta = symbolMap.get(row.sym)
  if (!meta) return false
  switch (group) {
    case 'HOSE': return meta.board === 'HSX'
    case 'HNX': return meta.board === 'HNX'
    case 'UPCOM': return meta.board === 'UPCOM'
    case 'VN30': return false // handled separately via value
    case 'VN100': return false // handled separately via value
    case 'CW': return meta.type === 'CW'
    case 'BOND': return meta.type === 'BOND'
    case 'WL': return true // watchlist checked separately
    default: return true
  }
}

export function filterStocks(
  rows: StockRow[],
  filter: VietcapFilterState,
  vn30Symbols: string[],
): StockRow[] {
  let result = rows

  // Filter by group
  if (filter.group === 'WL') {
    if (filter.watchlist.length > 0) {
      result = result.filter((r) => filter.watchlist.includes(r.sym))
    }
  } else if (filter.group === 'VN30') {
    result = result.filter((r) => vn30Symbols.includes(r.sym))
  } else if (filter.group === 'VN100') {
    // VN100 = top 100 by market cap, simplified to HSX stocks
    result = result.filter((r) => {
      const meta = symbolMap.get(r.sym)
      return meta?.board === 'HSX'
    }).slice(0, 100)
  } else if (filter.group === 'SECTOR') {
    // Filter by sector ICB code
    result = result.filter((r) => {
      const meta = symbolMap.get(r.sym)
      return meta?.icbCode2 === filter.value
    })
  } else {
    result = result.filter((r) => boardMatch(r, filter.group))
  }

  // Search filter
  if (filter.searchText) {
    result = result.filter((r) => searchMatch(r, filter.searchText))
  }

  return result
}
```

- [ ] **Step 2: Verify types compile**

Run: `npx tsc --noEmit`
Expected: No errors

---

### Task 5: SymbolSearch Component

**Files:**
- Create: `src/components/SymbolSearch.tsx`

**Interfaces:**
- Consumes: `ThemeTokens`, `symbolMap` (from vietcapNormalize)
- Produces: `SymbolSearch` component with autocomplete

- [ ] **Step 1: Create SymbolSearch component**

```tsx
// src/components/SymbolSearch.tsx
import { useState, useRef, useEffect, useMemo } from 'react'
import type { ThemeTokens } from '../types/priceboard'
import { symbolMap, getBoardName } from '../lib/vietcapNormalize'

type Props = {
  th: ThemeTokens
  onSelect: (symbol: string) => void
  placeholder?: string
}

export default function SymbolSearch({ th, onSelect, placeholder = 'Thêm mã ...' }: Props) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [highlightIdx, setHighlightIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => {
    if (!query || query.length < 1) return []
    const q = query.toLowerCase().trim()
    const matches: { symbol: string; board: string; name: string }[] = []
    for (const [sym, meta] of symbolMap) {
      if (matches.length >= 20) break
      if (sym.toLowerCase().includes(q) ||
          meta.organName.toLowerCase().includes(q) ||
          meta.organShortName.toLowerCase().includes(q)) {
        matches.push({
          symbol: sym,
          board: getBoardName(meta.board),
          name: meta.organShortName || meta.organName,
        })
      }
    }
    return matches
  }, [query])

  useEffect(() => {
    setHighlightIdx(-1)
  }, [query])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightIdx((prev) => Math.min(prev + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightIdx((prev) => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (highlightIdx >= 0 && highlightIdx < results.length) {
        onSelect(results[highlightIdx].symbol)
        setQuery('')
        setOpen(false)
      } else if (query) {
        onSelect(query.toUpperCase())
        setQuery('')
        setOpen(false)
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  function handleSelect(sym: string) {
    onSelect(sym)
    setQuery('')
    setOpen(false)
  }

  return (
    <div ref={boxRef} style={{ position: 'relative', width: 160, flexShrink: 0 }}>
      <div style={{
        border: `1px solid ${th.navBorder}`,
        borderRadius: 5,
        padding: '3px 7px',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        background: th.appBg,
      }}>
        <span style={{ fontSize: 10, color: '#94a3b8' }}>🔍</span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          style={{
            border: 'none',
            background: 'transparent',
            color: th.text,
            fontSize: 11,
            outline: 'none',
            width: '100%',
          }}
        />
      </div>
      {open && results.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: th.navBg,
          border: `1px solid ${th.navBorder}`,
          borderRadius: 5,
          marginTop: 2,
          maxHeight: 240,
          overflowY: 'auto',
          zIndex: 100,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}>
          {results.map((r, i) => (
            <div
              key={r.symbol}
              onClick={() => handleSelect(r.symbol)}
              style={{
                padding: '6px 10px',
                cursor: 'pointer',
                fontSize: 11,
                color: i === highlightIdx ? '#fff' : th.text,
                background: i === highlightIdx ? '#2563eb' : 'transparent',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>
                <span style={{ color: th.symColor, fontWeight: 600 }}>{r.symbol}</span>
                <span style={{ color: th.tabFg, marginLeft: 4 }}>{r.board}</span>
              </span>
              <span style={{ color: th.tabFg, fontSize: 10, marginLeft: 8 }}>{r.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify types compile**

Run: `npx tsc --noEmit`
Expected: No errors

---

### Task 6: FilterDropdown Component

**Files:**
- Create: `src/components/FilterDropdown.tsx`

**Interfaces:**
- Consumes: `ThemeTokens`
- Produces: `FilterDropdown` reusable dropdown component

- [ ] **Step 1: Create FilterDropdown component**

```tsx
// src/components/FilterDropdown.tsx
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
}

export default function FilterDropdown({ th, label, items, activeValue, onSelect, arrow = true }: Props) {
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

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((p) => !p)}
        style={{
          background: activeValue ? '#2563eb' : 'transparent',
          color: activeValue ? '#fff' : th.tabFg,
          border: activeValue ? 'none' : th.tabBorder,
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
        {arrow && <span style={{ fontSize: 8 }}>▾</span>}
      </button>
      {open && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          background: th.navBg,
          border: `1px solid ${th.navBorder}`,
          borderRadius: 5,
          marginTop: 2,
          minWidth: 140,
          zIndex: 100,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}>
          {items.map((item) => (
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
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify types compile**

Run: `npx tsc --noEmit`
Expected: No errors

---

### Task 7: Rebuild FilterBar

**Files:**
- Modify: `src/components/FilterBar.tsx`

**Interfaces:**
- Consumes: `ThemeTokens`, `VietcapFilterState`, `SymbolSearch`, `FilterDropdown`
- Produces: Updated `FilterBar` with mode icons, search input, dropdowns, URL sync

- [ ] **Step 1: Rebuild FilterBar**

```tsx
// src/components/FilterBar.tsx
import { useState, useRef, useEffect } from 'react'
import type { ThemeTokens } from '../types/priceboard'
import type { VietcapFilterGroup } from '../types/vietcap'
import SymbolSearch from './SymbolSearch'
import FilterDropdown from './FilterDropdown'
import { getSectorMap } from '../lib/vietcapNormalize'
import sectorsData from '../data/generated/sectors.json'

const sectorMap = getSectorMap(sectorsData as any)

const MODE_TABS = [
  { label: 'HOSE', id: 'HOSE' as VietcapFilterGroup },
  { label: 'HNX', id: 'HNX' as VietcapFilterGroup },
  { label: 'UPCOM', id: 'UPCOM' as VietcapFilterGroup },
]

const DERIVATIVE_TABS = [
  { label: 'Phái Sinh', id: 'PS' },
]

const CW_TABS = [
  { label: 'Chứng Quyền', id: 'CW' as VietcapFilterGroup },
]

const BOND_TABS = [
  { label: 'Trái phiếu', id: 'BOND' as VietcapFilterGroup },
]

type Props = {
  th: ThemeTokens
  filter: { group: VietcapFilterGroup; value: string; searchText: string }
  onFilterChange: (group: VietcapFilterGroup, value?: string) => void
  onSymbolAdd: (symbol: string) => void
}

export default function FilterBar({ th, filter, onFilterChange, onSymbolAdd }: Props) {
  const sectorItems = Array.from(sectorMap.entries()).map(([code, name]) => ({
    label: name,
    value: code,
  }))

  return (
    <div style={{ background: th.navBg, borderBottom: `1px solid ${th.navBorder}`, display: 'flex', alignItems: 'center', padding: '4px 10px', gap: 4, flexShrink: 0, height: 38, overflowX: 'auto' }}>
      {/* Mode icons */}
      <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
        <button style={{ background: th.iconBg, border: 'none', width: 24, height: 24, borderRadius: 4, cursor: 'pointer', color: th.iconColor, fontSize: 12 }}>☰</button>
        <button style={{ background: th.iconBg, border: 'none', width: 24, height: 24, borderRadius: 4, cursor: 'pointer', color: th.iconColor, fontSize: 12 }}>⊞</button>
      </div>

      {/* Search input */}
      <SymbolSearch th={th} onSelect={onSymbolAdd} />

      {/* Danh mục quan tâm */}
      <button
        onClick={() => onFilterChange('WL')}
        style={{
          background: filter.group === 'WL' ? '#2563eb' : 'transparent',
          color: filter.group === 'WL' ? '#fff' : th.tabFg,
          border: filter.group === 'WL' ? 'none' : th.tabBorder,
          borderRadius: 5, padding: '3px 8px', fontSize: 11,
          fontWeight: filter.group === 'WL' ? '700' : '400',
          cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap',
        }}
      >
        Danh mục quan tâm
      </button>

      {/* Board tabs */}
      {MODE_TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onFilterChange(tab.id)}
          style={{
            background: filter.group === tab.id ? '#2563eb' : 'transparent',
            color: filter.group === tab.id ? '#fff' : th.tabFg,
            border: filter.group === tab.id ? 'none' : th.tabBorder,
            borderRadius: 5, padding: '3px 8px', fontSize: 11,
            fontWeight: filter.group === tab.id ? '700' : '400',
            cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap',
          }}
        >
          {tab.label}
        </button>
      ))}

      {/* Phái Sinh */}
      {DERIVATIVE_TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => {}}
          style={{
            background: 'transparent',
            color: th.tabFg,
            border: th.tabBorder,
            borderRadius: 5, padding: '3px 8px', fontSize: 11,
            cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap',
            display: 'flex', alignItems: 'center', gap: 2,
          }}
        >
          {tab.label}
          <span style={{ fontSize: 8 }}>▾</span>
        </button>
      ))}

      {/* Chứng Quyền */}
      {CW_TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onFilterChange(tab.id)}
          style={{
            background: filter.group === tab.id ? '#2563eb' : 'transparent',
            color: filter.group === tab.id ? '#fff' : th.tabFg,
            border: filter.group === tab.id ? 'none' : th.tabBorder,
            borderRadius: 5, padding: '3px 8px', fontSize: 11,
            fontWeight: filter.group === tab.id ? '700' : '400',
            cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap',
          }}
        >
          {tab.label}
        </button>
      ))}

      {/* Ngành dropdown */}
      <FilterDropdown
        th={th}
        label="Ngành"
        items={sectorItems}
        activeValue={filter.group === 'SECTOR' ? filter.value : ''}
        onSelect={(val) => onFilterChange('SECTOR', val)}
      />

      {/* Trái phiếu */}
      {BOND_TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onFilterChange(tab.id)}
          style={{
            background: filter.group === tab.id ? '#2563eb' : 'transparent',
            color: filter.group === tab.id ? '#fff' : th.tabFg,
            border: filter.group === tab.id ? 'none' : th.tabBorder,
            borderRadius: 5, padding: '3px 8px', fontSize: 11,
            fontWeight: filter.group === tab.id ? '700' : '400',
            cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap',
          }}
        >
          {tab.label}
        </button>
      ))}

      {/* Right icons */}
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
        <span style={{ fontSize: 14, color: '#94a3b8', cursor: 'pointer' }}>▶</span>
        <span style={{ fontSize: 14, color: '#94a3b8', cursor: 'pointer' }}>⚙</span>
        <span style={{ fontSize: 14, color: '#94a3b8', cursor: 'pointer' }}>⬇</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify types compile**

Run: `npx tsc --noEmit`
Expected: No errors

---

### Task 8: Update App.tsx — Wire New Filter State + URL Sync

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/types/priceboard.ts`

**Interfaces:**
- Consumes: `VietcapFilterState`, `filterStocks()`, `FilterBar` (new props)
- Produces: Updated App with URL query sync, filter state management

- [ ] **Step 1: Add VietcapFilterState to types**

```typescript
// Add to src/types/priceboard.ts
import type { VietcapFilterGroup } from './vietcap'

// Add this type:
export type FilterState = {
  group: VietcapFilterGroup
  value: string
  searchText: string
  watchlist: string[]
}
```

- [ ] **Step 2: Update App.tsx**

Key changes in App.tsx:
1. Import `filterStocks` from `./lib/filterStocks`
2. Import `VietcapFilterGroup` from `./types/vietcap`
3. Replace `activeTab` + `activeSector` state with single `filter` state
4. Add URL read/write functions
5. Update `allStocks` memo to use `filterStocks()`
6. Update `FilterBar` props
7. Remove `SectorPanel` import and `showSector` state
8. Add `handleFilterChange`, `handleSearchChange`, `handleSymbolAdd` callbacks

```typescript
// Add to imports
import { filterStocks } from './lib/filterStocks'
import type { VietcapFilterGroup } from './types/vietcap'
import { VN30_SYMBOLS } from './data/mockMarket'

// Replace activeTab + activeSector + showSector with:
const [filter, setFilter] = useState<{
  group: VietcapFilterGroup
  value: string
  searchText: string
  watchlist: string[]
}>(() => {
  const params = new URLSearchParams(window.location.search)
  const group = (params.get('filter-group') || 'WL') as VietcapFilterGroup
  const value = params.get('filter-value') || 'DEFAULT'
  return { group, value, searchText: '', watchlist: [] }
})

// URL sync effect
useEffect(() => {
  const params = new URLSearchParams()
  params.set('filter-group', filter.group)
  params.set('filter-value', filter.value)
  const newUrl = `${window.location.pathname}?${params.toString()}`
  window.history.replaceState({}, '', newUrl)
}, [filter.group, filter.value])

// Update allStocks memo
const allStocks = useMemo(() => {
  let rows = mapStockRows(stocks, darkMode, th, openChart)
  return filterStocks(rows, filter, VN30_SYMBOLS)
}, [stocks, darkMode, th, openChart, filter])

// Add handlers
const handleFilterChange = useCallback((group: VietcapFilterGroup, value?: string) => {
  setFilter((prev) => ({
    ...prev,
    group,
    value: value || prev.value,
    searchText: '',
  }))
}, [])

const handleSearchChange = useCallback((text: string) => {
  setFilter((prev) => ({ ...prev, searchText: text }))
}, [])

const handleSymbolAdd = useCallback((symbol: string) => {
  setFilter((prev) => ({
    ...prev,
    group: 'WL',
    watchlist: [...new Set([...prev.watchlist, symbol])],
  }))
}, [])

// Update FilterBar usage
<FilterBar
  th={th}
  filter={filter}
  onFilterChange={handleFilterChange}
  onSymbolAdd={handleSymbolAdd}
/>
```

- [ ] **Step 3: Remove SectorPanel references + delete file**

Remove from App.tsx:
- `import SectorPanel from './components/SectorPanel'`
- `const [showSector, setShowSector] = useState(false)`
- `{showSector && (<SectorPanel ... />)}`

Delete file:
```bash
rm src/components/SectorPanel.tsx
```

- [ ] **Step 4: Update handleTabClick to handleFilterChange**

Replace `handleTabClick` with `handleFilterChange`.

- [ ] **Step 5: Remove SECTOR_LIST and handleSearchChange**

Remove:
```typescript
const SECTOR_LIST = [
  'Tất cả','VN30','Ngân hàng','BĐS','Thực phẩm','Chứng khoán','Thép',
  'Năng lượng','Công nghệ','Dược phẩm','Bảo hiểm','Bán lẻ','Vận tải',
  'Hóa chất','Cao su','Thủy sản','Dệt may',
]
```

Remove `handleSearchChange` callback (search is handled internally by SymbolSearch component).

- [ ] **Step 6: Verify build compiles**

Run: `npm run build`
Expected: Build succeeds

---

### Task 9: Add npm Script

**Files:**
- Modify: `package.json`

**Interfaces:**
- Consumes: `scripts/sync-vietcap-data.mjs` from Task 1
- Produces: `npm run sync:vietcap-data` script

- [ ] **Step 1: Add script to package.json**

Add to `scripts` section:
```json
"sync:vietcap-data": "node scripts/sync-vietcap-data.mjs"
```

- [ ] **Step 2: Verify script runs**

Run: `npm run sync:vietcap-data`
Expected: Script executes, generates JSON files

---

### Task 10: Final Verification

**Files:**
- None (verification only)

- [ ] **Step 1: Run lint**

Run: `npm run lint`
Expected: No errors

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Manual UI verification**

Run: `npm run dev`
Expected:
- Stock table shows real Vietcap data (3466+ symbols)
- Search "VCI" shows VCI stock with board info
- Search "FPT" shows FPT stock
- Click HOSE tab → shows only HSX stocks
- Click VN30 → shows VN30 constituents
- Click Ngành dropdown → shows sector list
- Click a sector → filters to that sector
- Click Chứng Quyền → shows only CW
- Click Trái phiếu → shows only bonds
- URL updates: `?filter-group=HOSE&filter-value=VN30`
- Dark/light mode toggle still works
- Flash animation on price tick still works
- Index strip shows market indices
- Intraday chart modal opens on click
