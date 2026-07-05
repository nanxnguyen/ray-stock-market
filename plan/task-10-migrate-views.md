# Task 10 — Migrate GridView, TopMoversView, HeatmapView

**Phụ thuộc:** task-09 (quy trình chuẩn ở task-04).

## Files

- `src/components/GridView.tsx` (129 dòng) — card grid các mã. → `Panel` + `PriceText` + `ChangeBadge`.
- `src/components/TopMoversView.tsx` (144 dòng) — top tăng/giảm. → `Panel` + `PriceText`.
- `src/components/HeatmapView.tsx` (103 dòng) — treemap. Các ô treemap có size/màu TÍNH TOÁN từ dữ liệu → giữ inline style cho width/height/màu động (ngoại lệ hợp lệ), phần khung/label/legend chuyển token classes.

## Lưu ý

- 3 view này switch qua view-mode trên FilterBar/HomePage — đảm bảo cả 3 mode render sau migrate.
- Màu market state dùng `getPriceState` + `PriceText`; heatmap dùng scale màu riêng (giữ logic, chỉ đổi cách apply).
- Gỡ `th` cả 3 file, cập nhật callsite `HomePage.tsx`.

## Acceptance

- [ ] Cả 3 view render đúng, dữ liệu simulate cập nhật màu đúng.
- [ ] Visual snapshots 3 view (task-00) pass.
- [ ] Protocol verify pass.
