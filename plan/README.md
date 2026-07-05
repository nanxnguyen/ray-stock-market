# Refactor Plan: Core Component Library (shadcn/ui + Tailwind v4)

Mục tiêu: xây bộ core component chuẩn shadcn/ui + Tailwind CSS, migrate 16 shared components khỏi inline style, **UI giữ nguyên 100% pixel, không regression**. Pages (`src/pages/*`) và AG Grid (`src/components/stock-table/`, `src/styles/ag-grid-theme.css`) **ngoài scope** — không đụng.

## Bối cảnh codebase (đọc trước khi làm bất kỳ task nào)

- Style hiện tại: ~1.538 inline `style={{}}` dùng CSS vars `--ds-*` (định nghĩa tại `src/styles/design-system.css`, theme switch qua `[data-theme="dark|light"]` — xem `src/hooks/useTheme.ts`, `src/styles/themes/dark.css`, `light.css`).
- Theme còn prop-drill `th: ThemeTokens` (`src/types/priceboard.ts`) xuyên 16 component — sẽ gỡ dần ở Phase 3.
- Tailwind v4 (`@tailwindcss/vite`) + shadcn đã cài. `components.json` chuẩn: style `base-nova`, alias `@/components/ui`, css entry `src/index.css`.
- `src/components/ui/` đã có 7 primitives (badge, button, input, select, separator, tabs, tooltip) — pattern `@base-ui/react` + CVA + `cn()` (`src/lib/utils.ts`) — **chưa file nào import**, palette đang neutral default.
- Bug nền: `src/index.css` khai `@custom-variant dark (&:is(.dark *))` nhưng theme dùng `[data-theme]` → `dark:` classes không hoạt động. Fix ở task-01.
- Design tham chiếu: `designHtml/*.dc.html`.
- Visual test: `tests/visual/*.spec.ts`, chạy `npm run test:visual`, update baseline `npm run test:visual:update`.

## Thứ tự & phụ thuộc

```
task-00 (baseline)  →  task-01 (token bridge)  →  task-02 (ui primitives)  →  task-03 (core domain + gallery)
                                                                                        ↓
task-04 → task-05 → task-06 → task-07 → task-08 → task-09 → task-10 → task-11 → task-12 → task-13
(migrate từng nhóm component, tuần tự rủi ro thấp → cao)
```

Task 04–12 đều phụ thuộc task-03. Làm tuần tự để visual diff dễ quy trách nhiệm.

## Protocol verify (BẮT BUỘC mỗi task, ghi kết quả vào cuối task file)

1. `npm run lint` pass.
2. `npm run build` pass (tsc + vite).
3. `npm run test:visual` pass so với baseline task-00. Diff = fail → sửa cho khớp, KHÔNG update baseline (trừ task-00).
4. **Structural DOM assertions** (`tests/visual/structural.spec.ts`) pass — independent screenshot baselines. Kiểm tra flex-direction, element count, layout positions.
5. Task migrate component: spot-check tương tác bằng Playwright MCP hoặc dev server (toggle dark/light, mở/đóng dropdown + modal).

## Quy tắc code

- Core components: strict typed props, CVA variants, `cn()` merge className, **cấm inline `style={{}}`** (ngoại lệ: giá trị động runtime như width % , transform tính toán).
- Không đổi behavior: click-outside đóng dropdown, overlay-click đóng modal, animation giữ nguyên.
- Không đổi public API component nếu chưa cần (props giữ nguyên trừ việc gỡ `th`).
- Commit riêng từng task, message tiếng Anh conventional commits.

## Trạng thái

| Task | Nội dung | Status |
|------|----------|--------|
| 00 | Baseline visual snapshots | ✅ |
| 01 | Token bridge (--ds-* → Tailwind + shadcn vars) | ✅ |
| 02 | ui/ primitives bổ sung + dense variants | ✅ |
| 03 | core/ domain components + gallery page | ✅ |
| 04 | Migrate FooterBar, Layout, SubPageLayout | ✅ |
| 05 | Migrate SymbolSearch, FilterDropdown | ✅ |
| 06 | Migrate AlertModal, CompareBar | ✅ |
| 07 | Migrate IndexStrip, GlobalMarketsPanel | ✅ |
| 08 | Migrate TopBar | ✅ |
| 09 | Migrate FilterBar | ✅ |
| 10 | Migrate GridView, TopMoversView, HeatmapView | ✅ |
| 11 | Migrate TradingViewModal | ✅ |
| 12 | Migrate StockDetailModal | ✅ |
| 13 | Cleanup + docs | ✅ |

### Bug tìm thấy sau refactor
- **IndexStrip xếp dọc** thay vì ngang — do task-07 migrate inline styles bỏ mất `flex` class trên container. Đã fix: thêm `flex` vào `className="flex flex-1 min-w-0 overflow-hidden"`.
- **Root cause verify sai**: `--update-snapshots` ghi đè baseline bằng state lỗi → tất cả test PASS sai. Đã cải thiện: thêm structural DOM assertions vào `tests/visual/structural.spec.ts`, cập nhật skill `ray-do-harness`.
