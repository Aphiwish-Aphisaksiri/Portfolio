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

**Grab lines (revised):** The initial fix used a `(pointer: coarse)` media query guard in `drawGrabLines()`. This failed on devices with both touch and a stylus (e.g. Samsung S26 Ultra with S Pen), where the browser reports the primary pointer as `fine` because of the pen — so the guard never triggered on real hardware.

The correct fix is to replace the `mousemove` listener with a `pointermove` listener and gate state mutation on `e.pointerType === "mouse"`. Touch and pen events return early before mutating `mouseOnScreen` or the mouse position, so grab lines never activate for non-mouse input regardless of what the device reports as its primary pointer type. The now-redundant `matchMedia` guard in `drawGrabLines()` was also removed.

**Scroll re-scatter:** Mobile browsers fire a `resize` event whenever the browser chrome (URL bar) appears or disappears during scrolling. The original `onResize` handler unconditionally called `initNodes()`, which re-randomizes all particle positions. The fix captures the width before calling `resize()`, then only calls `initNodes()` when the width actually changed — pure height changes (from browser chrome) now just silently update the canvas height without reinitializing particles.

## Files Changed

### `components/ui/ParticleBackground.tsx`

**`drawGrabLines()`** — Removed the `window.matchMedia("(pointer: coarse)").matches` early return (was insufficient; see Notes). The upstream handler now gates state, so this function needs no device check.

**`onPointerMove()` (formerly `onMouseMove()`)** — Replaced `mousemove` listener and `MouseEvent` handler with a `pointermove` listener and `PointerEvent` handler. Added `if (e.pointerType !== "mouse") return;` as the first line — touch and pen events exit immediately without updating any state.

**`onResize()`** — Replaced the unconditional `resize(); initNodes();` sequence with a width-aware version: capture `oldW = W` before `resize()`, then call `initNodes()` only if `W !== oldW`.

---

## Notes & Gotchas

- `pointer: coarse` media query is **not sufficient** for devices that have both touch and a stylus. Samsung S Pen devices report the primary pointer as `fine` (the pen), so `pointer: coarse` never matches — the grab-line guard was bypassed entirely on real hardware. The `pointerType` property on individual `PointerEvent` objects is the correct discriminator; it reflects the actual input that fired the event, not the device's primary pointer capability.
- S Pen stylus input (`pointerType === "pen"`) is intentionally excluded alongside touch. The portfolio has no pen-specific UX, and responding to pen hover would be unexpected behaviour.
- The particle clumping on small screens (particles visually bunching toward the center due to the perspective projection) was intentionally left in scope — it does not significantly harm readability and is a separate concern from these two bugs.
- Mobile browsers tested to fire `resize` on scroll: Chrome for Android, Safari on iOS (URL bar behaviour). This is the canonical known quirk; the width-gate fix is the standard mitigation.

## Follow-up Tasks

- [x] Test on real device (Samsung S26 Ultra) — confirmed fix works after switching to `pointerType` check
- [ ] Test on iOS Safari
- [ ] Consider reducing `nodeCount` or `maxDist` on mobile to improve performance on lower-end devices
