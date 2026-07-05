# Task 06 — Migrate AlertModal, CompareBar

**Phụ thuộc:** task-05 (quy trình chuẩn ở task-04).

## Files

- `src/components/AlertModal.tsx` (106 dòng) → `ModalShell` size sm (320px) + `Button` + `Input`.
  - Giữ props `{ alert: AlertModalState, onClose, onSave }` nguyên vẹn.
  - 2 nút direction (Giá LÊN/XUỐNG): active bg-blue-600 — dùng `FilterChip` hoặc Button variant chip.
  - Input ngưỡng giá: `font-mono text-[14px] bg-table`.
  - Nút Lưu: full-width `bg-market-up` (green-500) font-extrabold.
  - Behavior: overlay-click đóng, panel-click không đóng, save chỉ khi `parseFloat` hợp lệ > 0.
- `src/components/CompareBar.tsx` (67 dòng) → token classes + `Button`/`Badge` nếu khớp.

## Acceptance

- [ ] AlertModal mở/đóng/save hoạt động y cũ (test tay: click chuông trên row bảng giá).
- [ ] Visual snapshot AlertModal + CompareBar (task-00) pass.
- [ ] Protocol verify pass.
