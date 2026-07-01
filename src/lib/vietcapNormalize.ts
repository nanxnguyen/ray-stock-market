// src/lib/vietcapNormalize.ts
import type { RawStock } from '../types/priceboard'
import type { VietcapSymbol, VietcapPrice, VietcapIndexConfig, VietcapSector } from '../types/vietcap'
import symbolsData from '../data/generated/symbols.json'
import cwData from '../data/generated/covered-warrants.json'

export function normalizeSymbols(raw: VietcapSymbol[]): Map<string, VietcapSymbol> {
  const map = new Map<string, VietcapSymbol>()
  for (const s of raw) {
    map.set(s.symbol, s)
  }
  return map
}

export const symbolMap: Map<string, VietcapSymbol> = normalizeSymbols(symbolsData as VietcapSymbol[])

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
    ng: symbolMeta?.companyNameEn || symbolMeta?.companyName || symbolMeta?.organShortName || symbolMeta?.organName || '',
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

// CW data type from Vietcap API
type VietcapCW = {
  co: string
  s: string
  cei: number
  flo: number
  ref: number
  c: number
  mv: number
  h: number
  l: number
  frbv: number
  frsv: number
  vo: number
  va: number
  orgn: string
  enorgn: string
  bp1: number
  bv1: number
  bp2: number
  bv2: number
  bp3: number
  bv3: number
  ap1: number
  av1: number
  ap2: number
  av2: number
  ap3: number
  av3: number
  bo: string
  in: string
  udls: string
  exp: number
  exr: string
  md: string
  ltrdd: string
  lsh: number
  st: string
}

export function normalizeCW(cwList: VietcapCW[]): RawStock[] {
  return cwList
    .filter((cw) => cw.ref > 0)
    .map((cw) => {
      const ref = cw.ref
      const lp = cw.c || cw.ref
      const cl = cw.cei
      const fl = cw.flo
      const pct = ref > 0 ? +((lp - ref) / ref * 100).toFixed(1) : 0

      return {
        s: cw.s,
        ng: `${cw.udls} • ${cw.in}`,
        cl,
        r: ref,
        fl,
        lp,
        lq: cw.vo,
        pct,
        tv: cw.va,
        hi: cw.h || lp,
        lo: cw.l || lp,
        fb: cw.frbv,
        fs: cw.frsv,
        rm: 0,
      }
    })
    .sort((a, b) => a.s.localeCompare(b.s))
}

export function getAllCoveredWarrants(): RawStock[] {
  return normalizeCW(cwData as VietcapCW[])
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
    .slice(0, 30)
}

export function getSectorMap(sectors: VietcapSector[]): Map<string, string> {
  const map = new Map<string, string>()
  for (const sec of sectors) {
    map.set(sec.icbCode, sec.icbName)
  }
  return map
}
