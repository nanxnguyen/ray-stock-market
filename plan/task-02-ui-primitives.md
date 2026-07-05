# Task 02 — Bổ sung ui/ primitives + dense variants

**Phụ thuộc:** task-01. **Thư mục:** `src/components/ui/`.

## Mục tiêu

Đủ primitives cho 16 shared components sắp migrate, size/variant khớp design dense (font 10–13px, padding 3–8px, control height ~20–26px).

## Hiện có (giữ, không xóa)

`badge.tsx, button.tsx, input.tsx, select.tsx, separator.tsx, tabs.tsx, tooltip.tsx` — pattern: `@base-ui/react` primitive + CVA + `cn()` từ `@/lib/utils`, không forwardRef (React 19), `data-slot` attribute. Xem `button.tsx` làm mẫu chuẩn.

## Việc cần làm

### 1. Thêm primitives qua shadcn CLI

```bash
npx shadcn@latest add dialog dropdown-menu popover switch card scroll-area
```

(`components.json` đã cấu hình đúng — style `base-nova`, alias `@/components/ui`.) Nếu CLI lỗi mạng/registry, viết tay theo đúng pattern `button.tsx` + `@base-ui/react` docs (dùng Context7 MCP để tra API base-ui).

### 2. Thêm dense variants (mở rộng CVA trong chính file ui — triết lý shadcn own-the-code)

Consumer cần (đo từ code hiện tại):

| Primitive | Variant/size cần thêm | Khớp với |
|---|---|---|
| `button` | size `2xs`: h-[22px] px-2 text-[11px] rounded-[5px] | FilterDropdown trigger (padding '3px 8px', fontSize 11, radius 5) |
| `button` | variant `chip`: bg-transparent text-txt-secondary border-line, active→bg-blue-600 | FilterBar/FilterDropdown chips |
| `input` | size nhỏ text-[11px] h-[22px] | SymbolSearch (fontSize 11, padding '3px 7px') |
| `badge` | variant market: up/down/flat/ceiling/floor dùng `text-market-*` | ChangeBadge (task-03) |
| `dialog` | overlay: `bg-black/60 backdrop-blur-[4px]`, z-index cao hơn AG Grid | AlertModal overlay `rgba(0,0,0,.6)` blur 4px zIndex 250 |

Chỉ THÊM variants, không sửa variants mặc định (giữ khả năng sync shadcn registry sau này).

### 3. Kiểm tra tương thích

- `@base-ui/react` version `^1.6.0` — kiểm tra import path từng primitive (vd `@base-ui/react/dialog`).
- Dialog/Popover/DropdownMenu của base-ui render qua Portal — đảm bảo mount vào `document.body` và z-index đủ (app dùng `--ds-z-modal: 300`, dropdown 100; xem `src/styles/design-system.css`).

## Acceptance

- [ ] 6 primitives mới tồn tại trong `src/components/ui/`, compile pass.
- [ ] Dense variants thêm xong, không đổi default variants.
- [ ] `npm run lint`, `npm run build` pass.
- [ ] `npm run test:visual` pass (chưa ai import các file này → UI không đổi).
