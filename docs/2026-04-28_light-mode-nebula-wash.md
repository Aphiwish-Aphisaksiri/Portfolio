# Light Mode — Nebula Wash

**Date:** 2026-04-28
**Status:** Done
**Scope:** `app/globals.css`, `components/ui/NebulaBackground.tsx`, `app/page.tsx`

---

## Problem

The initial light mode override used near-white background colors (`#f8fafc` / `#ffffff`), which clashed completely with the dark-mode "space / neural network" aesthetic. Toggling to light mode felt like switching to a completely different, unrelated design — the particle background lost all visual presence against the bright canvas.

## Solution

Replaced the static light mode with an animated **Nebula Wash** — four large, heavily blurred radial gradient blobs (`nebula-1` through `nebula-4`) rendered in a React component (`NebulaBackground`) that mounts only in light mode. Each blob drifts independently via CSS `@keyframes` animations (24–38 s cycles) with slight scale pulsing, creating an organic, breathing atmosphere. The light background color remains (`#e8eaf6`) so the mode still reads clearly as "day", but the nebula blobs layer indigo, cyan, and violet blooms on top, tying the light mode visually back to the accent palette and the neural network aesthetic.

The nebula layer sits at `z-index: 1` — above the particle canvas (`z-0`) and below all page content (`z-10`) — so the particle connections read through it.

## Files Changed

### `app/globals.css`

- Removed the static `html.light body::before` gradient block.
- Added `.nebula-blob`, `.nebula-1` through `.nebula-4` classes with `radial-gradient` backgrounds, `blur()` filters, and individual opacities.
- Added four `@keyframes nebula-drift-*` animations with different durations and `translate` + `scale` paths so blobs never sync up.

### `components/ui/NebulaBackground.tsx`

New client component. Reads `resolvedTheme` from `ThemeProvider` and returns `null` in dark mode — zero render cost when not needed. In light mode renders a `position: fixed; overflow: hidden` container with four blob `<div>`s.

### `app/page.tsx`

Added `<NebulaBackground />` immediately after `<ParticleBackground />`.

---

## Notes & Gotchas

- `overflow: hidden` on the container is required — blobs are oversized and positioned partially off-screen intentionally so the bloom edge is never visible, only the soft gradient core shows.
- `will-change: transform` is set on each blob to keep animations on the compositor thread.
- The component hard-returns `null` in dark mode so there is no layout impact, no CSS paint, and no DOM nodes at all unless light mode is active.
- Blob opacities are deliberately asymmetric (0.5–0.7) so the wash has depth rather than uniform saturation.

## Follow-up Tasks

- [ ] Consider a subtle parallax offset on the blobs tied to scroll position for extra depth.
- [ ] Evaluate reducing `filter: blur()` radius on mobile to avoid potential GPU pressure on low-end devices.
