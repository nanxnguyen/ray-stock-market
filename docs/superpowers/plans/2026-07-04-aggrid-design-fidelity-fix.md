# AG Grid Design Fidelity Fix — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bảng giá AG Grid ở HomePage render giống 100% design gốc `designHtml/Bang Dien.dc.html` (font, color, header 2 tầng, row striping, flash effect).

**Architecture:** Giữ nguyên kiến trúc hiện tại (AG Grid Community v32, legacy CSS theming với class `ag-theme-alpine` + override `.ag-vietcap`). Fix theo 3 lớp: (1) nạp đúng font + sửa design tokens sai giá trị, (2) sửa row/cell color mapping trong `App.tsx`/`columnDefs.ts`, (3) viết lại `ag-grid-theme.css` khớp từng pixel với `<thead>`/`<td>` trong design HTML.

**Tech Stack:** React 19, AG Grid Community v32 (`ag-theme-alpine` làm base), CSS variables `--ds-*`, @fontsource, Playwright (visual verify).

## Global Constraints

- **Nguồn sự thật duy nhất về style:** `designHtml/Bang Dien.dc.html` (dark mode). Mọi hex/font-size/padding copy nguyên văn từ file này.
- Màu sắc dùng CSS variable `--ds-*` khi token tồn tại; hex hard-code chỉ khi design cũng hard-code cục bộ (header bảng).
- Không commit/push/PR tự động — dừng ở "ready for commit" (từng task có bước commit, chạy khi user execute plan).
- Verify gates mỗi task: `npm run lint` và `npm run build` phải PASS (project không có unit test runner; kiểm chứng UI bằng Playwright ở Task 7).
- KHÔNG sửa `FilterBar`, `IndexStrip`, `GridView`, `HeatmapView` trong plan này (ngoài scope — bảng table trước).

## Bảng đối chiếu design → code (tham chiếu khi implement)

| Hạng mục | Design (`Bang Dien.dc.html`) | Code hiện tại | Kết luận |
|---|---|---|---|
| Font bảng | JetBrains Mono 11px, header Inter 9.5px/9px | Font KHÔNG được load (index.html không có link, chỉ có Geist) → fallback to hệ thống | **Root cause #1** |
| Theme class AG Grid | — | Wrapper chỉ có `ag-vietcap`, thiếu `ag-theme-alpine` → toàn bộ `--ag-*` vars chết, font/padding default phá layout | **Root cause #2** |
| Flash up/down (dark) | `#0d2a14` / `#2a0a0d`, window 900ms (dòng 954-956) | `#14532d` / `#450a0a`, window 800ms | **Root cause #3 — bảng đỏ rực** |
| Màu trần (ceiling) | `#b07ef8` (dòng 704) | `--ds-color-market-ceiling: #c084fc` | Sửa token |
| Màu tham chiếu (flat) | `#fbbf24` (dòng 708) | `--ds-color-market-flat: #facc15` | Sửa token |
| Màu % (pc) | `#22c55e`/`#f43f5e`/`#fbbf24` (dòng 970) | `#4ade80`/`#f87171`/`#facc15` (App.tsx:54) | Sửa mapping |
| NN Mua / fbc dương | `#22d3a5` (dòng 771, 982) | `#22c55e` / `#4ade80` | Token mới + sửa mapping |
| Room | `#64748b` (dòng 417) | `#4a6080` (text-muted) | Sửa columnDefs |
| KLGD/KLGD TT (volColor) | `#4a7090` (dòng 801) | `#4a6080` (text-muted) | Token mới |
| Header bg | `#080f1c`; sub DƯ MUA `#05111e`; sub DƯ BÁN `#1a0808` | `#0b1628` (bg-nav); bg group selector theo `col-id` chết vì thiếu `groupId` | Viết lại CSS |
| Header height | 2 tầng: ~21px + ~17px | `headerHeight={48}` 1 giá trị | `groupHeaderHeight={21}` + `headerHeight={17}` |
| Row border | `#0d1a2e` (rowBorder) | `#0f1e36` (border-subtle) | Token mới |
| Row striping | i%2===0 → `#0b1628` (rowOdd), lẻ → `#08101e` | `--ag-odd-row` ↔ rowOdd bị ĐẢO (AG đánh index 0 = even) | Đảo lại |
| Separator 2px `#1a3050` | Sau cột: Sàn, KL1(mua), KLGD, KL3(bán), Thấp, Room | Chỉ có ở pinned Sàn | Thêm CSS col-id |
| Số tabular | `font-variant-numeric:tabular-nums` (dòng 346) | Thiếu | Thêm CSS |
| Header Trần | `#b07ef8` | `#a78bfa` (class purple) | Class mới |
| Header ♡ | `#60a5fa` | `#3b7fc4` (class blue) | Class mới |

---

### Task 1: Nạp font Inter + JetBrains Mono

**Files:**
- Modify: `package.json` (qua npm install)
- Modify: `src/index.css:1-7`

**Interfaces:**
- Produces: font-family `'Inter'` và `'JetBrains Mono'` khả dụng toàn app (CSS `--ds-font-sans`/`--ds-font-mono` đã trỏ sẵn tới 2 font này trong `design-system.css:142-143`).

- [ ] **Step 1: Cài @fontsource packages**

```bash
npm install @fontsource/inter @fontsource/jetbrains-mono
```

- [ ] **Step 2: Import font vào `src/index.css`** — thêm ngay sau dòng `@import "@fontsource-variable/geist";`

```css
@import '@fontsource/inter/400.css';
@import '@fontsource/inter/500.css';
@import '@fontsource/inter/600.css';
@import '@fontsource/inter/700.css';
@import '@fontsource/inter/800.css';
@import '@fontsource/jetbrains-mono/400.css';
@import '@fontsource/jetbrains-mono/500.css';
@import '@fontsource/jetbrains-mono/600.css';
```

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: PASS. Chạy `npm run dev`, DevTools → Network thấy file woff2 `inter-*` và `jetbrains-mono-*` được load; Computed style của cell bảng = "JetBrains Mono".

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json src/index.css
git commit -m "feat: load Inter and JetBrains Mono fonts to match design"
```

---

### Task 2: Sửa design tokens sai giá trị + thêm tokens còn thiếu

**Files:**
- Modify: `src/styles/design-system.css:93-100` (market colors) và thêm tokens mới sau dòng 100
- Modify: `src/styles/themes/dark.css` (thêm tokens mới cùng giá trị)

**Interfaces:**
- Produces: tokens sau, mọi task sau dùng qua `var()`:
  - `--ds-color-market-ceiling: #b07ef8` (sửa từ `#c084fc`)
  - `--ds-color-market-flat: #fbbf24` (sửa từ `#facc15`)
  - `--ds-color-market-flash-up: #0d2a14` (sửa từ `#14532d`)
  - `--ds-color-market-flash-down: #2a0a0d` (sửa từ `#450a0a`)
  - `--ds-color-market-foreign-buy: #22d3a5` (MỚI)
  - `--ds-color-text-vol: #4a7090` (MỚI)
  - `--ds-color-border-row: #0d1a2e` (MỚI)
  - `--ds-color-bg-table-header: #080f1c` (MỚI)
  - `--ds-color-bg-header-buy: #05111e` (MỚI)
  - `--ds-color-bg-header-sell: #1a0808` (MỚI)

- [ ] **Step 1: Sửa block Market Colors trong `design-system.css`** — thay block dòng 93-100 thành:

```css
  /* ── Market Colors ── */
  --ds-color-market-up: #22c55e;
  --ds-color-market-down: #f43f5e;
  --ds-color-market-flat: #fbbf24;
  --ds-color-market-ceiling: #b07ef8;
  --ds-color-market-floor: #38bdf8;
  --ds-color-market-flash-up: #0d2a14;
  --ds-color-market-flash-down: #2a0a0d;
  --ds-color-market-foreign-buy: #22d3a5;

  /* ── Table-specific (Bang Dien design) ── */
  --ds-color-text-vol: #4a7090;
  --ds-color-border-row: #0d1a2e;
  --ds-color-bg-table-header: #080f1c;
  --ds-color-bg-header-buy: #05111e;
  --ds-color-bg-header-sell: #1a0808;
```

- [ ] **Step 2: Thêm cùng nhóm tokens mới vào `[data-theme="dark"]` trong `dark.css`** (sau dòng 21, giữ giá trị y hệt — header bảng trong design hard-code không đổi theo theme):

```css
  --ds-color-text-vol: #4a7090;
  --ds-color-border-row: #0d1a2e;
  --ds-color-bg-table-header: #080f1c;
  --ds-color-bg-header-buy: #05111e;
  --ds-color-bg-header-sell: #1a0808;
```

- [ ] **Step 3: Verify**

Run: `npm run lint && npm run build`
Expected: cả 2 PASS.

- [ ] **Step 4: Commit**

```bash
git add src/styles/design-system.css src/styles/themes/dark.css
git commit -m "fix: align market color tokens with Bang Dien design values"
```

---

### Task 3: Sửa color mapping + flash timing trong App.tsx

**Files:**
- Modify: `src/App.tsx:29` (flash window), `src/App.tsx:54` (pc), `src/App.tsx:66` (fbc), và block CW tương ứng (`src/App.tsx:230`, `src/App.tsx:~241`)

**Interfaces:**
- Consumes: tokens từ Task 2.
- Produces: `StockRow.pc`, `StockRow.fbc`, `StockRow.bg` đúng màu design; `StockRow` type KHÔNG đổi.

- [ ] **Step 1: Sửa flash window 800 → 900 (khớp design dòng 954 `now-s.fts<900`)**

`src/App.tsx:29`:
```ts
    const fl = s.fl_ && now - s.fts < 900
```

- [ ] **Step 2: Sửa `pc` trong `mapStockRows` (App.tsx:54)**

```ts
      pc: s.pct > 0 ? 'var(--ds-color-market-up)' : s.pct < 0 ? 'var(--ds-color-market-down)' : 'var(--ds-color-market-flat)',
```

- [ ] **Step 3: Sửa `fbc` trong `mapStockRows` (App.tsx:66)**

```ts
      fbc: fbal >= 0 ? 'var(--ds-color-market-foreign-buy)' : 'var(--ds-color-red-400)',
```

- [ ] **Step 4: Áp dụng y hệt Step 2+3 cho block CW trong `allStocks` useMemo** (dòng ~230 `pc:` và dòng ~241 `fbc:` — cùng biểu thức như trên).

- [ ] **Step 5: Verify**

Run: `npm run lint && npm run build`
Expected: cả 2 PASS.

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx
git commit -m "fix: use design token colors for pct/foreign columns and 900ms flash window"
```

---

### Task 4: StockTableAGGrid — theme class, header heights, getRowStyle

**Files:**
- Modify: `src/components/stock-table/StockTableAGGrid.tsx`

**Interfaces:**
- Consumes: `StockRow.bg` (string — CSS color hoặc `var()`).
- Produces: grid render với class `ag-theme-alpine ag-vietcap`; row background = `data.bg` (striping + flash inline, giống hệt cơ chế `background:{{ s.bg }}` của design dòng 389).

- [ ] **Step 1: Viết lại component**

```tsx
import { memo, useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react'
import type { RowClickedEvent, RowClassParams, RowStyle } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import '../../styles/ag-grid-theme.css'
import type { StockRow, ThemeTokens } from '../../types/priceboard'
import columnDefs from './columnDefs'

type Props = { rows: StockRow[]; th: ThemeTokens }

function StockTableAGGridInner({ rows }: Props) {
  const onRowClicked = useCallback((e: RowClickedEvent<StockRow>) => {
    e.data?.onChart()
  }, [])

  const getRowStyle = useCallback(
    (params: RowClassParams<StockRow>): RowStyle | undefined =>
      params.data ? { background: params.data.bg } : undefined,
    [],
  )

  return (
    <div className="ag-theme-alpine ag-vietcap" style={{ height: '100%', width: '100%' }}>
      <AgGridReact<StockRow>
        rowData={rows}
        columnDefs={columnDefs as never}
        rowHeight={26}
        headerHeight={17}
        groupHeaderHeight={21}
        animateRows={true}
        suppressRowClickSelection={true}
        onRowClicked={onRowClicked}
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
  )
}

const StockTableAGGrid = memo(StockTableAGGridInner)
export default StockTableAGGrid
```

Ghi chú cho người implement:
- `ag-theme-alpine` BẮT BUỘC — không có nó toàn bộ `--ag-*` variables trong `ag-grid-theme.css` không có hiệu lực (đây là bug hiện tại làm font to, cell bị cắt).
- `getRowStyle` thay cho `getRowClass` cũ (xóa hẳn) — inline bg tái tạo đúng cơ chế design: striping + flash cùng 1 nguồn, mượt nhờ `transition: background .5s` trong CSS (Task 6).
- Hover vẫn hoạt động: CSS Task 6 dùng `!important` cho `.ag-row-hover`.

- [ ] **Step 2: Verify**

Run: `npm run lint && npm run build`
Expected: cả 2 PASS. `npm run dev` → bảng đã có font nhỏ đúng cỡ, không còn nền đỏ toàn bảng (flash chỉ nháy dòng có giao dịch rồi trở về striping).

- [ ] **Step 3: Commit**

```bash
git add src/components/stock-table/StockTableAGGrid.tsx
git commit -m "fix: apply alpine theme class, two-tier header heights, inline row background"
```

---

### Task 5: columnDefs — groupId, header classes, cell colors đúng hex design

**Files:**
- Modify: `src/components/stock-table/columnDefs.ts`

**Interfaces:**
- Consumes: tokens Task 2; `StockRow` fields hiện có.
- Produces: các `groupId`: `'buy'`, `'matched'`, `'sell'`, `'foreign'`; các headerClass mới `ag-header-cell-ceiling`, `ag-header-cell-heart` (CSS định nghĩa ở Task 6).

- [ ] **Step 1: Thêm `groupId` cho 4 column groups**

```ts
  { headerName: '── DƯ MUA ──', groupId: 'buy', headerClass: 'ag-header-cell-buy', children: [/* giữ nguyên */] },
  { headerName: 'KHỚP LỆNH', groupId: 'matched', headerClass: 'ag-header-group-cell-matched', children: [/* giữ nguyên */] },
  { headerName: '── DƯ BÁN ──', groupId: 'sell', headerClass: 'ag-header-cell-sell', children: [/* giữ nguyên */] },
  { headerName: 'NN', groupId: 'foreign', headerClass: 'ag-header-cell-purple', children: [/* giữ nguyên */] },
```

- [ ] **Step 2: Sửa màu cell các cột tĩnh**

Cột `ceil` (Trần) — design dòng 391 `color:#b07ef8` + header dòng 350 `color:#b07ef8`:
```ts
    headerClass: 'ag-header-cell-ceiling',
    cellStyle: () => ({
      textAlign: 'right',
      color: 'var(--ds-color-market-ceiling)',
    }),
```

Cột `tc` (TC) — design dòng 392 `color:#fbbf24`:
```ts
    cellStyle: () => ({
      textAlign: 'right',
      color: 'var(--ds-color-market-flat)',
    }),
```

Cột `floor` (Sàn) giữ nguyên `var(--ds-color-cyan-400)` (= `#38bdf8` ✓).

- [ ] **Step 3: Sửa `volumeCellStyle` (dùng cho `tvol` + `kltt`) — design dòng 404/418 `color:{{ th.volColor }}` = `#4a7090`**

```ts
const volumeCellStyle = (): Record<string, string | number> => ({
  textAlign: 'right',
  color: 'var(--ds-color-text-vol)',
})
```

- [ ] **Step 4: Sửa nhóm NN**

`fbuy` — design dòng 414 `color:#22d3a5`:
```ts
        cellStyle: () => ({
          textAlign: 'right',
          color: 'var(--ds-color-market-foreign-buy)',
        }),
```

`fsell` giữ `var(--ds-color-red-400)` (= `#f87171` ✓). `fbal` giữ theo `data.fbc` ✓.

`room` — design dòng 417 `color:#64748b`:
```ts
        cellStyle: () => ({
          textAlign: 'right',
          color: 'var(--ds-color-neutral-500)',
        }),
```

- [ ] **Step 5: Sửa headerClass cột ♡ — design dòng 361 `color:#60a5fa`, label giữa**

```ts
    headerClass: ['ag-header-cell-heart', 'ag-header-cell-center'],
```

- [ ] **Step 6: Verify**

Run: `npm run lint && npm run build`
Expected: cả 2 PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/stock-table/columnDefs.ts
git commit -m "fix: match column header/cell colors and group ids with design"
```

---

### Task 6: Viết lại ag-grid-theme.css khớp thead/td design

**Files:**
- Modify: `src/styles/ag-grid-theme.css` (thay toàn bộ nội dung)

**Interfaces:**
- Consumes: tokens Task 2, groupId/headerClass Task 5, theme class Task 4.

- [ ] **Step 1: Thay toàn bộ nội dung file bằng:**

```css
/* ═══ AG Grid theme — khớp 1:1 với designHtml/Bang Dien.dc.html (dark) ═══ */

.ag-vietcap {
  --ag-background-color: var(--ds-color-bg-table);
  --ag-header-background-color: var(--ds-color-bg-table-header);
  --ag-header-foreground-color: #4a7090;
  --ag-foreground-color: var(--ds-color-text-primary);
  --ag-border-color: var(--ds-color-border-subtle);
  --ag-row-border-color: var(--ds-color-border-row);
  --ag-row-hover-color: var(--ds-color-bg-row-hover);
  --ag-selected-row-background-color: rgba(59, 130, 246, 0.12);
  --ag-range-selection-background-color: rgba(59, 130, 246, 0.08);
  --ag-font-family: 'JetBrains Mono', monospace;
  --ag-font-size: 11px;
  /* AG đánh số row từ 0: ag-row-even (0,2,4…) = design i%2===0 → rowOdd */
  --ag-even-row-background-color: var(--ds-color-bg-row-odd);
  --ag-odd-row-background-color: var(--ds-color-bg-row-even);
  --ag-checkbox-checked-color: var(--ds-color-blue-400);
  --ag-input-focus-border-color: transparent;
  --ag-input-border-color: transparent;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ── HEADER tầng 1 (group row): design dòng 348 — 9.5px Inter 700 #4a7090, bg #080f1c ── */
.ag-vietcap .ag-header {
  border-bottom: none;
}

.ag-vietcap .ag-header-group-cell {
  font-family: 'Inter', sans-serif;
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #4a7090;
  padding: 0 5px;
  border-right: 2px solid var(--ds-color-border-default);
}

.ag-vietcap .ag-header-group-cell-label {
  justify-content: center;
  white-space: nowrap;
  overflow: visible;
}

/* Group màu — design dòng 353-355, 359 */
.ag-vietcap .ag-header-group-cell.ag-header-cell-buy {
  background: var(--ds-color-bg-header-buy);
  color: #60a5fa;
  letter-spacing: 0.8px;
}
.ag-vietcap .ag-header-group-cell.ag-header-group-cell-matched {
  color: #e2e8f0;
  letter-spacing: 0.5px;
}
.ag-vietcap .ag-header-group-cell.ag-header-cell-sell {
  background: var(--ds-color-bg-header-sell);
  color: #f87171;
  letter-spacing: 0.8px;
}

/* ── HEADER tầng 2 (leaf row): design dòng 363 — 9px Inter #3a6080, letter-spacing .3px ── */
.ag-vietcap .ag-header-cell {
  font-family: 'Inter', sans-serif;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  color: #3a6080;
  padding: 3px 6px;
  cursor: default;
}

.ag-vietcap .ag-header-cell-label {
  justify-content: flex-end;
}

/* Cột không group span 2 tầng (Mã CK, Trần, TC, Sàn, Cao, TB, Thấp, KLGD TT, ♡)
   → style như tầng 1: 9.5px #4a7090 — design dòng 349-361 */
.ag-vietcap .ag-header-cell.ag-header-span-height {
  font-size: 9.5px;
  letter-spacing: 0.5px;
  color: #4a7090;
  padding: 5px 6px;
}

/* Sub-header DƯ MUA: bg #05111e, chữ #3b7fc4 — design dòng 364-369 */
.ag-vietcap .ag-header-cell[col-id='b3p'],
.ag-vietcap .ag-header-cell[col-id='b3q'],
.ag-vietcap .ag-header-cell[col-id='b2p'],
.ag-vietcap .ag-header-cell[col-id='b2q'],
.ag-vietcap .ag-header-cell[col-id='b1p'],
.ag-vietcap .ag-header-cell[col-id='b1q'] {
  background: var(--ds-color-bg-header-buy);
  color: #3b7fc4;
}

/* Sub-header DƯ BÁN: bg #1a0808, chữ #c04040 — design dòng 375-380 */
.ag-vietcap .ag-header-cell[col-id='a1p'],
.ag-vietcap .ag-header-cell[col-id='a1q'],
.ag-vietcap .ag-header-cell[col-id='a2p'],
.ag-vietcap .ag-header-cell[col-id='a2q'],
.ag-vietcap .ag-header-cell[col-id='a3p'],
.ag-vietcap .ag-header-cell[col-id='a3q'] {
  background: var(--ds-color-bg-header-sell);
  color: #c04040;
}

/* Header màu theo cột — hex nguyên văn từ design */
.ag-vietcap .ag-header-cell-center .ag-header-cell-label { justify-content: center; }
.ag-vietcap .ag-header-cell-ceiling { color: #b07ef8 !important; }
.ag-vietcap .ag-header-cell-yellow { color: #fbbf24 !important; }
.ag-vietcap .ag-header-cell-cyan { color: #38bdf8 !important; }
.ag-vietcap .ag-header-cell-purple { color: #a78bfa !important; }
.ag-vietcap .ag-header-cell-secondary { color: #94a3b8 !important; }
.ag-vietcap .ag-header-cell-heart { color: #60a5fa !important; }

/* Ẩn sort indicator (design không có) */
.ag-vietcap .ag-header-cell .ag-sort-indicator-container,
.ag-vietcap .ag-header-cell .ag-sort-order {
  display: none !important;
}

/* ── CELLS: design dòng 394 — padding 3px 6px, JetBrains Mono, tabular-nums ── */
.ag-vietcap .ag-cell {
  padding: 3px 6px;
  border-right: 1px solid var(--ds-color-border-subtle);
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  overflow: hidden;
  white-space: nowrap;
  font-family: 'JetBrains Mono', monospace;
  font-variant-numeric: tabular-nums;
}

.ag-vietcap .ag-cell[col-id='sym'],
.ag-vietcap .ag-cell[col-id='kltt'],
.ag-vietcap .ag-cell[col-id='room'] {
  padding: 3px 8px;
}

.ag-vietcap .ag-cell[col-id='sym'],
.ag-vietcap .ag-cell[col-id='watchlist'] {
  justify-content: center;
}

.ag-vietcap .ag-cell-focus {
  outline: none !important;
  border-right: 1px solid var(--ds-color-border-subtle) !important;
}

/* Separator 2px sau mỗi group — design: Sàn, KL1(mua), KLGD, KL3(bán), Thấp, Room */
.ag-vietcap .ag-cell[col-id='b1q'],
.ag-vietcap .ag-cell[col-id='tvol'],
.ag-vietcap .ag-cell[col-id='a3q'],
.ag-vietcap .ag-cell[col-id='lo'],
.ag-vietcap .ag-cell[col-id='room'],
.ag-vietcap .ag-header-cell[col-id='b1q'],
.ag-vietcap .ag-header-cell[col-id='tvol'],
.ag-vietcap .ag-header-cell[col-id='a3q'],
.ag-vietcap .ag-header-cell[col-id='lo'],
.ag-vietcap .ag-header-cell[col-id='room'] {
  border-right: 2px solid var(--ds-color-border-default);
}

/* ── ROWS: transition .5s cho flash (design dòng 389), hover #102040 ── */
.ag-vietcap .ag-row {
  transition: background 0.5s ease;
  border-bottom: 1px solid var(--ds-color-border-row);
}

.ag-vietcap .ag-row-hover {
  background-color: var(--ds-color-bg-row-hover) !important;
}

.ag-vietcap .ag-row-selected {
  background-color: rgba(59, 130, 246, 0.08) !important;
}

/* Pinned: cell trong suốt cho bg row xuyên qua; border 2px sau Sàn — design dòng 393 */
.ag-vietcap .ag-pinned-left-header,
.ag-vietcap .ag-pinned-left-cols-container {
  border-right: none;
}

.ag-vietcap .ag-cell.ag-cell-last-left-pinned,
.ag-vietcap .ag-header-cell.ag-header-cell-last-left-pinned {
  border-right: 2px solid var(--ds-color-border-default) !important;
}

.ag-vietcap .ag-cell[col-id='sym'],
.ag-vietcap .ag-cell[col-id='ceil'],
.ag-vietcap .ag-cell[col-id='tc'],
.ag-vietcap .ag-cell[col-id='floor'] {
  border-right-color: var(--ds-color-border-default);
}

/* ── SCROLLBAR — design dòng 15-18: 4px, thumb #1e3a5f ── */
.ag-vietcap ::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
.ag-vietcap ::-webkit-scrollbar-track {
  background: transparent;
}
.ag-vietcap ::-webkit-scrollbar-thumb {
  background: #1e3a5f;
  border-radius: 4px;
}
.ag-vietcap ::-webkit-scrollbar-thumb:hover {
  background: #2563eb;
}
```

Ghi chú cho người implement:
- Class `ag-header-span-height` do AG Grid tự thêm cho leaf column không thuộc group (span 2 tầng header) — đúng hành vi `rowspan="2"` của design; KHÔNG set `suppressSpanHeaderHeight`.
- Xóa các rule cũ: `getRowClass`-based `.ag-row-flash-up/down` (flash giờ đi qua `getRowStyle`), selector `[col-id="buy"]` trên group (thay bằng headerClass), override `[col-id="sym"]` màu text-muted (design để màu default #4a7090).
- Border trong cell của cột `ceil`/`tc` design dùng `th.cellBorder` (#1a3050) vì pinned — rule cuối cùng xử lý.

- [ ] **Step 2: Verify**

Run: `npm run lint && npm run build`
Expected: cả 2 PASS.

- [ ] **Step 3: Verify visual nhanh**

Run: `npm run dev` → mở `http://localhost:5173`. Đối chiếu với design:
- Header 2 tầng nền `#080f1c`, DƯ MUA nền xanh đậm `#05111e` chữ `#60a5fa`, DƯ BÁN nền đỏ đậm `#1a0808` chữ `#f87171`.
- Row xen kẽ `#0b1628`/`#08101e`, KHÔNG còn đỏ toàn bảng; flash nháy nhẹ `#0d2a14`/`#2a0a0d` rồi trở lại.
- Số dùng JetBrains Mono 11px, không bị cắt cụt.

- [ ] **Step 4: Commit**

```bash
git add src/styles/ag-grid-theme.css
git commit -m "fix: rewrite AG Grid theme CSS to match Bang Dien design 1:1"
```

---

### Task 7: Visual verification bằng Playwright + full gates

**Files:**
- Test: `tests/visual/` (snapshot có sẵn — update nếu diff là chủ đích)

- [ ] **Step 1: Chạy full gates**

Run: `npm run lint && npm run build`
Expected: cả 2 PASS — paste output thật.

- [ ] **Step 2: Visual test**

Run: `npm run test:visual`
Expected: FAIL với diff (vì UI đổi chủ đích) hoặc PASS nếu chưa có baseline cho bảng.

- [ ] **Step 3: Cập nhật snapshot sau khi đã tự đối chiếu bằng mắt với design**

Run: `npm run test:visual:update` rồi `npm run test:visual`
Expected: PASS.

- [ ] **Step 4: Đối chiếu cuối với design bằng Playwright MCP**

Mở `http://localhost:5173` (dev server) và mở `designHtml/Bang Dien.dc.html`, chụp screenshot 2 bên, so sánh từng vùng: header, 4 cột pinned, DƯ MUA/KHỚP LỆNH/DƯ BÁN, Cao/TB/Thấp, NN, KLGD TT, ♡. Mọi lệch màu/font/spacing → sửa tại file tương ứng (Task 5/6) trước khi kết thúc.

- [ ] **Step 5: Commit**

```bash
git add tests/
git commit -m "test: update visual snapshots for design-matched stock table"
```
