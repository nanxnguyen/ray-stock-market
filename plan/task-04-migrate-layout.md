# Task 04 — Migrate FooterBar, Layout, SubPageLayout

**Phụ thuộc:** task-03. Task migrate đầu tiên — rủi ro thấp nhất, dùng để chuẩn hóa quy trình migrate.

## Quy trình migrate chuẩn (áp dụng cho mọi task 04–12)

1. Đọc component cũ, liệt kê mọi giá trị style (màu, px, font) → map sang Tailwind class/token (`bg-app`, `text-[11px]`, `px-[7px]`...). Giá trị lẻ không có token → arbitrary value `[...]`, KHÔNG làm tròn.
2. Rewrite: inline style → className Tailwind + core/ui components. Logic/state/props giữ nguyên.
3. Gỡ prop `th: ThemeTokens` nếu component nhận: màu lấy từ token classes (tự flip theo `data-theme`). Cập nhật callsite truyền `th` (xem `src/router.tsx`, `src/App.tsx`, `src/pages/HomePage.tsx`).
4. Verify: `npm run lint` + `npm run build` + `npm run test:visual` (so baseline task-00, KHÔNG update baseline) + spot-check dev server.

## Files

- `src/components/FooterBar.tsx` (23 dòng) — thuần trình bày.
- `src/components/Layout.tsx` (22 dòng) — shell wrap TopBar/FooterBar, nhận `th`.
- `src/components/SubPageLayout.tsx` (220 dòng) — layout subpages, nhận `th`.

## Lưu ý riêng

- `Layout`/`SubPageLayout` nhận `th: ThemeTokens` → sau khi 3 file này tự lấy màu qua token classes, kiểm tra `th` còn được truyền xuống children nào không (TopBar vẫn cần `th` đến task-08 — giữ pass-through nếu cần, gỡ hẳn ở task-08).
- SubPageLayout dùng `Panel`/`NavPill` từ core nếu khớp pattern; không ép nếu style khác.

## Acceptance

- [ ] 3 file không còn inline `style={{}}` (trừ giá trị động), dùng token classes.
- [ ] Protocol verify pass đủ 4 bước.
