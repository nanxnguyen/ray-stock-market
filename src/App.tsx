import { useState, useEffect, useCallback, useMemo } from 'react'
import type {
  ThemeTokens,
  StockState,
  StockRow,
  MarketIndexState,
  MarketIndexView,
  ChartState,
  ChartView,
  TradeHistoryItem,
} from './types/priceboard'
import type { VietcapFilterGroup } from './types/vietcap'
import { VN30_SYMBOLS, createInitialIndices } from './data/mockMarket'
import { createInitialStocks, tickStocks, tickIndices } from './lib/marketSimulation'
import { formatPrice, formatQuantity, priceColor, toPolylinePoints, toAreaPath, minMaxRange } from './lib/marketFormat'
import { filterStockStates } from './lib/filterStocks'
import { getAllCoveredWarrants } from './lib/vietcapNormalize'
import AppRoutes from './router'
import './App.css'

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
        ? dark ? 'var(--ds-color-market-flash-up)' : '#dcfce7'
        : dark ? 'var(--ds-color-market-flash-down)' : '#fee2e2'
      : i % 2 === 0
        ? th.rowOdd
        : th.rowEven
    const pc = (p: number) => priceColor(p, s.r, s.cl, s.fl)
    const chg = +(s.lp - s.r).toFixed(2)
    const fbal = s.fb - s.fs
    const avg = +((s.hi + s.lo + s.lp) / 3).toFixed(2)
    const sparkRange = s.ipts.length > 1 ? minMaxRange(s.ipts) : undefined
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
      sparkPts: sparkRange ? toPolylinePoints(s.ipts, 100, 22, sparkRange) : '',
      sparkFill: sparkRange ? toAreaPath(s.ipts, 100, 22, sparkRange) : '',
      onChart: () => openChart(s.s),
    }
  })
}

function mapIndexViews(
  indices: MarketIndexState[],
  onIndexClick: (sym: string, color: string) => void,
): MarketIndexView[] {
  return indices.map((idx) => {
    const color = idx.ch >= 0 ? '#22c55e' : '#f43f5e'
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
      statusBg: idx.ch >= 0 ? 'rgba(34,197,94,.15)' : 'rgba(244,63,94,.15)',
      gradId: `ig${idx.n}`,
      onClick: () => onIndexClick(idx.n, color),
    }
  })
}

function App() {
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
  const [chart, setChart] = useState<ChartState>({ open: false, sym: '', range: '1Đ' })
  const [viewMode, setViewMode] = useState<'table' | 'grid' | 'heat' | 'movers'>('table')
  const [idxChart, setIdxChart] = useState<{ open: boolean; sym: string; color: string }>({ open: false, sym: '', color: '' })
  const [showSector, setShowSector] = useState(false)
  const [activeSector, setActiveSector] = useState('Tất cả')
  const [showAdvFilter, setShowAdvFilter] = useState(false)
  const [showTradeHist, setShowTradeHist] = useState(false)
  const [filterPctFrom, setFilterPctFrom] = useState('')
  const [filterPctTo, setFilterPctTo] = useState('')
  const [filterVolMin, setFilterVolMin] = useState('')
  const [filterPriceMin, setFilterPriceMin] = useState('')
  const [filterPriceMax, setFilterPriceMax] = useState('')

  const th = useMemo(() => ({
    appBg: 'var(--ds-color-bg-app)',
    navBg: 'var(--ds-color-bg-nav)',
    navBorder: 'var(--ds-color-border-default)',
    navItemColor: 'var(--ds-color-text-secondary)',
    idxColBorder: 'var(--ds-color-border-default)',
    idxTitle: 'var(--ds-color-text-primary)',
    glItemBorder: 'var(--ds-color-border-subtle)',
    glNameColor: 'var(--ds-color-text-secondary)',
    filterBorder: 'var(--ds-color-border-default)',
    searchText: 'var(--ds-color-text-muted)',
    tabFg: 'var(--ds-color-text-secondary)',
    tabBorder: `1px solid var(--ds-color-border-default)`,
    tableBg: 'var(--ds-color-bg-table)',
    rowOdd: 'var(--ds-color-bg-row-odd)',
    rowEven: 'var(--ds-color-bg-row-even)',
    rowBorder: 'var(--ds-color-border-subtle)',
    rowHover: 'var(--ds-color-bg-row-hover)',
    cellBorder: 'var(--ds-color-border-default)',
    cellBorderL: 'var(--ds-color-border-subtle)',
    symColor: 'var(--ds-color-text-link)',
    volColor: 'var(--ds-color-text-muted)',
    iconBg: 'var(--ds-color-bg-elevated)',
    iconColor: 'var(--ds-color-text-muted)',
    text: 'var(--ds-color-text-primary)',
    textMuted: 'var(--ds-color-text-muted)',
    toggleBg: 'var(--ds-color-blue-600)',
    togglePos: darkMode ? '22px' : '2px',
    toggleLabel: darkMode ? 'LIGHT' : 'DARK',
    toggleIcon: darkMode ? '\u2600' : '\uD83C\uDF19',
    toggleTitle: darkMode ? 'Chuyển Light mode' : 'Chuyển Dark mode',
  }), [darkMode])

  const openChart = useCallback((sym: string) => {
    setChart({ open: true, sym, range: '1Đ' })
  }, [])

  const closeChart = useCallback(() => {
    setChart((prev) => ({ ...prev, open: false }))
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

  const toggleDark = useCallback(() => setDarkMode((p) => !p), [])

  const handleIndexClick = useCallback((sym: string, color: string) => {
    setIdxChart({ open: true, sym, color })
  }, [])

  const onToggleSector = useCallback(() => setShowSector(p => !p), [])
  const onToggleAdvFilter = useCallback(() => setShowAdvFilter(p => !p), [])
  const onToggleTradeHist = useCallback(() => setShowTradeHist(p => !p), [])
  const onCloseIdxChart = useCallback(() => setIdxChart({ open: false, sym: '', color: '' }), [])

  const indexViews = useMemo(
    () => mapIndexViews(indices, handleIndexClick),
    [indices, handleIndexClick]
  )

  const allStocks = useMemo(() => {
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
          sparkPts: '',
          sparkFill: '',
          onChart: () => openChart(cw.s),
        }
      })
      return cwRows
    }
    
    const filteredStocks = filterStockStates(stocks, filter, VN30_SYMBOLS)
    return mapStockRows(filteredStocks, darkMode, th, openChart)
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

  // Advanced filter
  const filteredStocks = useMemo(() => {
    const hasFilter = filterPctFrom || filterPctTo || filterVolMin || filterPriceMin || filterPriceMax
    if (!hasFilter) {
      return allStocks
    }
    let result = allStocks
    if (filterPctFrom) result = result.filter(s => parseFloat(s.pct) >= parseFloat(filterPctFrom))
    if (filterPctTo) result = result.filter(s => parseFloat(s.pct) <= parseFloat(filterPctTo))
    if (filterVolMin) result = result.filter(s => {
      const vol = parseInt(s.tvol.replace(/,/g, '')) || 0
      return vol >= parseFloat(filterVolMin) * 1000000
    })
    if (filterPriceMin) result = result.filter(s => parseFloat(s.lp) >= parseFloat(filterPriceMin))
    if (filterPriceMax) result = result.filter(s => parseFloat(s.lp) <= parseFloat(filterPriceMax))
    return result
  }, [allStocks, filterPctFrom, filterPctTo, filterVolMin, filterPriceMin, filterPriceMax])

  // Watchlist toggle
  const toggleWatchlist = useCallback((sym: string) => {
    setFilter(prev => ({
      ...prev,
      watchlist: prev.watchlist.includes(sym)
        ? prev.watchlist.filter(s => s !== sym)
        : [...prev.watchlist, sym],
    }))
  }, [])

  // Add watchlist info to rows
  const stocksWithWatchlist = useMemo(() => {
    return filteredStocks.map(s => ({
      ...s,
      watchlisted: filter.watchlist.includes(s.sym),
      onToggleWatchlist: () => toggleWatchlist(s.sym),
    }))
  }, [filteredStocks, filter.watchlist, toggleWatchlist])

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilterPctFrom('')
    setFilterPctTo('')
    setFilterVolMin('')
    setFilterPriceMin('')
    setFilterPriceMax('')
  }, [])

  // CSV export
  const exportCSV = useCallback(() => {
    const headers = ['Mã CK', 'Giá', '% Thay đổi', 'KLGD', 'Cao', 'Thấp', 'NN Mua', 'NN Bán']
    const rows = stocksWithWatchlist.map(s => [
      s.sym, s.lp, s.pct, s.tvol, s.hi, s.lo, s.fbuy, s.fsell,
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bang-dien-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }, [stocksWithWatchlist])

  // Trade history (mock)
  const tradeHistory = useMemo<TradeHistoryItem[]>(() => [
    { sym: 'ACB', time: '15:29', price: '22.65', qty: '5,200', side: 'SELL', sideColor: '#f43f5e', priceColor: '#f43f5e', timeColor: '#94a3b8', volColor: '#3a5570' },
    { sym: 'VCB', time: '15:28', price: '81.50', qty: '1,800', side: 'BUY', sideColor: '#22c55e', priceColor: '#22c55e', timeColor: '#94a3b8', volColor: '#3a5570' },
    { sym: 'FPT', time: '15:27', price: '137.50', qty: '3,400', side: 'BUY', sideColor: '#22c55e', priceColor: '#22c55e', timeColor: '#94a3b8', volColor: '#3a5570' },
    { sym: 'HPG', time: '15:26', price: '24.10', qty: '8,900', side: 'SELL', sideColor: '#f43f5e', priceColor: '#f43f5e', timeColor: '#94a3b8', volColor: '#3a5570' },
    { sym: 'BID', time: '15:25', price: '45.80', qty: '2,100', side: 'BUY', sideColor: '#22c55e', priceColor: '#22c55e', timeColor: '#94a3b8', volColor: '#3a5570' },
  ], [])

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
    const ranges = ['1Đ', '5Đ', '15Đ', '1T'].map((r) => ({
      label: r,
      bg: r === chart.range ? '#2563eb' : th.iconBg,
      fg: r === chart.range ? '#fff' : th.navItemColor,
      border: r === chart.range ? '#2563eb' : th.navBorder,
      onClick: () => setChart((prev) => ({ ...prev, range: r })),
    }))
    const chgBg = s.pct >= 0 ? 'rgba(34,197,94,.15)' : 'rgba(244,63,94,.15)'
    return {
      sym: s.s,
      lp: formatPrice(s.lp),
      lc: color,
      chg: (chgVal >= 0 ? '+' : '') + formatPrice(chgVal) + ' (' + (s.pct >= 0 ? '+' : '') + s.pct.toFixed(1) + '%)',
      chgBg,
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
    <AppRoutes
      th={th}
      toggleDark={toggleDark}
      indices={indexViews}
      filter={filter}
      onFilterChange={handleFilterChange}
      onSymbolAdd={handleSymbolAdd}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      showSector={showSector}
      onToggleSector={onToggleSector}
      activeSector={activeSector}
      onSectorChange={setActiveSector}
      showAdvFilter={showAdvFilter}
      onToggleAdvFilter={onToggleAdvFilter}
      showTradeHist={showTradeHist}
      onToggleTradeHist={onToggleTradeHist}
      onExportCSV={exportCSV}
      filterPctFrom={filterPctFrom}
      filterPctTo={filterPctTo}
      filterVolMin={filterVolMin}
      filterPriceMin={filterPriceMin}
      filterPriceMax={filterPriceMax}
      onSetPctFrom={setFilterPctFrom}
      onSetPctTo={setFilterPctTo}
      onSetVolMin={setFilterVolMin}
      onSetPriceMin={setFilterPriceMin}
      onSetPriceMax={setFilterPriceMax}
      onResetFilters={resetFilters}
      tradeHistory={tradeHistory}
      stocksWithWatchlist={stocksWithWatchlist}
      chartView={chartView}
      onCloseChart={closeChart}
      idxChart={idxChart}
      onCloseIdxChart={onCloseIdxChart}
    />
  )
}

export default App
