# Hero Section — Landscape Mobile Fix

**Date:** 2026-04-28
**Status:** Done
**Scope:** `app/globals.css`, `components/sections/Hero.tsx`

---

## Problem

On phones in landscape orientation (e.g. Samsung S26 Ultra, ~915×412 viewport), the Hero section renders at full portrait height. The stacked content — heading, subtitle, location, summary paragraph, CTA buttons, and scroll indicator — totals ~600–700 px, well over the ~390–412 px landscape viewport height. This causes the section to overflow and the CTA buttons are pushed below the fold (or past the navbar on some devices).

## Solution

Defined a `landscape-compact` Tailwind v4 custom variant in `globals.css` that activates under `@media (orientation: landscape) and (max-height: 500px)`. The 500 px threshold catches all landscape phones while leaving tablets (iPad landscape ≥ 768 px) completely unaffected.

In `Hero.tsx`, the variant is applied to:

- **Hide** the location `<p>` and summary `<p>` — the two bulkiest vertical items
- **Hide** the `ScrollIndicator` wrapper — scroll hinting is less meaningful in landscape
- **Shrink** the `<h1>` from `text-4xl` → `text-3xl` and tighten its bottom margin
- **Remove** `min-h-screen` force (`landscape-compact:min-h-0`) and add `py-6` padding so the section sizes to its content
- **Tighten** margins on the label, heading, and button container

Portrait layout is completely unchanged. No client component or JS is involved — pure CSS/Tailwind.

## Files Changed

### `app/globals.css`

Added a `@custom-variant landscape-compact` block using the Tailwind v4 CSS-first `@slot` syntax immediately after the existing `light` variant:

```css
@custom-variant landscape-compact {
  @media (orientation: landscape) and (max-height: 500px) {
    @slot;
  }
}
```

### `components/sections/Hero.tsx`

Applied `landscape-compact:*` classes to six elements:

| Element | Change |
|---|---|
| `<section>` | `min-h-screen` → `landscape-compact:min-h-0 landscape-compact:py-6` |
| "Hi, I'm" `<p>` | `landscape-compact:mb-1` |
| `<h1>` | `landscape-compact:text-3xl landscape-compact:mb-1` |
| Subtitle `<p>` | `landscape-compact:mb-3` |
| Location `<p>` | `landscape-compact:hidden` |
| Summary `<p>` | `landscape-compact:hidden` |
| CTA button `<div>` | `landscape-compact:mb-0` (removes `mb-16` dead space) |
| `<ScrollIndicator>` wrapper | `landscape-compact:hidden` |

---

## Notes & Gotchas

- **Threshold choice (500 px):** Samsung S26 Ultra landscape is ~412 px; iPad mini landscape is ~768 px. 500 px is a clean gap between the two device categories.
- **`@custom-variant` with `@slot`:** This is the Tailwind v4.x CSS-first block syntax. The single-line selector form `@custom-variant name (selector)` does not work for media queries — use the block form with `@slot`.
- **No `!important` needed:** `@custom-variant`-generated utilities sit in `@layer utilities` at the same cascade layer as regular Tailwind utilities. Later declarations (landscape-compact overrides) win over earlier ones (default utilities) due to source order within the same layer.
- **Stays a server component:** No `"use client"`, no `useState`, no JS resize listeners — the fix is pure CSS.

## Follow-up Tasks

- [ ] Test on an actual S26 Ultra or via Chrome DevTools → Samsung Galaxy S24 Ultra device preset in landscape
- [ ] Verify other sections (About, Experience, etc.) don't overflow in landscape — they use natural content height, so they should be fine
