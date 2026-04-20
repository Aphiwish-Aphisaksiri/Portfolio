# Fix Skills & Project Icon Issues — Implementation Plan

## Problem

Friends' feedback on the portfolio's Skills and Projects sections identified four issues:

1. **Too many Python icons** — `devicon-python-plain` reused for multiple skills and project stack items
2. **Ollama icon not showing** — `devicon-ollama-plain` does not exist in Devicon
3. **Dark icons invisible on dark background** — `colored` class forces brand color `#000` on `#111118` surface (Next.js, Socket.IO, Linux)
4. **Icon grid feels unbalanced** — `grid-cols-3 sm:grid-cols-4` leaves trailing gaps when item count isn't a multiple

## Decisions

| Decision | Choice |
|----------|--------|
| **Ollama icon** | Use custom SVG from `/public/ollama.svg` — already downloaded |
| **Dark icon fix** | Remove `colored` class for dark-branded icons → inherit light `text-text-primary` |
| **Docker Compose** | Keep as-is — both are genuinely Docker tools |
| **Duplicate skills icons** | Replace LDA Classifiers → scikit-learn, nomic-embed-text → Hugging Face |
| **Project stack duplicates** | Replace with custom SVGs and more representative Devicon icons (see Phase 2) |

---

## Phase 1 — Skills Section Icon Fixes

### 1.1 Replace Duplicate Icons in `SKILLS` Array

> **File:** `lib/constants.ts` — `SKILLS` array

| Skill | Current Icon | New Icon |
|-------|-------------|----------|
| LDA Classifiers | `devicon-python-plain` | `devicon-scikitlearn-plain` |
| nomic-embed-text | `devicon-python-plain` | Custom SVG huggingface-color.svg in public folder

### 1.2 Fix Ollama Icon

> **Files:** `lib/constants.ts`, `components/ui/SkillCard.tsx`

- Ollama already has `/public/ollama.svg` but it's black outline, apply colored class similar to dark icons
- Add an optional `customIcon` field to the skill type so Ollama uses `<img src="/ollama.svg">` instead of `<i>` tag
- Update `SkillCard.tsx` to conditionally render `<img>` when `customIcon` is present

### 1.3 Fix Dark Icons on Dark Background

> **Files:** `lib/constants.ts`, `components/ui/SkillCard.tsx`

Add a `darkIcon: true` flag to skills with black brand colors:

| Skill | Icon Class | Brand Color |
|-------|-----------|-------------|
| Next.js | `devicon-nextjs-plain` | `#000` |
| WebSockets | `devicon-socketio-original` | `#010101` |
| Linux | `devicon-linux-plain` | `#000` |

In `SkillCard.tsx`, conditionally drop the `colored` class for `darkIcon` items so they inherit `text-text-primary` (#f1f5f9).

### 1.4 Center-Align Icon Grid

> **File:** `components/ui/SkillCard.tsx`

Replace CSS Grid with Flexbox for centering trailing items:

```
Before: grid grid-cols-3 sm:grid-cols-4 gap-4
After:  flex flex-wrap justify-center gap-4
```

Give each skill item a fixed width (e.g., `w-20`) so they maintain consistent sizing while trailing items center naturally.

---

## Phase 2 — Project Section Icon Fixes

### 2.1 CYBATHLON 2024 BCI — Replace Python Fallbacks

> **File:** `lib/constants.ts` — `STACK_ICON_MAP`

| Stack Item | Current | New Approach |
|-----------|---------|-------------|
| TCP Sockets | `devicon-python-plain` | Custom SVG — globe/internet icon in `/public/icons/` |
| EEG / BCI | `devicon-python-plain` | Custom SVG — brain icon in `/public/icons/` |

### 2.2 BOAS Capstone — Replace Python Fallbacks

> **File:** `lib/constants.ts` — `STACK_ICON_MAP`

| Stack Item | Current | New Approach |
|-----------|---------|-------------|
| DearPyGUI | `devicon-python-plain` | Keep as `devicon-python-plain` — official logo has wordmark, not suitable as icon |
| HDF5 | `devicon-python-plain` | Keep as `devicon-python-plain` or custom SVG if one exists |
| Multithreading | `devicon-python-plain` | Custom SVG — CPU/threads icon in `/public/icons/` |

### 2.3 YOLO Fine-tuning — Fix Missing & Wrong Icons

> **File:** `lib/constants.ts` — `STACK_ICON_MAP`

| Stack Item | Current | New Approach |
|-----------|---------|-------------|
| YOLOv11 | **No mapping** (falls to broken `devicon-plain`) | Custom SVG — Ultralytics logo in `/public/icons/` |
| Roboflow | `devicon-python-plain` | Custom SVG — Roboflow logo in `/public/icons/` |

> [!IMPORTANT]
> The `STACK_ICON_MAP` has a key `"YOLOv8"` but the YOLO project's stack uses `"YOLOv11"`. This causes a broken icon. Must add a `"YOLOv11"` key.

### 2.4 Fix Dark Icons in Project Cards

> **File:** `components/ui/ProjectCard.tsx`

Same approach as Skills — dark-branded icons in project stack need the `colored` class removed:

| Stack Item | Icon Class |
|-----------|-----------|
| Next.js | `devicon-nextjs-plain` |
| Ollama | Custom SVG (already fixed) |

Apply the same `darkIcon` check logic used in `SkillCard.tsx`, or add a shared utility.

### 2.5 Update ProjectCard to Support Custom SVG Icons

> **File:** `components/ui/ProjectCard.tsx`

Currently renders all icons as `<i className={STACK_ICON_MAP[tech]} />`. Needs to handle:

- Custom SVG paths (for Ollama, TCP Sockets, EEG/BCI, Multithreading, Ultralytics, Roboflow)
- Dark icon flag (remove `colored` for black-branded icons)

Options:
- **Option A:** Change `STACK_ICON_MAP` values to objects: `{ icon: string, type: "devicon" | "svg", darkIcon?: boolean }`
- **Option B:** Create a separate `CUSTOM_ICON_MAP` for SVG paths and check both maps

Option A is cleaner — single source of truth.

---

## Phase 3 — Custom SVG Assets

Download or create SVGs for `/public/icons/`:

| Icon | Source | Filename |
|------|--------|----------|
| Globe/Internet | Lucide, Heroicons, or similar | `globe.svg` |
| Brain | Lucide, Heroicons, or similar | `brain.svg` |
| CPU/Threads | Lucide `cpu` icon or similar | `cpu.svg` |
| Ultralytics | Official Ultralytics logo | `ultralytics.svg` |
| Roboflow | Official Roboflow logo | `roboflow.svg` |

Move existing `ollama.svg` to `/public/icons/ollama.svg` for consistency.

> [!NOTE]
> For generic icons (globe, brain, cpu), Lucide React could be used instead of SVG files since Next.js already supports it. However, keeping all custom icons as SVGs in `/public/icons/` maintains consistency with the Ollama approach.

---

## Phase 4 — Verification

1. **Visual check** — all skills show unique, visible icons on dark background
2. **Project cards** — expanded view shows correct icons for every stack item, no broken `devicon-plain` fallbacks
3. **Hover animations** — icons still scale up on hover
4. **Responsive** — mobile (1-col) and desktop (2-col) layouts render correctly
5. **Network tab** — no 404s for SVG files or Devicon classes
6. **Grid alignment** — trailing items in each category card center properly

---

## Files Changed

| File | Changes |
|------|---------|
| `lib/constants.ts` | Update `SKILLS` icons (LDA → scikit-learn, nomic → HF), add `darkIcon`/`customIcon` fields, update `STACK_ICON_MAP` to support objects, fix `YOLOv11` key |
| `components/ui/SkillCard.tsx` | Handle `customIcon` (render `<img>`), handle `darkIcon` (drop `colored`), switch grid → flexbox |
| `components/ui/ProjectCard.tsx` | Handle custom SVG icons, handle dark icons, same rendering logic as SkillCard |
| `public/icons/` | Add `ollama.svg`, `globe.svg`, `brain.svg`, `cpu.svg`, `ultralytics.svg`, `roboflow.svg` |

## Out of Scope

- Adding or removing skills/projects
- Changing skill or project names (except fixing YOLOv8 → YOLOv11 key mismatch)
- Card layout redesign beyond grid centering
- Icon size changes
- Changing Devicon CDN version
