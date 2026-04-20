# Experience Section — Implementation Plan

---

## Overview

A vertical timeline with accordion-style expandable cards. The line runs continuously
down the left side, with a dot per entry aligned to the card's header row. Current roles
show a pulsing dot; past roles show an outlined dot. Cards expand downward on click,
one at a time.

---

## File Structure

```
components/
├── sections/
│   └── Experience.tsx          ← section shell, maps EXPERIENCES array
├── ui/
│   └── ExperienceCard.tsx      ← single timeline entry (dot + card)
```

---

## Component Architecture

### `Experience.tsx` (section shell)

Responsibilities:
- Imports `EXPERIENCES` from `constants.ts`
- Sorts entries: `current: true` first, then by period descending
- Renders the section heading and the timeline container
- Tracks which card is open (`openIndex` state) and passes it down
- Renders `ExperienceCard` for each entry

```tsx
const [openIndex, setOpenIndex] = useState(0); // first card open by default

const sorted = [...EXPERIENCES].sort((a, b) => {
  if (a.current && !b.current) return -1;
  if (!a.current && b.current) return 1;
  return 0; // preserve array order otherwise — keep constants.ts as source of truth for ordering
});
```

---

### `ExperienceCard.tsx` (single entry)

Props:
```tsx
interface ExperienceCardProps {
  experience: Experience;
  isOpen: boolean;
  isLast: boolean;   // used to stop the line after the final entry
  onToggle: () => void;
}
```

Responsibilities:
- Renders the dot, the connecting line segment, and the card content
- Handles open/close toggle
- Applies current vs past styling to the dot

---

## Layout Structure (per entry)

```
[line]  ←─ continuous vertical line, left side
  │
[dot]   ←─ aligned to the vertical center of the header row
  │
        ┌─────────────────────────────────────────────────────┐
        │  Role Title          Company Name       Period  [↓] │  ← header (always visible)
        │─────────────────────────────────────────────────────│
        │  • Bullet one                                       │  ← expanded content
        │  • Bullet two                                       │    (animated height)
        │  • Bullet three                                     │
        │                                                     │
        │  [tag]  [tag]  [tag]                                │  ← skill tags row
        └─────────────────────────────────────────────────────┘
```

### Key layout detail — dot alignment

The dot must align with the **vertical center of the header row**, not the top of the
card. Achieve this with:

```tsx
<div className="relative flex items-start gap-6">

  {/* Left column: line + dot */}
  <div className="flex flex-col items-center">
    <div className="mt-[1.1rem] w-3 h-3 rounded-full ... " />  {/* dot — mt nudges to header center */}
    {!isLast && <div className="flex-1 w-px bg-gradient-to-b from-accent/60 to-accent/5 mt-1" />}
  </div>

  {/* Right column: card */}
  <div className="flex-1 pb-12">
    ...
  </div>

</div>
```

Adjust `mt-[1.1rem]` based on your header's line-height until the dot visually centers
on the role title text.

---

## Dot Styling — Two States

### Current role (`current: true`)
```tsx
<div className="
  relative w-4 h-4 rounded-full
  bg-accent
  shadow-[0_0_12px_theme(--color-accent)]
  after:absolute after:inset-0 after:rounded-full
  after:bg-accent-hover after:opacity-75
  after:animate-ping
" />
```
The `after:animate-ping` ring gives the pulsing glow effect indicating an active role.

### Past role (`current: false`)
```tsx
<div className="
  w-3 h-3 rounded-full
  border-2 border-accent
  bg-transparent
" />
```
Smaller, outlined only. Visually recedes without disappearing.

---

## Timeline Line

### Gradient line (between dots)
```tsx
<div className="
  flex-1 w-px mt-1
  bg-gradient-to-b from-accent/60 to-accent/5
" />
```

- Starts at `accent/60` (semi-bright) near the current role at top
- Fades to near-transparent at the bottom
- Stop the line after the last entry using the `isLast` prop — render `null` instead

---

## Card Header (always visible)

```tsx
<button onClick={onToggle} className="w-full text-left cursor-pointer">
  <div className="flex items-start justify-between gap-4">

    <div>
      <h3 className="text-lg font-semibold text-text-primary">
        {experience.role}
      </h3>
      {experience.companyUrl ? (
        <a href={experience.companyUrl} target="_blank" rel="noopener noreferrer"
           onClick={(e) => e.stopPropagation()}
           className="text-sm text-accent hover:underline mt-0.5 inline-block">
          {experience.company}
        </a>
      ) : (
        <p className="text-sm text-accent mt-0.5">{experience.company}</p>
      )}
    </div>

    <div className="flex items-center gap-3 shrink-0">
      {experience.current && (
        <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/30">
          Present
        </span>
      )}
      <span className="text-sm text-text-muted">{experience.period}</span>
      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
        <FiChevronDown size={16} className="text-text-muted" />
      </motion.div>
    </div>

  </div>
</button>
```

Uses `FiChevronDown` from `react-icons/fi` (already used across the project) instead of
`lucide-react`. Renders `companyUrl` as a clickable link when provided.

---

## Expanded Content — Animated Height

Use `framer-motion` for smooth height animation:

```tsx
import { AnimatePresence, motion } from "framer-motion";

<AnimatePresence>
  {isOpen && (
    <motion.div
      key="content"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="overflow-hidden"
    >
      <div className="pt-4 space-y-2">

        {/* Bullet points */}
        <ul className="space-y-2">
          {experience.bullets.map((bullet, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-text-muted">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-accent shrink-0" />
              {bullet}
            </li>
          ))}
        </ul>

        {/* Skill tags — icon + label, same style as ProjectCard stack */}
        {experience.tags.length > 0 && (
          <div className="flex flex-wrap gap-4 pt-3 border-t border-border mt-4">
            {experience.tags.map((tag) => {
              const entry = STACK_ICON_MAP[tag];
              return (
                <div key={tag} className="flex flex-col items-center gap-1">
                  {entry ? (
                    entry.type === "svg" ? (
                      <Image src={entry.icon} alt="" width={24} height={24}
                        className={`... ${entry.darkIcon ? "invert" : ""}`} />
                    ) : (
                      <i className={`${entry.icon} ${entry.darkIcon ? "text-text-primary" : "colored"} text-2xl`} />
                    )
                  ) : null}
                  <span className="text-text-muted text-[10px]">{tag}</span>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </motion.div>
  )}
</AnimatePresence>
```

---

## Card Shell Styling

```tsx
<div className={`
  bg-surface border rounded-xl transition-all duration-200 p-5
  ${isOpen ? "border-accent" : "border-border hover:border-accent/50"}
`} />
```

Matches the card style used in the Projects section — uses design tokens (`bg-surface`,
`border-border`, `border-accent`) for consistent surface treatment across the portfolio.

---

## Mobile Behavior

At `< md` breakpoint:
- Dot shrinks slightly (`w-2.5 h-2.5`)
- Card goes full width
- Period text wraps below the role title instead of staying inline
- Tags row wraps naturally (already handled by `flex-wrap`)
- Gap between dot column and card narrows (`gap-3 md:gap-6`)

No extra padding wrapper needed — the existing `px-6` on the `motion.div` already
handles section padding consistently across all sections.

---

## Accordion Behavior (one open at a time)

Managed entirely in `Experience.tsx`:

```tsx
const handleToggle = (index: number) => {
  setOpenIndex(openIndex === index ? -1 : index);
};
```

Uses `-1` as the "none open" sentinel, matching the Projects section pattern.

Pass `isOpen={openIndex === index}` and `onToggle={() => handleToggle(index)}` to each
`ExperienceCard`. No state lives inside the card itself.

---

## Section Heading

Keep consistent with the rest of the portfolio — uses `<motion.div>` fade-in wrapper
with `relative z-10 py-24` on the section, matching About/Projects/Skills/Contact:

```tsx
<section id="experience" className="relative z-10 py-24">
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
    className="max-w-[1100px] mx-auto px-6"
  >
    <h2 className="text-3xl font-bold text-text-primary mb-12">Experience</h2>
    <div className="relative">
      {sorted.map((exp, i) => (
        <ExperienceCard
          key={`${exp.company}-${exp.period}`}
          experience={exp}
          isOpen={openIndex === i}
          isLast={i === sorted.length - 1}
          onToggle={() => handleToggle(i)}
        />
      ))}
    </div>
  </motion.div>
</section>
```

---

## Dependencies

No new packages needed — `framer-motion` is already installed from the Projects section.
`FiChevronDown` comes from `react-icons/fi` which is already used across the project.

---

## Integration — page.tsx

Add `<Experience />` between `<About />` and `<Projects />` in `app/page.tsx` to match
the nav order defined in `NAV_LINKS`:

```tsx
import Experience from "@/components/sections/Experience";

// inside <main>
<Hero />
<About />
<Experience />   // ← new
<Projects />
<Skills />
<Contact />
```

---

## Adding Omise Later

When you're ready, add to `EXPERIENCES` in `constants.ts`:

```typescript
{
  role: "Software Engineer (AI Project)",
  company: "Omise",
  companyUrl: "https://www.omise.co",
  period: "May 2025 – Present",
  current: true,
  bullets: [
    "...",
  ],
  tags: ["Python", "TypeScript", "..."],
}
```

The `current: true` flag automatically:
- Sorts it to the top
- Renders the pulsing dot
- Shows the "Present" badge

No changes to any component needed.
