# Performance Optimization: Filter Before Format

## Overview
Optimize the data pipeline in the priceboard application by filtering raw `StockState[]` before formatting into `StockRow[]`, reducing unnecessary computation.

## Current Problem
- `mapStockRows()` formats ALL ~1896 stocks into `StockRow[]` with expensive operations (`formatPrice`, `formatQuantity`, `priceColor`, `toPolylinePoints`, `toAreaPath`)
- Then `filterStocks()` filters the already-formatted rows
- This wastes computation on stocks that will be filtered out

## Solution

### 1. Add `filterStockStates()` to `src/lib/filterStocks.ts`
- New exported function that filters `StockState[]` directly
- Same filtering logic as `filterStocks()` but operates on raw data
- Keep existing `filterStocks()` for backward compatibility

### 2. Update `allStocks` useMemo in `src/App.tsx`
- Filter first using `filterStockStates()`
- Then `mapStockRows()` only processes filtered stocks
- CW filter branch keeps existing logic (already filtered)

### 3. Optimize `src/lib/marketFormat.ts`
- Add `minMaxRange()` helper that returns `[min, max, range]` in single pass
- Update `toPolylinePoints()` and `toAreaPath()` to accept optional precomputed range
- Avoids separate `Math.min()` and `Math.max()` calls

## Benefits
- Reduces formatting operations from ~1896 to filtered count
- Single-pass min/max computation for sparklines
- Maintains backward compatibility
- No changes to UI or data types

## Testing
- Run `npm run build && npm run lint` to verify
- Verify filtering works correctly for all filter groups
- Check sparkline rendering still works
