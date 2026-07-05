import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import type { StockState } from '../types/priceboard'

type Props = { stock: StockState; onClose: () => void }

type Tab = 'overview' | 'stats' | 'tech' | 'sentiment' | 'fin' | 'research' | 'events'
type OvPanel = 'keymetrics' | 'timesales'
type OvRange = '1D' | '2D' | '1W' | '3M' | 'YTD' | '1Y' | '5Y'
type StatSub = 'stats' | 'foreign' | 'proprietary'
type FinSub = 'overview' | 'indicators'
type FinPeriod = 'quarter' | 'year'
type SentPeriod = '1D' | '1W' | '1M'
type EventSub = 'news' | 'dividends' | 'insider' | 'other'

const axBase = {
  axisLine: { lineStyle: { color: '#26374a' } },
  axisTick: { show: false },
}
const gridDef = (o?: Record<string, unknown>) => ({
  left: 8, right: 14, top: 14, bottom: 22, containLabel: true, ...o,
})
const fmtN = (v: number) => {
  const a = Math.abs(v)
  if (a >= 1e9) return (v / 1e9).toFixed(1) + ' B'
  if (a >= 1e6) return (v / 1e6).toFixed(1) + ' M'
  if (a >= 1e3) return (v / 1e3).toFixed(1) + ' K'
  return Math.round(v).toString()
}

function makeRng(seed: string) {
  let h = 1779033703 ^ seed.length
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  let a = h >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function genData(sym: string, stock: StockState) {
  const ref = +(stock.r ?? 24.9)
  const lp = +(stock.lp ?? ref)
  const hi = +(stock.hi ?? lp * 1.02)
  const lo = +(stock.lo ?? lp * 0.98)
  const R = makeRng(sym)

  const times: string[] = []
  for (let i = 0; i < 135; i++) {
    let h: number, m: number
    if (i < 75) {
      const tot = 9 * 60 + i * 2
      h = Math.floor(tot / 60)
      m = tot % 60
    } else {
      const tot = 13 * 60 + (i - 75) * 2
      h = Math.floor(tot / 60)
      m = tot % 60
    }
    times.push(String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0'))
  }

  const price: number[] = []
  const vol: number[] = []
  let p = ref
  for (let i = 0; i < times.length; i++) {
    const target = i < times.length - 1 ? p + (lp - p) / (times.length - i) * 0.4 : lp
    p = +(target + (R() - 0.5) * ref * 0.006).toFixed(2)
    p = Math.max(lo * 0.99, Math.min(hi * 1.01, p))
    if (i === times.length - 1) p = lp
    price.push(p)
    vol.push(Math.round(2000 + R() * 9000))
  }

  const liqT: number[] = [], liqY: number[] = [], liqW: number[] = []
  let ct = 0, cy = 0, cw = 0
  for (let i = 0; i < times.length; i++) {
    ct += R() * 1.4e9; cy += R() * 1.0e9; cw += R() * 1.35e9
    liqT.push(Math.round(ct)); liqY.push(Math.round(cy)); liqW.push(Math.round(cw * 1.05))
  }

  const fBuy: number[] = [], fSell: number[] = []
  let cb = 0, cs = 0
  for (let i = 0; i < times.length; i++) {
    cb += (R() - 0.35) * 2.5e8; cs -= (R() - 0.3) * 3.2e8
    fBuy.push(Math.round(Math.max(0, cb))); fSell.push(Math.round(Math.min(0, cs)))
  }

  const days = 180
  const candle: [number, number, number, number][] = []
  const cvol: number[] = []
  const cdates: string[] = []
  let o = lp * 0.5
  const now = new Date()
  for (let k = 0; k < days; k++) {
    const t = k / days
    const targ = lp * (0.55 + 0.75 * Math.sin(t * Math.PI))
    o += (targ - o) * 0.12 + (R() - 0.5) * lp * 0.035
    let cl = o + (R() - 0.5) * lp * 0.03
    if (k === days - 1) cl = lp
    const h2 = Math.max(o, cl) + R() * lp * 0.02
    const l2 = Math.max(0.1, Math.min(o, cl) - R() * lp * 0.02)
    candle.push([+o.toFixed(2), +cl.toFixed(2), +l2.toFixed(2), +h2.toFixed(2)])
    cvol.push(Math.round(2e6 + R() * 6e6))
    const d = new Date(now.getTime() - (days - 1 - k) * 86400000)
    cdates.push((d.getMonth() + 1) + '/' + d.getDate())
    o = cl
  }

  const levels: { price: number; buy: number; sell: number }[] = []
  const tk = stock.tk || (ref >= 50 ? 0.1 : ref >= 10 ? 0.05 : 0.01)
  for (let i = 6; i >= -6; i--) {
    const pr = +(lp + i * tk).toFixed(2)
    levels.push({ price: pr, buy: Math.round(R() * 700000), sell: Math.round(R() * 700000) })
  }
  let vwSum = 0, vwVol = 0
  levels.forEach(l => { const v = l.buy + l.sell; vwSum += l.price * v; vwVol += v })
  const vwap = vwSum / vwVol

  const qCols = ['Q3/23', 'Q4/23', 'Q1/24', 'Q2/24', 'Q3/24', 'Q4/24', 'Q1/25', 'Q2/25', 'Q3/25', 'Q4/25', 'Q1/26']
  const yCols = ['2021', '2022', '2023', '2024', '2025']
  const mkSeries = (base: number, spread: number) => qCols.map(() => +(base + (R() - 0.5) * spread).toFixed(2))
  const pe = mkSeries(12, 20).map(v => Math.max(-30, v))
  const pb = mkSeries(1.4, 1.2).map(v => Math.max(0.4, v))
  const netSales = qCols.map((_, i) => Math.round(20000 + R() * 30000 + i * 1500))
  const netProfit = qCols.map(() => Math.round((R() - 0.2) * 3500))
  const salesGrowth = netSales.map((v, i) => i === 0 ? 0 : +((v - netSales[i - 1]) / netSales[i - 1] * 100).toFixed(1))
  const profitGrowth = netProfit.map((v, i) => i === 0 ? 0 : +((v - netProfit[i - 1]) / Math.abs(netProfit[i - 1] || 1) * 100).toFixed(1))

  return { ref, lp, hi, lo, times, price, vol, liqT, liqY, liqW, fBuy, fSell, candle, cvol, cdates, levels, vwap, qCols, yCols, pe, pb, netSales, netProfit, salesGrowth, profitGrowth, R: makeRng(sym + '2') }
}

type Data = ReturnType<typeof genData>

const SENTIMENT_NAMES: Record<string, string> = {
  AAA: 'CTCP Nhựa An Phát Xanh', ACB: 'Ngân hàng TMCP Á Châu',
  BID: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam',
  CTG: 'Ngân hàng TMCP Công Thương Việt Nam', FPT: 'CTCP FPT',
  GAS: 'Tổng Công ty Khí Việt Nam', HPG: 'CTCP Tập đoàn Hòa Phát',
  HDB: 'Ngân hàng TMCP Phát triển TP.HCM', MBB: 'Ngân hàng TMCP Quân đội',
  TCB: 'Ngân hàng TMCP Kỹ Thương Việt Nam', VCB: 'Ngân hàng TMCP Ngoại thương Việt Nam',
  VNM: 'CTCP Sữa Việt Nam (Vinamilk)', VHM: 'CTCP Vinhomes',
  BSR: 'CTCP Lọc hóa dầu Bình Sơn',
}

export default function StockDetailModal({ stock, onClose }: Props) {
  const [tab, setTab] = useState<Tab>('overview')
  const [ovPanel, setOvPanel] = useState<OvPanel>('timesales')
  const [ovRange, setOvRange] = useState<OvRange>('1D')
  const [statSub, setStatSub] = useState<StatSub>('stats')
  const [finSub, setFinSub] = useState<FinSub>('overview')
  const [finPeriod, setFinPeriod] = useState<FinPeriod>('quarter')
  const [sentPeriod, setSentPeriod] = useState<SentPeriod>('1D')
  const [eventSub, setEventSub] = useState<EventSub>('news')
  const [starred, setStarred] = useState(false)

  const chartsRef = useRef<Record<string, { dispose: () => void; resize: () => void }>>({})
  const prevKeyRef = useRef('')

  const sym = stock.s
  const data = useMemo(() => genData(sym, stock), [sym, stock])

  const mkChart = useCallback((id: string, option: Record<string, unknown>) => {
    const el = document.getElementById(id)
    if (!el || !(window as any).echarts) return
    const c = (window as any).echarts.init(el, null, { renderer: 'canvas' })
    c.setOption(option)
    chartsRef.current[id] = c
  }, [])

  const dispose = useCallback(() => {
    Object.values(chartsRef.current).forEach(c => { try { c.dispose() } catch { /* */ } })
    chartsRef.current = {}
  }, [])

  const gauge = useCallback((id: string, value: number) => {
    mkChart(id, {
      animation: false, backgroundColor: 'transparent',
      series: [{
        type: 'gauge', startAngle: 200, endAngle: -20, min: 0, max: 100, radius: '92%', center: ['50%', '72%'],
        progress: { show: false }, pointer: { width: 4, length: '62%', itemStyle: { color: '#e2e8f0' } },
        axisLine: { lineStyle: { width: 14, color: [[0.35, '#f43f5e'], [0.65, '#4b5a6d'], [1, '#22c55e']] } },
        axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false },
        detail: { show: false }, title: { show: false }, data: [{ value }],
      }],
    })
  }, [mkChart])

  // Render charts when tab/data change
  useEffect(() => {
    const key = [tab, statSub, finSub, finPeriod, sentPeriod, ovRange, ovPanel, sym].join('|')
    if (key === prevKeyRef.current) return
    prevKeyRef.current = key

    const t = setTimeout(() => {
      dispose()
      if (!(window as any).echarts) {
        const poll = setInterval(() => {
          if ((window as any).echarts) { clearInterval(poll); renderCharts() }
        }, 80)
        return
      }
      renderCharts()
    }, 30)
    return () => clearTimeout(t)
  }, [tab, statSub, finSub, finPeriod, sentPeriod, ovRange, ovPanel, sym, dispose])

  useEffect(() => {
    const onResize = () => { Object.values(chartsRef.current).forEach(c => { try { c.resize() } catch { /* */ } }) }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      dispose()
    }
  }, [dispose])

  function renderCharts() {
    const d = data
    if (tab === 'overview') renderOverview(d)
    else if (tab === 'stats') renderStats(d)
    else if (tab === 'sentiment') renderSentiment()
    else if (tab === 'fin' && finSub === 'overview') renderFin(d)
  }

  function renderOverview(d: Data) {
    mkChart('sdPrice', {
      animation: false, backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis', backgroundColor: '#0f1c2b', borderColor: '#26374a', textStyle: { color: '#cbd5e1', fontSize: 11 },
        formatter: (ps: any[]) => { const i = ps[0].dataIndex; return d.times[i] + '<br/>Price ' + d.price[i].toFixed(2) + '<br/>Volume ' + d.vol[i].toLocaleString() },
      },
      axisPointer: { link: [{ xAxisIndex: 'all' }], lineStyle: { color: '#3a4a5c' } },
      grid: [gridDef({ left: 8, right: 44, top: 12, bottom: 78, height: '62%' }), { left: 8, right: 44, bottom: 24, height: '16%', containLabel: true }],
      xAxis: [
        { type: 'category', data: d.times, boundaryGap: false, gridIndex: 0, ...axBase, axisLabel: { show: false } },
        { type: 'category', data: d.times, gridIndex: 1, ...axBase, axisLabel: { color: '#6b7d92', fontSize: 9, interval: 26 }, splitLine: { lineStyle: { color: '#152232' } } },
      ],
      yAxis: [
        { type: 'value', scale: true, position: 'right', gridIndex: 0, ...axBase, axisLabel: { color: '#6b7d92', fontSize: 10 }, splitLine: { lineStyle: { color: '#152232' } } },
        { type: 'value', gridIndex: 1, ...axBase, axisLabel: { show: false }, splitLine: { show: false } },
      ],
      series: [
        {
          type: 'line', data: d.price, xAxisIndex: 0, yAxisIndex: 0, showSymbol: false,
          lineStyle: { color: '#eab308', width: 1.6 },
          areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(234,179,8,.28)' }, { offset: 1, color: 'rgba(234,179,8,0)' }] } },
          markLine: { silent: true, symbol: 'none', data: [{ yAxis: d.ref }], lineStyle: { color: '#f43f5e', type: 'solid', width: 1 }, label: { show: true, position: 'end', color: '#f43f5e', fontSize: 10, formatter: d.ref.toFixed(2) } },
        },
        {
          type: 'bar', xAxisIndex: 1, yAxisIndex: 1,
          data: d.vol.map((v, i) => ({ value: v, itemStyle: { color: i > 0 && d.price[i] >= d.price[i - 1] ? 'rgba(34,197,94,.55)' : 'rgba(244,63,94,.55)' } })),
        },
      ],
    })

    const area = (id: string, series: any[]) => mkChart(id, {
      animation: false, backgroundColor: 'transparent',
      tooltip: { trigger: 'axis', backgroundColor: '#0f1c2b', borderColor: '#26374a', textStyle: { color: '#cbd5e1', fontSize: 10 }, valueFormatter: (v: number) => fmtN(v) },
      grid: gridDef({ right: 44, bottom: 16 }),
      xAxis: { type: 'category', data: d.times, boundaryGap: false, ...axBase, axisLabel: { color: '#6b7d92', fontSize: 9, interval: 40 }, splitLine: { lineStyle: { color: '#152232' } } },
      yAxis: { type: 'value', position: 'right', ...axBase, axisLabel: { formatter: (v: number) => fmtN(v), color: '#6b7d92', fontSize: 10 }, splitLine: { lineStyle: { color: '#152232' } } },
      series,
    })
    area('sdLiq', [
      { type: 'line', data: d.liqT, showSymbol: false, lineStyle: { color: '#3b82f6', width: 1.4 }, areaStyle: { color: 'rgba(59,130,246,.18)' } },
      { type: 'line', data: d.liqY, showSymbol: false, lineStyle: { color: '#94a3b8', width: 1.2 } },
      { type: 'line', data: d.liqW, showSymbol: false, lineStyle: { color: '#eab308', width: 1.2 } },
    ])
    area('sdForeign', [
      { type: 'line', data: d.fBuy, showSymbol: false, lineStyle: { color: '#22c55e', width: 1.3 }, areaStyle: { color: 'rgba(34,197,94,.16)' } },
      { type: 'line', data: d.fSell, showSymbol: false, lineStyle: { color: '#f43f5e', width: 1.3 }, areaStyle: { color: 'rgba(244,63,94,.14)' } },
    ])
    gauge('sdSentiment', sentVal())
  }

  function renderStats(d: Data) {
    if (statSub === 'stats') {
      mkChart('sdStatLiq', {
        animation: false, backgroundColor: 'transparent',
        tooltip: { trigger: 'axis', backgroundColor: '#0f1c2b', borderColor: '#26374a', textStyle: { color: '#cbd5e1', fontSize: 10 }, valueFormatter: (v: number) => fmtN(v) },
        grid: gridDef({ right: 48, bottom: 20 }),
        xAxis: { type: 'category', data: d.times, boundaryGap: false, ...axBase, axisLabel: { color: '#6b7d92', fontSize: 9, interval: 40 }, splitLine: { lineStyle: { color: '#152232' } } },
        yAxis: { type: 'value', position: 'right', ...axBase, axisLabel: { formatter: (v: number) => fmtN(v), color: '#6b7d92', fontSize: 10 }, splitLine: { lineStyle: { color: '#152232' } } },
        series: [
          { type: 'line', data: d.liqT, showSymbol: false, lineStyle: { color: '#3b82f6', width: 1.5 }, areaStyle: { color: 'rgba(59,130,246,.2)' } },
          { type: 'line', data: d.liqY, showSymbol: false, lineStyle: { color: '#94a3b8', width: 1.3 }, areaStyle: { color: 'rgba(148,163,184,.12)' } },
          { type: 'line', data: d.liqW, showSymbol: false, lineStyle: { color: '#eab308', width: 1.4 } },
        ],
      })
      const cats = d.levels.map(l => l.price.toFixed(2))
      mkChart('sdDepth', {
        animation: false, backgroundColor: 'transparent',
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, backgroundColor: '#0f1c2b', borderColor: '#26374a', textStyle: { color: '#cbd5e1', fontSize: 10 } },
        grid: gridDef({ left: 6, right: 56, top: 8, bottom: 24 }),
        xAxis: { type: 'value', inverse: true, ...axBase, axisLabel: { formatter: (v: number) => fmtN(v), color: '#6b7d92', fontSize: 9 }, splitLine: { lineStyle: { color: '#152232' } } },
        yAxis: { type: 'category', data: cats, position: 'right', ...axBase, axisLabel: { color: '#8296ab', fontSize: 10, fontFamily: 'JetBrains Mono' }, splitLine: { lineStyle: { color: '#152232' } } },
        series: [
          { name: 'Buy', type: 'bar', stack: 'x', data: d.levels.map(l => l.buy), itemStyle: { color: '#22c55e' }, barWidth: '62%' },
          { name: 'Sell', type: 'bar', stack: 'x', data: d.levels.map(l => l.sell), itemStyle: { color: '#f43f5e' } },
        ],
      })
    } else if (statSub === 'foreign') {
      mkChart('sdFxArea', {
        animation: false, backgroundColor: 'transparent',
        tooltip: { trigger: 'axis', backgroundColor: '#0f1c2b', borderColor: '#26374a', textStyle: { color: '#cbd5e1', fontSize: 10 }, valueFormatter: (v: number) => fmtN(v) },
        grid: gridDef({ right: 52, bottom: 20 }),
        xAxis: { type: 'category', data: d.times, boundaryGap: false, ...axBase, axisLabel: { color: '#6b7d92', fontSize: 9, interval: 40 }, splitLine: { lineStyle: { color: '#152232' } } },
        yAxis: { type: 'value', position: 'right', ...axBase, axisLabel: { formatter: (v: number) => fmtN(v), color: '#6b7d92', fontSize: 10 }, splitLine: { lineStyle: { color: '#152232' } } },
        series: [
          { type: 'line', data: d.fBuy, showSymbol: false, lineStyle: { color: '#22c55e', width: 1.5 }, areaStyle: { color: 'rgba(34,197,94,.2)' } },
          { type: 'line', data: d.fSell, showSymbol: false, lineStyle: { color: '#f43f5e', width: 1.5 }, areaStyle: { color: 'rgba(244,63,94,.16)' } },
          { type: 'line', data: d.fBuy.map(v => Math.round(v * 0.6)), showSymbol: false, lineStyle: { color: '#94a3b8', width: 1.2 } },
        ],
      })
    } else {
      const R = d.R
      const dates: string[] = []
      const vals: number[] = []
      const now = new Date()
      for (let i = 6; i >= 0; i--) {
        const dt = new Date(now.getTime() - i * 86400000)
        dates.push((dt.getMonth() + 1) + '/' + dt.getDate())
        vals.push(Math.round((R() - 0.4) * 2.5e10))
      }
      mkChart('sdPropBar', {
        animation: false, backgroundColor: 'transparent',
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, backgroundColor: '#0f1c2b', borderColor: '#26374a', textStyle: { color: '#cbd5e1', fontSize: 10 }, valueFormatter: (v: number) => fmtN(v) },
        grid: gridDef({ right: 52, bottom: 24 }),
        xAxis: { type: 'category', data: dates, ...axBase, axisLabel: { color: '#6b7d92', fontSize: 10 }, splitLine: { lineStyle: { color: '#152232' } } },
        yAxis: { type: 'value', position: 'right', ...axBase, axisLabel: { formatter: (v: number) => fmtN(v), color: '#6b7d92', fontSize: 10 }, splitLine: { lineStyle: { color: '#152232' } } },
        series: [{ type: 'bar', data: vals.map(v => ({ value: v, itemStyle: { color: v >= 0 ? '#22c55e' : '#f43f5e' } })), barWidth: '52%' }],
      })
    }
  }

  function renderSentiment() {
    gauge('sdSum', sentVal())
    const subVals: Record<string, number> = { sdMA: 22, sdOsc: 58, sdVol: 64 }
    Object.keys(subVals).forEach(id => gauge(id, subVals[id]))
  }

  function renderFin(d: Data) {
    const cols = finPeriod === 'year' ? d.yCols : d.qCols
    const n = cols.length
    mkChart('sdValuation', {
      animation: false, backgroundColor: 'transparent',
      tooltip: { trigger: 'axis', backgroundColor: '#0f1c2b', borderColor: '#26374a', textStyle: { color: '#cbd5e1', fontSize: 10 } },
      legend: { show: false },
      grid: gridDef({ left: 8, right: 48, top: 16, bottom: 24 }),
      xAxis: { type: 'category', data: cols, ...axBase, axisLabel: { color: '#6b7d92', fontSize: 9 }, splitLine: { lineStyle: { color: '#152232' } } },
      yAxis: [
        { type: 'value', position: 'left', ...axBase, axisLabel: { color: '#6b7d92', fontSize: 9 }, splitLine: { lineStyle: { color: '#152232' } } },
        { type: 'value', position: 'right', ...axBase, axisLabel: { color: '#6b7d92', fontSize: 9 }, splitLine: { lineStyle: { color: '#152232' } } },
      ],
      series: [
        { name: 'P/E TTM', type: 'line', data: d.pe.slice(0, n), yAxisIndex: 0, symbol: 'circle', symbolSize: 7, lineStyle: { color: '#3b82f6', width: 2 }, itemStyle: { color: '#3b82f6' } },
        { name: 'P/B TTM', type: 'line', data: d.pb.slice(0, n), yAxisIndex: 1, symbol: 'circle', symbolSize: 7, lineStyle: { color: '#eab308', width: 2 }, itemStyle: { color: '#eab308' } },
      ],
    })
    mkChart('sdPerf', {
      animation: false, backgroundColor: 'transparent',
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, backgroundColor: '#0f1c2b', borderColor: '#26374a', textStyle: { color: '#cbd5e1', fontSize: 10 } },
      grid: gridDef({ left: 8, right: 52, top: 16, bottom: 24 }),
      xAxis: { type: 'category', data: cols, ...axBase, axisLabel: { color: '#6b7d92', fontSize: 9 }, splitLine: { lineStyle: { color: '#152232' } } },
      yAxis: [
        { type: 'value', position: 'left', ...axBase, axisLabel: { formatter: (v: number) => v + '%', color: '#6b7d92', fontSize: 9 }, splitLine: { lineStyle: { color: '#152232' } } },
        { type: 'value', position: 'right', ...axBase, axisLabel: { color: '#6b7d92', fontSize: 9 }, splitLine: { lineStyle: { color: '#152232' } } },
      ],
      series: [
        { name: 'Net Sales', type: 'bar', yAxisIndex: 1, data: d.netSales.slice(0, n), itemStyle: { color: '#3b82f6' }, barWidth: '46%' },
        { name: 'Net Profit', type: 'bar', yAxisIndex: 1, data: d.netProfit.slice(0, n), itemStyle: { color: '#22c55e' }, barWidth: '46%' },
        { name: 'QoQ Sales', type: 'line', yAxisIndex: 0, data: d.salesGrowth.slice(0, n), symbol: 'circle', symbolSize: 6, lineStyle: { color: '#eab308', width: 1.6 }, itemStyle: { color: '#eab308' } },
        { name: 'QoQ Profit', type: 'line', yAxisIndex: 0, data: d.profitGrowth.slice(0, n), symbol: 'circle', symbolSize: 6, lineStyle: { color: '#cbd5e1', width: 1.6 }, itemStyle: { color: '#cbd5e1' } },
      ],
    })
  }

  function sentVal() { return Math.round((makeRng(sym + 'sent')() * 0.5 + 0.15) * 100) }

  function sentimentData() {
    const R = makeRng(sym + 'sx')
    const val = sentVal()
    const neg = 8 + Math.round(R() * 8), pos = 3 + Math.round(R() * 6), neu = 1 + Math.round(R() * 2)
    return { val, neg, neu, pos }
  }

  const ref = stock.r
  const lp = stock.lp
  const chg = +(lp - ref).toFixed(2)
  const pct = ref ? +(chg / ref * 100).toFixed(2) : 0
  const col = chg > 0 ? '#22c55e' : chg < 0 ? '#f43f5e' : '#eab308'
  const company = SENTIMENT_NAMES[sym] || (sym + ' - Công ty Cổ phần')

  const tvSym = 'HOSE:' + sym
  const tvIframeUrl = `https://s.tradingview.com/widgetembed/?frameElementId=tvsd&symbol=${encodeURIComponent(tvSym)}&interval=D&hidesidetoolbar=0&hidetoptoolbar=0&theme=dark&style=1&locale=vi&toolbar_bg=%23131722&enable_publishing=false&allow_symbol_change=true&save_image=false&show_popup_button=false`
  const tvOpenUrl = `https://www.tradingview.com/chart/?symbol=${encodeURIComponent(tvSym)}&theme=dark`

  const tabDefs: [Tab, string][] = [
    ['overview', 'Tổng quan'], ['stats', 'Thống kê'], ['tech', 'Biểu đồ kỹ thuật'],
    ['sentiment', 'Tâm lý kỹ thuật'], ['fin', 'Tài chính'], ['research', 'Khuyến nghị'], ['events', 'Sự kiện'],
  ]

  const rangeDefs: [OvRange, string, string][] = [
    ['1D', '1 Ngày', '-0.80%'], ['2D', '2 Ngày', '+2.28%'], ['1W', '1 Tuần', '-3.33%'],
    ['3M', '3 Tháng', '-4.63%'], ['YTD', 'Từ đầu năm', '+52.47%'], ['1Y', '1 Năm', '+38.76%'], ['5Y', '5 Năm', '+20.49%'],
  ]

  const upDir = chg >= 0
  const sent = sentimentData()
  const sentTxt = {
    rec: 'Cân nhắc giải ngân thăm dò / theo dõi chặt',
    disb: '≤15%',
    strat: upDir ? 'Xu hướng tăng còn nguyên vẹn. Tích lũy khi giá điều chỉnh về vùng hỗ trợ; đặt cắt lỗ dưới đường trung bình 10 phiên.' : 'Xu hướng giảm. Có thể xuất hiện hồi phục kỹ thuật ngắn hạn. Mua gần vùng hỗ trợ; thoát khi biến động vượt 1,2 lần trung bình 10 phiên.',
  }

  const Rlog = makeRng(sym + 'log')
  const tk = stock.tk || (ref >= 50 ? 0.1 : ref >= 10 ? 0.05 : 0.01)
  const depthRows = [0, 1, 2].map(i => ({
    bv: fmtN(Math.round(50000 + Rlog() * 250000)),
    bp: (lp - (i + 1) * tk).toFixed(2),
    ap: (lp + (i + 1) * tk).toFixed(2),
    av: fmtN(Math.round(20000 + Rlog() * 230000)),
  }))
  const tradeLog = Array.from({ length: 20 }).map((_, i) => {
    const buy = Rlog() > 0.55
    const pr = +(lp + (Rlog() - 0.5) * tk * 2).toFixed(2)
    const pc = pr > ref ? '#22c55e' : pr < ref ? '#f43f5e' : '#eab308'
    const mm = 45 - Math.floor(i * 0.8)
    return { time: '14:' + String(Math.max(10, mm)).padStart(2, '0'), price: pr.toFixed(2), vol: (Math.floor(Rlog() * 30) * 100 + 100).toLocaleString(), side: buy ? 'B' : 'S', sc: buy ? '#22c55e' : '#f43f5e', pc }
  })
  const aggr = [
    { k: 'Mua chủ động', c: '#22c55e', vol: '1.8 M', val: '44.5 B' },
    { k: 'Bán chủ động', c: '#f43f5e', vol: '3.0 M', val: '75.4 B' },
    { k: 'Mua/Bán chủ động ròng', c: '#cbd5e1', vol: '-1.2 M', val: '-30.9 B' },
  ]
  const keyMetrics = [
    { k: 'Mở cửa', v: data.price[0].toFixed(2), c: '#cbd5e1' },
    { k: 'Cao nhất', v: data.hi.toFixed(2), c: '#22c55e' },
    { k: 'Thấp nhất', v: data.lo.toFixed(2), c: '#f43f5e' },
    { k: 'Trần', v: (stock.cl ?? ref * 1.07).toFixed(2), c: '#b07ef8' },
    { k: 'Tham chiếu', v: ref.toFixed(2), c: '#eab308' },
    { k: 'Sàn', v: (stock.fl ?? ref * 0.93).toFixed(2), c: '#38bdf8' },
    { k: 'KLGD', v: fmtN(stock.tv ?? 4.9e6), c: '#cbd5e1' },
    { k: 'Cao nhất 52T', v: (data.hi * 1.4).toFixed(2), c: '#cbd5e1' },
    { k: 'Thấp nhất 52T', v: (data.lo * 0.55).toFixed(2), c: '#cbd5e1' },
    { k: 'P/E', v: data.pe[data.pe.length - 1].toFixed(2), c: '#cbd5e1' },
    { k: 'P/B', v: data.pb[data.pb.length - 1].toFixed(2), c: '#cbd5e1' },
    { k: 'Vốn hóa', v: fmtN(lp * 1e9 * 4.5) + ' VND', c: '#cbd5e1' },
  ]

  const statSubDefs: [StatSub, string][] = [['stats', 'Thống kê'], ['foreign', 'Giao dịch NĐTNN'], ['proprietary', 'Tự doanh']]
  const fxValue = [{ k: 'Giá trị mua', v: '6.8 B', c: '#cbd5e1' }, { k: 'Giá trị bán', v: '7.3 B', c: '#cbd5e1' }, { k: 'Giá trị ròng', v: '-466.8 M', c: '#f43f5e' }]
  const fxVol = [{ k: 'KL mua', v: '276.4 K', c: '#cbd5e1' }, { k: 'KL bán', v: '295.3 K', c: '#cbd5e1' }, { k: 'KL ròng', v: '-18.9 K', c: '#f43f5e' }]
  const propValue = [{ k: 'Giá trị mua', v: '44.5 B', c: '#cbd5e1' }, { k: 'Giá trị bán', v: '19.0 B', c: '#cbd5e1' }, { k: 'Giá trị ròng', v: '25.5 B', c: '#22c55e' }]
  const propVol = [{ k: 'KL mua', v: '1.8 M', c: '#cbd5e1' }, { k: 'KL bán', v: '763.4 K', c: '#cbd5e1' }, { k: 'KL ròng', v: '1.0 M', c: '#22c55e' }]

  const sentPeriods: SentPeriod[] = ['1D', '1W', '1M']
  const gaugeCards = [
    { id: 'sdMA', title: 'Đường trung bình', neg: 3, neu: 1, pos: 1, note: 'Giá giảm chậm' },
    { id: 'sdOsc', title: 'Dao động', neg: 6, neu: 0, pos: 4, note: 'Giá giảm trong phiên' },
    { id: 'sdVol', title: 'Biến động', neg: 3, neu: 0, pos: 1, note: 'Giá ổn định, hình thành xu hướng mới' },
  ]
  const A = (v: string) => ({ action: v, c: v === 'Mua' ? '#22c55e' : v === 'Bán' ? '#f43f5e' : '#eab308' })
  const indGroups = [
    {
      title: 'Đường trung bình', rows: [
        { name: 'Trung bình động giản đơn – SMA (20)', ...A('Bán') },
        { name: 'Trung bình động lũy thừa – EMA (20)', ...A('Bán') },
        { name: 'Trung bình động theo khối lượng – VWMA (20)', ...A('Bán') },
        { name: 'Chỉ báo Supertrend (10, 3)', ...A('Mua') },
        { name: 'Giá TB theo khối lượng – VWAP (W)', ...A('Trung lập') },
      ],
    },
    {
      title: 'Dao động', rows: [
        { name: 'MACD (12, 26, 9)', ...A('Mua') },
        { name: 'Chỉ số sức mạnh tương đối – RSI (14)', ...A('Bán') },
        { name: 'Chỉ báo động lượng – MOM (10)', ...A('Bán') },
        { name: 'Tỷ lệ thay đổi (10)', ...A('Bán') },
        { name: 'Chỉ số dòng tiền – MFI (14)', ...A('Bán') },
        { name: 'Chỉ số kênh hàng hóa – CCI (20)', ...A('Mua') },
        { name: 'Dao động Stochastic', ...A('Bán') },
        { name: 'Williams %R (14)', ...A('Bán') },
        { name: 'Dao động Ultimate – UO', ...A('Mua') },
      ],
    },
    {
      title: 'Biến động', rows: [
        { name: 'Dải Bollinger – BB (20, 2)', ...A('Bán') },
        { name: 'Độ lệch chuẩn', ...A('Bán') },
        { name: 'Biên độ dao động TB – ATR (14)', ...A('Trung lập') },
      ],
    },
  ]

  const finSubDefs: [FinSub, string][] = [['overview', 'Tổng quan'], ['indicators', 'Chỉ số']]
  const finPeriodDefs: [FinPeriod, string][] = [['quarter', 'Quý'], ['year', 'Năm']]
  const finColsRaw = finPeriod === 'year' ? data.yCols : ['Q3/2023', 'Q4/2023', 'Q1/2024', 'Q2/2024', 'Q3/2024', 'Q4/2024', 'Q1/2025', 'Q2/2025', 'Q3/2025', 'Q4/2025', 'Q1/2026']
  const Rfin = makeRng(sym + 'fin')
  const mkRow = (label: string, base: number, spread: number, dec: number, isHead?: boolean) => {
    if (isHead) return { label, cells: finColsRaw.map(() => ''), rowBg: '#152234', labelColor: '#cbd5e1', labelWeight: 800 }
    return {
      label, rowBg: 'transparent', labelColor: '#9fb0c2', labelWeight: 500,
      cells: finColsRaw.map(() => { const v = base + (Rfin() - 0.5) * spread; return dec === 0 ? Math.round(v).toLocaleString() : v.toFixed(dec) }),
    }
  }
  const finTable = [
    mkRow('Định giá', 0, 0, 0, true),
    mkRow('Vốn hóa (tỷ VND)', 70000, 60000, 0),
    mkRow('P/E TTM (x)', 15, 60, 2),
    mkRow('P/B TTM (x)', 1.3, 1.0, 2),
    mkRow('ROE (%)', 8, 20, 2),
    mkRow('ROA (%)', 5, 10, 2),
    mkRow('Kết quả kinh doanh', 0, 0, 0, true),
    mkRow('Doanh thu thuần (tỷ VND)', 34000, 16000, 0),
    mkRow('Lợi nhuận gộp (tỷ VND)', 3000, 5000, 0),
    mkRow('Lợi nhuận sau thuế (tỷ VND)', 1500, 4000, 0),
    mkRow('Biên LN gộp (%)', 5, 8, 2),
    mkRow('Biên LN ròng (%)', 4, 6, 2),
    mkRow('EPS (VND)', 1500, 2500, 0),
    mkRow('Bảng cân đối kế toán', 0, 0, 0, true),
    mkRow('Tổng tài sản (tỷ VND)', 90000, 20000, 0),
    mkRow('Vốn chủ sở hữu (tỷ VND)', 55000, 10000, 0),
    mkRow('Tổng nợ (tỷ VND)', 12000, 8000, 0),
    mkRow('Tiền và tương đương tiền (tỷ VND)', 25000, 12000, 0),
  ]

  const research = { rating: upDir ? 'MUA' : 'NẮM GIỮ', ratingColor: upDir ? '#22c55e' : '#eab308', target: (lp * 1.18).toFixed(2), upside: '+18.0%' }
  const reports = [
    { title: sym + ' — Cập nhật doanh nghiệp', tag: 'MUA', tagColor: '#22c55e', tagBg: 'rgba(34,197,94,.15)', date: '02/07/2026', summary: 'Biên lợi nhuận cải thiện nhờ sản lượng tăng và chi phí đầu vào thuận lợi; nâng giá mục tiêu và duy trì quan điểm tích cực.' },
    { title: 'Triển vọng ngành nửa cuối 2026', tag: 'KHẢ QUAN', tagColor: '#60a5fa', tagBg: 'rgba(96,165,250,.15)', date: '28/06/2026', summary: 'Duy trì đánh giá Khả quan với ngành khi nhu cầu phục hồi và định giá vẫn hấp dẫn so với khu vực.' },
    { title: 'Đánh giá KQKD Quý 1/2026', tag: 'TRUNG LẬP', tagColor: '#eab308', tagBg: 'rgba(234,179,8,.15)', date: '29/04/2026', summary: 'Kết quả sát với dự báo. Doanh thu tăng trưởng ổn định trong khi một số khoản mục bất thường ảnh hưởng nhẹ đến lợi nhuận.' },
    { title: 'Ghi chú định giá & rủi ro', tag: 'MUA', tagColor: '#22c55e', tagBg: 'rgba(34,197,94,.15)', date: '15/04/2026', summary: 'Tương quan rủi ro/lợi nhuận thuận lợi ở vùng giá hiện tại; các yếu tố cần theo dõi là chi phí đầu vào và dòng vốn NĐTNN.' },
  ]

  const eventSubDefs: [EventSub, string][] = [['news', 'Tin tức'], ['dividends', 'Cổ tức & Tăng vốn'], ['insider', 'Cổ đông lớn & GD nội bộ'], ['other', 'Sự kiện khác']]
  const eventBank: Record<EventSub, [string, string, string][]> = {
    news: [
      ['02/07/2026', sym + ': Thông qua giao dịch với ngân hàng đối tác', 'Hoạt động khác'],
      ['01/07/2026', sym + ': Ngày ĐKCC trả cổ tức tiền mặt năm 2025', 'Cổ tức'],
      ['30/06/2026', sym + ': Thông qua giao dịch với bên liên quan', 'Hoạt động khác'],
      ['22/06/2026', sym + ': Thông qua kế hoạch trả cổ tức 2025', 'Cổ tức'],
      ['03/06/2026', sym + ': Thông qua hạn mức tín dụng', 'Hoạt động khác'],
      ['29/05/2026', sym + ': Thông qua hợp đồng và giao dịch', 'Hoạt động khác'],
      ['12/05/2026', sym + ': Thay đổi nhân sự', 'Thay đổi nhân sự'],
      ['29/04/2026', sym + ': Giải trình lợi nhuận sau thuế Quý 1/2026', 'Công bố KQKD'],
      ['21/04/2026', sym + ': Ký hợp đồng kiểm toán năm 2026', 'Công bố KQKD'],
    ],
    dividends: [
      ['22/06/2026', sym + ': Thông qua kế hoạch trả cổ tức 2025 (10% tiền mặt)', 'Cổ tức'],
      ['01/07/2026', sym + ': Ngày ĐKCC trả cổ tức tiền mặt năm 2025', 'Cổ tức'],
      ['15/03/2026', sym + ': Hoàn tất trả cổ tức cổ phiếu 5% năm 2024', 'Tăng vốn'],
    ],
    insider: [
      ['18/06/2026', sym + ': Thành viên HĐQT đăng ký mua 500.000 cổ phiếu', 'GD nội bộ'],
      ['02/05/2026', sym + ': Cổ đông lớn bán 1.200.000 cổ phiếu', 'Cổ đông lớn'],
      ['12/03/2026', sym + ': Tổng Giám đốc hoàn tất mua 200.000 cổ phiếu', 'GD nội bộ'],
    ],
    other: [
      ['20/05/2026', sym + ': Sửa đổi, bổ sung Điều lệ công ty', 'Hoạt động khác'],
      ['12/05/2026', sym + ': Thay đổi mẫu con dấu', 'Hoạt động khác'],
      ['12/05/2026', sym + ': Thay đổi Giấy chứng nhận đăng ký doanh nghiệp', 'Hoạt động khác'],
    ],
  }
  const events = (eventBank[eventSub] || []).map(([date, title, type]) => ({ date, title, type }))

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 400,
        background: 'rgba(4,8,14,.72)', backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: 'min(1560px, 97vw)', height: '93vh', background: '#0b1420',
          border: '1px solid #1e2c3d', borderRadius: 12,
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          boxShadow: '0 40px 120px rgba(0,0,0,.7)',
          animation: 'sdIn .2s ease',
        }}
      >
        {/* TITLE BAR */}
        <div style={{
          flexShrink: 0, height: 52,
          background: 'linear-gradient(180deg, #243347, #1b2838)',
          borderBottom: '1px solid #1e2c3d',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px',
        }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#eef3f9', letterSpacing: '.2px' }}>Phân tích chuyên sâu cổ phiếu</span>
          <div onClick={onClose} style={{ cursor: 'pointer', width: 30, height: 30, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#93a4b8', fontSize: 18 }}>✕</div>
        </div>

        {/* SYMBOL ROW */}
        <div style={{ flexShrink: 0, padding: '12px 20px 10px', display: 'flex', alignItems: 'center', gap: 18, borderBottom: '1px solid #14202e' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#111c29', border: '1px solid #24344a', borderRadius: 7, padding: '7px 12px', minWidth: 120 }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: '#eef3f9', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '.5px' }}>{sym}</span>
          </div>
          <span style={{ fontSize: 26, fontWeight: 800, color: col, fontFamily: "'JetBrains Mono', monospace" }}>{lp.toFixed(2)}</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: col, fontFamily: "'JetBrains Mono', monospace" }}>{chg >= 0 ? '+' : ''}{chg.toFixed(2)}</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: col, fontFamily: "'JetBrains Mono', monospace" }}>{pct >= 0 ? '+' : ''}{pct.toFixed(2)}%</span>
          <span style={{ fontSize: 13, color: '#8fa1b4', fontWeight: 500 }}>{company} <span style={{ color: '#5f7488' }}>(HOSE)</span></span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14, color: '#6b7d92', fontSize: 16 }}>
            <span style={{ cursor: 'pointer' }}>🔔</span>
            <span onClick={() => setStarred(p => !p)} style={{ cursor: 'pointer', color: starred ? '#fbbf24' : '#6b7d92' }}>{starred ? '★' : '☆'}</span>
          </div>
        </div>

        {/* TABS */}
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'stretch', gap: 2, padding: '0 20px', borderBottom: '1px solid #1a2736', background: '#0b1420' }}>
          {tabDefs.map(([k, label]) => (
            <div key={k} onClick={() => setTab(k)} style={{ cursor: 'pointer', padding: '12px 4px', marginRight: 22, fontSize: 13.5, fontWeight: tab === k ? 700 : 500, color: tab === k ? '#fff' : '#8296ab', borderBottom: tab === k ? '2px solid #2f7fff' : '2px solid transparent', transition: 'color .12s', whiteSpace: 'nowrap' }}>{label}</div>
          ))}
        </div>

        {/* BODY */}
        <div id="sdScroll" style={{ flex: 1, overflowY: 'auto', background: '#08111b', padding: '16px 20px 22px' }}>

          {/* ═══ OVERVIEW ═══ */}
          {tab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 356px', gap: 14, alignItems: 'start', animation: 'sdFade .2s ease' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
                <div style={{ background: '#0d1826', border: '1px solid #1b2838', borderRadius: 10, padding: '14px 16px 10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>Biến động giá</span>
                    <span style={{ fontSize: 11, color: '#f43f5e' }}>●</span>
                  </div>
                  <div id="sdPrice" style={{ width: '100%', height: 320 }} />
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginTop: 10 }}>
                    {rangeDefs.map(([k, label, pctVal]) => {
                      const active = ovRange === k
                      const pos = pctVal[0] === '+'
                      return (
                        <div key={k} onClick={() => setOvRange(k)} style={{ cursor: 'pointer', textAlign: 'center', background: active ? '#182b42' : '#101c29', border: '1px solid ' + (active ? '#2f5f9a' : '#1b2838'), borderRadius: 7, padding: '8px 4px' }}>
                          <div style={{ fontSize: 11.5, fontWeight: 700, color: active ? '#fff' : '#cbd5e1' }}>{label}</div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: pos ? '#22c55e' : '#f43f5e', marginTop: 2 }}>{pctVal}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                  <div style={{ background: '#0d1826', border: '1px solid #1b2838', borderRadius: 10, padding: '12px 14px' }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: '#e2e8f0' }}>Thanh khoản</span>
                    <div id="sdLiq" style={{ width: '100%', height: 170, marginTop: 6 }} />
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', fontSize: 9.5, color: '#7d90a5', marginTop: 4 }}>
                      <span style={{ color: '#3b82f6' }}>● Hôm nay</span><span style={{ color: '#94a3b8' }}>● Hôm qua</span><span style={{ color: '#eab308' }}>● 1 Tuần</span>
                    </div>
                  </div>
                  <div style={{ background: '#0d1826', border: '1px solid #1b2838', borderRadius: 10, padding: '12px 14px' }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: '#e2e8f0' }}>Khối ngoại</span>
                    <div id="sdForeign" style={{ width: '100%', height: 170, marginTop: 6 }} />
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', fontSize: 9.5, color: '#7d90a5', marginTop: 4 }}>
                      <span style={{ color: '#22c55e' }}>● Mua</span><span style={{ color: '#f43f5e' }}>● Bán</span><span style={{ color: '#94a3b8' }}>● Hôm qua</span>
                    </div>
                  </div>
                  <div style={{ background: '#0d1826', border: '1px solid #1b2838', borderRadius: 10, padding: '12px 14px' }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: '#e2e8f0' }}>Tâm lý kỹ thuật</span>
                    <div id="sdSentiment" style={{ width: '100%', height: 150, marginTop: 6 }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', textAlign: 'center', marginTop: 2 }}>
                      <div><div style={{ fontSize: 9.5, color: '#f43f5e', fontWeight: 700 }}>Tiêu cực</div><div style={{ fontSize: 13, fontWeight: 800, color: '#e2e8f0' }}>{sent.neg}</div></div>
                      <div><div style={{ fontSize: 9.5, color: '#94a3b8', fontWeight: 700 }}>Trung lập</div><div style={{ fontSize: 13, fontWeight: 800, color: '#e2e8f0' }}>{sent.neu}</div></div>
                      <div><div style={{ fontSize: 9.5, color: '#22c55e', fontWeight: 700 }}>Tích cực</div><div style={{ fontSize: 13, fontWeight: 800, color: '#e2e8f0' }}>{sent.pos}</div></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDEBAR */}
              <div style={{ background: '#0d1826', border: '1px solid #1b2838', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <div onClick={() => setOvPanel('keymetrics')} style={{ cursor: 'pointer', flex: 1, textAlign: 'center', padding: 6, borderRadius: 7, fontSize: 11.5, fontWeight: 700, background: ovPanel === 'keymetrics' ? '#2f7fff' : '#101c29', color: ovPanel === 'keymetrics' ? '#fff' : '#8296ab' }}>Chỉ số chính</div>
                  <div onClick={() => setOvPanel('timesales')} style={{ cursor: 'pointer', flex: 1, textAlign: 'center', padding: 6, borderRadius: 7, fontSize: 11.5, fontWeight: 700, background: ovPanel === 'timesales' ? '#2f7fff' : '#101c29', color: ovPanel === 'timesales' ? '#fff' : '#8296ab' }}>Khớp lệnh</div>
                </div>

                {ovPanel === 'keymetrics' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {keyMetrics.map((km, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 6px', borderBottom: '1px solid #14202e' }}>
                        <span style={{ fontSize: 11, color: '#8296ab' }}>{km.k}</span>
                        <span style={{ fontSize: 11.5, fontWeight: 700, color: km.c, fontFamily: "'JetBrains Mono', monospace" }}>{km.v}</span>
                      </div>
                    ))}
                  </div>
                )}

                {ovPanel === 'timesales' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {depthRows.map((d, i) => (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderRadius: 5, overflow: 'hidden', fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5 }}>
                        <span style={{ background: 'rgba(34,197,94,.16)', padding: '7px 8px', color: '#cbd5e1' }}>{d.bv}</span>
                        <span style={{ background: 'rgba(34,197,94,.16)', padding: '7px 8px', textAlign: 'right', color: '#22c55e', fontWeight: 700 }}>{d.bp}</span>
                        <span style={{ background: 'rgba(244,63,94,.16)', padding: '7px 8px', color: '#f43f5e', fontWeight: 700 }}>{d.ap}</span>
                        <span style={{ background: 'rgba(244,63,94,.16)', padding: '7px 8px', textAlign: 'right', color: '#cbd5e1' }}>{d.av}</span>
                      </div>
                    ))}
                    <div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0' }}>Nhật ký khớp lệnh</span>
                      <div className="sdSb" style={{ marginTop: 6, maxHeight: 280, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 18px', padding: '2px 6px', fontSize: 10, color: '#5f7488', fontWeight: 700, position: 'sticky', top: 0, background: '#0d1826' }}>
                          <span>Giờ</span><span style={{ textAlign: 'right' }}>Giá</span><span style={{ textAlign: 'right' }}>KL</span><span></span>
                        </div>
                        {tradeLog.map((tl, i) => (
                          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 18px', padding: '5px 6px', fontSize: 11, fontFamily: "'JetBrains Mono', monospace", borderBottom: '1px solid #101c29' }}>
                            <span style={{ color: '#8296ab' }}>{tl.time}</span>
                            <span style={{ textAlign: 'right', color: tl.pc }}>{tl.price}</span>
                            <span style={{ textAlign: 'right', color: '#cbd5e1' }}>{tl.vol}</span>
                            <span style={{ textAlign: 'center', color: tl.sc, fontWeight: 700, fontSize: 9.5 }}>{tl.side}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ background: '#0f2033', border: '1px solid #1c3450', borderRadius: 8, padding: 10 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', fontSize: 10, color: '#7d90a5', fontWeight: 700, paddingBottom: 6 }}><span></span><span style={{ textAlign: 'right' }}>Khối lượng</span><span style={{ textAlign: 'right' }}>Giá trị</span></div>
                      {aggr.map((a, i) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', padding: '4px 0', fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>
                          <span style={{ color: a.c, fontWeight: 600 }}>{a.k}</span>
                          <span style={{ textAlign: 'right', color: '#cbd5e1' }}>{a.vol}</span>
                          <span style={{ textAlign: 'right', color: '#cbd5e1' }}>{a.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══ STATISTICS ═══ */}
          {tab === 'stats' && (
            <div style={{ animation: 'sdFade .2s ease' }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                {statSubDefs.map(([k, label]) => (
                  <div key={k} onClick={() => setStatSub(k)} style={{ cursor: 'pointer', padding: '6px 14px', borderRadius: 7, fontSize: 12, fontWeight: 700, background: statSub === k ? '#2f7fff' : 'transparent', color: statSub === k ? '#fff' : '#8296ab' }}>{label}</div>
                ))}
              </div>

              {statSub === 'stats' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, alignItems: 'start' }}>
                  <div style={{ background: '#0d1826', border: '1px solid #1b2838', borderRadius: 10, padding: '14px 16px' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>Thanh khoản</span>
                    <div id="sdStatLiq" style={{ width: '100%', height: 440, marginTop: 8 }} />
                  </div>
                  <div style={{ background: '#0d1826', border: '1px solid #1b2838', borderRadius: 10, padding: '14px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>Nhật ký khớp lệnh</span>
                      <span style={{ fontSize: 12, color: '#8296ab' }}>Giá TB (VWAP): <b style={{ color: '#e2e8f0' }}>{data.vwap.toFixed(3)}</b></span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.15fr .85fr', gap: 8, marginTop: 8 }}>
                      <div id="sdDepth" style={{ width: '100%', height: 400 }} />
                      <div className="sdSb" style={{ maxHeight: 400, overflowY: 'auto' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 16px', padding: '2px 4px', fontSize: 9.5, color: '#5f7488', fontWeight: 700, position: 'sticky', top: 0, background: '#0d1826' }}><span></span><span style={{ textAlign: 'right' }}>Giá</span><span style={{ textAlign: 'right' }}>KL</span><span></span></div>
                        {tradeLog.map((tl, i) => (
                          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 16px', padding: 4, fontSize: 10.5, fontFamily: "'JetBrains Mono', monospace", borderBottom: '1px solid #101c29' }}>
                            <span style={{ color: '#8296ab' }}>{tl.time}</span>
                            <span style={{ textAlign: 'right', color: tl.pc }}>{tl.price}</span>
                            <span style={{ textAlign: 'right', color: '#cbd5e1' }}>{tl.vol}</span>
                            <span style={{ textAlign: 'center', color: tl.sc, fontWeight: 700, fontSize: 9 }}>{tl.side}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {statSub === 'foreign' && (
                <div style={{ display: 'grid', gridTemplateColumns: '270px 1fr', gap: 14, alignItems: 'start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ background: '#0d1826', border: '1px solid #1b2838', borderRadius: 10, padding: 14, display: 'flex', flexDirection: 'column', gap: 9 }}>
                      {fxValue.map((f, i) => (<div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 12, color: '#8296ab' }}>{f.k}</span><span style={{ fontSize: 12.5, fontWeight: 700, color: f.c, fontFamily: "'JetBrains Mono', monospace" }}>{f.v}</span></div>))}
                    </div>
                    <div style={{ background: '#0d1826', border: '1px solid #1b2838', borderRadius: 10, padding: 14, display: 'flex', flexDirection: 'column', gap: 9 }}>
                      {fxVol.map((f, i) => (<div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 12, color: '#8296ab' }}>{f.k}</span><span style={{ fontSize: 12.5, fontWeight: 700, color: f.c, fontFamily: "'JetBrains Mono', monospace" }}>{f.v}</span></div>))}
                    </div>
                    <div style={{ background: '#0f2033', border: '1px solid #1c3450', borderRadius: 10, padding: '12px 14px', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#60a5fa' }}>Room NN</span>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: '#e2e8f0', fontFamily: "'JetBrains Mono', monospace" }}>2.4 B (47.91%)</span>
                    </div>
                  </div>
                  <div style={{ background: '#0d1826', border: '1px solid #1b2838', borderRadius: 10, padding: '14px 16px' }}>
                    <div id="sdFxArea" style={{ width: '100%', height: 440 }} />
                  </div>
                </div>
              )}

              {statSub === 'proprietary' && (
                <div style={{ display: 'grid', gridTemplateColumns: '270px 1fr', gap: 14, alignItems: 'start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ background: '#0d1826', border: '1px solid #1b2838', borderRadius: 10, padding: 14, display: 'flex', flexDirection: 'column', gap: 9 }}>
                      {propValue.map((f, i) => (<div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 12, color: '#8296ab' }}>{f.k}</span><span style={{ fontSize: 12.5, fontWeight: 700, color: f.c, fontFamily: "'JetBrains Mono', monospace" }}>{f.v}</span></div>))}
                    </div>
                    <div style={{ background: '#0d1826', border: '1px solid #1b2838', borderRadius: 10, padding: 14, display: 'flex', flexDirection: 'column', gap: 9 }}>
                      {propVol.map((f, i) => (<div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 12, color: '#8296ab' }}>{f.k}</span><span style={{ fontSize: 12.5, fontWeight: 700, color: f.c, fontFamily: "'JetBrains Mono', monospace" }}>{f.v}</span></div>))}
                    </div>
                  </div>
                  <div style={{ background: '#0d1826', border: '1px solid #1b2838', borderRadius: 10, padding: '14px 16px' }}>
                    <div id="sdPropBar" style={{ width: '100%', height: 440 }} />
                    <div style={{ display: 'flex', gap: 20, justifyContent: 'center', fontSize: 10, color: '#7d90a5', marginTop: 4 }}><span style={{ color: '#22c55e' }}>● Mua ròng</span><span style={{ color: '#f43f5e' }}>● Bán ròng</span></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══ TECHNICAL CHART ═══ */}
          {tab === 'tech' && (
            <div style={{ animation: 'sdFade .2s ease', background: '#0b1219', border: '1px solid #1b2838', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderBottom: '1px solid #16222f' }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: '#e2e8f0' }}>Biểu đồ kỹ thuật — {sym}</span>
                <span style={{ fontSize: 10.5, color: '#5f7488' }}>Nguồn: TradingView · Thời gian thực</span>
                <a href={tvOpenUrl} target="_blank" rel="noreferrer" style={{ marginLeft: 'auto', textDecoration: 'none', background: '#182b42', border: '1px solid #2f5f9a', color: '#93c5fd', borderRadius: 6, padding: '5px 12px', fontSize: 11, fontWeight: 700 }}>Mở trên TradingView ↗</a>
              </div>
              <iframe src={tvIframeUrl} style={{ width: '100%', height: 640, border: 'none', background: '#0b1219' }} allowTransparency scrolling="no" title="TradingView chart" />
            </div>
          )}

          {/* ═══ TECHNICAL SENTIMENT ═══ */}
          {tab === 'sentiment' && (
            <div style={{ animation: 'sdFade .2s ease' }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                {sentPeriods.map(p => (
                  <div key={p} onClick={() => setSentPeriod(p)} style={{ cursor: 'pointer', padding: '5px 14px', borderRadius: 7, fontSize: 12, fontWeight: 700, background: sentPeriod === p ? '#2f7fff' : 'transparent', color: sentPeriod === p ? '#fff' : '#8296ab' }}>{p}</div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 460px', gap: 16, alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ background: '#0d1826', border: '1px solid #1b2838', borderRadius: 10, padding: 16 }}>
                    <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>Tổng quan</div>
                    <div id="sdSum" style={{ width: '100%', height: 200 }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', textAlign: 'center' }}>
                      <div><div style={{ fontSize: 11, color: '#f43f5e', fontWeight: 700 }}>Tiêu cực</div><div style={{ fontSize: 16, fontWeight: 800, color: '#e2e8f0' }}>{sent.neg}</div></div>
                      <div><div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>Trung lập</div><div style={{ fontSize: 16, fontWeight: 800, color: '#e2e8f0' }}>{sent.neu}</div></div>
                      <div><div style={{ fontSize: 11, color: '#22c55e', fontWeight: 700 }}>Tích cực</div><div style={{ fontSize: 16, fontWeight: 800, color: '#e2e8f0' }}>{sent.pos}</div></div>
                    </div>
                    <div style={{ borderTop: '1px solid #182634', marginTop: 12, paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11.5 }}>
                      <div style={{ display: 'flex', gap: 10 }}><span style={{ color: '#7d90a5', minWidth: 140 }}>Khuyến nghị:</span><span style={{ color: '#cbd5e1' }}>{sentTxt.rec}</span></div>
                      <div style={{ display: 'flex', gap: 10 }}><span style={{ color: '#7d90a5', minWidth: 140 }}>Tỷ lệ giải ngân:</span><span style={{ color: '#cbd5e1' }}>{sentTxt.disb}</span></div>
                      <div style={{ display: 'flex', gap: 10 }}><span style={{ color: '#7d90a5', minWidth: 140 }}>Gợi ý chiến lược:</span><span style={{ color: '#cbd5e1' }}>{sentTxt.strat}</span></div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                    {gaugeCards.map(g => (
                      <div key={g.id} style={{ background: '#0d1826', border: '1px solid #1b2838', borderRadius: 10, padding: 12 }}>
                        <div style={{ textAlign: 'center', fontSize: 12.5, fontWeight: 700, color: '#e2e8f0' }}>{g.title}</div>
                        <div id={g.id} style={{ width: '100%', height: 150 }} />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', textAlign: 'center', fontSize: 10 }}>
                          <div><div style={{ color: '#f43f5e', fontWeight: 700 }}>Tiêu cực</div><div style={{ color: '#e2e8f0', fontWeight: 800 }}>{g.neg}</div></div>
                          <div><div style={{ color: '#94a3b8', fontWeight: 700 }}>Trung lập</div><div style={{ color: '#e2e8f0', fontWeight: 800 }}>{g.neu}</div></div>
                          <div><div style={{ color: '#22c55e', fontWeight: 700 }}>Tích cực</div><div style={{ color: '#e2e8f0', fontWeight: 800 }}>{g.pos}</div></div>
                        </div>
                        <div style={{ textAlign: 'center', fontSize: 10, color: '#7d90a5', marginTop: 6 }}>{g.note}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ background: '#0d1826', border: '1px solid #1b2838', borderRadius: 10, overflow: 'hidden' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 70px', padding: '11px 14px', borderBottom: '1px solid #182634', fontSize: 11.5, fontWeight: 700, color: '#8296ab' }}><span>Chỉ báo</span><span style={{ textAlign: 'right' }}>Tín hiệu</span></div>
                  <div className="sdSb" style={{ maxHeight: 560, overflowY: 'auto' }}>
                    {indGroups.map((grp, gi) => (
                      <div key={gi}>
                        <div style={{ padding: '8px 14px', background: '#111c29', fontSize: 11, fontWeight: 800, color: '#cbd5e1' }}>{grp.title}</div>
                        {grp.rows.map((row, ri) => (
                          <div key={ri} style={{ display: 'grid', gridTemplateColumns: '1fr 70px', padding: '9px 14px', borderBottom: '1px solid #101c29', fontSize: 11.5 }}>
                            <span style={{ color: '#b9c6d4' }}>{row.name}</span>
                            <span style={{ textAlign: 'right', fontWeight: 700, color: row.c }}>{row.action}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══ FINANCIALS ═══ */}
          {tab === 'fin' && (
            <div style={{ animation: 'sdFade .2s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {finSubDefs.map(([k, label]) => (
                    <div key={k} onClick={() => setFinSub(k)} style={{ cursor: 'pointer', padding: '6px 14px', borderRadius: 7, fontSize: 12, fontWeight: 700, background: finSub === k ? '#2f7fff' : 'transparent', color: finSub === k ? '#fff' : '#8296ab' }}>{label}</div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {finPeriodDefs.map(([k, label]) => (
                    <div key={k} onClick={() => setFinPeriod(k)} style={{ cursor: 'pointer', padding: '6px 12px', fontSize: 12, fontWeight: 700, color: finPeriod === k ? '#fff' : '#8296ab', borderBottom: '2px solid ' + (finPeriod === k ? '#2f7fff' : 'transparent') }}>{label}</div>
                  ))}
                </div>
              </div>

              {finSub === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ background: '#0d1826', border: '1px solid #1b2838', borderRadius: 10, padding: '14px 16px' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>Định giá</span>
                    <div id="sdValuation" style={{ width: '100%', height: 300, marginTop: 6 }} />
                    <div style={{ display: 'flex', gap: 24, justifyContent: 'center', fontSize: 11, color: '#7d90a5' }}><span style={{ color: '#3b82f6' }}>● P/E TTM</span><span style={{ color: '#eab308' }}>● P/B TTM</span></div>
                  </div>
                  <div style={{ background: '#0d1826', border: '1px solid #1b2838', borderRadius: 10, padding: '14px 16px' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>Kết quả kinh doanh</span>
                    <div id="sdPerf" style={{ width: '100%', height: 320, marginTop: 6 }} />
                    <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap', fontSize: 10.5, color: '#7d90a5' }}>
                      <span style={{ color: '#3b82f6' }}>● Doanh thu thuần (tỷ VND)</span>
                      <span style={{ color: '#22c55e' }}>● Lợi nhuận thuần (tỷ VND)</span>
                      <span style={{ color: '#eab308' }}>● Tăng trưởng DT theo quý</span>
                      <span style={{ color: '#cbd5e1' }}>● Tăng trưởng LN theo quý</span>
                    </div>
                  </div>
                </div>
              )}

              {finSub === 'indicators' && (
                <div className="sdSb" style={{ background: '#0d1826', border: '1px solid #1b2838', borderRadius: 10, overflow: 'auto', maxHeight: 620 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5, whiteSpace: 'nowrap' }}>
                    <thead>
                      <tr style={{ position: 'sticky', top: 0, background: '#152234', zIndex: 2 }}>
                        <th style={{ textAlign: 'left', padding: '10px 14px', color: '#8296ab', fontWeight: 700, position: 'sticky', left: 0, background: '#152234', minWidth: 190 }}></th>
                        {finColsRaw.map((c, i) => (
                          <th key={i} style={{ textAlign: 'right', padding: '10px 14px', color: '#b9c6d4', fontWeight: 700 }}>{c}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {finTable.map((r, ri) => (
                        <tr key={ri} style={{ background: r.rowBg, borderBottom: '1px solid #101c29' }}>
                          <td style={{ textAlign: 'left', padding: '9px 14px', color: r.labelColor, fontWeight: r.labelWeight, position: 'sticky', left: 0, background: r.rowBg }}>{r.label}</td>
                          {r.cells.map((v, ci) => (
                            <td key={ci} style={{ textAlign: 'right', padding: '9px 14px', color: '#cbd5e1', fontFamily: "'JetBrains Mono', monospace" }}>{v}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ═══ RESEARCH ═══ */}
          {tab === 'research' && (
            <div style={{ animation: 'sdFade .2s ease', display: 'grid', gridTemplateColumns: '280px 1fr', gap: 14, alignItems: 'start' }}>
              <div style={{ background: '#0d1826', border: '1px solid #1b2838', borderRadius: 10, padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#7d90a5', fontWeight: 700 }}>Khuyến nghị</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: research.ratingColor, marginTop: 4 }}>{research.rating}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #182634', paddingTop: 10 }}><span style={{ fontSize: 12, color: '#8296ab' }}>Giá mục tiêu</span><span style={{ fontSize: 13, fontWeight: 800, color: '#22c55e', fontFamily: "'JetBrains Mono', monospace" }}>{research.target}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 12, color: '#8296ab' }}>Tiềm năng tăng giá</span><span style={{ fontSize: 13, fontWeight: 800, color: '#22c55e', fontFamily: "'JetBrains Mono', monospace" }}>{research.upside}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 12, color: '#8296ab' }}>Giá hiện tại</span><span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', fontFamily: "'JetBrains Mono', monospace" }}>{lp.toFixed(2)}</span></div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {reports.map((rp, i) => (
                  <div key={i} style={{ background: '#0d1826', border: '1px solid #1b2838', borderRadius: 10, padding: '14px 16px', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>{rp.title}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: rp.tagColor, background: rp.tagBg, padding: '3px 9px', borderRadius: 10 }}>{rp.tag}</span>
                    </div>
                    <p style={{ margin: '8px 0 0', fontSize: 11.5, color: '#8296ab', lineHeight: 1.6 }}>{rp.summary}</p>
                    <div style={{ marginTop: 8, fontSize: 10.5, color: '#5f7488' }}>{rp.date} · Ray Research</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ EVENTS ═══ */}
          {tab === 'events' && (
            <div style={{ animation: 'sdFade .2s ease' }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                {eventSubDefs.map(([k, label]) => (
                  <div key={k} onClick={() => setEventSub(k)} style={{ cursor: 'pointer', padding: '6px 14px', borderRadius: 7, fontSize: 12, fontWeight: 700, background: eventSub === k ? '#2f7fff' : 'transparent', color: eventSub === k ? '#fff' : '#8296ab' }}>{label}</div>
                ))}
              </div>
              <div style={{ background: '#0d1826', border: '1px solid #1b2838', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr 220px', padding: '11px 16px', borderBottom: '1px solid #182634', fontSize: 11.5, fontWeight: 700, color: '#8296ab' }}><span>Ngày công bố</span><span>Tiêu đề</span><span>Loại</span></div>
                {events.map((ev, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '150px 1fr 220px', padding: '11px 16px', borderBottom: '1px solid #101c29', fontSize: 12 }}>
                    <span style={{ color: '#8296ab', fontFamily: "'JetBrains Mono', monospace" }}>{ev.date}</span>
                    <span style={{ color: '#dbe3ec' }}>{ev.title}</span>
                    <span style={{ color: '#8296ab' }}>{ev.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
