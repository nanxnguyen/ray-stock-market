import { memo } from 'react'
import type {
  ThemeTokens,
  StockRow,
  MarketIndexView,
  StockState,
  TradeHistoryItem,
  AlertModalState,
  SortKey,
  SortDir,
} from '../types/priceboard'
import type { VietcapFilterGroup } from '../types/vietcap'
import IndexStrip from '../components/IndexStrip'
import FilterBar from '../components/FilterBar'
import StockTable from '../components/stock-table/StockTableAGGrid'
import GridView from '../components/GridView'
import HeatmapView from '../components/HeatmapView'
import TradingViewModal from '../components/TradingViewModal'
import TopMoversView from '../components/TopMoversView'
import AlertModal from '../components/AlertModal'
import CompareBar from '../components/CompareBar'
import StockDetailModal from '../components/StockDetailModal'

type Props = {
  th: ThemeTokens
  indices: MarketIndexView[]
  filter: { group: VietcapFilterGroup; value: string; searchText: string; watchlist: string[] }
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
  stocksWithWatchlist: StockRow[]
  chartStock: StockState | null
  onCloseChart: () => void
  idxChart: { open: boolean; sym: string; color: string }
  onCloseIdxChart: () => void
  selectedCompare: string[]
  onToggleCompare: (sym: string) => void
  onClearCompare: () => void
  alertModal: AlertModalState
  onCloseAlertModal: () => void
  onSaveAlert: (sym: string, threshold: number, direction: 'above' | 'below') => void
  sortKey: SortKey
  sortDir: SortDir
  onSort: (key: SortKey) => void
}

function HomePageInner({
  th, indices, filter, onFilterChange, onSymbolAdd,
  viewMode, onViewModeChange, showSector, onToggleSector, activeSector,
  onSectorChange, showAdvFilter, onToggleAdvFilter, showTradeHist,
  onToggleTradeHist, onExportCSV, filterPctFrom, filterPctTo,
  filterVolMin, filterPriceMin, filterPriceMax, onSetPctFrom,
  onSetPctTo, onSetVolMin, onSetPriceMin, onSetPriceMax,
  onResetFilters, tradeHistory, stocksWithWatchlist,
  chartStock, onCloseChart, idxChart, onCloseIdxChart,
  selectedCompare, onToggleCompare, onClearCompare,
  alertModal, onCloseAlertModal, onSaveAlert,
}: Props) {
  return (
    <div className="home-page-shell">
      <IndexStrip
        indices={indices}
        th={th}
      />
      <FilterBar
        th={th}
        filter={filter}
        onFilterChange={onFilterChange}
        onSymbolAdd={onSymbolAdd}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        showSector={showSector}
        onToggleSector={onToggleSector}
        activeSector={activeSector}
        onSectorChange={onSectorChange}
        showAdvFilter={showAdvFilter}
        onToggleAdvFilter={onToggleAdvFilter}
        showTradeHist={showTradeHist}
        onToggleTradeHist={onToggleTradeHist}
        onExportCSV={onExportCSV}
        filterPctFrom={filterPctFrom}
        filterPctTo={filterPctTo}
        filterVolMin={filterVolMin}
        filterPriceMin={filterPriceMin}
        filterPriceMax={filterPriceMax}
        onSetPctFrom={onSetPctFrom}
        onSetPctTo={onSetPctTo}
        onSetVolMin={onSetVolMin}
        onSetPriceMin={onSetPriceMin}
        onSetPriceMax={onSetPriceMax}
        onResetFilters={onResetFilters}
        tradeHistory={tradeHistory}
      />
      <div className="home-page-view">
        {viewMode === 'table' && <StockTable rows={stocksWithWatchlist} th={th} />}
        {viewMode === 'grid' && <GridView rows={stocksWithWatchlist} th={th} />}
        {viewMode === 'heat' && <HeatmapView rows={stocksWithWatchlist} th={th} />}
        {viewMode === 'movers' && <TopMoversView rows={stocksWithWatchlist} th={th} />}
      </div>

      {/* Compare floating bar */}
      <CompareBar
        selected={selectedCompare}
        onRemove={onToggleCompare}
        onClear={onClearCompare}
        onCompare={() => {}}
      />

      {/* Alert modal */}
      {alertModal.open && (
        <AlertModal
          alert={alertModal}
          onClose={onCloseAlertModal}
          onSave={onSaveAlert}
        />
      )}

      {/* TradingView index modal */}
      {idxChart.open && (
        <TradingViewModal
          sym={idxChart.sym}
          tvSymbol={idxChart.sym}
          onClose={onCloseIdxChart}
        />
      )}

      {/* Stock detail modal */}
      {chartStock && (
        <StockDetailModal stock={chartStock} onClose={onCloseChart} />
      )}
    </div>
  )
}

const HomePage = memo(HomePageInner)
export default HomePage
