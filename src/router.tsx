import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import type { ThemeTokens, MarketIndexView, ChartView, TradeHistoryItem, StockRow } from './types/priceboard'
import type { VietcapFilterGroup, VietcapFilterState } from './types/vietcap'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'

const TradingPanel = lazy(() => import('./pages/TradingPanel'))
const OrderBook = lazy(() => import('./pages/OrderBook'))
const OrderHistory = lazy(() => import('./pages/OrderHistory'))
const Portfolio = lazy(() => import('./pages/Portfolio'))
const PortfolioAnalytics = lazy(() => import('./pages/PortfolioAnalytics'))
const AdvancedChart = lazy(() => import('./pages/AdvancedChart'))
const MarketHeatmapPage = lazy(() => import('./pages/MarketHeatmap'))
const StockComparison = lazy(() => import('./pages/StockComparison'))
const StockScreener = lazy(() => import('./pages/StockScreener'))
const MoneyFlow = lazy(() => import('./pages/MoneyFlow'))
const CompanyResearch = lazy(() => import('./pages/CompanyResearch'))
const DerivativesTrading = lazy(() => import('./pages/DerivativesTrading'))
const Watchlists = lazy(() => import('./pages/Watchlists'))
const AlertsManagement = lazy(() => import('./pages/AlertsManagement'))
const MarketNews = lazy(() => import('./pages/MarketNews'))
const EventCalendar = lazy(() => import('./pages/EventCalendar'))
const AccountSettings = lazy(() => import('./pages/AccountSettings'))
const AuthFlow = lazy(() => import('./pages/AuthFlow'))
const StockInfo = lazy(() => import('./pages/StockInfo'))

function PageLoader() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100%', color: '#94a3b8', fontSize: 14,
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 32, height: 32, border: '3px solid #1a3050',
          borderTopColor: '#2563eb', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite', margin: '0 auto 12px',
        }} />
        Đang tải...
      </div>
    </div>
  )
}

type AppRoutesProps = {
  th: ThemeTokens
  toggleDark: () => void
  indices: MarketIndexView[]
  filter: VietcapFilterState
  onFilterChange: (group: VietcapFilterGroup, value?: string) => void
  onSymbolAdd: (symbol: string) => void
  viewMode: 'table' | 'grid' | 'heat' | 'movers'
  onViewModeChange: (mode: 'table' | 'grid' | 'heat' | 'movers') => void
  showSector: boolean
  onToggleSector: () => void
  activeSector: string
  onSectorChange: (sector: string) => void
  showAdvFilter: boolean
  onToggleAdvFilter: () => void
  showTradeHist: boolean
  onToggleTradeHist: () => void
  onExportCSV: () => void
  filterPctFrom: string
  filterPctTo: string
  filterVolMin: string
  filterPriceMin: string
  filterPriceMax: string
  onSetPctFrom: (v: string) => void
  onSetPctTo: (v: string) => void
  onSetVolMin: (v: string) => void
  onSetPriceMin: (v: string) => void
  onSetPriceMax: (v: string) => void
  onResetFilters: () => void
  tradeHistory: TradeHistoryItem[]
  stocksWithWatchlist: (StockRow & { watchlisted: boolean; onToggleWatchlist: () => void })[]
  chartView: ChartView | null
  onCloseChart: () => void
  idxChart: { open: boolean; sym: string; color: string }
  onCloseIdxChart: () => void
}

export default function AppRoutes(props: AppRoutesProps) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<Layout th={props.th} toggleDark={props.toggleDark} />}>
          <Route path="/" element={<HomePage {...props} />} />
          <Route path="/trading-panel" element={<TradingPanel />} />
          <Route path="/order-book" element={<OrderBook />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/portfolio-analytics" element={<PortfolioAnalytics />} />
          <Route path="/advanced-chart" element={<AdvancedChart />} />
          <Route path="/market-heatmap" element={<MarketHeatmapPage />} />
          <Route path="/stock-comparison" element={<StockComparison />} />
          <Route path="/stock-screener" element={<StockScreener />} />
          <Route path="/money-flow" element={<MoneyFlow />} />
          <Route path="/company-research" element={<CompanyResearch />} />
          <Route path="/derivatives-trading" element={<DerivativesTrading />} />
          <Route path="/watchlists" element={<Watchlists />} />
          <Route path="/alerts" element={<AlertsManagement />} />
          <Route path="/market-news" element={<MarketNews />} />
          <Route path="/event-calendar" element={<EventCalendar />} />
          <Route path="/account-settings" element={<AccountSettings />} />
          <Route path="/auth" element={<AuthFlow />} />
          <Route path="/stock-info" element={<StockInfo />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
