import type { StockState, MarketIndexState } from '../types/priceboard'
import { RAW_STOCKS } from '../data/mockMarket'

function randomQty(): number {
  return (Math.floor(Math.random() * 200) + 1) * 100
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
  return RAW_STOCKS.map((d) => {
    const tk = d.r >= 50 ? 0.10 : d.r >= 10 ? 0.05 : 0.01
    return {
      ...d,
      tk,
      b3p: +Math.max(d.fl, d.lp - tk * 3).toFixed(2),
      b3q: randomQty(),
      b2p: +Math.max(d.fl, d.lp - tk * 2).toFixed(2),
      b2q: randomQty(),
      b1p: +Math.max(d.fl, d.lp - tk).toFixed(2),
      b1q: randomQty(),
      a1p: +Math.min(d.cl, d.lp + tk).toFixed(2),
      a1q: randomQty(),
      a2p: +Math.min(d.cl, d.lp + tk * 2).toFixed(2),
      a2q: randomQty(),
      a3p: +Math.min(d.cl, d.lp + tk * 3).toFixed(2),
      a3q: randomQty(),
      fl_: null,
      fts: 0,
      ipts: generateIntraday(d.lp, d.r),
    }
  })
}

export function tickStocks(stocks: StockState[], now: number): StockState[] {
  return stocks.map((s) => {
    const expire = s.fl_ && now - s.fts > 800
    if (Math.random() < 0.55) return expire ? { ...s, fl_: null } : s
    const dir = Math.random() > 0.48 ? 1 : -1
    let lp = +(s.lp + dir * s.tk).toFixed(2)
    lp = Math.max(s.fl, Math.min(s.cl, lp))
    if (lp === s.lp) return expire ? { ...s, fl_: null } : s
    const lq = (Math.floor(Math.random() * 100) + 1) * 100
    const pct = +((lp - s.r) / s.r * 100).toFixed(1)
    const newPts = [...s.ipts.slice(1), lp]
    return {
      ...s,
      lp,
      lq,
      pct,
      tv: s.tv + lq,
      hi: Math.max(s.hi, lp),
      lo: Math.min(s.lo, lp),
      b1p: +Math.max(s.fl, lp - s.tk).toFixed(2),
      b1q: (Math.floor(Math.random() * 200) + 1) * 100,
      a1p: +Math.min(s.cl, lp + s.tk).toFixed(2),
      a1q: (Math.floor(Math.random() * 200) + 1) * 100,
      fl_: dir > 0 ? 'u' : 'd',
      fts: now,
      ipts: newPts,
    }
  })
}

export function tickIndices(indices: MarketIndexState[]): MarketIndexState[] {
  return indices.map((idx) => {
    const d = (Math.random() - 0.49) * idx.v * 0.0004
    const v = +(idx.v + d).toFixed(2)
    const ch = +(idx.ch + d).toFixed(2)
    return {
      ...idx,
      v,
      ch,
      pct: +(ch / (v - ch) * 100).toFixed(2),
      h: [...idx.h.slice(1), v],
    }
  })
}
