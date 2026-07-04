import { memo } from 'react'
import type {
  ThemeTokens,
  StockRow,
  MarketIndexView,
  ChartView,
  TradeHistoryItem,
} from '../types/priceboard'
import type { VietcapFilterGroup } from '../types/vietcap'
import IndexStrip from '../components/IndexStrip'
import FilterBar from '../components/FilterBar'
import StockTable from '../components/StockTable'
import GridView from '../components/GridView'
import HeatmapView from '../components/HeatmapView'
import IntradayChartModal from '../components/IntradayChartModal'
import TradingViewModal from '../components/TradingViewModal'
import TopMoversView from '../components/TopMoversView'

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
  chartView: ChartView | null
  onCloseChart: () => void
  idxChart: { open: boolean; sym: string; color: string }
  onCloseIdxChart: () => void
}

function HomePageInner({
  th, indices, filter, onFilterChange, onSymbolAdd,
  viewMode, onViewModeChange, showSector, onToggleSector, activeSector,
  onSectorChange, showAdvFilter, onToggleAdvFilter, showTradeHist,
  onToggleTradeHist, onExportCSV, filterPctFrom, filterPctTo,
  filterVolMin, filterPriceMin, filterPriceMax, onSetPctFrom,
  onSetPctTo, onSetVolMin, onSetPriceMin, onSetPriceMax,
  onResetFilters, tradeHistory, stocksWithWatchlist,
  chartView, onCloseChart, idxChart, onCloseIdxChart,
}: Props) {
  return (
    <>
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
      {viewMode === 'table' && <StockTable rows={stocksWithWatchlist} th={th} />}
      {viewMode === 'grid' && <GridView rows={stocksWithWatchlist} th={th} />}
      {viewMode === 'heat' && <HeatmapView rows={stocksWithWatchlist} th={th} />}
      {viewMode === 'movers' && <TopMoversView rows={stocksWithWatchlist} th={th} />}
      {chartView && (
        <IntradayChartModal chart={chartView} onClose={onCloseChart} />
      )}
      {idxChart.open && (
        <TradingViewModal
          sym={idxChart.sym}
          tvSymbol={idxChart.sym}
          onClose={onCloseIdxChart}
        />
      )}
    </>
  )
}

const HomePage = memo(HomePageInner)
export default HomePage
