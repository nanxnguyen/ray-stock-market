# Design System — Colors, Spacing, Typography Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a unified design token system with CSS variables + ThemeTokens, supporting dark/light mode across the entire app.

**Architecture:** CSS variables defined in `:root` with dark/light theme overrides via `[data-theme]` attribute. A `useTheme()` React hook manages theme state. Existing `ThemeTokens` stays for backward compatibility during migration.

**Tech Stack:** CSS custom properties, React hooks, TypeScript types.

## Global Constraints

- CSS variables use `--ds-{category}-{name}` naming convention
- Default theme: dark (preserves current behavior)
- No new npm dependencies
- Backward compatible: existing `ThemeTokens` prop system still works
- All CSS variable values come from the design spec

---

## File Structure

```
src/
  styles/
    design-system.css         ← Root CSS variables (~120 variables)
    themes/
      dark.css                ← Dark mode semantic overrides (~20 vars)
      light.css               ← Light mode semantic overrides (~20 vars)
  types/
    design-system.ts          ← Theme type + DesignTokens type
  hooks/
    useTheme.ts               ← useTheme() hook
```

**Modified files:**
```
src/main.tsx                  ← Import CSS, add data-theme="dark"
src/index.css                 ← Import design-system.css
```

---

### Task 1: Create design-system.css — Primitive Colors

**Files:**
- Create: `src/styles/design-system.css`

**Interfaces:**
- Consumes: Design spec color values
- Produces: CSS variables available globally via `:root`

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p src/styles/themes
```

- [ ] **Step 2: Create design-system.css with primitive colors + spacing + radius + shadows + z-index + transitions + typography**

Write the full CSS file with ALL tokens defined in `:root`. Here are the exact values:

```css
/* ========================================
   Design System — CSS Variables
   Naming: --ds-{category}-{name}
   ======================================== */

:root {
  /* ── Primitive Colors ── */
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

  /* Neutral */
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

  /* ── Semantic Colors (dark default) ── */
  --ds-color-bg-app: #060c18;
  --ds-color-bg-nav: #0b1628;
  --ds-color-bg-card: #0d1420;
  --ds-color-bg-elevated: #131a24;
  --ds-color-bg-input: #0a1018;
  --ds-color-bg-table: #060c18;
  --ds-color-bg-row-odd: #0b1628;
  --ds-color-bg-row-even: #08101e;
  --ds-color-bg-row-hover: #102040;

  --ds-color-text-primary: #d4e0ee;
  --ds-color-text-secondary: #94a3b8;
  --ds-color-text-muted: #4a6080;
  --ds-color-text-inverse: #ffffff;
  --ds-color-text-link: #60a5fa;

  --ds-color-border-default: #1a3050;
  --ds-color-border-subtle: #0f1e36;
  --ds-color-border-strong: #232b38;

  --ds-color-success: #22c55e;
  --ds-color-danger: #f43f5e;
  --ds-color-warning: #f59e0b;
  --ds-color-info: #3b82f6;

  /* ── Market Colors ── */
  --ds-color-market-up: #22c55e;
  --ds-color-market-down: #f43f5e;
  --ds-color-market-flat: #facc15;
  --ds-color-market-ceiling: #c084fc;
  --ds-color-market-floor: #38bdf8;
  --ds-color-market-flash-up: #14532d;
  --ds-color-market-flash-down: #450a0a;

  /* ── Spacing (base 4px) ── */
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

  /* ── Border Radius ── */
  --ds-radius-sm: 4px;
  --ds-radius-md: 6px;
  --ds-radius-lg: 8px;
  --ds-radius-xl: 12px;
  --ds-radius-2xl: 16px;
  --ds-radius-full: 9999px;

  /* ── Shadows ── */
  --ds-shadow-sm: 0 1px 2px rgba(0,0,0,.3);
  --ds-shadow-md: 0 4px 12px rgba(0,0,0,.4);
  --ds-shadow-lg: 0 12px 30px rgba(0,0,0,.5);
  --ds-shadow-xl: 0 24px 60px rgba(0,0,0,.55);

  /* ── Z-Index ── */
  --ds-z-base: 0;
  --ds-z-dropdown: 100;
  --ds-z-sticky: 200;
  --ds-z-modal: 300;
  --ds-z-tooltip: 400;

  /* ── Transitions ── */
  --ds-transition-fast: 150ms ease;
  --ds-transition-normal: 250ms ease;
  --ds-transition-slow: 350ms ease;

  /* ── Typography ── */
  --ds-font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --ds-font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  --ds-text-xs: 10px;
  --ds-text-sm: 11px;
  --ds-text-base: 12px;
  --ds-text-md: 13px;
  --ds-text-lg: 14px;
  --ds-text-xl: 16px;
  --ds-text-2xl: 20px;
  --ds-text-3xl: 28px;

  --ds-font-regular: 400;
  --ds-font-medium: 500;
  --ds-font-semibold: 600;
  --ds-font-bold: 700;
  --ds-font-extrabold: 800;

  --ds-leading-tight: 1.15;
  --ds-leading-normal: 1.4;
  --ds-leading-relaxed: 1.6;
}
```

- [ ] **Step 3: Verify CSS file is valid**

Run: `cat src/styles/design-system.css | wc -l`
Expected: ~140 lines

---

### Task 2: Create dark.css and light.css — Theme Overrides

**Files:**
- Create: `src/styles/themes/dark.css`
- Create: `src/styles/themes/light.css`

**Interfaces:**
- Consumes: CSS variables from design-system.css
- Produces: Theme-specific overrides via `[data-theme]` selector

- [ ] **Step 1: Create dark.css**

```css
/* Dark theme overrides (default — matches :root defaults) */
[data-theme="dark"] {
  --ds-color-bg-app: #060c18;
  --ds-color-bg-nav: #0b1628;
  --ds-color-bg-card: #0d1420;
  --ds-color-bg-elevated: #131a24;
  --ds-color-bg-input: #0a1018;
  --ds-color-bg-table: #060c18;
  --ds-color-bg-row-odd: #0b1628;
  --ds-color-bg-row-even: #08101e;
  --ds-color-bg-row-hover: #102040;

  --ds-color-text-primary: #d4e0ee;
  --ds-color-text-secondary: #94a3b8;
  --ds-color-text-muted: #4a6080;
  --ds-color-text-inverse: #ffffff;
  --ds-color-text-link: #60a5fa;

  --ds-color-border-default: #1a3050;
  --ds-color-border-subtle: #0f1e36;
  --ds-color-border-strong: #232b38;

  --ds-shadow-sm: 0 1px 2px rgba(0,0,0,.3);
  --ds-shadow-md: 0 4px 12px rgba(0,0,0,.4);
  --ds-shadow-lg: 0 12px 30px rgba(0,0,0,.5);
  --ds-shadow-xl: 0 24px 60px rgba(0,0,0,.55);
}
```

- [ ] **Step 2: Create light.css**

```css
/* Light theme overrides */
[data-theme="light"] {
  --ds-color-bg-app: #f0f4f8;
  --ds-color-bg-nav: #ffffff;
  --ds-color-bg-card: #ffffff;
  --ds-color-bg-elevated: #f8fafd;
  --ds-color-bg-input: #f0f4f8;
  --ds-color-bg-table: #f4f7fb;
  --ds-color-bg-row-odd: #ffffff;
  --ds-color-bg-row-even: #f8fafd;
  --ds-color-bg-row-hover: #eef4ff;

  --ds-color-text-primary: #1e293b;
  --ds-color-text-secondary: #64748b;
  --ds-color-text-muted: #94a3b8;
  --ds-color-text-inverse: #ffffff;
  --ds-color-text-link: #2563eb;

  --ds-color-border-default: #e1e8f0;
  --ds-color-border-subtle: #f0f5fb;
  --ds-color-border-strong: #cbd5e1;

  --ds-shadow-sm: 0 1px 2px rgba(0,0,0,.08);
  --ds-shadow-md: 0 4px 12px rgba(0,0,0,.1);
  --ds-shadow-lg: 0 12px 30px rgba(0,0,0,.12);
  --ds-shadow-xl: 0 24px 60px rgba(0,0,0,.15);
}
```

---

### Task 3: Create TypeScript Types and useTheme Hook

**Files:**
- Create: `src/types/design-system.ts`
- Create: `src/hooks/useTheme.ts`

**Interfaces:**
- Consumes: CSS variable names from design-system.css
- Produces: `useTheme()` hook exported for components

- [ ] **Step 1: Create design-system.ts types**

```typescript
export type Theme = 'dark' | 'light'

export interface DesignTokens {
  color: {
    bg: {
      app: string
      nav: string
      card: string
      elevated: string
      input: string
      table: string
      rowOdd: string
      rowEven: string
      rowHover: string
    }
    text: {
      primary: string
      secondary: string
      muted: string
      inverse: string
      link: string
    }
    border: {
      default: string
      subtle: string
      strong: string
    }
    status: {
      success: string
      danger: string
      warning: string
      info: string
    }
    market: {
      up: string
      down: string
      flat: string
      ceiling: string
      floor: string
      flashUp: string
      flashDown: string
    }
  }
}
```

- [ ] **Step 2: Create useTheme.ts hook**

```typescript
import { useState, useEffect, useCallback } from 'react'
import type { Theme } from '../types/design-system'

const STORAGE_KEY = 'ds-theme'

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return 'dark'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  const isDark = theme === 'dark'

  return { theme, toggleTheme, isDark }
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1`
Expected: No errors

---

### Task 4: Wire Into main.tsx and index.css

**Files:**
- Modify: `src/main.tsx`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: `useTheme` hook, CSS files
- Produces: App renders with design system active

- [ ] **Step 1: Add CSS imports to index.css**

Add at the top of `src/index.css`:

```css
@import './styles/design-system.css';
@import './styles/themes/dark.css';
@import './styles/themes/light.css';
```

- [ ] **Step 2: Set default data-theme in index.html**

Read `index.html` and add `data-theme="dark"` to the `<html>` tag:

```html
<html lang="vi" data-theme="dark">
```

- [ ] **Step 3: Verify the app builds**

Run: `npx tsc --noEmit 2>&1`
Expected: No errors

- [ ] **Step 4: Verify CSS variables load in browser**

Run: `npm run dev` and open browser dev tools → inspect `<html>` element → check that `data-theme="dark"` is present and CSS variables resolve.

- [ ] **Step 5: Commit**

```bash
git add src/styles/ src/types/design-system.ts src/hooks/useTheme.ts src/main.tsx src/index.css index.html
git commit -m "feat: add design system foundation — CSS variables, dark/light themes, useTheme hook"
```

---

### Task 5: Verify CSS Variables Work End-to-End

**Files:**
- No new files

**Interfaces:**
- Consumes: Design system from Tasks 1-4
- Produces: Confirmation that variables resolve correctly

- [ ] **Step 1: Create a quick smoke test — add a temporary debug element**

In `src/main.tsx` or any component, temporarily add:

```tsx
<div style={{
  background: 'var(--ds-color-bg-card)',
  color: 'var(--ds-color-text-primary)',
  padding: 'var(--ds-space-4)',
  borderRadius: 'var(--ds-radius-lg)',
  border: '1px solid var(--ds-color-border-default)',
  fontSize: 'var(--ds-text-md)',
}}>
  Design System Smoke Test
</div>
```

- [ ] **Step 2: Run dev server and visually verify**

Run: `npm run dev`
Expected: The smoke test div shows with correct dark theme colors.

- [ ] **Step 3: Toggle theme and verify light mode**

Manually change `<html data-theme="light">` in dev tools or use `useTheme().toggleTheme()`.
Expected: Smoke test div switches to light theme colors.

- [ ] **Step 4: Remove smoke test element**

Delete the temporary div from Step 1.

- [ ] **Step 5: Run TypeScript check**

Run: `npx tsc --noEmit 2>&1`
Expected: No errors

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: verify design system CSS variables work end-to-end"
```

---

## Summary

| Task | Files Created | Files Modified | Deliverable |
|------|---------------|----------------|-------------|
| 1 | `design-system.css` | — | All CSS variables defined |
| 2 | `dark.css`, `light.css` | — | Theme overrides |
| 3 | `design-system.ts`, `useTheme.ts` | — | TypeScript types + hook |
| 4 | — | `main.tsx`, `index.css`, `index.html` | Wired into app |
| 5 | — | — | End-to-end verification |
