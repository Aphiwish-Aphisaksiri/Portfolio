# Canvas Particle Migration Plan

**Date:** 2026-04-27

## Goal

Replace the `@tsparticles`-based `ParticleBackground.tsx` with a pure canvas animation ported from `ProjectHub-Offline/index.html`. The ProjectHub animation features depth-based perspective, mouse tilt/parallax, per-node radial glow, and edge color interpolation — effects that cannot be expressed in tsparticles config.

## Decisions

- **Colors:** Portfolio indigo (`#6366f1`, RGB 99,102,241 for nodes/hover; `#312e81`, RGB 49,46,129 for dim edges)
- **Custom cursor:** Excluded (portfolio keeps default browser cursor)
- **Scope:** Only `ParticleBackground.tsx` is touched — no changes to `ParticleWrapper.tsx`, `page.tsx`, or stacking context

## Why Pure Canvas Over @tsparticles

| | `@tsparticles` | Pure canvas |
|---|---|---|
| Bundle size | ~120KB (slim build) | ~0KB added |
| Init overhead | Async engine init + dynamic import on load | Single `useEffect` |
| Control | Config-driven, limited to exposed options | Full control over every pixel |
| Tilt/parallax/depth | Not possible without custom plugins | Native |
| Mouse glow per-node | Not possible | Native |
| Debugging | Black box | Readable code |

The tilt/depth effect is the key reason: the ProjectHub animation uses a `project()` function operating on per-node `z` depth values, giving a 3D parallax when the mouse moves. tsparticles has no concept of this.

## Files Changed

- `components/ui/ParticleBackground.tsx` — **full rewrite**
- `components/ui/ParticleWrapper.tsx` — no changes (SSR guard stays)
- `app/page.tsx` — no changes (stacking context already correct: canvas z-index 0, content z-index 10)
- `package.json` — optional: remove `@tsparticles/*` deps after migration

## Implementation

### Canvas element

```tsx
<canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} />
```

### CFG

```ts
const CFG = {
  nodeCount:  90,
  maxDist:    180,
  nodeSpeed:  0.28,
  tiltAmount: 18,
  tiltSmooth: 0.055,
  nodeR:      2.2,
};
```

### Node structure

```ts
interface Node { x: number; y: number; z: number; vx: number; vy: number; r: number; }
```

### `project(node)` — perspective tilt

```ts
px = cx + (node.x - cx) * z + tilt.x * z * 60;
py = cy + (node.y - cy) * z + tilt.y * z * 60;
scale = 0.5 + z * 0.5;
```

Near nodes (`z≈1`) sit at their actual position; far nodes (`z≈0.3`) are pulled toward center. Mouse tilt displaces nodes proportional to depth — near nodes shift more, creating parallax.

### `drawEdge()` — color interpolation

Midpoint proximity to mouse → `hover` (0–1 within 200px). Lerps stroke color from dim indigo (`#312e81`) to bright indigo (`#6366f1`). Alpha = `(1 - dist/maxDist) * 0.25 * depth + hover * 0.45`.

### `drawNode()` — radial glow

Per-node proximity within 90px → `hover` (0–1). When `hover > 0.1`, draws a `createRadialGradient` glow at `radius * 5`. Node alpha = `0.35 + z * 0.55 + hover * 0.4`.

### `tick()` loop

1. Lerp tilt toward `mouse.nx/ny * (tiltAmount/90)` (Y inverted)
2. Clear canvas
3. Move nodes, wrap at ±50px outside bounds
4. Sort nodes far→near by `z`
5. O(n²) edge pass — draw if projected distance < `maxDist`
6. Draw nodes on top
7. `requestAnimationFrame(tick)`

### Event listeners (window)

- `mousemove` → update `mouse.x/y` (raw pixels) and `mouse.nx/ny` (normalized −1..1)
- `resize` → `resize()` + `initNodes()`

### Cleanup

```ts
cancelAnimationFrame(rafId);
window.removeEventListener('mousemove', onMouseMove);
window.removeEventListener('resize', onResize);
```

## Verification Checklist

- [ ] `npm run dev` starts without errors
- [ ] Canvas fills viewport behind all content (z-index 0)
- [ ] Indigo nodes animate and connect with edges
- [ ] Mouse movement triggers tilt/parallax on the node field
- [ ] Nodes near cursor brighten with radial glow
- [ ] Page content (Nav, sections, footer) remains interactive above canvas
- [ ] Resizing reinitializes nodes to fill new viewport
- [ ] `npm run build` passes with no TypeScript/lint errors
