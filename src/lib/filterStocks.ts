// src/lib/filterStocks.ts
import type { StockState, StockRow } from '../types/priceboard'
import type { VietcapFilterGroup, FilterGroupConfig } from '../types/vietcap'
import { symbolMap } from './vietcapNormalize'
import filterOptionsData from '../data/generated/filter-options.json'

const filterGroups = filterOptionsData.groups as FilterGroupConfig[]

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
    const name = meta.companyNameEn || meta.companyName || meta.organShortName || meta.organName || ''
    if (name.toLowerCase().includes(q)) return true
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
    case 'FU': return meta.type === 'FU'
    case 'WL': return true
    default: return false
  }
}

function subOptionMatch(row: StockRow, group: VietcapFilterGroup, vn30Symbols: string[]): boolean {
  const meta = symbolMap.get(row.sym)
  if (!meta) return false

  switch (group) {
    case 'HOSE':
      return meta.board === 'HSX'
    case 'VN30':
      return vn30Symbols.includes(row.sym)
    case 'VN100':
    case 'VNMIDCAP':
    case 'VNSMALLCAP':
    case 'VNALLSHARE':
    case 'VNDIAMOND':
    case 'VNFINLEAD':
    case 'VNFINSELECT':
    case 'VNDIVIDEND':
    case 'VNMITECH':
    case 'ETF':
    case 'VN50_GROWTH':
    case 'VNFIN':
    case 'VNIND':
    case 'VNMAT':
    case 'VNIT':
    case 'VNREAL':
    case 'VNCONS':
    case 'VNEE':
    case 'VNHEAL':
    case 'VNSI':
    case 'VNUTI':
    case 'VNX50':
    case 'VNXALLSHARE':
      return meta.board === 'HSX'

    case 'HNX':
      return meta.board === 'HNX'
    case 'HNX30':
    case 'HNXCON':
    case 'HNXFIN':
    case 'HNXLCAP':
    case 'HNXMSCAP':
    case 'HNXMAN':
      return meta.board === 'HNX'

    case 'UPCOM':
      return meta.board === 'UPCOM'

    case 'PUT_THROUGH_HOSE':
    case 'PUT_THROUGH_HNX':
    case 'PUT_THROUGH_UPCOM':
    case 'DERIVATIVE':
      return false

    case 'ODD_LOT_HOSE':
    case 'ODD_LOT_HNX':
    case 'ODD_LOT_UPCOM':
      return false

    case 'CW':
      return meta.type === 'CW'
    case 'FU':
      return meta.type === 'FU'
    case 'FU_INDEX':
      return meta.type === 'FU'
    case 'BOND_FU':
      return false

    case 'BOND':
      return meta.type === 'BOND'
    case 'PRIVATE_BOND':
    case 'LISTED_BOND':
      return meta.type === 'BOND'

    default:
      return false
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
    // Sector data not available from Vietcap priceboard API - show all stocks
  } else {
    result = result.filter((r) => boardMatch(r, topGroup))
    result = result.filter((r) => subOptionMatch(r, filter.group, vn30Symbols))
  }

  if (filter.searchText) {
    result = result.filter((r) => searchMatch(r, filter.searchText))
  }

  return result
}

function searchMatchStock(stock: StockState, text: string): boolean {
  if (!text) return true
  const q = text.toLowerCase().trim()
  if (stock.s.toLowerCase().includes(q)) return true
  if (stock.ng.toLowerCase().includes(q)) return true
  const meta = symbolMap.get(stock.s)
  if (meta) {
    const name = meta.companyNameEn || meta.companyName || meta.organShortName || meta.organName || ''
    if (name.toLowerCase().includes(q)) return true
  }
  return false
}

function boardMatchStock(stock: StockState, group: string): boolean {
  const meta = symbolMap.get(stock.s)
  if (!meta) return false
  switch (group) {
    case 'HOSE': return meta.board === 'HSX'
    case 'HNX': return meta.board === 'HNX'
    case 'UPCOM': return meta.board === 'UPCOM'
    case 'CW': return meta.type === 'CW'
    case 'BOND': return meta.type === 'BOND'
    case 'FU': return meta.type === 'FU'
    case 'WL': return true
    default: return false
  }
}

function subOptionMatchStock(stock: StockState, group: VietcapFilterGroup, vn30Symbols: string[]): boolean {
  const meta = symbolMap.get(stock.s)
  if (!meta) return false

  switch (group) {
    case 'HOSE':
      return meta.board === 'HSX'
    case 'VN30':
      return vn30Symbols.includes(stock.s)
    case 'VN100':
    case 'VNMIDCAP':
    case 'VNSMALLCAP':
    case 'VNALLSHARE':
    case 'VNDIAMOND':
    case 'VNFINLEAD':
    case 'VNFINSELECT':
    case 'VNDIVIDEND':
    case 'VNMITECH':
    case 'ETF':
    case 'VN50_GROWTH':
    case 'VNFIN':
    case 'VNIND':
    case 'VNMAT':
    case 'VNIT':
    case 'VNREAL':
    case 'VNCONS':
    case 'VNEE':
    case 'VNHEAL':
    case 'VNSI':
    case 'VNUTI':
    case 'VNX50':
    case 'VNXALLSHARE':
      return meta.board === 'HSX'

    case 'HNX':
      return meta.board === 'HNX'
    case 'HNX30':
    case 'HNXCON':
    case 'HNXFIN':
    case 'HNXLCAP':
    case 'HNXMSCAP':
    case 'HNXMAN':
      return meta.board === 'HNX'

    case 'UPCOM':
      return meta.board === 'UPCOM'

    case 'PUT_THROUGH_HOSE':
    case 'PUT_THROUGH_HNX':
    case 'PUT_THROUGH_UPCOM':
    case 'DERIVATIVE':
      return false

    case 'ODD_LOT_HOSE':
    case 'ODD_LOT_HNX':
    case 'ODD_LOT_UPCOM':
      return false

    case 'CW':
      return meta.type === 'CW'
    case 'FU':
      return meta.type === 'FU'
    case 'FU_INDEX':
      return meta.type === 'FU'
    case 'BOND_FU':
      return false

    case 'BOND':
      return meta.type === 'BOND'
    case 'PRIVATE_BOND':
    case 'LISTED_BOND':
      return meta.type === 'BOND'

    default:
      return false
  }
}

export function filterStockStates(
  stocks: StockState[],
  filter: { group: VietcapFilterGroup; value: string; searchText: string; watchlist: string[] },
  vn30Symbols: string[],
): StockState[] {
  let result = stocks

  const topGroup = resolveTopGroup(filter.group)

  if (filter.group === 'WL') {
    if (filter.watchlist.length > 0) {
      result = result.filter((s) => filter.watchlist.includes(s.s))
    }
  } else if (topGroup === 'SECTOR') {
    // Sector data not available from Vietcap priceboard API - show all stocks
  } else {
    result = result.filter((s) => boardMatchStock(s, topGroup))
    result = result.filter((s) => subOptionMatchStock(s, filter.group, vn30Symbols))
  }

  if (filter.searchText) {
    result = result.filter((s) => searchMatchStock(s, filter.searchText))
  }

  return result
}
