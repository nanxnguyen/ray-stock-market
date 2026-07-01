import { useState, useEffect, useCallback, useMemo } from 'react'
import type {
  ThemeTokens,
  StockState,
  StockRow,
  MarketIndexState,
  MarketIndexView,
  ChartState,
  ChartView,
} from './types/priceboard'
import type { VietcapFilterGroup } from './types/vietcap'
import { VN30_SYMBOLS, createInitialIndices } from './data/mockMarket'
import { createInitialStocks, tickStocks, tickIndices } from './lib/marketSimulation'
import { formatPrice, formatQuantity, priceColor, toPolylinePoints, toAreaPath } from './lib/marketFormat'
import { filterStocks } from './lib/filterStocks'
import { getAllCoveredWarrants } from './lib/vietcapNormalize'
import TopBar from './components/TopBar'
import IndexStrip from './components/IndexStrip'
import FilterBar from './components/FilterBar'
import StockTable from './components/StockTable'
import FooterBar from './components/FooterBar'
import IntradayChartModal from './components/IntradayChartModal'
import './App.css'

function getTheme(dark: boolean): ThemeTokens {
  return {
    appBg:       dark ? '#060d18' : '#f0f4f8',
    navBg:       dark ? '#0d1624' : '#ffffff',
    navBorder:   dark ? '#1e3a5f' : '#e2e8f0',
    navItemColor:dark ? '#94a3b8' : '#374151',
    idxColBorder:dark ? '#1e3a5f' : '#e8edf4',
    idxTitle:    dark ? '#e2e8f0' : '#1e293b',
    glItemBorder:dark ? '#1a2d45' : '#f1f5f9',
    glNameColor: dark ? '#cbd5e1' : '#334155',
    filterBorder:dark ? '#1e3a5f' : '#e2e8f0',
    searchText:  dark ? '#475569' : '#cbd5e1',
    tabFg:       dark ? '#94a3b8' : '#374151',
    tabBorder:   dark ? '1px solid #1e3a5f' : '1px solid #e2e8f0',
    tableBg:     dark ? '#060d18' : '#f8fafc',
    rowOdd:      dark ? '#0f1929' : '#ffffff',
    rowEven:     dark ? '#0d1624' : '#f8fafc',
    rowBorder:   dark ? '#152033' : '#e8edf3',
    cellBorder:  dark ? '#1e3a5f' : '#e2e8f0',
    cellBorderL: dark ? '#152033' : '#eef2f7',
    symColor:    dark ? '#60a5fa' : '#1d4ed8',
    volColor:    dark ? '#7fa8cc' : '#475569',
    iconBg:      dark ? '#1a2d45' : '#f1f5f9',
    iconColor:   dark ? '#94a3b8' : '#64748b',
    text:        dark ? '#e2e8f0' : '#1e293b',
    toggleBg:    dark ? '#2563eb' : '#475569',
    togglePos:   dark ? '22px' : '2px',
    toggleIcon:  dark ? '\u2600' : '\uD83C\uDF19',
    toggleTitle: dark ? 'Chuyển Light mode' : 'Chuyển Dark mode',
  }
}

function mapStockRows(
  stocks: StockState[],
  dark: boolean,
  th: ThemeTokens,
  openChart: (sym: string) => void,
): StockRow[] {
  const now = Date.now()
  return stocks.map((s, i) => {
    const fl = s.fl_ && now - s.fts < 800
    const bg = fl
      ? s.fl_ === 'u'
        ? dark ? '#14532d' : '#dcfce7'
        : dark ? '#450a0a' : '#fee2e2'
      : i % 2 === 0
        ? th.rowOdd
        : th.rowEven
    const pc = (p: number) => priceColor(p, s.r, s.cl, s.fl)
    const chg = +(s.lp - s.r).toFixed(2)
    const fbal = s.fb - s.fs
    const avg = +((s.hi + s.lo + s.lp) / 3).toFixed(2)
    return {
      sym: s.s,
      ng: s.ng,
      bg,
      ceil: formatPrice(s.cl),
      tc: formatPrice(s.r),
      floor: formatPrice(s.fl),
      b3p: formatPrice(s.b3p), b3q: formatQuantity(s.b3q), b3c: pc(s.b3p),
      b2p: formatPrice(s.b2p), b2q: formatQuantity(s.b2q), b2c: pc(s.b2p),
      b1p: formatPrice(s.b1p), b1q: formatQuantity(s.b1q), b1c: pc(s.b1p),
      lp: formatPrice(s.lp), lq: formatQuantity(s.lq), lc: pc(s.lp),
      pct: (s.pct >= 0 ? '+' : '') + s.pct.toFixed(1) + '%',
      pc: s.pct > 0 ? '#4ade80' : s.pct < 0 ? '#f87171' : '#facc15',
      chg: (chg >= 0 ? '+' : '') + formatPrice(chg),
      tvol: formatQuantity(s.tv),
      a1p: formatPrice(s.a1p), a1q: formatQuantity(s.a1q), a1c: pc(s.a1p),
      a2p: formatPrice(s.a2p), a2q: formatQuantity(s.a2q), a2c: pc(s.a2p),
      a3p: formatPrice(s.a3p), a3q: formatQuantity(s.a3q), a3c: pc(s.a3p),
      hi: formatPrice(s.hi), hc: pc(s.hi),
      avg: formatPrice(avg), ac: pc(avg),
      lo: formatPrice(s.lo), oc: pc(s.lo),
      fbuy: s.fb > 0 ? formatQuantity(s.fb) : '',
      fsell: s.fs > 0 ? formatQuantity(s.fs) : '',
      fbal: fbal ? ((fbal > 0 ? '+' : '') + formatQuantity(Math.abs(fbal))) : '',
      fbc: fbal >= 0 ? '#4ade80' : '#f87171',
      room: s.rm ? formatQuantity(Math.abs(s.rm)) : '',
      kltt: formatQuantity(Math.abs(s.rm) || s.tv),
      onChart: () => openChart(s.s),
    }
  })
}

function mapIndexViews(indices: MarketIndexState[]): MarketIndexView[] {
  return indices.map((idx) => {
    const color = idx.ch >= 0 ? '#4ade80' : '#f87171'
    return {
      name: idx.n,
      color,
      val: idx.v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      chg: `${idx.ch >= 0 ? '+' : ''}${idx.ch.toFixed(2)} (${idx.pct >= 0 ? '+' : ''}${idx.pct.toFixed(2)}%)`,
      vol: idx.vol,
      up: idx.up,
      dn: idx.dn,
      nc: idx.nc,
      pts: toPolylinePoints(idx.h),
      fill: toAreaPath(idx.h),
    }
  })
}

function App() {
  const [time, setTime] = useState(new Date())
  const [stocks, setStocks] = useState<StockState[]>(() => createInitialStocks())
  const [indices, setIndices] = useState<MarketIndexState[]>(() => createInitialIndices())
  const [darkMode, setDarkMode] = useState(true)
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
  const [chart, setChart] = useState<ChartState>({ open: false, sym: '', range: '1D' })

  const th = useMemo(() => getTheme(darkMode), [darkMode])

  const openChart = useCallback((sym: string) => {
    setChart({ open: true, sym, range: '1D' })
  }, [])

  const closeChart = useCallback(() => {
    setChart((prev) => ({ ...prev, open: false }))
  }, [])

  useEffect(() => {
    const c = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(c)
  }, [])

  useEffect(() => {
    if (stocks.length === 0) return
    const p = setInterval(() => {
      setStocks((prev) => tickStocks(prev, Date.now()))
    }, 1100)
    return () => clearInterval(p)
  }, [stocks.length])

  useEffect(() => {
    if (indices.length === 0) return
    const i = setInterval(() => {
      setIndices((prev) => tickIndices(prev))
    }, 2800)
    return () => clearInterval(i)
  }, [indices.length])

  useEffect(() => {
    const params = new URLSearchParams()
    params.set('filter-group', filter.group)
    params.set('filter-value', filter.value)
    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState({}, '', newUrl)
  }, [filter.group, filter.value])

  const timeStr = `${String(time.getDate()).padStart(2, '0')}/${String(time.getMonth() + 1).padStart(2, '0')}/${time.getFullYear()} ${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}:${String(time.getSeconds()).padStart(2, '0')}`

  const toggleDark = () => setDarkMode((p) => !p)

  const allStocks = useMemo(() => {
    const rows = mapStockRows(stocks, darkMode, th, openChart)
    
    // Add CW data when filter is CW
    if (filter.group === 'CW') {
      const cwRaw = getAllCoveredWarrants()
      const cwRows = cwRaw.map((cw, i) => {
        const pc = (p: number) => priceColor(p, cw.r, cw.cl, cw.fl)
        const chg = +(cw.lp - cw.r).toFixed(2)
        const fbal = cw.fb - cw.fs
        const avg = +((cw.hi + cw.lo + cw.lp) / 3).toFixed(2)
        return {
          sym: cw.s,
          ng: cw.ng,
          bg: i % 2 === 0 ? th.rowOdd : th.rowEven,
          ceil: formatPrice(cw.cl),
          tc: formatPrice(cw.r),
          floor: formatPrice(cw.fl),
          b3p: '', b3q: '', b3c: '',
          b2p: '', b2q: '', b2c: '',
          b1p: '', b1q: '', b1c: '',
          lp: formatPrice(cw.lp), lq: formatQuantity(cw.lq), lc: pc(cw.lp),
          pct: (cw.pct >= 0 ? '+' : '') + cw.pct.toFixed(1) + '%',
          pc: cw.pct > 0 ? '#4ade80' : cw.pct < 0 ? '#f87171' : '#facc15',
          chg: (chg >= 0 ? '+' : '') + formatPrice(chg),
          tvol: formatQuantity(cw.tv),
          a1p: '', a1q: '', a1c: '',
          a2p: '', a2q: '', a2c: '',
          a3p: '', a3q: '', a3c: '',
          hi: formatPrice(cw.hi), hc: pc(cw.hi),
          avg: formatPrice(avg), ac: pc(avg),
          lo: formatPrice(cw.lo), oc: pc(cw.lo),
          fbuy: cw.fb > 0 ? formatQuantity(cw.fb) : '',
          fsell: cw.fs > 0 ? formatQuantity(cw.fs) : '',
          fbal: fbal ? ((fbal > 0 ? '+' : '') + formatQuantity(Math.abs(fbal))) : '',
          fbc: fbal >= 0 ? '#4ade80' : '#f87171',
          room: '',
          kltt: formatQuantity(cw.tv),
          onChart: () => openChart(cw.s),
        }
      })
      return cwRows
    }
    
    return filterStocks(rows, filter, VN30_SYMBOLS)
  }, [stocks, darkMode, th, openChart, filter])

  const handleFilterChange = useCallback((group: VietcapFilterGroup, value?: string) => {
    setFilter((prev) => ({
      ...prev,
      group,
      value: value || prev.value,
      searchText: '',
    }))
  }, [])

  const handleSymbolAdd = useCallback((symbol: string) => {
    setFilter((prev) => ({
      ...prev,
      group: 'WL',
      watchlist: [...new Set([...prev.watchlist, symbol])],
    }))
  }, [])

  const chartStock = useMemo(() => {
    if (!chart.open || !chart.sym) return null
    return stocks.find((x) => x.s === chart.sym) ?? null
  }, [chart.open, chart.sym, stocks])

  const chartView = useMemo<ChartView | null>(() => {
    if (!chartStock) return null
    const s = chartStock
    const pts = s.ipts || []
    const W = 640, H = 160, pad = 4
    const mn = Math.min(...pts), mx = Math.max(...pts), rng = mx - mn || 0.01
    const px = (_v: number, i: number) => ((i / (pts.length - 1)) * W).toFixed(1)
    const py = (v: number) => (H - pad - ((v - mn) / rng) * (H - pad * 2)).toFixed(1)
    const linePts = pts.map((v, i) => `${px(v, i)},${py(v)}`).join(' ')
    const fillPath = `M 0,${H} L ${pts.map((v, i) => `${px(v, i)},${py(v)}`).join(' L ')} L ${W},${H} Z`
    const refY = +(H - pad - ((s.r - mn) / rng) * (H - pad * 2)).toFixed(1)
    const n = 5
    const yLabels = Array.from({ length: n }, (_, i) => formatPrice(mn + (mx - mn) * (n - 1 - i) / (n - 1)))
    const nbars = 30, bw = W / nbars
    const vols = Array.from({ length: nbars }, (_, i) => {
      const base = s.tv / nbars
      const seed = (s.tv * 0.0001 + i * 0.37) % 1
      return base * (0.5 + seed)
    })
    const maxV = Math.max(...vols)
    const vbars = vols.map((v, i) => {
      const h = Math.max(2, (v / maxV) * 36)
      const pi = Math.floor(i / (nbars / pts.length))
      const pv = pts[Math.min(pi, pts.length - 1)]
      return {
        x: (i * bw).toFixed(1),
        y: (40 - h).toFixed(1),
        w: (bw - 1).toFixed(1),
        h: h.toFixed(1),
        c: pv >= s.r ? '#4ade80' : '#f87171',
      }
    })
    const color = priceColor(s.lp, s.r, s.cl, s.fl)
    const chgVal = +(s.lp - s.r).toFixed(2)
    const ranges = ['1D', '1W', '1M', '3M'].map((r) => ({
      label: r,
      bg: r === chart.range ? '#2563eb' : th.iconBg,
      fg: r === chart.range ? '#fff' : th.navItemColor,
      onClick: () => setChart((prev) => ({ ...prev, range: r })),
    }))
    return {
      sym: s.s,
      lp: formatPrice(s.lp),
      lc: color,
      chg: (chgVal >= 0 ? '+' : '') + formatPrice(chgVal) + ' (' + (s.pct >= 0 ? '+' : '') + s.pct.toFixed(1) + '%)',
      linePts,
      fillPath,
      refY,
      yLabels,
      vbars,
      stats: [
        { label: 'Tham chiếu', val: formatPrice(s.r), color: '#facc15' },
        { label: 'Cao', val: formatPrice(s.hi), color: '#4ade80' },
        { label: 'Thấp', val: formatPrice(s.lo), color: '#f87171' },
        { label: 'KLGD', val: formatQuantity(s.tv), color: '#94a3b8' },
        { label: 'NN Mua', val: formatQuantity(s.fb), color: '#4ade80' },
        { label: 'NN Bán', val: formatQuantity(s.fs), color: '#f87171' },
      ],
      ranges,
    }
  }, [chartStock, chart.range, th])

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100vh',
      fontFamily: "'Inter', system-ui, sans-serif", color: th.text,
      overflow: 'hidden', background: th.appBg,
    }}>
      <TopBar th={th} timeStr={timeStr} toggleDark={toggleDark} />
      <IndexStrip indices={mapIndexViews(indices)} th={th} />
      <FilterBar
        th={th}
        filter={filter}
        onFilterChange={handleFilterChange}
        onSymbolAdd={handleSymbolAdd}
      />
      <StockTable rows={allStocks} th={th} />
      <FooterBar />
      {chartView && (
        <IntradayChartModal chart={chartView} th={th} onClose={closeChart} />
      )}
    </div>
  )
}

export default App
