# Task 00 — Baseline visual snapshots (chụp TRƯỚC mọi thay đổi)

**Phụ thuộc:** không. **Chặn:** tất cả task sau.

## Mục tiêu

Mở rộng visual test coverage rồi chụp baseline trên code HIỆN TẠI. Đây là "hợp đồng pixel" — mọi task sau phải pass so với baseline này.

## Hiện có

- `tests/visual/homepage.spec.ts` (3 snapshot: ag-grid-full, homepage-dark-mode, homepage-table-view), `tests/visual/subpages.spec.ts`.
- `playwright.config.ts` đã cấu hình. Scripts: `npm run test:visual`, `npm run test:visual:update`.

## Việc cần làm

Thêm spec chụp các bề mặt sẽ bị refactor (chỉ shared components, không cần pages):

1. HomePage các view mode: table, grid (GridView), heatmap (HeatmapView), top movers (TopMoversView) — nếu có switcher trên FilterBar/HomePage.
2. Dark + light theme cho HomePage (toggle qua nút trên TopBar).
3. TopBar: dropdown "Công cụ" đang mở.
4. FilterDropdown đang mở (một dropdown bất kỳ trên FilterBar).
5. AlertModal mở (click chuông trên row bảng giá — xem `src/components/stock-table/cellRenderers.tsx` để biết trigger).
6. StockDetailModal mở (double-click row).
7. TradingViewModal mở.
8. CompareBar hiển thị (chọn mã để compare).
9. SubPageLayout shell (một subpage bất kỳ, ví dụ `/watchlists`).

Lưu ý: app có ticker tape animation (TopBar) và giá simulate real-time (`src/lib/marketSimulation.ts`) → mask/disable vùng động khi snapshot (Playwright `mask` option hoặc `animations: 'disabled'`), nếu không baseline sẽ flaky. Kiểm tra spec hiện có xem đã xử lý chưa, tái dùng pattern đó.

## Các bước

1. Đọc `tests/visual/homepage.spec.ts` nắm pattern hiện có (cách chờ load, mask, viewport).
2. Viết thêm specs theo danh sách trên (file mới `tests/visual/refactor-baseline.spec.ts` hoặc mở rộng file cũ).
3. `npm run test:visual:update` tạo baseline.
4. Chạy lại `npm run test:visual` 2 lần liên tiếp — phải pass ổn định (không flaky) mới được merge.

## Acceptance

- [ ] Snapshot cover: 4 view modes, dark+light, 3 modals, 2 dropdowns mở, CompareBar, SubPageLayout.
- [ ] `npm run test:visual` pass ổn định 2 lần liên tiếp.
- [ ] Không sửa bất kỳ file nào trong `src/`.
