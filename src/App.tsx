import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import type {
  ThemeTokens,
  StockState,
  StockRow,
  MarketIndexState,
  MarketIndexView,
  ChartState,
  TradeHistoryItem,
  AlertModalState,
  SortKey,
  SortDir,
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
  selectedCompare: string[],
  toggleCompare: (sym: string) => void,
  openAlertModal: (sym: string, price: number) => void,
  focusedIndex: number,
  recentSyms: string[],
): StockRow[] {
  const now = Date.now()
  const maxRoom = stocks.reduce((m, s) => Math.max(m, Math.abs(s.rm || 0)), 1)
  return stocks.map((s, i) => {
    const fl = s.fl_ && now - s.fts < 900
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

    // Flash effects — per-cell based on individual change direction
    const flashPrice = fl ? (s.fl_ === 'u' ? 'flashUp 0.8s ease' : 'flashDn 0.8s ease') : 'none'
    const flashQty = fl ? (s.fl_ === 'u' ? 'flashUp 0.8s ease' : 'flashDn 0.8s ease') : 'none'
    // KLGD (total vol) always rises on match → green flash
    const flashVol = fl ? 'flashUp 0.8s ease' : 'none'
    // Order book flash — on the slower book tick
    const bookFresh = s.bts && now - s.bts < 900
    const _fa = (d: 'u' | 'd' | null) => d === 'u' ? 'flashUp 0.8s ease' : d === 'd' ? 'flashDn 0.8s ease' : 'none'
    const flashB1q = bookFresh ? _fa(s.fb1q) : 'none'
    const flashB2q = bookFresh ? _fa(s.fb2q) : 'none'
    const flashB3q = bookFresh ? _fa(s.fb3q) : 'none'
    const flashA1q = bookFresh ? _fa(s.fa1q) : 'none'
    const flashA2q = bookFresh ? _fa(s.fa2q) : 'none'
    const flashA3q = bookFresh ? _fa(s.fa3q) : 'none'
    const flashRoom = bookFresh ? _fa(s.frm) : 'none'

    // Price cell background — dynamic intensity by % change
    const intensity = Math.min(Math.abs(s.pct) / 7, 1)
    const priceCellBg = s.pct > 0
      ? `rgba(34,197,94,${(0.06 + intensity * 0.32).toFixed(2)})`
      : s.pct < 0
        ? `rgba(244,63,94,${(0.06 + intensity * 0.32).toFixed(2)})`
        : 'transparent'

    // Room progress bar
    const roomPct = Math.max(2, Math.round(Math.abs(s.rm || 0) / maxRoom * 100))

    // Focus outline for keyboard nav
    const focusOutline = i === focusedIndex ? '2px solid #3b82f6' : 'none'

    // Pinned symbol border (recently viewed)
    const isPinned = recentSyms.includes(s.s)
    const pinBorder = isPinned ? '3px solid #f59e0b' : '3px solid transparent'

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
      pc: s.pct > 0 ? 'var(--ds-color-market-up)' : s.pct < 0 ? 'var(--ds-color-market-down)' : 'var(--ds-color-market-flat)',
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
      fbc: fbal >= 0 ? 'var(--ds-color-market-foreign-buy)' : 'var(--ds-color-red-400)',
      room: s.rm ? formatQuantity(Math.abs(s.rm)) : '',
      roomPct,
      kltt: formatQuantity(Math.abs(s.rm) || s.tv),
      sparkPts: sparkRange ? toPolylinePoints(s.ipts, 100, 22, sparkRange) : '',
      sparkFill: sparkRange ? toAreaPath(s.ipts, 100, 22, sparkRange) : '',
      onChart: () => openChart(s.s),
      isSelected: selectedCompare.includes(s.s),
      onToggleCompare: () => toggleCompare(s.s),
      onOpenAlert: () => openAlertModal(s.s, s.lp),
      flashPrice,
      flashQty,
      flashB1q, flashB2q, flashB3q,
      flashA1q, flashA2q, flashA3q,
      flashVol, flashRoom,
      priceCellBg,
      pinBorder,
      focusOutline,
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
    const group = (params.get('filter-group') || 'HOSE') as VietcapFilterGroup
    const value = params.get('filter-value') || 'VN30'
    const saved = JSON.parse(localStorage.getItem('watchlist') || '[]')
    return { group, value, searchText: '', watchlist: saved }
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

  // Compare state
  const [selectedCompare, setSelectedCompare] = useState<string[]>([])

  // Alert modal state
  const [alertModal, setAlertModal] = useState<AlertModalState>({ open: false, sym: '', threshold: '', direction: 'above' })

  // Sorting state
  const [sortKey, setSortKey] = useState<SortKey>(null)
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  // Keyboard navigation
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const visibleStocksRef = useRef<StockRow[]>([])

  // Pinned (recently viewed) symbols
  const [recentSyms, setRecentSyms] = useState<string[]>([])
  const pinRecent = useCallback((sym: string) => {
    setRecentSyms(prev => [sym, ...prev.filter(s => s !== sym)].slice(0, 3))
  }, [])

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
    pinRecent(sym)
    setChart({ open: true, sym, range: '1Đ' })
  }, [pinRecent])

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

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(filter.watchlist))
  }, [filter.watchlist])

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      const list = visibleStocksRef.current
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setFocusedIndex(prev => Math.min((prev ?? -1) + 1, list.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setFocusedIndex(prev => Math.max((prev ?? 0) - 1, 0))
      } else if (e.key === 'Enter') {
        if (focusedIndex >= 0 && list[focusedIndex]) {
          openChart(list[focusedIndex].sym)
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [focusedIndex, openChart])

  const toggleDark = useCallback(() => setDarkMode((p) => !p), [])

  const handleIndexClick = useCallback((sym: string, color: string) => {
    setIdxChart({ open: true, sym, color })
  }, [])

  const onToggleSector = useCallback(() => setShowSector(p => !p), [])
  const onToggleAdvFilter = useCallback(() => setShowAdvFilter(p => !p), [])
  const onToggleTradeHist = useCallback(() => setShowTradeHist(p => !p), [])
  const onCloseIdxChart = useCallback(() => setIdxChart({ open: false, sym: '', color: '' }), [])

  // Compare handlers
  const toggleCompare = useCallback((sym: string) => {
    setSelectedCompare(prev => {
      const has = prev.includes(sym)
      if (has) return prev.filter(s => s !== sym)
      if (prev.length >= 5) return prev
      return [...prev, sym]
    })
  }, [])

  const clearCompare = useCallback(() => setSelectedCompare([]), [])

  // Alert handlers
  const openAlertModal = useCallback((sym: string, price: number) => {
    setAlertModal({ open: true, sym, threshold: String(price), direction: 'above' })
  }, [])

  const closeAlertModal = useCallback(() => {
    setAlertModal(prev => ({ ...prev, open: false }))
  }, [])

  const saveAlert = useCallback((sym: string, threshold: number, direction: 'above' | 'below') => {
    const alerts = JSON.parse(localStorage.getItem('priceAlerts') || '[]')
    alerts.push({ id: Date.now(), sym, threshold, direction, createdAt: new Date().toISOString(), active: true })
    localStorage.setItem('priceAlerts', JSON.stringify(alerts))
    setAlertModal({ open: false, sym: '', threshold: '', direction: 'above' })
  }, [])

  // Sort handler
  const handleSort = useCallback((key: SortKey) => {
    setSortKey(prev => {
      if (prev === key) {
        setSortDir(d => d === 'desc' ? 'asc' : 'desc')
        return key
      }
      setSortDir('desc')
      return key
    })
  }, [])

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
          pc: cw.pct > 0 ? 'var(--ds-color-market-up)' : cw.pct < 0 ? 'var(--ds-color-market-down)' : 'var(--ds-color-market-flat)',
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
          fbc: fbal >= 0 ? 'var(--ds-color-market-foreign-buy)' : 'var(--ds-color-red-400)',
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
    return mapStockRows(filteredStocks, darkMode, th, openChart, selectedCompare, toggleCompare, openAlertModal, focusedIndex, recentSyms)
  }, [stocks, darkMode, th, openChart, filter, selectedCompare, toggleCompare, openAlertModal, focusedIndex, recentSyms])

  const handleFilterChange = useCallback((group: VietcapFilterGroup, value?: string) => {
    setFilter((prev) => ({
      ...prev,
      group,
      value: value || group,
      searchText: '',
    }))
  }, [])

  const handleSearchTextChange = useCallback((text: string) => {
    setFilter((prev) => ({ ...prev, searchText: text }))
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

  // Sort or pin-recent
  const sortedStocks = useMemo(() => {
    if (!sortKey) return stocksWithWatchlist
    return [...stocksWithWatchlist].sort((a, b) => {
      let av: number, bv: number
      if (sortKey === 'lp') {
        av = parseFloat(a.lp.replace(/,/g, ''))
        bv = parseFloat(b.lp.replace(/,/g, ''))
      } else if (sortKey === 'pct') {
        av = parseFloat(a.pct)
        bv = parseFloat(b.pct)
      } else {
        av = parseInt(a.tvol.replace(/,/g, ''))
        bv = parseInt(b.tvol.replace(/,/g, ''))
      }
      return sortDir === 'asc' ? av - bv : bv - av
    })
  }, [stocksWithWatchlist, sortKey, sortDir])

  // Update visible stocks ref for keyboard nav
  visibleStocksRef.current = sortedStocks

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

  return (
    <AppRoutes
      th={th}
      toggleDark={toggleDark}
      indices={indexViews}
      filter={filter}
      onFilterChange={handleFilterChange}
      onSearchTextChange={handleSearchTextChange}
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
      stocksWithWatchlist={sortedStocks}
      chartStock={chartStock}
      onCloseChart={closeChart}
      idxChart={idxChart}
      onCloseIdxChart={onCloseIdxChart}
      selectedCompare={selectedCompare}
      onToggleCompare={toggleCompare}
      onClearCompare={clearCompare}
      alertModal={alertModal}
      onCloseAlertModal={closeAlertModal}
      onSaveAlert={saveAlert}
      sortKey={sortKey}
      sortDir={sortDir}
      onSort={handleSort}
    />
  )
}

export default App
