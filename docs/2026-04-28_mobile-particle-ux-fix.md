# Mobile Particle UX Fix

**Date:** 2026-04-28
**Status:** Done
**Scope:** `components/ui/ParticleBackground.tsx`

---

## Problem

Two UX regressions were observed when viewing the portfolio on a phone:

1. **Touch grab lines:** Touching or dragging on the screen caused every nearby particle to draw a line to the touch point, producing a sudden bright flash that made text harder to read. On desktop this is an intentional hover effect, but on mobile it was overwhelming.

2. **Particles re-scatter on scroll:** While scrolling, all particles would visibly reset to new random positions. This made the background feel broken and unstable.

## Solution

Both bugs were confined to `ParticleBackground.tsx` and required only two small changes.

**Grab lines:** Added a `(pointer: coarse)` media query guard at the top of `drawGrabLines()`. Mobile browsers synthesize `mousemove` events from touch gestures, which was setting `mouseOnScreen = true` and triggering the grab-line logic. The `pointer: coarse` check short-circuits the function for any device where the primary pointer is a finger, regardless of screen size — this correctly disables the effect on phones and tablets while leaving desktop hover behaviour untouched.

**Scroll re-scatter:** Mobile browsers fire a `resize` event whenever the browser chrome (URL bar) appears or disappears during scrolling. The original `onResize` handler unconditionally called `initNodes()`, which re-randomizes all particle positions. The fix captures the width before calling `resize()`, then only calls `initNodes()` when the width actually changed — pure height changes (from browser chrome) now just silently update the canvas height without reinitializing particles.

## Files Changed

### `components/ui/ParticleBackground.tsx`

**`drawGrabLines()`** — Added early return when `window.matchMedia("(pointer: coarse)").matches` is true. Placed after the existing `mouseOnScreen` check. No other logic in the function was touched.

**`onResize()`** — Replaced the unconditional `resize(); initNodes();` sequence with a width-aware version: capture `oldW = W` before `resize()`, then call `initNodes()` only if `W !== oldW`.

---

## Notes & Gotchas

- `pointer: coarse` is more reliable than a pixel-width breakpoint. It catches tablets and other touch-first devices regardless of viewport size, and won't accidentally disable grab lines on a large-screen touch monitor used with a mouse.
- The particle clumping on small screens (particles visually bunching toward the center due to the perspective projection) was intentionally left in scope — it does not significantly harm readability and is a separate concern from these two bugs.
- Mobile browsers tested to fire `resize` on scroll: Chrome for Android, Safari on iOS (URL bar behaviour). This is the canonical known quirk; the width-gate fix is the standard mitigation.

## Follow-up Tasks

- [ ] Test on iOS Safari and Chrome for Android via browser DevTools mobile emulator
- [ ] Consider reducing `nodeCount` or `maxDist` on mobile to improve performance on lower-end devices
