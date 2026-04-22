# About Section Improvement Plan

**Date:** April 22, 2026  
**Source:** `260421-friends-comments3.md`

---

## TODO 1 — Rewrite the About Me Paragraph ✅ Option B chosen

**Chosen approach:** Full rewrite with stronger hook + punchy sentences.

**Rationale:** Leads with the Biomedical → AI career arc immediately, which explains why projects like CYBATHLON and BCI systems exist on an AI engineer's portfolio. Punchy sentences are easier to skim. Clear narrative: where you came from → what you learned → what you build now.

---

### What changes

**Current text (plain string in `lib/constants.ts`):**
> "I started in Biomedical Engineering at Mahidol University, where I built signal processing systems and competed internationally in BCI research. That problem-solving foundation shaped how I approach software — I care about systems that work under pressure, not just in demos. Now I design and ship AI systems: agentic pipelines, RAG architectures, and the full-stack layer that makes them usable."

**New text:**
> "**Biomedical Engineer turned AI Software Engineer.** I spent four years at Mahidol University building signal-processing systems and competing on the international stage with BCI research — which taught me to care about systems that work under pressure, not just in demos. Today I design and ship **agentic AI pipelines, RAG architectures, and the full-stack infrastructure** that makes them actually usable."

---

### Implementation steps

**Step 1 — Change `ABOUT_TEXT` type from `string` to `React.ReactNode` in `lib/constants.ts`**

`ABOUT_TEXT` is currently a plain `string`, which cannot hold JSX bold elements. It needs to become a JSX fragment so `<strong>` tags render correctly.

```ts
// lib/constants.ts
import { ReactNode } from "react";

export const ABOUT_TEXT: ReactNode = (
  <>
    <strong>Biomedical Engineer turned AI Software Engineer.</strong> I spent
    four years at Mahidol University building signal-processing systems and
    competing on the international stage with BCI research — which taught me to
    care about systems that work under pressure, not just in demos. Today I
    design and ship{" "}
    <strong>
      agentic AI pipelines, RAG architectures, and the full-stack infrastructure
    </strong>{" "}
    that makes them actually usable.
  </>
);
```

**Step 2 — No change needed in `About.tsx`**

The paragraph already renders `{ABOUT_TEXT}` inside a `<p>` tag. Because `ABOUT_TEXT` is now a `ReactNode`, React will render the `<strong>` children correctly without any JSX changes to `About.tsx`.

**Step 3 — Verify `<strong>` styling**

`<strong>` inside a `text-text-muted` paragraph will be bold by default but may not stand out enough on a dark background. Add a rule to `globals.css` to ensure strong text uses the primary text color:

```css
/* globals.css — add under Global Styles */
p strong {
  color: var(--color-text-primary);
  font-weight: 600;
}
```

---

### Files touched in TODO 1
| File | Change |
|------|--------|
| `lib/constants.ts` | Add `ReactNode` import; rewrite `ABOUT_TEXT` as a JSX fragment with `<strong>` tags |
| `app/globals.css` | Add `p strong` color rule so bold text uses `--color-text-primary` |

---

## TODO 2 — Redesign: Add Border and/or Background ✅ Option B chosen

**Chosen approach:** Card only around the right column — keep the 3D model floating free.

**Rationale:** The 3D clay model is the most distinctive visual element on the page; boxing it into a card would shrink it and break the "floating" feel. Wrapping only the text panel gives the section a structured, boxed look (consistent with Experience and Skills) while letting the model breathe on the left. The asymmetry is intentional and creates visual tension between the organic 3D element and the structured content panel.

---

### What changes

**Current right column `<div>` in `About.tsx`:**
```tsx
<div className="md:col-span-3 flex flex-col gap-8">
```

**New right column `<div>`:**
```tsx
<div className="md:col-span-3 bg-surface border border-border rounded-2xl p-6 flex flex-col gap-8">
```

Only four Tailwind classes are added: `bg-surface`, `border`, `border-border`, `rounded-2xl`, `p-6`.

---

### Implementation steps

**Step 1 — Update the right column wrapper in `components/sections/About.tsx`**

Locate the right column div (currently `className="md:col-span-3 flex flex-col gap-8"`) and add the surface card classes:

```tsx
// Before:
<div className="md:col-span-3 flex flex-col gap-8">

// After:
<div className="md:col-span-3 bg-surface border border-border rounded-2xl p-6 flex flex-col gap-8">
```

**Step 2 — Remove the inner gap from the paragraph**

With `p-6` now providing padding inside the card, the paragraph already has breathing room. The existing `gap-8` flex gap between the paragraph and the stat cards grid is fine — no change needed there.

**Step 3 — Mobile: remove left `md:col-span-2` fixed height on the 3D model**

On mobile the grid is single column, so the model appears above the card. The existing `h-[300px] md:h-[450px]` on the model container is correct and needs no change.

**Step 4 — Visual check: stat cards inside the right panel**

The `StatCard` components already use `bg-surface border border-border rounded-xl` themselves. Inside the new card they will appear as nested cards — a common portfolio pattern that looks intentional. No style changes needed.

**Step 5 — Hover interaction on the right column card (optional enhancement)**

To match the subtle hover on SkillCard and StatCard, add `hover:border-accent transition-all duration-200` to the right column wrapper:

```tsx
<div className="md:col-span-3 bg-surface border border-border rounded-2xl p-6 flex flex-col gap-8 hover:border-accent transition-all duration-200">
```

This is optional — leave it out if you prefer the card to feel static rather than interactive.

---

### Files touched in TODO 2
| File | Change |
|------|--------|
| `components/sections/About.tsx` | Add `bg-surface border border-border rounded-2xl p-6` (and optionally `hover:border-accent transition-all duration-200`) to the right column `<div>` |

---

## TODO 3 — Implement Links in About Me Stat Cards

### Overview
Each `StatCard` needs to become optionally clickable. Two link types are needed:
- **External** — opens a URL in a new tab (`target="_blank"`)
- **Scroll** — smooth-scrolls to a section on the page (`href="#projects"`)

### Step 1 — Update `StatCardData` type in `lib/constants.ts`

Add optional `href` and `isExternal` fields to the interface:

```ts
export interface StatCardData {
  icon: string;
  label: string;
  value: string;
  href?: string;
  isExternal?: boolean;
}
```

### Step 2 — Update `STAT_CARDS` data in `lib/constants.ts`

```ts
export const STAT_CARDS: StatCardData[] = [
  {
    icon: "🏆",
    label: "Grand Prize · 100+ Global Teams",
    value: "8th Delta International Contest",
    href: "https://www.deltaww.com/en-US/press/35668",
    isExternal: true,
  },
  {
    icon: "🌍",
    label: "International BCI Competition",
    value: "CYBATHLON 2024",
    href: "#projects",
    isExternal: false,
  },
  {
    icon: "🎓",
    label: "Engineering, Mahidol University",
    value: "First Class Honors · Ranked #1",
    href: "https://www.facebook.com/egmahidol/posts/%E0%B8%99%E0%B8%B1%E0%B8%81%E0%B8%A8%E0%B8%B6%E0%B8%81%E0%B8%A9%E0%B8%B2%E0%B8%A7%E0%B8%B4%E0%B8%A8%E0%B8%A7%E0%B8%B0%E0%B8%A1%E0%B8%AB%E0%B8%B4%E0%B8%94%E0%B8%A5-%E0%B8%84%E0%B8%A7%E0%B9%89%E0%B8%B2%E0%B9%80%E0%B8%AB%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%8D%E0%B8%A3%E0%B8%B2%E0%B8%87%E0%B8%A7%E0%B8%B1%E0%B8%A5%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%94%E0%B8%B5-%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%88%E0%B8%B3%E0%B8%9B%E0%B8%B5-2567%E0%B8%84%E0%B8%93%E0%B8%B0%E0%B8%A7%E0%B8%B4%E0%B8%A8%E0%B8%A7%E0%B8%81%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C-%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2/1396705611588293/",
    isExternal: true,
  },
  {
    icon: "🚀",
    label: "Projects Shipped",
    value: "4+",
    href: "#projects",
    isExternal: false,
  },
];
```

### Step 3 — Update `components/ui/StatCard.tsx`

Wrap the card content in a conditional `<a>` tag. If no `href`, render as a plain `<div>`. External link cards get a `LuArrowUpRight` icon (from `react-icons/lu`, already installed) positioned in the top-right corner of the card — it appears at rest as a faint muted color and brightens to accent on hover.

**Icon placement:** The card uses `relative` positioning on the wrapper and `absolute top-2 right-2` on the icon, so it sits in the corner without affecting the centered content layout.

```tsx
import { LuArrowUpRight } from "react-icons/lu";
import { StatCardData } from "@/lib/constants";

interface StatCardProps {
  data: StatCardData;
}

const cardBase =
  "relative bg-surface border border-border rounded-xl p-4 hover:border-accent transition-all duration-200 flex flex-col items-center text-center gap-1.5";

export default function StatCard({ data }: StatCardProps) {
  const content = (
    <>
      {data.isExternal && (
        <LuArrowUpRight
          className="absolute top-2 right-2 text-text-muted group-hover:text-accent transition-colors duration-200"
          size={14}
        />
      )}
      <span className="text-2xl">{data.icon}</span>
      <span className="text-text-muted text-xs uppercase tracking-wider">
        {data.label}
      </span>
      <span className="text-text-primary font-bold text-sm font-[family-name:var(--font-geist-mono)]">
        {data.value}
      </span>
    </>
  );

  if (data.href) {
    return (
      <a
        href={data.href}
        target={data.isExternal ? "_blank" : undefined}
        rel={data.isExternal ? "noopener noreferrer" : undefined}
        className={`${cardBase} group cursor-pointer hover:scale-[1.02]`}
      >
        {content}
      </a>
    );
  }

  return <div className={cardBase}>{content}</div>;
}
```

**Key details:**
- `group` class is added to the `<a>` wrapper so the icon can respond to hover via `group-hover:text-accent`
- `relative` is added to `cardBase` to enable `absolute` positioning of the icon
- The icon is only rendered when `data.isExternal === true` — internal scroll links (`#projects`) do not get the arrow since they navigate within the page
- `size={14}` keeps the icon small and unobtrusive

**Security note:** `rel="noopener noreferrer"` is applied to all external links to prevent tab-napping attacks.

### Step 4 — Verify smooth scroll behavior
The scroll-target cards (`#projects`) rely on `scroll-behavior: smooth` which is already set in `globals.css`. No additional JS is needed.

### Files touched in TODO 3
| File | Change |
|------|--------|
| `lib/constants.ts` | Add `href?` and `isExternal?` to `StatCardData` interface; add URL data to `STAT_CARDS` array |
| `components/ui/StatCard.tsx` | Conditional `<a>` vs `<div>` render; `LuArrowUpRight` icon for external links; `relative`/`group` on wrapper |

---

## Decision Summary

| TODO | Choice | Status |
|------|--------|--------|
| 1 — Paragraph rewrite | Option B — full rewrite with punchy hook | Approved — ready to implement |
| 2 — Section redesign | Option B — card on right col, model floats | Approved — ready to implement |
| 3 — Stat card links | Full implementation plan above | Ready to implement |
