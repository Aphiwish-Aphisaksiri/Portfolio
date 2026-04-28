# Light / Dark Mode Toggle

**Date:** 2026-04-28
**Status:** Done
**Scope:** `components/ThemeProvider.tsx` (new), `app/layout.tsx`, `app/globals.css`, `components/Nav.tsx`

---

## Problem

The site was hard-coded to dark mode with static CSS custom properties in `globals.css`. There was no way for a visitor to switch to a lighter theme, and no infrastructure for theming at all.

## Goal

Add a small Moon/Sun icon toggle button to the navbar (rightmost position, desktop and mobile) that switches between dark mode (default) and light mode. The chosen theme persists across page reloads and must not cause an SSR flash on load.

## Key Decisions

| Option | Why rejected / accepted |
|---|---|
| `next-themes` library | **Accepted** — handles SSR hydration flash prevention automatically via `suppressHydrationWarning`, persists to `localStorage`, minimal API |
| Manual `useState` + `localStorage` | Rejected — susceptible to flash-of-wrong-theme on SSR; requires reinventing what `next-themes` already solves cleanly |
| `attribute="data-theme"` | Rejected — Tailwind v4 CSS variable overrides are most naturally scoped with a class selector (`html.light`) |
| System preference (`enableSystem`) | Rejected per requirement — dark is always the default regardless of OS preference |
| `next-themes` built-in `ThemeProvider` directly in `layout.tsx` | Rejected — `layout.tsx` is a Server Component; the provider must be in a `"use client"` wrapper |

---

## Implementation Plan

1. `npm install next-themes`
2. Create `components/ThemeProvider.tsx` — `"use client"` wrapper around `NextThemesProvider`
3. Update `app/layout.tsx` — import `ThemeProvider`, wrap `{children}`, add `suppressHydrationWarning` to `<html>`
4. Update `app/globals.css` — add `html.light { ... }` block overriding the CSS custom properties for light mode
5. Update `components/Nav.tsx` — import `useTheme`, import `HiMoon`/`HiSun`, add toggle button at end of desktop link row and inside mobile overlay

---

## Solution

Used `next-themes` with `attribute="class"` and `defaultTheme="dark"`. The library adds a `light` or `dark` class to `<html>`, which is then used in `globals.css` to override the CSS custom property tokens defined in `@theme inline`. Only the foundational color tokens change between themes; the accent (`#6366f1`) and semantic tokens (`success`, `error`) are identical in both modes.

The toggle button uses `HiMoon` (shown when in dark mode → click to go light) and `HiSun` (shown in light mode → click to go dark), pulled from `react-icons/hi` which was already a project dependency.

## Files Changed

### `components/ThemeProvider.tsx` *(new)*

Thin `"use client"` wrapper that renders `NextThemesProvider` with `attribute="class"`, `defaultTheme="dark"`, and `enableSystem={false}`. Needed because `layout.tsx` is a Server Component and cannot directly use the provider.

### `app/layout.tsx`

- Added `import ThemeProvider from "@/components/ThemeProvider"`
- Wrapped `{children}` in `<ThemeProvider>`
- Added `suppressHydrationWarning` to `<html>` — required to silence React's hydration mismatch warning caused by `next-themes` adding the class attribute client-side

### `app/globals.css`

Added `html.light { ... }` block with the following overrides:

| Token | Dark (default) | Light |
|---|---|---|
| `--color-bg` | `#0a0a0f` | `#f8fafc` |
| `--color-surface` | `#111118` | `#ffffff` |
| `--color-border` | `#1e1e2e` | `#e2e8f0` |
| `--color-text-primary` | `#f1f5f9` | `#0f172a` |
| `--color-text-muted` | `#94a3b8` | `#64748b` |
| `--color-accent-hover` | `#818cf8` | `#4f46e5` |
| `--color-cyan` | `#22d3ee` | `#0891b2` |

Scrollbar colors adapt automatically since they reference `--color-bg`, `--color-border`, and `--color-accent`.

### `components/Nav.tsx`

- Added `useTheme` import from `next-themes`
- Added `HiMoon`, `HiSun` to the `react-icons/hi` import
- Destructured `{ theme, setTheme }` from `useTheme()`
- Added a `<button>` at the end of the desktop `gap-8` flex row (after all `NAV_LINKS`) — 18px icon, styled as `text-text-muted hover:text-text-primary`
- Added a matching `<button>` in the mobile overlay — 28px icon to match the larger mobile typography scale

---

## Notes & Gotchas

- `suppressHydrationWarning` on `<html>` is mandatory; without it React will log a warning in dev because `next-themes` modifies the `class` attribute during hydration.
- `enableSystem={false}` is intentional — the design default is always dark, not OS-preference-aware.
- The `--color-cyan` change (`#22d3ee` → `#0891b2` in light mode) affects particle effects and any accent highlights. If the teal feels too muted in light mode, revert to `#22d3ee` or try `#06b6d4`.
- The Tailwind v4 lint warning `max-w-[1100px]` in Nav.tsx is pre-existing and unrelated to this change.

## Follow-up Tasks

- [ ] Audit individual section components (Hero, About, Projects, etc.) for any hard-coded dark colours that don't use the CSS variable tokens — these won't adapt to light mode automatically
- [ ] Review particle background visibility in light mode; may need opacity or colour adjustments in `ParticleBackground.tsx`
- [ ] Consider adding a smooth CSS `transition` on `body` (`color`, `background-color`) for a fade effect when toggling
