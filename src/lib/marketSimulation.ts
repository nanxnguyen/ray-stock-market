import type { StockState, MarketIndexState } from '../types/priceboard'
import { RAW_STOCKS } from '../data/mockMarket'
import { getScrapedPrices, type ScrapedPrice } from './vietcapNormalize'

function randomQty(): number {
  return (Math.floor(Math.random() * 200) + 1) * 100
}

function vndToPrice(vnd: number): number {
  return vnd > 0 ? +(vnd / 100).toFixed(2) : 0
}

export function generateIntraday(lastPrice: number, reference: number): number[] {
  const n = 78
  const pts = [reference]
  for (let i = 1; i < n; i++) {
    const prev = pts[pts.length - 1]
    const drift = (lastPrice - prev) / (n - i) * 0.5
    const noise = (Math.random() - 0.5) * Math.abs(lastPrice - reference) * 0.18
    pts.push(+(prev + drift + noise).toFixed(2))
  }
  pts.push(lastPrice)
  return pts
}

export function createInitialStocks(): StockState[] {
  const scrapedPrices = getScrapedPrices()
  const priceMap = new Map<string, ScrapedPrice>()
  for (const p of scrapedPrices) {
    priceMap.set(p.symbol, p)
  }

  return RAW_STOCKS.map((d) => {
    const tk = d.r >= 50 ? 0.10 : d.r >= 10 ? 0.05 : 0.01
    const scraped = priceMap.get(d.s)
    return {
      ...d,
      tk,
      b3p: scraped ? vndToPrice(scraped.bid3) : +Math.max(d.fl, d.lp - tk * 3).toFixed(2),
      b3q: scraped ? scraped.bidVol3 : randomQty(),
      b2p: scraped ? vndToPrice(scraped.bid2) : +Math.max(d.fl, d.lp - tk * 2).toFixed(2),
      b2q: scraped ? scraped.bidVol2 : randomQty(),
      b1p: scraped ? vndToPrice(scraped.bid1) : +Math.max(d.fl, d.lp - tk).toFixed(2),
      b1q: scraped ? scraped.bidVol1 : randomQty(),
      a1p: scraped ? vndToPrice(scraped.ask1) : +Math.min(d.cl, d.lp + tk).toFixed(2),
      a1q: scraped ? scraped.askVol1 : randomQty(),
      a2p: scraped ? vndToPrice(scraped.ask2) : +Math.min(d.cl, d.lp + tk * 2).toFixed(2),
      a2q: scraped ? scraped.askVol2 : randomQty(),
      a3p: scraped ? vndToPrice(scraped.ask3) : +Math.min(d.cl, d.lp + tk * 3).toFixed(2),
      a3q: scraped ? scraped.askVol3 : randomQty(),
      fl_: null,
      fts: 0,
      ipts: generateIntraday(d.lp, d.r),
    }
  })
}

export function tickStocks(stocks: StockState[], now: number): StockState[] {
  const len = stocks.length
  const willChange = new Array<number>()
  const willExpire = new Array<number>()

  for (let i = 0; i < len; i++) {
    if (Math.random() < 0.55) {
      const s = stocks[i]
      if (s.fl_ && now - s.fts > 800) willExpire.push(i)
    } else {
      willChange.push(i)
    }
  }

  if (willChange.length === 0 && willExpire.length === 0) return stocks

  const result = stocks.slice()
  const r100 = 100
  const r200 = 200

  for (let k = 0; k < willChange.length; k++) {
    const i = willChange[k]
    const s = stocks[i]
    const dir = Math.random() > 0.48 ? 1 : -1
    let lp = +(s.lp + dir * s.tk).toFixed(2)
    lp = Math.max(s.fl, Math.min(s.cl, lp))
    if (lp === s.lp) {
      if (s.fl_ && now - s.fts > 800) {
        result[i] = { ...s, fl_: null }
      }
      continue
    }
    const lq = (Math.floor(Math.random() * 100) + 1) * r100
    const newPts = s.ipts.slice(1)
    newPts.push(lp)
    result[i] = {
      ...s,
      lp,
      lq,
      pct: +((lp - s.r) / s.r * 100).toFixed(1),
      tv: s.tv + lq,
      hi: Math.max(s.hi, lp),
      lo: Math.min(s.lo, lp),
      b1p: +Math.max(s.fl, lp - s.tk).toFixed(2),
      b1q: (Math.floor(Math.random() * 200) + 1) * r200,
      a1p: +Math.min(s.cl, lp + s.tk).toFixed(2),
      a1q: (Math.floor(Math.random() * 200) + 1) * r200,
      fl_: dir > 0 ? 'u' : 'd',
      fts: now,
      ipts: newPts,
    }
  }

  for (let k = 0; k < willExpire.length; k++) {
    const i = willExpire[k]
    const s = stocks[i]
    result[i] = { ...s, fl_: null }
  }

  return result
}

export function tickIndices(indices: MarketIndexState[]): MarketIndexState[] {
  const len = indices.length
  const result = indices.slice()
  let changed = false

  for (let i = 0; i < len; i++) {
    const idx = indices[i]
    const d = (Math.random() - 0.49) * idx.v * 0.0004
    const v = +(idx.v + d).toFixed(2)
    const ch = +(idx.ch + d).toFixed(2)

    if (v !== idx.v || ch !== idx.ch) {
      changed = true
      const newH = idx.h.slice(1)
      newH.push(v)
      result[i] = {
        ...idx,
        v,
        ch,
        pct: +(ch / (v - ch) * 100).toFixed(2),
        h: newH,
      }
    }
  }

  return changed ? result : indices
}
