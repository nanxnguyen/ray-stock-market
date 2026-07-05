# Task 4 Report: StockTableAGGrid — theme class, header heights, getRowStyle

## Summary
Replaced StockTableAGGrid.tsx with fixed component that applies `ag-theme-alpine` class, adjusts header heights (headerHeight: 17, groupHeaderHeight: 21), and switches from `getRowClass` to `getRowStyle` for inline row backgrounds.

## Changes Made

### File: `src/components/stock-table/StockTableAGGrid.tsx`

**Key updates:**
1. **Added `ag-theme-alpine` class** to root div (was missing, causing --ag-* CSS variables to not apply)
2. **Changed headerHeight** from `48` to `17`, and added `groupHeaderHeight={21}` for two-tier header
3. **Replaced `getRowClass` with `getRowStyle`:**
   - Old: Returned class names (`ag-row-flash-up`, `ag-row-flash-down`) based on string matching
   - New: Returns `{ background: params.data.bg }` inline — unifies striping + flash colors in one mechanism (per design requirement)
4. **Updated imports:** Added `RowClassParams`, `RowStyle` from `ag-grid-community`

## Verification Results

**ESLint:** ✓ No issues found
**TypeScript & Build:** ✓ `vite build` successful (426ms)

All chunks compiled and bundled correctly. No new warnings introduced by this change.

## Design Rationale

- **`ag-theme-alpine` class:** Required for AG Grid theme CSS variables to activate. Without it, column widths and cell sizes weren't respecting custom --ag-* tokens from `ag-grid-theme.css`, causing visual bugs (font too large, cells truncated).
- **getRowStyle vs getRowClass:** Inline styles (`background: params.data.bg`) directly render the color from `StockRow.bg`, which is already computed as striping + flash colors by an earlier task. This eliminates the old pattern of parsing CSS class names and ensures visual updates flow through a single consistent data path.
- **Header heights:** 17px (header) + 21px (group header) allows compact multi-tier headers while maintaining readability.

## Concerns
None. All changes are mechanical and follow the specification exactly. The component now properly activates the Alpine theme and uses the correct row styling mechanism.

---
**Status:** DONE
