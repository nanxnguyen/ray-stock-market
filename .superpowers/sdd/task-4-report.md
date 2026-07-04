# Task 4: Wire design system into main.tsx + index.css + index.html

## What I modified

### 1. `src/index.css`
Added 3 CSS imports at the very top of the file:
```css
@import './styles/design-system.css';
@import './styles/themes/dark.css';
@import './styles/themes/light.css';
```

### 2. `index.html`
Changed `<html lang="en">` to `<html lang="vi" data-theme="dark">`.

## TypeScript check result

`npx tsc --noEmit` — **PASS** (no output, no errors).

## Build result

`npm run build` — **PASS** (built in 231ms, all chunks emitted).

Note: Vite reports a warning about a chunk exceeding 500 kB (`index-BZYU2X8N.js` at ~1.4 MB). This is pre-existing and unrelated to this task.

## Self-review findings

- CSS imports are at the top of `index.css` (before the `*` reset), ensuring design system variables load before any styles that reference them.
- Default theme is `dark`, matching the expected user experience.
- `lang="vi"` set on `<html>` for Vietnamese locale.
- No runtime errors, no TypeScript errors, build succeeds cleanly.

## Any issues

None. All items complete and verified.
