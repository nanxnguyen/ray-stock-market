# Visual & Structural Tests

## Two Types of Tests

### Visual Regression Tests (screenshot comparison)
- **File:** `homepage.spec.ts`
- **Purpose:** Catch pixel-level regressions by comparing screenshots against baselines
- **How:** Uses `toHaveScreenshot()` to compare current render against stored PNG baselines
- **When to update:** Only when an intentional visual change is made

### Structural Tests (DOM assertions)
- **File:** `structural.spec.ts`
- **Purpose:** Catch layout/logic regressions that pixel-comparison might miss
- **Examples:** flex-direction wrong, elements hidden, wrong count, elements stacked instead of side-by-side
- **How:** Uses `page.evaluate()` to inspect DOM structure and computed styles
- **Always:** Independent of screenshot baselines

## Running Tests

```bash
# Run structural tests only (fast, no screenshot dependencies)
npm run test:structural

# Run all visual tests
npx playwright test tests/visual/

# Update snapshots (CAUTION: see below)
npx playwright test tests/visual/ --update-snapshots
```

## Updating Snapshots

**NEVER run `--update-snapshots` blindly.** This overwrites baselines with the current state, including broken states.

### Safe workflow:
1. Run tests first: `npx playwright test tests/visual/`
2. Check which tests fail
3. Review the diffs in `test-results/` screenshots
4. If the changes are **intentional**: `npx playwright test tests/visual/ --update-snapshots`
5. Verify updated baselines look correct
6. Check that no structural tests broke

### Automated check:
```bash
npm run test:visual:check
```
This updates snapshots and then checks if any PNG files changed via `git diff`. If git diff is clean, no baselines were modified.
