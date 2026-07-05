# Task 03 — Core domain components + gallery page

**Phụ thuộc:** task-02. **Thư mục mới:** `src/components/core/`.

## Mục tiêu

Bộ domain components tái sử dụng, compose từ `ui/` primitives, encode design tokens của bảng giá. Đây là bộ mặt "component core để sync qua Claude design" — API phải sạch, strict typed, CVA variants, không inline style.

## Components cần build

Mỗi component 1 file, export qua barrel `src/components/core/index.ts`.

### `PriceText`
Text giá màu theo market state. Nguồn logic màu tham khảo `src/components/stock-table/cellRenderers.tsx` + `columnDefs.ts` (cách app quyết định up/down/ceiling/floor so với reference/ceiling/floor).
```ts
type PriceState = 'up' | 'down' | 'flat' | 'ceiling' | 'floor' | 'reference'
type PriceTextProps = { state: PriceState; children: ReactNode; className?: string; mono?: boolean /* default true */ }
```
Màu: `text-market-up/down/flat/ceiling/floor`, reference → `text-market-flat`. Font `font-mono`. Export thêm helper thuần `getPriceState(price, ref, ceiling, floor): PriceState` (pure function, dễ test, tái dùng cho AG Grid sau này).

### `ChangeBadge`
Badge % thay đổi (▲ +1.2% xanh / ▼ -0.5% đỏ / 0% vàng). Compose `Badge` variant market.

### `ModalShell`
Dialog styled chuẩn design, thay pattern overlay+panel lặp ở AlertModal/StockDetailModal/TradingViewModal:
- Overlay `bg-black/60 backdrop-blur-[4px]`; panel `bg-app border border-line rounded-xl` (12px), animation fadeUp .15s (keyframe `fadeUp` đang ở `src/App.css` — chuyển vào tw-animate hoặc giữ class).
- Props: `open, onClose, title?, width?, children`. Overlay-click + ESC đóng (base-ui Dialog có sẵn).
- Size variants: `sm` (320px — AlertModal), `lg`, `full`.

### `Panel`
Container card: variants `card` (bg-card-2 border-line-subtle), `elevated` (bg-elevated), radius/padding props qua CVA.

### `NavPill`
Pill của TopBar (quick links + toggle): `rounded-[14px] px-[9px] py-1 text-[10px] font-semibold bg-line-subtle border border-line text-txt-secondary`, hỗ trợ `asChild`/render NavLink, state `active` (bg #16457a border-blue-600 — xem TopBar "Công cụ" button).

### `FilterChip`
Nút filter FilterBar/FilterDropdown: default `text-[11px] rounded-[5px] px-2 py-[3px] border`, active `bg-blue-600 text-txt-inverse font-bold border-none`. Props: `active, onClick, children, arrow?`.

### `DropdownGrid`
Menu multi-column của FilterDropdown: panel `bg-nav border-line rounded-[5px] shadow-md`, chia items theo `columns` (round-robin như code cũ `FilterDropdown.tsx:40-47`), item active bg-blue-600, minWidth 130/cột. Build trên `Popover` hoặc `DropdownMenu` primitive (chọn cái giữ được positioning `fixed` dưới trigger như cũ).

### `SearchField`
Input search của SymbolSearch: icon 🔍, nút ✕ clear (chỉ hiện khi có value, click → clear + focus lại), border focus `border-blue-500`, `bg-app text-[11px] rounded-[5px]`. Props: `value, onChange, placeholder?`.

### `IconChip`
Ô icon 28×28 `rounded-lg` với bg tint tùy ý (TopBar menu items): props `icon: ReactNode, tint: string` — tint là giá trị động → cho phép style bg động (ngoại lệ inline style hợp lệ).

## Gallery page (dev-only)

- `src/pages/DevComponents.tsx`: render TẤT CẢ core components mọi variant/state, group theo section, cả dark+light demo.
- Route `/dev/components` thêm vào `src/router.tsx` (lazy, chỉ mount khi `import.meta.env.DEV` — production không bundle).
- Mục đích: eyeball parity với `designHtml/`, làm bề mặt cho DesignSync.

## Quy tắc

- Props strict typed, không `any`. CVA cho variants, `cn()` merge className.
- Không inline `style={{}}` trừ giá trị động runtime (tint, width tính toán).
- Chưa sửa BẤT KỲ component cũ nào — task này chỉ THÊM file mới.

## Acceptance

- [ ] 9 core components + barrel + gallery page compile pass.
- [ ] Gallery `/dev/components` render đủ, so bằng mắt với designHtml/Bang Dien.dc.html thấy khớp style.
- [ ] `npm run lint`, `npm run build`, `npm run test:visual` pass (UI cũ không đổi).
