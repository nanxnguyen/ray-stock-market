# Task 01 — Token bridge: `--ds-*` → Tailwind theme + shadcn vars

**Phụ thuộc:** task-00. **File chính:** `src/index.css`. **UI không được đổi 1 pixel nào.**

## Mục tiêu

Nối design tokens `--ds-*` (nguồn sự thật tại `src/styles/design-system.css` + `src/styles/themes/*.css`) vào (1) Tailwind utility classes và (2) shadcn semantic vars — để core components dùng được `bg-app`, `text-market-up`, `border-line`... và shadcn primitives render đúng màu design.

## Việc cần làm trong `src/index.css`

### 1. Fix dark variant (bug hiện tại)

```css
/* cũ:  @custom-variant dark (&:is(.dark *)); */
@custom-variant dark (&:is([data-theme="dark"] *));
```

Theme switch qua `data-theme` attribute (xem `src/hooks/useTheme.ts`) — KHÔNG đổi hook.

### 2. Map `--ds-*` vào block `@theme inline` (thêm vào block sẵn có)

```css
@theme inline {
  /* Surfaces */
  --color-app: var(--ds-color-bg-app);
  --color-nav: var(--ds-color-bg-nav);
  --color-card-2: var(--ds-color-bg-card);
  --color-elevated: var(--ds-color-bg-elevated);
  --color-input-bg: var(--ds-color-bg-input);
  --color-table: var(--ds-color-bg-table);
  --color-row-odd: var(--ds-color-bg-row-odd);
  --color-row-even: var(--ds-color-bg-row-even);
  --color-row-hover: var(--ds-color-bg-row-hover);
  /* Text */
  --color-txt-primary: var(--ds-color-text-primary);
  --color-txt-secondary: var(--ds-color-text-secondary);
  --color-txt-muted: var(--ds-color-text-muted);
  --color-txt-inverse: var(--ds-color-text-inverse);
  --color-txt-link: var(--ds-color-text-link);
  /* Borders */
  --color-line: var(--ds-color-border-default);
  --color-line-subtle: var(--ds-color-border-subtle);
  --color-line-strong: var(--ds-color-border-strong);
  /* Market states */
  --color-market-up: var(--ds-color-market-up);
  --color-market-down: var(--ds-color-market-down);
  --color-market-flat: var(--ds-color-market-flat);
  --color-market-ceiling: var(--ds-color-market-ceiling);
  --color-market-floor: var(--ds-color-market-floor);
  --color-market-foreign-buy: var(--ds-color-market-foreign-buy);
  /* Status */
  --color-success: var(--ds-color-success);
  --color-danger: var(--ds-color-danger);
  --color-warning: var(--ds-color-warning);
  --color-info: var(--ds-color-info);
  /* Fonts — KHÔNG đổi --font-sans (body đang Geist, giữ parity) */
  --font-ui: var(--ds-font-sans);      /* Inter */
  --font-mono: var(--ds-font-mono);    /* JetBrains Mono */
}
```

(Tên class sinh ra: `bg-app`, `text-txt-primary`, `border-line`, `text-market-up`, `font-ui`, `font-mono`...)

### 3. Remap shadcn semantic vars về `--ds-*`

Thay 2 block `:root { --background: oklch(...) ... }` và `.dark { ... }` neutral hiện tại bằng MỘT block trỏ vào ds tokens (ds tokens tự flip theo `[data-theme]` nên không cần block dark riêng cho những var trỏ vào ds):

```css
:root {
  --background: var(--ds-color-bg-app);
  --foreground: var(--ds-color-text-primary);
  --card: var(--ds-color-bg-card);
  --card-foreground: var(--ds-color-text-primary);
  --popover: var(--ds-color-bg-card);
  --popover-foreground: var(--ds-color-text-primary);
  --primary: var(--ds-color-blue-600);
  --primary-foreground: var(--ds-color-text-inverse);
  --secondary: var(--ds-color-bg-elevated);
  --secondary-foreground: var(--ds-color-text-primary);
  --muted: var(--ds-color-bg-elevated);
  --muted-foreground: var(--ds-color-text-secondary);
  --accent: var(--ds-color-bg-elevated);
  --accent-foreground: var(--ds-color-text-primary);
  --destructive: var(--ds-color-danger);
  --border: var(--ds-color-border-default);
  --input: var(--ds-color-bg-input);
  --ring: var(--ds-color-blue-500);
  --radius: 0.625rem;
  /* chart-* và sidebar-* giữ giá trị cũ nếu chưa dùng */
}
```

Giữ `@theme inline` mapping sẵn có của shadcn (`--color-background: var(--background)`...) nguyên vẹn.

## Vì sao zero-risk

Chưa component nào trong app import `@/components/ui` hay dùng Tailwind color classes (74 `className` hiện có chủ yếu là ag-grid) → đổi các vars này không ảnh hưởng UI đang chạy. Visual test phải chứng minh điều đó.

## Acceptance

- [ ] `npm run lint`, `npm run build` pass.
- [ ] `npm run test:visual` pass 100% so baseline task-00 (KHÔNG update baseline).
- [ ] `dark:` variant hoạt động: viết thử 1 element test `class="dark:bg-red-500"` trên dev server, toggle theme thấy đổi, rồi XÓA element test.
- [ ] Không sửa file nào ngoài `src/index.css`.
