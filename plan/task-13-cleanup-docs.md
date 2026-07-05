# Task 13 — Cleanup + docs (task cuối)

**Phụ thuộc:** task-04 → task-12 xong hết.

## Việc cần làm

1. **ThemeTokens dọn dẹp:** `grep -rn "ThemeTokens" src` — sau migrate, chỉ pages (chưa migrate, ngoài scope) còn dùng. Gỡ các field không còn ai đọc (toggleIcon/toggleLabel/toggleTitle nếu chỉ TopBar dùng); KHÔNG xóa type nếu pages còn nhận `th`. Cập nhật `src/types/priceboard.ts`, nơi build `th` object (`src/App.tsx`/`HomePage.tsx`).
2. **Dead CSS:** rà `src/App.css` (47 dòng) — giữ keyframes còn dùng (`ticker`, `fadeUp` nếu chưa chuyển), xóa rule chết. Rà class không còn reference.
3. **CLAUDE.md update:** file đang mô tả app cũ (single App.tsx, 5 mã hardcode) — viết lại section Architecture + thêm section conventions core components:
   - `src/components/ui/` = shadcn primitives (base-nova, @base-ui/react, CVA), `src/components/core/` = domain components, barrel import `@/components/core`.
   - Token flow: `--ds-*` (design-system.css, flip theo `[data-theme]`) → Tailwind `@theme` (`bg-app`, `text-market-up`...) → shadcn semantic vars.
   - Rule: component mới cấm inline style, dùng core/ui + token classes; gallery `/dev/components`.
4. **Full verify cuối:**
   - `npm run lint && npm run build && npm run test:visual` pass toàn bộ.
   - Đi tay dev server: toggle theme, cả 4 view modes, 3 modals, filter, search, watchlist, navigate 3-4 subpages.
5. Cập nhật bảng Status trong `plan/README.md` — đánh dấu hoàn thành toàn bộ.

## Acceptance

- [ ] Không còn code/type/CSS chết liên quan phần đã migrate.
- [ ] CLAUDE.md phản ánh đúng kiến trúc mới.
- [ ] Full verify pass.
