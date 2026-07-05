# AG Grid + shadcn/ui Migration Plan

**Ngày:** 2026-07-04  
**Mục tiêu:** Thay thế StockTable hiện tại bằng AG Grid + chuyển inline styles sang shadcn/ui, giữ nguyên UI 100%.

---

## Tổng quan hiện trạng

| Hạng mục | Hiện tại | Mục tiêu |
|----------|----------|----------|
| **Bảng cổ phiếu** | `StockTable.tsx` — custom `<table>` + manual virtualization (148 dòng) | AG Grid Community (`ag-grid-react`) — built-in virtualization, sorting, column pinning |
| **Styling** | 100% inline styles qua `ThemeTokens` | shadcn/ui components + CSS variables `--ds-*` |
| **Dependencies đã có** | `ag-grid-community` ^32.3.9, `ag-grid-react` ^32.3.9, `shadcn-ui` ^0.9.5 | Cần setup: `components.json`, `src/components/ui/`, `src/lib/utils.ts`, Tailwind CSS |
| **Pages** | 21 pages, chỉ `HomePage` dùng StockTable | Migrate HomePage trước, sub-pages sau |
| **Tailwind** | Chưa có | Cần cài đặt cho shadcn/ui |

---

## Phase 1: Setup Infrastructure

### 1.1 Cài Tailwind CSS
**Files tạo/sửa:**
- `tailwind.config.ts` (tạo mới)
- `src/index.css` hoặc `src/App.css` (thêm `@tailwind` directives)
- `vite.config.ts` (kiểm tra plugin)

**Cài đặt:**
```bash
npm install -D tailwindcss @tailwindcss/vite
```

**Lưu ý:** shadcn/ui v0.9.5 cần Tailwind. Phải cấu hình `content` paths đúng.

### 1.2 Setup shadcn/ui
**Files tạo:**
- `components.json` — cấu hình shadcn/ui (style: "default", tailwind config path, aliases)
- `src/lib/utils.ts` — `cn()` helper từ `clsx` + `tailwind-merge`
- `src/components/ui/` — thư mục chứa shadcn components

**Cài đặt:**
```bash
npx shadcn@latest init
# Chọn: style=default, base color=neutral, CSS variables=yes
```

**Cài components cần thiết:**
```bash
npx shadcn@latest add button input badge select dropdown-menu tabs separator tooltip
```

### 1.3 Kiểm tra AG Grid
AG Grid đã cài (`ag-grid-community` + `ag-grid-react` ^32.3.9) nhưng chưa dùng. Không cần cài thêm.

**Files tạo:**
- `src/styles/ag-grid-theme.css` — custom AG Grid theme khớp design system `--ds-*`

---

## Phase 2: Migrate StockTable → AG Grid

### 2.1 Phân tích StockTable hiện tại
**Đặc điểm kỹ thuật:**
- Manual virtualization: `ROW_HEIGHT = 26`, `OVERSCAN = 20`
- Sticky columns: Mã CK (left:0), Trần (left:58), TC (left:106), Sàn (left:154)
- Header 2-row với `rowSpan`/`colSpan`
- 30 columns, mỗi cell có inline color/style từ `StockRow` + `ThemeTokens`
- Row hover: `th.rowHover`
- Row flash animation: `bg` từ `fl_` (flash up/down)
- Click vào symbol → mở chart
- Watchlist toggle (heart icon)
- Font: JetBrains Mono 11px, header Inter 9.5px

### 2.2 Column Definitions
**Files tạo:**
- `src/components/stock-table/columnDefs.ts` — AG Grid column definitions
- `src/components/stock-table/cellRenderers.tsx` — custom cell renderers
- `src/components/stock-table/StockTableAGGrid.tsx` — main AG Grid component

**Cột sticky (pinned left):**
| Column | field | minWidth | pinLeft |
|--------|-------|----------|---------|
| Mã CK | sym | 58 | ✅ |
| Trần | ceil | 48 | ✅ (left: 58) |
| TC | tc | 48 | ✅ (left: 106) |
| Sàn | floor | 48 | ✅ (left: 154) |

**AG Grid approach cho sticky columns:**
Sử dụng `colDef.pinned = 'left'` thay vì CSS `position: sticky`. AG Grid tự quản lý z-index và background.

**Header groups:**
- Row 0: Mã CK (rowSpan=2), Trần (rowSpan=2), TC (rowSpan=2), Sàn (rowSpan=2), "── DƯ MUA ──" (colSpan=6), "KHỚP LỆNH" (colSpan=5), "── DƯ BÁN ──" (colSpan=6), Cao (rowSpan=2), TB (rowSpan=2), Thấp (rowSpan=2), NN (colSpan=4), KLGD TT (rowSpan=2), ♡ (rowSpan=2)
- Row 1: Giá 3, KL 3, Giá 2, KL 2, Giá 1, KL 1, Giá, KL, %, ↕, KLGD, Giá 1, KL 1, Giá 2, KL 2, Giá 3, KL 3, Mua, Bán, ↕, Room

**AG Grid approach:** Sử dụng `headerComponentParams` hoặc `children` trong column definitions để tạo grouped headers. AG Grid Community hỗ trợ multi-level headers.

### 2.3 Cell Style Callbacks
Mỗi cell có color động từ `StockRow` (ví dụ `s.b1c`, `s.lc`, `s.pc`). AG Grid hỗ trợ `cellStyle` callback:

```typescript
cellStyle: (params) => ({
  color: params.data.b1c,
  textAlign: 'right',
  // ...
})
```

**Hoặc sử dụng `valueFormatter` + CSS classes** — cleaner approach.

### 2.4 Custom Cell Renderers
**Files tạo:**
- `src/components/stock-table/SymbolCellRenderer.tsx` — clickable symbol + chart icon
- `src/components/stock-table/WatchlistCellRenderer.tsx` — heart toggle
- `src/components/stock-table/PriceCellRenderer.tsx` — formatted price with color
- `src/components/stock-table/VolumeCellRenderer.tsx` — formatted volume

### 2.5 AG Grid Theme
**File:** `src/styles/ag-grid-theme.css`

Custom theme class `.vietcap-theme` với:
- Background: `var(--ds-color-bg-table)`
- Header background: `var(--ds-color-bg-nav)`
- Row odd/even: `var(--ds-color-bg-row-odd)` / `var(--ds-color-bg-row-even)`
- Row hover: `var(--ds-color-bg-row-hover)`
- Border colors: `var(--ds-color-border-subtle)` / `var(--ds-color-border-default)`
- Font family: `'JetBrains Mono', monospace`
- Font size: 11px
- Row height: 26px

### 2.6 Tích hợp vào HomePage
**File sửa:** `src/pages/HomePage.tsx`

Thay `StockTable` bằng `StockTableAGGrid`. Giữ nguyên props interface.

**Files sửa:**
- `src/pages/HomePage.tsx` — import mới
- `src/App.tsx` — cập nhật nếu cần

---

## Phase 3: Migrate FilterBar → shadcn/ui

### 3.1 Phân tích FilterBar hiện tại
**Components hiện tại:**
- View mode buttons (4 icon buttons)
- SymbolSearch input
- Filter tabs (dynamic từ `filterGroups`)
- FilterDropdown (custom dropdown)
- Action buttons (advanced filter, trade history, CSV export)
- Sector filter panel (button group)
- Advanced filter panel (input fields)
- Trade history panel (grid layout)

### 3.2 Components shadcn/ui thay thế
| Hiện tại | shadcn/ui |
|----------|-----------|
| Icon buttons (view mode) | `Button` variant="ghost" + active state |
| SymbolSearch | `Input` + command palette |
| Filter tabs | `Tabs` hoặc custom `Button` group |
| FilterDropdown | `DropdownMenu` hoặc `Select` |
| Action buttons | `Button` variant="ghost" |
| Sector chips | `Badge` variant="outline" |
| Advanced filter inputs | `Input` |
| Reset button | `Button` variant="outline" |
| Trade history list | Card-based layout |

### 3.3 Files tạo/sửa
- `src/components/FilterBar.tsx` — rewrite với shadcn/ui components
- `src/components/ui/` — shadcn components (auto-created by CLI)

### 3.4 Giữ nguyên
- `SymbolSearch.tsx` — có thể refactor sau, giữ nguyên hiện tại
- `FilterDropdown.tsx` — thay bằng shadcn `DropdownMenu` hoặc `Select`

---

## Phase 4: Visual Regression Testing

### 4.1 Setup Playwright
**Files tạo:**
- `playwright.config.ts`
- `tests/visual/` — visual regression tests
- `tests/visual/homepage.spec.ts`

**Cài đặt:**
```bash
npm install -D @playwright/test
npx playwright install chromium
```

### 4.2 Snapshot Comparison Strategy
1. **Baseline snapshots:** Chụp HomePage trước khi migrate
2. **Post-migration snapshots:** Chụp sau khi migrate
3. **Diff:** So sánh pixel-by-pixel,_tolerance ~0.1% để chấp nhận rendering differences

### 4.3 Test Scenarios
- [ ] HomePage table view — full page screenshot
- [ ] FilterBar với các states (tabs, dropdown, advanced filter)
- [ ] Row hover states
- [ ] Symbol click behavior
- [ ] Watchlist toggle
- [ ] Dark mode consistency
- [ ] Responsive behavior (1280px, 1920px)

### 4.4 Files
- `tests/visual/homepage-table.spec.ts`
- `tests/visual/homepage-filters.spec.ts`
- `tests/visual/snapshots/` — baseline images

---

## Phase 5: Performance Comparison

### 5.1 Metrics cần đo
| Metric | Tool | Before | After |
|--------|------|--------|-------|
| Initial render time | React DevTools Profiler | ? | ? |
| Scroll FPS (500+ rows) | Chrome DevTools Performance | ? | ? |
| Memory usage | Chrome DevTools Memory | ? | ? |
| Time to first meaningful paint | Lighthouse | ? | ? |
| Bundle size impact | `vite-bundle-visualizer` | ? | ? |

### 5.2 Test Script
**File:** `scripts/perf-comparison.ts`

```bash
# Before migration
npm run build && npx vite preview
# Đo metrics

# After migration
npm run build && npx vite preview
# Đo metrics, so sánh
```

### 5.3 Expected Improvements
- AG Grid virtualization tốt hơn manual implementation
- Fewer re-renders (AG Grid manages its own DOM)
- Sorting/filtering built-in (không cần custom logic)

---

## Phase 6: Migrate Sub-pages

### 6.1 Sub-pages sử dụng StockTable
Kiểm tra các pages:
- `StockScreener.tsx` — có thể dùng StockTable
- `OrderBook.tsx` — có thể dùng bảng tương tự
- Các pages khác — cần audit

### 6.2 Approach
1. Audit từng page xem có dùng `StockTable` hoặc components đã migrate không
2. Thay thế dần, đảm bảo import paths đúng
3. Test regression cho từng page

### 6.3 Files potentially affected
- `src/pages/StockScreener.tsx`
- `src/pages/OrderBook.tsx`
- `src/pages/Watchlists.tsx`
- `src/pages/MarketHeatmap.tsx`

---

## Migration Order (Execution Sequence)

```
Phase 1.1: Install Tailwind CSS
    ↓
Phase 1.2: Setup shadcn/ui (init + add components)
    ↓
Phase 1.3: Create AG Grid theme CSS
    ↓
Phase 2.1-2.5: Build StockTableAGGrid with column defs, cell renderers
    ↓
Phase 2.6: Integrate into HomePage (replace StockTable)
    ↓
Phase 4.1-4.3: Visual regression testing (before/after comparison)
    ↓
Phase 5: Performance comparison
    ↓
Phase 3: Migrate FilterBar → shadcn/ui
    ↓
Phase 4再次: Re-test visual regression after FilterBar migration
    ↓
Phase 6: Migrate sub-pages
    ↓
Final: Full regression test + cleanup
```

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| AG Grid Community thiếu tính năng (row grouping, pivoting) | Không cần cho use case này — chỉ cần table display + sorting |
| shadcn/ui không match design system `--ds-*` | Override CSS variables trong `globals.css`, tạo custom theme |
| Breaking changes khi migrate | Feature flag: giữ StockTable cũ, switch qua lại |
| Performance regression | Benchmark trước/sau, AG Grid thường nhanh hơn manual virtualization |
| Visual differences | Playwright snapshots để catch early |

---

## Acceptance Criteria

- [ ] AG Grid hiển thị đúng 30 columns với header 2-row
- [ ] Sticky columns hoạt động đúng (Mã CK, Trần, TC, Sàn)
- [ ] Sorting trên AG Grid (nếu cần)
- [ ] Row flash animation giữ nguyên
- [ ] Symbol click mở chart
- [ ] Watchlist toggle hoạt động
- [ ] shadcn/ui components render đúng trong FilterBar
- [ ] Visual regression: < 0.1% pixel diff
- [ ] Performance: không regression (giữ nguyên hoặc tốt hơn)
- [ ] TypeScript: không có type errors
- [ ] Lint: không có lint errors
- [ ] Tất cả existing features hoạt động
