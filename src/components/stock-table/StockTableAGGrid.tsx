import { memo, useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react'
import type { RowClassParams, RowStyle, SizeColumnsToFitGridStrategy } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import '../../styles/ag-grid-theme.css'
import type { StockRow, ThemeTokens } from '../../types/priceboard'
import columnDefs from './columnDefs'

type Props = { rows: StockRow[]; th: ThemeTokens }

const autoSizeStrategy: SizeColumnsToFitGridStrategy = {
  type: 'fitGridWidth',
}

function StockTableAGGridInner({ rows }: Props) {
  const getRowStyle = useCallback(
    (params: RowClassParams<StockRow>): RowStyle | undefined =>
      params.data ? { background: params.data.bg } : undefined,
    [],
  )

  return (
    <div className="priceboard-scroll-shell">
      <div className="ag-theme-alpine ag-vietcap priceboard-grid">
        <AgGridReact<StockRow>
          rowData={rows}
          columnDefs={columnDefs as never}
          autoSizeStrategy={autoSizeStrategy}
          rowHeight={26}
          headerHeight={17}
          groupHeaderHeight={21}
          animateRows={true}
          suppressRowClickSelection={true}
          getRowStyle={getRowStyle}
          suppressCellFocus={true}
          suppressMovableColumns={true}
          suppressDragLeaveHidesColumns={true}
          enableCellTextSelection={true}
          ensureDomOrder={true}
          suppressRowHoverHighlight={false}
          rowSelection="single"
          getRowId={(params) => params.data.sym}
        />
      </div>
    </div>
  )
}

const StockTableAGGrid = memo(StockTableAGGridInner)
export default StockTableAGGrid
