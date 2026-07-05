# Task 07 — Migrate IndexStrip, GlobalMarketsPanel

**Phụ thuộc:** task-06 (quy trình chuẩn ở task-04).

## Files

- `src/components/IndexStrip.tsx` (56 dòng) — dải chỉ số thị trường. Dùng `PriceText`/`ChangeBadge` cho giá + % thay đổi, gỡ `th`.
- `src/components/GlobalMarketsPanel.tsx` (101 dòng) — panel thị trường quốc tế. Dùng `Panel` + `PriceText`, gỡ `th`.

## Lưu ý

- Cả 2 hiển thị dữ liệu động (marketSimulation) — màu up/down phải đúng logic cũ, dùng `getPriceState` helper từ core nếu khớp, không thì giữ logic màu cục bộ nhưng bằng token classes.
- Số liệu format qua `src/lib/marketFormat.ts` — không đụng.

## Acceptance

- [ ] 2 file dùng core components + token classes, không inline style, không `th`.
- [ ] Màu up/down/flat đúng khi giá simulate đổi (quan sát dev server ~30s).
- [ ] Protocol verify pass.
