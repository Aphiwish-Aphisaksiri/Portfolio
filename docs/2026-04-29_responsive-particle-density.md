# Responsive Particle Density

**Date:** 2026-04-29
**Status:** Done
**Scope:** `components/ui/ParticleBackground.tsx`

---

## Problem

`ParticleBackground` used fixed constants (`nodeCount: 90`, `maxDist: 180`) regardless of viewport size. On small screens (e.g. 375 × 812 mobile), this caused three compounding problems:

1. **Cramped node clustering** — 90 nodes in a fraction of the desktop area forced them to bunch near the projected center due to the perspective formula `(node.x - cx) * node.z`.
2. **Overly dense web** — a fixed `maxDist` of 180 px represents a much larger proportion of a narrow screen, drawing connections between nearly every visible node.
3. **Overwhelming glow** — the glow halo was always `radius * 5` regardless of screen width, bleeding over nearby text on mobile.

## Solution

Replaced three fixed values with viewport-derived values recalculated on every `resize()` call:

- **`nodeCount`** — derived from `(W × H) / DENSITY_AREA`, clamped to `[20, 110]`. `DENSITY_AREA = 23 040` is calibrated so a 1920 × 1080 viewport yields ~90 nodes, matching the old default.
- **`maxDist`** — `min(180, W × 0.095)`, keeping connection reach proportional to screen width. A 375 px phone gets ~35 px reach instead of 180 px.
- **Glow radius** — `min(radius * 5, W × 0.025)`, capping the halo at ~9 px on mobile vs. ~48 px on desktop.

`onResize()` was also extended to reinitialize nodes when either width **or** height changes (previously only width), covering device rotation.

## Files Changed

### `components/ui/ParticleBackground.tsx`

- Removed `nodeCount` and `maxDist` from the `CFG` constant object.
- Added `DENSITY_AREA = 23_040` module-level constant for the density calibration value.
- Added `let nodeCount = 0, maxDist = 0` to the effect's mutable state.
- Extended `resize()` to compute `nodeCount` and `maxDist` from current `W`/`H`.
- Updated `initNodes()` to loop `i < nodeCount` instead of `i < CFG.nodeCount`.
- Updated `tick()` edge loop to use local `maxDist` instead of `CFG.maxDist`.
- Updated `drawNode()` glow block to use `glowRadius = Math.min(radius * 5, W * 0.025)`.
- Updated `onResize()` to check `W !== oldW || H !== oldH` (added height check).

---

## Notes & Gotchas

- `maxDist` also controls `drawEdge`'s alpha calculation via the `dist / maxDist` ratio — because it's passed as a parameter, reducing it at small widths automatically makes edges slightly more transparent too (since fewer long-distance edges pass the threshold).
- The `[20, 110]` clamp prevents the canvas feeling empty on very narrow viewports (< ~350 px) and prevents performance regression on ultra-wide monitors.
- `DENSITY_AREA` is the single tuning knob for overall density. Increase it to make the graph sparser everywhere; decrease it to make it denser.

## Follow-up Tasks

- [ ] Consider whether `grabDist: 140` (the mouse pull radius) also needs to scale with viewport width on mobile touch screens.
