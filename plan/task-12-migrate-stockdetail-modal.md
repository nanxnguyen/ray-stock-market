# Task 12 — Migrate StockDetailModal (file lớn nhất — 1000 dòng)

**Phụ thuộc:** task-11 (quy trình chuẩn ở task-04). **File:** `src/components/StockDetailModal.tsx`.

## Chiến lược: chia section, migrate từng section, verify sau MỖI section

1. Đọc file, chia theo section UI (ước lượng: header symbol+giá, tab bar, khớp lệnh, order book buy/sell, thông tin cơ bản, chart mini, lịch sử giao dịch...). Ghi checklist section vào cuối file này trước khi bắt đầu.
2. Bước 1: shell — overlay+panel → `ModalShell`, verify visual.
3. Bước 2..n: từng section → token classes + `PriceText`/`ChangeBadge`/`Panel`/`Tabs`. Sau mỗi section: build + test:visual. Diff → sửa ngay trước khi sang section kế.
4. Gỡ `th` cuối cùng, cập nhật callsite (HomePage/App — nơi mở modal từ double-click row).

## Lưu ý

- Modal này hiển thị dữ liệu real-time (marketSimulation + trade history `TradeHistoryItem`) — màu giá phải dùng `getPriceState`, số dùng `font-mono`.
- Bảng buy/sell có màu nền riêng (`--ds-color-bg-header-buy/sell`) — thêm token map nếu task-01 chưa cover (bổ sung vào `@theme inline`).
- File dài — dùng Serena `replace_symbol_body`/section-wise edit, tránh rewrite cả file một phát.

## Acceptance

- [ ] Không inline style (trừ giá trị động), không `th`.
- [ ] Mọi section render đúng, dữ liệu cập nhật real-time đúng màu.
- [ ] Visual snapshot StockDetailModal (task-00) pass.
- [ ] Protocol verify pass.
