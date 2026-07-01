import type { RawStock, MarketIndexState } from '../types/priceboard'
import type { VietcapSymbol, VietcapPrice } from '../types/vietcap'
import symbolsData from './generated/symbols.json'
import pricesData from './generated/prices.json'
import { normalizeSymbols, normalizeStocks, getVN30Symbols } from '../lib/vietcapNormalize'

const symbolMap = normalizeSymbols(symbolsData as VietcapSymbol[])

export const RAW_STOCKS: RawStock[] = normalizeStocks(
  pricesData as unknown as Record<string, VietcapPrice>,
  symbolMap,
)

export const VN30_SYMBOLS: string[] = getVN30Symbols(symbolsData as VietcapSymbol[])

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
