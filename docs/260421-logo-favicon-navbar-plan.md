# Logo — Favicon & Navbar Brand

**Date:** 2026-04-21  
**Status:** In Progress

## Goal

- Replace the browser tab icon with `logo.svg`
- Show `[logo] aphiwish` in the top-left of the navbar (currently plain text only)

---

## Context

| Item | Detail |
|---|---|
| `app/logo.svg` | Moved → `public/logo.svg` ✅ |
| `app/favicon.ico` | Deleted (was a Next.js App Router special file that overrides all `metadata.icons` config) ✅ |
| `app/layout.tsx` | `metadata.icons.icon` currently points to `"/favicon.ico"` — needs updating |
| `components/Nav.tsx` | Brand link renders plain `"aphiwish"` text — needs logo image prepended |

---

## Steps

### Phase 1 — File Setup
- [x] Move `app/logo.svg` → `public/logo.svg`
- [x] Delete `app/favicon.ico`

### Phase 2 — Favicon Config

**File:** `app/layout.tsx`

Change `metadata.icons.icon` from `"/favicon.ico"` to `"/logo.svg"`:

```ts
// Before
icons: {
  icon: "/favicon.ico",
},

// After
icons: {
  icon: "/logo.svg",
},
```

- [ ] Update `metadata.icons.icon` in `app/layout.tsx`

### Phase 3 — Navbar Brand

**File:** `components/Nav.tsx`

1. Import `Image` from `"next/image"`
2. Add `flex items-center gap-2` to the brand `<a>` className
3. Insert `<Image>` before the `"aphiwish"` text

```tsx
// Before
import { ... } from "..."

<a
  href="#hero"
  onClick={(e) => handleNavClick(e, "#hero")}
  className="text-text-primary font-semibold text-lg tracking-tight hover:text-accent transition-colors duration-200"
>
  aphiwish
</a>

// After
import Image from "next/image"

<a
  href="#hero"
  onClick={(e) => handleNavClick(e, "#hero")}
  className="flex items-center gap-2 text-text-primary font-semibold text-lg tracking-tight hover:text-accent transition-colors duration-200"
>
  <Image src="/logo.svg" alt="Aphiwish logo" width={24} height={24} />
  aphiwish
</a>
```

- [ ] Add `Image` import to `components/Nav.tsx`
- [ ] Update brand `<a>` className to include `flex items-center gap-2`
- [ ] Add `<Image>` before `"aphiwish"` text

---

## Verification

1. Run `npm run dev`
2. Browser tab should show `logo.svg` instead of blank/default
3. Navbar top-left should display the logo and "aphiwish" inline

---

## Notes

- **Logo size in navbar:** 24×24px — aligns with `text-lg` line height (~28px). Adjust if logo has a wide aspect ratio.
- **Dark theme visibility:** If `logo.svg` uses dark colors, add `className="invert"` or `"brightness-0 invert"` to the `<Image>` tag so it's visible on the dark navbar background.
- Next.js `app/favicon.ico` is a "special file" — when present it auto-generates its own `<link rel="icon">` and overrides any `metadata.icons` configuration, which is why it had to be deleted.
