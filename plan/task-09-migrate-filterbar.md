# Task 09 — Migrate FilterBar

**Phụ thuộc:** task-08 (quy trình chuẩn ở task-04). **File:** `src/components/FilterBar.tsx` (331 dòng).

## Nội dung

FilterBar là thanh filter chính của bảng giá: tabs sàn (HOSE/VN30/HNX/UPCOM/CW/WL...), các FilterDropdown (đã migrate task-05), SymbolSearch (task-05), view-mode switcher, nút favorite/watchlist... Nhận `th: ThemeTokens` + nhiều props state từ HomePage.

## Việc cần làm

- Đọc kỹ file, inventory từng cụm UI → map: tab/nút filter → `FilterChip`; separator → `Separator` (ui); group tabs cân nhắc `Tabs` primitive CHỈ khi giữ được đúng markup/pixel — không ép, `FilterChip` list là đủ.
- Gỡ `th`, dùng token classes.
- Props/state interface với HomePage giữ NGUYÊN (đây là component nhiều wiring nhất — không đổi contract).
- Chú ý các trạng thái: tab active, dropdown active (bg-blue-600), WL/favorites (liên quan localStorage watchlist — commit `c9a2fc9`), đếm số mã.

## Acceptance

- [ ] Không inline style, không `th`, mọi filter/tab hoạt động y cũ (đổi sàn, filter ngành, search, đổi view mode, WL).
- [ ] Visual snapshot FilterBar các trạng thái (task-00) pass.
- [ ] Protocol verify pass.
