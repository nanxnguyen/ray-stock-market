# Task 05 — Migrate SymbolSearch, FilterDropdown

**Phụ thuộc:** task-04 (quy trình chuẩn ở task-04, áp dụng y nguyên).

## Files

- `src/components/SymbolSearch.tsx` (66 dòng) → thay ruột bằng `SearchField` (core). Giữ nguyên props `{ value, onChange, placeholder }`, gỡ `th`.
- `src/components/FilterDropdown.tsx` (122 dòng) → thay bằng `FilterChip` (trigger) + `DropdownGrid` (menu). Giữ props `{ label, items, activeValue, onSelect, arrow, columns }`, gỡ `th`.

## Behavior phải giữ nguyên (test tay)

- SymbolSearch: focus → border blue; ✕ chỉ hiện khi có text, click ✕ → clear + focus lại input.
- FilterDropdown: click trigger toggle menu; click outside đóng; chọn item → `onSelect` + đóng; menu position fixed ngay dưới trigger (cũ: `rect.bottom + 2, rect.left`); multi-column round-robin; trigger active (activeValue ≠ '') → bg-blue-600 + font-bold + label = item label.

## Callsites cập nhật (gỡ `th`)

`grep -rn "SymbolSearch\|FilterDropdown" src --include="*.tsx"` — chủ yếu `FilterBar.tsx` (chưa migrate — chỉ sửa chỗ truyền props).

## Acceptance

- [ ] 2 file dùng core components, không inline style, không nhận `th`.
- [ ] Behavior checklist trên pass trên dev server.
- [ ] Protocol verify (lint/build/test:visual) pass.
