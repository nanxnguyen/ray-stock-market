# Design System — Colors, Spacing, Typography & Beyond

## Goal

Unified design token system for the entire app — replace ~50-60 hardcoded hex colors with a scalable, maintainable token architecture. Support dark/light mode everywhere.

## Problem

Current state:
- `ThemeTokens` (30 tokens) only serves HomePage flow
- 10/20 pages create local hardcoded theme objects
- ~50-60 distinct hex colors scattered across components
- TopBar, FooterBar, StockTable header fully hardcoded
- No CSS variables used anywhere
- Dark/light mode only works on HomePage

## Architecture

```
src/
  styles/
    design-system.css         ← Root CSS variable definitions
    themes/
      dark.css                ← Dark mode overrides via [data-theme="dark"]
      light.css               ← Light mode overrides via [data-theme="light"]
  types/
    design-system.ts          ← ThemeTokens type + DesignSystemTokens type
  hooks/
    useTheme.ts               ← React hook: theme state + toggle + <html> attribute
```

### Flow

1. `design-system.css` imported in `main.tsx` — defines all tokens in `:root`
2. `dark.css` / `light.css` imported in `main.tsx` — override semantic colors via `[data-theme]`
3. `useTheme()` hook manages `darkMode` state, adds/removes `data-theme` attribute on `<html>`
4. Components use CSS variables via `var(--ds-*)` in inline styles or className-based styles

### CSS Variable Naming Convention

Pattern: `--ds-{category}-{name}` or `--ds-{category}-{name}-{scale}`

- `--ds-color-blue-500` (primitive color)
- `--ds-color-bg-primary` (semantic color)
- --ds-color-market-up` (market status color)
- `--ds-space-4` (spacing)
- `--ds-text-sm` (font size)
- `--ds-radius-lg` (border radius)
- `--ds-shadow-md` (box shadow)
- `--ds-z-modal` (z-index)
- `--ds-transition-fast` (transition speed)

## Token Definitions

### Colors — Primitive

Base palette, never changes between themes.

```css
/* Blue */
--ds-color-blue-50: #eff6ff;
--ds-color-blue-100: #dbeafe;
--ds-color-blue-200: #bfdbfe;
--ds-color-blue-300: #93c5fd;
--ds-color-blue-400: #60a5fa;
--ds-color-blue-500: #3b82f6;
--ds-color-blue-600: #2563eb;
--ds-color-blue-700: #1d4ed8;

/* Green */
--ds-color-green-400: #4ade80;
--ds-color-green-500: #22c55e;
--ds-color-green-600: #16a34a;

/* Red */
--ds-color-red-400: #f87171;
--ds-color-red-500: #f43f5e;
--ds-color-red-600: #dc2626;

/* Yellow */
--ds-color-yellow-300: #fde047;
--ds-color-yellow-400: #facc15;
--ds-color-yellow-500: #eab308;

/* Purple */
--ds-color-purple-300: #c4b5fd;
--ds-color-purple-400: #c084fc;
--ds-color-purple-500: #a855f7;
--ds-color-purple-600: #9333ea;
--ds-color-purple-700: #7c3aed;

/* Cyan */
--ds-color-cyan-400: #38bdf8;
--ds-color-cyan-500: #0ea5e9;

/* Orange */
--ds-color-orange-400: #fb923c;
--ds-color-orange-500: #f97316;

/* Neutral (for non-semantic use) */
--ds-color-neutral-50: #f8fafd;
--ds-color-neutral-100: #f0f4f8;
--ds-color-neutral-200: #e2e8f0;
--ds-color-neutral-300: #cbd5e1;
--ds-color-neutral-400: #94a3b8;
--ds-color-neutral-500: #64748b;
--ds-color-neutral-600: #475569;
--ds-color-neutral-700: #334155;
--ds-color-neutral-800: #1e293b;
--ds-color-neutral-900: #0f172a;
--ds-color-neutral-950: #020617;
```

### Colors — Semantic

Change between dark/light themes. Used by most components.

```css
/* Backgrounds */
--ds-color-bg-app: #060c18;           /* light: #f0f4f8 */
--ds-color-bg-nav: #0b1628;           /* light: #ffffff */
--ds-color-bg-card: #0d1420;          /* light: #ffffff */
--ds-color-bg-elevated: #131a24;      /* light: #f8fafd */
--ds-color-bg-input: #0a1018;         /* light: #f0f4f8 */
--ds-color-bg-table: #060c18;         /* light: #f4f7fb */
--ds-color-bg-row-odd: #0b1628;       /* light: #ffffff */
--ds-color-bg-row-even: #08101e;      /* light: #f8fafd */
--ds-color-bg-row-hover: #102040;     /* light: #eef4ff */

/* Text */
--ds-color-text-primary: #d4e0ee;     /* light: #1e293b */
--ds-color-text-secondary: #94a3b8;   /* light: #64748b */
--ds-color-text-muted: #4a6080;       /* light: #94a3b8 */
--ds-color-text-inverse: #ffffff;
--ds-color-text-link: #60a5fa;

/* Borders */
--ds-color-border-default: #1a3050;   /* light: #e1e8f0 */
--ds-color-border-subtle: #0f1e36;    /* light: #f0f5fb */
--ds-color-border-strong: #232b38;    /* light: #cbd5e1 */

/* Status */
--ds-color-success: #22c55e;
--ds-color-danger: #f43f5e;
--ds-color-warning: #f59e0b;
--ds-color-info: #3b82f6;
```

### Colors — Market

Stock market specific, always same regardless of theme.

```css
--ds-color-market-up: #22c55e;
--ds-color-market-down: #f43f5e;
--ds-color-market-flat: #facc15;
--ds-color-market-ceiling: #c084fc;
--ds-color-market-floor: #38bdf8;
--ds-color-market-flash-up: #14532d;
--ds-color-market-flash-down: #450a0a;
```

### Spacing

Base 4px scale.

```css
--ds-space-0: 0px;
--ds-space-1: 4px;
--ds-space-2: 8px;
--ds-space-3: 12px;
--ds-space-4: 16px;
--ds-space-5: 20px;
--ds-space-6: 24px;
--ds-space-8: 32px;
--ds-space-10: 40px;
--ds-space-12: 48px;
--ds-space-16: 64px;
```

### Border Radius

```css
--ds-radius-sm: 4px;
--ds-radius-md: 6px;
--ds-radius-lg: 8px;
--ds-radius-xl: 12px;
--ds-radius-2xl: 16px;
--ds-radius-full: 9999px;
```

### Shadows

```css
--ds-shadow-sm: 0 1px 2px rgba(0,0,0,.3);
--ds-shadow-md: 0 4px 12px rgba(0,0,0,.4);
--ds-shadow-lg: 0 12px 30px rgba(0,0,0,.5);
--ds-shadow-xl: 0 24px 60px rgba(0,0,0,.55);
```

### Z-Index

```css
--ds-z-base: 0;
--ds-z-dropdown: 100;
--ds-z-sticky: 200;
--ds-z-modal: 300;
--ds-z-tooltip: 400;
```

### Transitions

```css
--ds-transition-fast: 150ms ease;
--ds-transition-normal: 250ms ease;
--ds-transition-slow: 350ms ease;
```

### Typography

```css
/* Font families */
--ds-font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--ds-font-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* Font sizes */
--ds-text-xs: 10px;
--ds-text-sm: 11px;
--ds-text-base: 12px;
--ds-text-md: 13px;
--ds-text-lg: 14px;
--ds-text-xl: 16px;
--ds-text-2xl: 20px;
--ds-text-3xl: 28px;

/* Font weights */
--ds-font-regular: 400;
--ds-font-medium: 500;
--ds-font-semibold: 600;
--ds-font-bold: 700;
--ds-font-extrabold: 800;

/* Line heights */
--ds-leading-tight: 1.15;
--ds-leading-normal: 1.4;
--ds-leading-relaxed: 1.6;
```

## TypeScript Integration

### ThemeTokens Type (existing, will be refactored)

Current `ThemeTokens` in `src/types/priceboard.ts` stays as-is for backward compatibility during migration. New components use CSS variables directly.

### useTheme Hook

```typescript
// src/hooks/useTheme.ts
export type Theme = 'dark' | 'light'

export function useTheme(): {
  theme: Theme
  toggleTheme: () => void
  isDark: boolean
}
```

- Reads initial theme from `localStorage` or system preference
- Sets `data-theme` attribute on `<html>` element
- Persists to `localStorage`

## Migration Strategy

### Phase 1: Foundation (this implementation)

1. Create `src/styles/design-system.css` with all CSS variables
2. Create `src/styles/themes/dark.css` and `light.css`
3. Create `src/types/design-system.ts` with types
4. Create `src/hooks/useTheme.ts`
5. Import in `main.tsx`
6. Add `data-theme="dark"` to `<html>` as default

### Phase 2: Gradual Migration (future)

Migrate existing components one by one:

| Priority | Target | Change |
|----------|--------|--------|
| 1 | `getTheme()` in App.tsx | Refactor to return CSS variable references |
| 2 | TopBar.tsx | Replace hardcoded colors with `var(--ds-*)` |
| 3 | FooterBar.tsx | Same |
| 4 | StockTable header | Same |
| 5 | 10 pages with local themes | Replace local `th` objects with shared tokens |
| 6 | marketFormat.ts priceColor() | Use `var(--ds-color-market-*)` |

### Phase 3: Full Dark/Light Mode (future)

After all components migrated, dark/light mode works everywhere automatically.

## Constraints

- Backward compatible: existing `ThemeTokens` prop system still works during migration
- CSS variables are the source of truth; `ThemeTokens` becomes a thin wrapper
- No new dependencies — pure CSS + React hooks
- Default theme is dark (current behavior preserved)
- `getTheme()` function deprecated after full migration

## Files Created (this implementation)

```
src/styles/design-system.css
src/styles/themes/dark.css
src/styles/themes/light.css
src/types/design-system.ts
src/hooks/useTheme.ts
```

## Files Modified (this implementation)

```
src/main.tsx          — import CSS files, set default data-theme
src/index.css         — import design-system.css
```
