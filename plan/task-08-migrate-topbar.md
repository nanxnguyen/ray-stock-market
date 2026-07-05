# Task 08 — Migrate TopBar

**Phụ thuộc:** task-07 (quy trình chuẩn ở task-04). **File:** `src/components/TopBar.tsx` (214 dòng).

## Cấu trúc hiện tại

Logo + clock (JetBrains Mono, update mỗi giây) + ticker tape (animation `ticker` 34s, keyframe ở `src/App.css`) + 3 quick-link pills + nút "Công cụ" (mega dropdown 3 cột × ~7 items, `MENU_GROUPS`) + toggle dark/light. Component `memo`-wrapped.

## Việc cần làm

- Quick links + toggle + nút Công cụ → `NavPill` (core). Nút Công cụ có state active (bg `#16457a`, border blue-600, arrow xoay 180°).
- Mega dropdown → giữ cấu trúc div position absolute như cũ HOẶC dropdown-menu primitive — chọn phương án khớp pixel (dropdown cũ: `top: 38, right: 0, width 660, maxWidth 88vw, rounded-[14px], shadow-xl, animation fadeUp`). Item hover bg-elevated (cũ dùng onMouseEnter/Leave đổi style — thay bằng `hover:bg-elevated` class).
- Menu item icon → `IconChip` (28×28, tint từ `MENU_GROUPS[].items[].iconBg` — giá trị động, inline style hợp lệ).
- Ticker tape: GIỮ animation keyframe `ticker` + gradient fade 2 bên; nội dung hardcode giữ nguyên.
- Toggle dark/light: gỡ `th.toggleIcon/toggleLabel/toggleTitle` → component tự dùng `useTheme()` (`src/hooks/useTheme.ts`) lấy `isDark` + `toggleTheme`; xóa prop `toggleDark` nếu callsite cho phép (kiểm tra `Layout.tsx`/`App.tsx` nơi render TopBar).
- Gỡ hẳn `th: ThemeTokens` khỏi TopBar. Cập nhật callsites.
- Giữ `memo`.

## Behavior giữ nguyên

- Clock tick mỗi giây; dropdown Công cụ: click toggle, click outside đóng (document click listener), click item → navigate + đóng; stopPropagation trên nút và panel.

## Acceptance

- [ ] Không inline style (trừ `IconChip` tint), không `th`, dùng `useTheme` trực tiếp.
- [ ] Visual snapshot TopBar + dropdown mở (task-00) pass; ticker tape chạy mượt.
- [ ] Toggle dark/light hoạt động cả app.
- [ ] Protocol verify pass.
