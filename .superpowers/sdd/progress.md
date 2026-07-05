# AG Grid Design Fidelity Fix — Progress
(no-commit mode: user declined commits; changes stay in working tree)
Task 1: complete (fonts loaded, review clean, no-commit mode)
Task 2: complete (tokens fixed 10/10 exact, review clean)
Task 3: complete (App.tsx colors + 900ms flash, review clean)
Minor backlog: pc/fbc color logic duplicated in mapStockRows + CW block — candidate helper extraction (final review triage)
Task 4: complete (alpine class + getRowStyle + header heights, review clean)
Minor backlog: rowSelection="single" deprecated in v32; Props.th dead prop in StockTableAGGrid
Task 5: complete (groupIds + header classes + cell colors, review clean)
Minor backlog: static cellStyle arrows in columnDefs could hoist to consts (consistency with volumeCellStyle)
Task 6: complete (theme CSS rewrite byte-identical to brief, review clean)
Minor backlog: orphaned ag-header-cell-blue/-red headerClass strings in columnDefs.ts (CSS now uses col-id selectors)
