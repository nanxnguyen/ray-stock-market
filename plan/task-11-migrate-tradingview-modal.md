# Task 11 — Migrate TradingViewModal

**Phụ thuộc:** task-10 (quy trình chuẩn ở task-04). **File:** `src/components/TradingViewModal.tsx` (130 dòng).

## Việc cần làm

- Overlay + panel → `ModalShell` (size lg/full tùy kích thước cũ — đo trước khi chọn).
- Header (title + nút đóng), body chart/iframe giữ nguyên logic.
- Token classes thay inline style; gỡ `th` nếu nhận.
- Behavior: overlay-click + nút ✕ đóng; nếu có ESC handler riêng thì bỏ (ModalShell/base-ui lo), test ESC vẫn đóng.

## Acceptance

- [ ] Modal mở/đóng đúng trigger cũ, nội dung render đủ.
- [ ] Visual snapshot (task-00) pass.
- [ ] Protocol verify pass.
