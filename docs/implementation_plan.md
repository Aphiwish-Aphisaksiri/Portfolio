# Aphiwish.com — Portfolio Implementation Plan

## Current State

Your workspace already has a **Next.js 16.2.4** project with **Tailwind CSS v4** and **React 19** scaffolded. The default boilerplate pages are in place. The `model.glb` (chibi clay model) is already in `public/`. Resend API key is set up and domain is verified.

---

## Resolved Questions

| Question | Answer |
|----------|--------|
| 3D Model | ✅ Ready — chibi clay full-body model. Center point is on the back (not center of mass) — will offset in Three.js |
| Fonts | ✅ Using default **Geist Sans** (headings + body) + **Geist Mono** (code/mono accents) — already configured |
| `model.glb` | ✅ Already moved to `public/` |
| Resend | ✅ API key created, DNS verified, domain ready |
| Visual testing | ✅ Will provide a detailed checklist for you to verify manually |

---

## Key Design Decisions

> [!IMPORTANT]
> **Tailwind CSS v4 `@theme`**: Custom colors, fonts, and design tokens are defined directly in `globals.css` using `@theme inline { ... }` — no `tailwind.config.js` needed.

> [!TIP]
> **3D Model center-point fix**: Since the model's origin is at the back rather than the center of mass, we'll apply a position offset (`position={[0, 0, -0.5]}` or similar) on the `<primitive>` element and potentially use `scene.traverse()` to recompute bounds. This ensures the model looks centered when floating and rotating.

- **Geist Sans + Geist Mono** — already loaded in layout, no extra font downloads
- **Framer Motion** — for scroll-triggered `whileInView` fade-ups and accordion expand/collapse
- **CSS keyframes** — for scroll indicator bounce and spinner (lighter than JS)
- **`@tsparticles/slim`** — lazy-loaded particle background, `ssr: false`
- **Devicon CDN** — colored tech stack icons without bundling bloat
- **Custom toast** — lightweight success/error notifications (no extra library)
- **`IntersectionObserver`** custom hook — scroll spy for nav active state
- **CSS `scroll-behavior: smooth`** — native smooth scrolling

---

## Proposed Changes

### Phase 1 — Foundation & Design System

---

#### [MODIFY] [globals.css](file:///d:/Homework/LifeCH1/Codes/portfolio/app/globals.css)

Replace the default Tailwind v4 theme with the portfolio's design system:

**Design tokens (via `@theme inline`):**
```
Background:        #0a0a0f   (near black, slightly blue-tinted)
Surface/Cards:     #111118
Border:            #1e1e2e
Accent:            #6366f1   (indigo)
Accent hover:      #818cf8
Text primary:      #f1f5f9
Text muted:        #94a3b8
Success/tag:       #22d3ee   (cyan, for tech badges)
```

**Additional CSS:**
- `scroll-behavior: smooth` on `html`
- `@keyframes bounce` for scroll indicator chevron
- `@keyframes spin` for loading spinners
- Body: `bg-[#0a0a0f]`, `color-[#f1f5f9]`, font-family from Geist variable
- Selection color using accent

---

#### [MODIFY] [layout.tsx](file:///d:/Homework/LifeCH1/Codes/portfolio/app/layout.tsx)

- **Keep** existing Geist Sans + Geist Mono font setup (already perfect)
- **Update metadata** for SEO:
  ```ts
  title: "Aphiwish Aphisaksiri — Software Engineer"
  description: "Full-stack Software Engineer focused on AI-integrated applications. Based in Bangkok, Thailand."
  openGraph: { title, description, url: "https://aphiwish.com", siteName }
  ```
- **Add** `<link>` for Devicon CDN in `<head>` (for colored tech stack icons)
- **Import** `<Nav />` and `<ParticleBackground />` (dynamic, ssr: false) into the layout
- Structure: particle bg (fixed behind) → nav (sticky top) → `{children}` → footer

---

### Phase 2 — Shared Components & Data

---

#### [NEW] [lib/constants.ts](file:///d:/Homework/LifeCH1/Codes/portfolio/lib/constants.ts)

All text content centralized so updates don't require touching component files.

**Contains:**
- `PERSONAL` — name, alias ("Neal"), title, location, summary text, social links
- `RESUME_URL` — `https://drive.google.com/uc?export=download&id=1v1EVP6Fgl6FTv9pymORpVgEdlRxPPfyt`
- `ABOUT_TEXT` — the "Biomedical Engineering graduate..." paragraph
- `STAT_CARDS` — array of `{ icon, label, value }`:
  - 🏆 International Competition → CYBATHLON 2024
  - 🎓 Academic Achievement → First Class Honors
  - 🚀 Projects Shipped → 4+
- `PROJECTS` — array of project objects, each with:
  - `title`, `collapsedDesc`, `expandedDesc`
  - `metrics` (array of `{ icon, text }`)
  - `stack` (array of tech names matching devicon class names)
  - `links` (array of `{ label, url, isExternal }`)
- `SKILLS` — 4 categories: AI/ML, Frontend, Backend, DevOps & Tools, each with icon arrays
- `CONTACT_INFO` — email, GitHub, LinkedIn display text + URLs
- `NAV_LINKS` — section IDs and labels for scroll spy

**TypeScript interfaces:**
```ts
interface Project { title: string; collapsed: string; expanded: string; metrics: Metric[]; stack: string[]; links: Link[] }
interface SkillCategory { emoji: string; title: string; skills: { name: string; icon: string }[] }
interface StatCard { icon: string; label: string; value: string }
```

---

#### [NEW] [components/Nav.tsx](file:///d:/Homework/LifeCH1/Codes/portfolio/components/Nav.tsx)

`'use client'` — needs scroll spy state + hamburger toggle + scroll detection.

**Behavior:**
- Sticky top nav (`position: sticky; top: 0; z-index: 50`)
- **Default**: transparent background
- **On scroll** (>50px): transitions to `bg-[#0a0a0f]/80 backdrop-blur-lg`
- **Desktop layout**: `aphiwish.com` (or just "aphiwish") left, nav links right
- **Nav links**: Hero · About · Projects · Skills · Contact
- **Active section**: highlighted with accent color (`#6366f1`), detected via `IntersectionObserver` watching each section `id`
- **Mobile** (below `md` breakpoint): hamburger icon → full-screen overlay with centered nav links, close on link click
- **Transitions**: `transition-all duration-200` on background and link colors

---

#### [NEW] [components/ui/ParticleBackground.tsx](file:///d:/Homework/LifeCH1/Codes/portfolio/components/ui/ParticleBackground.tsx)

`'use client'` — dynamically imported with `ssr: false` from layout.

**Configuration:**
- Neural network style: particles connect with lines when near each other
- Particle opacity: ~0.4 (subtle, doesn't compete with content)
- Particle color: `#6366f1` (accent indigo) or `#94a3b8` (muted)
- Line color: `#1e1e2e` (border color, subtle connections)
- Slow movement, responsive to mouse hover (gentle repel/attract)
- `position: fixed; inset: 0; z-index: 0` — behind all content
- Content sections need `position: relative; z-index: 10` to sit above

---

### Phase 3 — Hero Section

---

#### [NEW] [components/sections/Hero.tsx](file:///d:/Homework/LifeCH1/Codes/portfolio/components/sections/Hero.tsx)

Mostly a Server Component. The scroll indicator is a tiny client sub-component.

**Layout** — full viewport height (`min-h-screen`), vertically and horizontally centered:
```
[small muted label]   Hi, I'm

[large bold heading]  Aphiwish Aphisaksiri          ← H1, large, bold

[subtitle line]       Neal  ·  Software Engineer     ← alias + title

[location]            📍 Bangkok, Thailand

[summary paragraph]   "Biomedical Engineering graduate turned Software Engineer,
                       focused on building full-stack applications with integrated AI."

[CTA buttons]         [GitHub]  [LinkedIn]  [Download CV]

[scroll indicator]    animated bouncing chevron ↓
```

**CTA Buttons:**
- **GitHub** → `https://github.com/Aphiwish-Aphisaksiri` — outline style, `target="_blank"`
- **LinkedIn** → `https://www.linkedin.com/in/aphiwish-aphisaksiri/` — outline style, `target="_blank"`
- **Download CV** → Google Drive direct download link — solid accent, no new tab (triggers download)

**Scroll indicator:**
- CSS `@keyframes bounce` animation
- Disappears once user starts scrolling (small client component with scroll listener)
- Chevron-down icon

---

### Phase 4 — About Section (3D Model + Stats)

---

#### [NEW] [components/sections/About.tsx](file:///d:/Homework/LifeCH1/Codes/portfolio/components/sections/About.tsx)

**Layout**: Two columns on desktop (`grid grid-cols-5`), stacked on mobile.

**Left column (2/5 width):**
- `<ClayModel />` component (dynamic import, ssr: false)
- On mobile: stacks above text, reduced height `h-[300px]` (desktop: `h-full`)

**Right column (3/5 width):**
- Section heading: "About Me"
- About paragraph:
  > "I started in Biomedical Engineering at Mahidol University, where I built signal processing systems and competed internationally in BCI research. That problem-solving foundation shaped how I approach software — I care about systems that work under pressure, not just in demos. Now I build full-stack applications with AI at their core."
- **3 stat cards** in a row below the paragraph:

| Icon | Label | Value |
|------|-------|-------|
| 🏆 | International Competition | CYBATHLON 2024 |
| 🎓 | Academic Achievement | First Class Honors |
| 🚀 | Projects Shipped | 4+ |

**Animation**: Scroll-triggered fade-up via framer-motion `whileInView`

---

#### [NEW] [components/ui/ClayModel.tsx](file:///d:/Homework/LifeCH1/Codes/portfolio/components/ui/ClayModel.tsx)

Dynamic import wrapper:
```tsx
const ClayModel = dynamic(() => import('./ClayModelCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="w-12 h-12 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
    </div>
  )
})
```

---

#### [NEW] [components/ui/ClayModelCanvas.tsx](file:///d:/Homework/LifeCH1/Codes/portfolio/components/ui/ClayModelCanvas.tsx)

`'use client'` — Three.js is browser-only.

**Scene setup:**
- `<Canvas camera={{ position: [0, 0, 5], fov: 45 }}>`
- `<ambientLight intensity={0.6} />` — soft fill
- `<directionalLight position={[5, 5, 5]} intensity={1} />` — top-right key light

**Model behavior:**
- Load via `useGLTF('/model.glb')`
- **Center-point fix**: Since the model's origin is at the back, apply:
  - Compute bounding box via `new THREE.Box3().setFromObject(scene)`
  - Get center offset and apply `scene.position.sub(center)` or manual position offset
  - This ensures the model rotates around its visual center, not the back
- **Floating**: `<Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>`
- **Mouse tracking**: `useFrame(({ mouse }) => ...)` — smoothly lerp rotation.y/x toward mouse position
  - `rotation.y += (mouse.x * 0.5 - rotation.y) * 0.05`
  - `rotation.x += (-mouse.y * 0.2 - rotation.x) * 0.05`
- **No orbit controls** — mouse only influences rotation direction
- **Mobile**: mouse tracking degrades to floating-only on touch devices (no gyroscope)
- **`<Suspense>`** wraps the model with null fallback (spinner is in the dynamic wrapper)

---

#### [NEW] [components/ui/StatCard.tsx](file:///d:/Homework/LifeCH1/Codes/portfolio/components/ui/StatCard.tsx)

Small bordered card component:
- `bg-[#111118]` with `border border-[#1e1e2e]`
- `hover:border-indigo-500 transition-all duration-200`
- `rounded-xl`
- Layout: icon (accent color) top, muted label below, bold value at bottom
- Compact sizing

---

### Phase 5 — Projects Section (Accordion)

---

#### [NEW] [components/sections/Projects.tsx](file:///d:/Homework/LifeCH1/Codes/portfolio/components/sections/Projects.tsx)

`'use client'` — manages accordion open/close state.

**Behavior:**
- One card open at a time
- Default: first card (ProjectHub) open, rest collapsed
- Section heading: "Projects"
- Maps over `PROJECTS` array from `constants.ts`
- Uses `useState` to track which card index is open

---

#### [NEW] [components/ui/ProjectCard.tsx](file:///d:/Homework/LifeCH1/Codes/portfolio/components/ui/ProjectCard.tsx)

`'use client'` — receives `isOpen`, `onToggle` props.

**Collapsed state (always visible):**
```
[Project title]              [stack icon row — 4-5 icons max]    [chevron ↓]
[one sentence description]
```

**Expanded state (slides open with framer-motion `AnimatePresence`):**
```
[2-3 sentence description]
[metric highlights — 1-3 key numbers in accent color chips]
[full tech stack icons with text labels below each]
[GitHub button]   [Live demo button if applicable]
```

**Card styling:**
- `bg-[#111118]` with `border border-[#1e1e2e]` and `hover:border-indigo-500`
- `rounded-xl`, `transition-all duration-200`
- Stack icons: colored devicon icons on dark background
- Metric chips: accent-colored text/border, monospace font for numbers

**Project Data:**

| # | Title | Collapsed | Stack | Metrics | Links |
|---|-------|-----------|-------|---------|-------|
| 1 | **ProjectHub** ⭐ | "Full-stack project management app with an agentic AI chatbot powered by local LLMs running on consumer hardware." | Next.js · FastAPI · PostgreSQL · pgvector · Docker · Ollama · TypeScript · Python | ⚡ 185 tok/s (Gemma 4) · ⏱ 1.85s avg · 🔧 5-iteration loop | [GitHub](https://github.com/Aphiwish-Aphisaksiri/ProjectHub) |
| 2 | **CYBATHLON 2024 BCI** | "Competed internationally building a Brain-Computer Interface system for motor-impaired pilots at CYBATHLON 2024." | Python · NumPy · TCP Sockets · EEG/BCI | 🌍 International, ETH Zurich · 🧠 EEG + LDA | [Team](https://cybathlon.com/en/teams/mahidol-bcilab) |
| 3 | **BOAS Capstone** | "Real-time multi-threaded neural signal acquisition application with a custom circular buffer and live visualization." | Python · DearPyGUI · HDF5 · Multithreading · MATLAB | — | [GitHub](https://github.com/Aphiwish-Aphisaksiri/BrainOrganoidDataAcquisitionSystem) |
| 4 | **YOLO Fine-tuning** | "Custom object detection model fine-tuned on a domain-specific dataset, achieving mAP50 of 0.792." | Python · YOLOv8 · Roboflow · PyTorch | 🎯 mAP50: 0.792 | [GitHub](https://github.com/Aphiwish-Aphisaksiri/DishSoapDetection) |

---

### Phase 6 — Skills Section

---

#### [NEW] [components/sections/Skills.tsx](file:///d:/Homework/LifeCH1/Codes/portfolio/components/sections/Skills.tsx)

Server Component (no interactivity).

**Layout:** 2×2 grid on desktop (`grid-cols-2`), stacked on mobile.

**Section heading:** "Skills"

---

#### [NEW] [components/ui/SkillCard.tsx](file:///d:/Homework/LifeCH1/Codes/portfolio/components/ui/SkillCard.tsx)

**Each card:** Category title with emoji, then icon grid (4–6 columns).

**No progress bars.** Just clean devicon icons + text labels below each.

**Skill categories:**

| Category | Skills |
|----------|--------|
| 🤖 **AI / ML** | Python · Ollama · RAG Pipelines · pgvector · Embeddings · LDA Classifiers · Prompt Engineering · nomic-embed-text |
| 🎨 **Frontend** | Next.js · React · TypeScript · Tailwind CSS · HTML · CSS |
| ⚙️ **Backend** | FastAPI · PostgreSQL · Prisma ORM · REST APIs · WebSockets |
| 🛠 **DevOps & Tools** | Docker · Docker Compose · GitHub Actions · Git · Linux · WSL2 |

**Card styling:** Same as other cards — `bg-[#111118]`, `border border-[#1e1e2e]`, `rounded-xl`, `hover:border-indigo-500`

---

### Phase 7 — Contact Section + API

---

#### [NEW] [components/sections/Contact.tsx](file:///d:/Homework/LifeCH1/Codes/portfolio/components/sections/Contact.tsx)

`'use client'` — form handling with `react-hook-form` + `zod`.

**Layout:** Two columns on desktop, stacked on mobile.

**Left column (40%):**
```
"Let's Connect"

Open to opportunities, collaborations, or just a chat.

📧  work@aphiwish.com
🐙  github.com/Aphiwish-Aphisaksiri
💼  linkedin.com/in/aphiwish-aphisaksiri
```
- Links are clickable (email opens mailto:, social open new tabs)

**Right column (60%):**
- **Name** — text input, required
- **Email** — email input, required, validated with zod email pattern
- **Message** — textarea (~4 rows), required, min 10 chars
- **Send button** — full width, accent color (`bg-indigo-600 hover:bg-indigo-500`)
- Loading state: spinner + "Sending..." while submitting

**Form behavior:**
- Submits to `POST /api/contact`
- **Success toast**: "Message sent! I'll get back to you soon." (green accent)
- **Error toast**: "Something went wrong. Please try again." (red accent)
- Toast auto-dismisses after 5 seconds

---

#### [NEW] [components/ui/Toast.tsx](file:///d:/Homework/LifeCH1/Codes/portfolio/components/ui/Toast.tsx)

`'use client'` — lightweight custom toast component.

- Fixed position bottom-right
- Slide-in animation with framer-motion
- Variants: `success` (green), `error` (red)
- Auto-dismiss after 5s with progress bar

---

#### [NEW] [app/api/contact/route.ts](file:///d:/Homework/LifeCH1/Codes/portfolio/app/api/contact/route.ts)

POST handler (Route Handler):
- Parse JSON body: `{ name, email, message }`
- Validate fields server-side (defense in depth)
- Send email via `Resend` SDK:
  - **From**: `onboarding@resend.dev` (or `contact@aphiwish.com` if domain is verified for sending)
  - **To**: `work@aphiwish.com`
  - **Subject**: `Portfolio Contact: ${name}`
  - **Body**: formatted HTML with name, email, message
- Return `{ success: true }` or `{ error: "..." }` with appropriate status codes
- `RESEND_API_KEY` from `process.env` (set in Vercel env vars)

---

### Phase 8 — Page Assembly & Animations

---

#### [MODIFY] [page.tsx](file:///d:/Homework/LifeCH1/Codes/portfolio/app/page.tsx)

Replace boilerplate with assembled sections:

```tsx
<main>
  <section id="hero"><Hero /></section>
  <section id="about"><About /></section>
  <section id="projects"><Projects /></section>
  <section id="skills"><Skills /></section>
  <section id="contact"><Contact /></section>
</main>
```

- Each `<section>` gets an `id` for scroll spy navigation
- Wrap sections in a scroll-triggered animation wrapper (framer-motion):
  - `initial={{ opacity: 0, y: 30 }}`
  - `whileInView={{ opacity: 1, y: 0 }}`
  - `transition={{ duration: 0.6 }}`
  - `viewport={{ once: true }}` — animate only on first scroll-in
- Section padding: generous `py-24` between sections
- Max content width: `max-w-[1100px] mx-auto px-6`

---

### Phase 9 — Cleanup

---

#### [DELETE] Default SVGs from `public/`
- `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` — not used

---

## Packages to Install

```bash
# Animation
npm install framer-motion

# Particle background
npm install @tsparticles/react @tsparticles/slim

# 3D model
npm install @react-three/fiber @react-three/drei three
npm install -D @types/three

# Contact form
npm install react-hook-form zod @hookform/resolvers

# Email
npm install resend

# Icons
npm install react-icons
```

---

## File Structure (Final)

```
app/
├── globals.css              # Tailwind v4 theme + design tokens
├── layout.tsx               # Root layout: fonts, metadata, nav, particles
├── page.tsx                 # Assembles all sections
├── favicon.ico
├── api/
│   └── contact/
│       └── route.ts         # Resend email handler
components/
├── Nav.tsx                  # Sticky nav with scroll spy
├── sections/
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Projects.tsx
│   ├── Skills.tsx
│   └── Contact.tsx
├── ui/
│   ├── ClayModel.tsx        # Dynamic import wrapper (ssr: false)
│   ├── ClayModelCanvas.tsx  # Three.js canvas + scene
│   ├── ParticleBackground.tsx
│   ├── ProjectCard.tsx      # Accordion card
│   ├── SkillCard.tsx        # Category skill card
│   ├── StatCard.tsx         # About stat chips
│   └── Toast.tsx            # Custom toast notification
lib/
└── constants.ts             # All text content, links, project data
public/
└── model.glb                # Clay 3D chibi model (already placed)
```

---

## Build Order

| Phase | Tasks | Est. Files |
|-------|-------|------------|
| 1 | Design system (globals.css, layout.tsx, metadata) | 2 |
| 2 | Shared (constants.ts, Nav, ParticleBackground) | 3 |
| 3 | Hero section | 1 |
| 4 | About section (3D model, stat cards) | 4 |
| 5 | Projects section (accordion cards) | 2 |
| 6 | Skills section | 2 |
| 7 | Contact section + API route + toast | 3 |
| 8 | Page assembly + scroll animations | 1 |
| 9 | Cleanup (delete default SVGs) | — |

---

## Verification Plan

### Build Check
```bash
npm run build   # Must pass with no errors
npm run lint     # ESLint clean
```

### Visual Verification Checklist

You can run `npm run dev` and check each item. Test at **3 breakpoints**: Desktop (1280px), Tablet (768px), Mobile (375px).

#### Global
- [ ] Background is `#0a0a0f` (near-black with blue tint)
- [ ] Particle network renders behind all content, opacity ~0.4
- [ ] Particles connect with lines when near each other
- [ ] Content sits above particles (no z-index issues)
- [ ] Smooth scroll works when clicking nav links
- [ ] Page has no horizontal overflow at any breakpoint

#### Navigation
- [ ] Nav is transparent at top of page
- [ ] Nav transitions to blurred background (`backdrop-blur`) on scroll
- [ ] Active section is highlighted with indigo accent
- [ ] Clicking a nav link scrolls to the correct section
- [ ] Mobile: hamburger icon appears below `md` breakpoint
- [ ] Mobile: hamburger opens full-screen overlay with nav links
- [ ] Mobile: clicking a link closes the overlay and scrolls to section

#### Hero
- [ ] Takes full viewport height (`min-h-screen`)
- [ ] "Hi, I'm" label is small and muted
- [ ] "Aphiwish Aphisaksiri" is a large bold H1
- [ ] "Neal · Software Engineer" subtitle is visible
- [ ] "📍 Bangkok, Thailand" location is shown
- [ ] Summary paragraph displays correctly (2 lines max)
- [ ] GitHub button opens `github.com/Aphiwish-Aphisaksiri` in new tab
- [ ] LinkedIn button opens LinkedIn profile in new tab
- [ ] Download CV triggers a file download (no new tab)
- [ ] Scroll indicator (chevron ↓) bounces with CSS animation
- [ ] Scroll indicator disappears once you start scrolling
- [ ] Mobile: content is centered, buttons stack if needed

#### About
- [ ] Desktop: 2-column grid (2/5 model, 3/5 text)
- [ ] Mobile: model stacks above text, height ~300px
- [ ] 3D model loads with indigo spinner fallback
- [ ] Model floats gently (vertical sine motion)
- [ ] Model rotates subtly toward mouse cursor
- [ ] Model appears centered (not offset to one side despite back origin point)
- [ ] About paragraph text is readable
- [ ] 3 stat cards display in a row with icons, labels, and bold values
- [ ] Stat cards have hover border transition (indigo)
- [ ] Section fades in on scroll

#### Projects
- [ ] First project (ProjectHub) is expanded by default
- [ ] Other projects are collapsed
- [ ] Collapsed cards show: title, 4-5 stack icons, chevron
- [ ] Clicking a collapsed card expands it and collapses the previously open one
- [ ] Expanded card shows: full description, metric chips, full stack with labels, action buttons
- [ ] Metric chips show accent-colored numbers (e.g., "185 tok/s")
- [ ] GitHub/Live links open in new tabs
- [ ] Expand/collapse animation is smooth (no jump)
- [ ] Stack icons are colored (devicon)
- [ ] All 4 projects render with correct data

#### Skills
- [ ] Desktop: 2×2 grid of category cards
- [ ] Mobile: cards stack vertically
- [ ] Each card has emoji + category title
- [ ] Icons display in a grid (4-6 columns) with labels below
- [ ] No progress bars — just icons + labels
- [ ] Cards have the standard border + hover effect

#### Contact
- [ ] Desktop: 2-column layout (40% info, 60% form)
- [ ] Mobile: stacks vertically
- [ ] Left side shows "Let's Connect", subtitle, email, GitHub, LinkedIn
- [ ] Email link opens mailto
- [ ] Social links open in new tabs
- [ ] Form has Name, Email, Message fields
- [ ] Empty form submission shows validation errors
- [ ] Invalid email shows validation error
- [ ] Send button is full-width, accent indigo
- [ ] Submitting shows loading state (spinner + "Sending...")
- [ ] Successful submission shows green toast
- [ ] Toast auto-dismisses after 5 seconds
- [ ] (With Resend API key) Email arrives at `work@aphiwish.com`

#### Animations & Polish
- [ ] Each section fades in on first scroll (not on repeat)
- [ ] All interactive elements have `transition-all duration-200`
- [ ] Cards have `hover:border-indigo-500` effect
- [ ] Buttons have hover state changes
- [ ] No layout shifts on any interaction
- [ ] Page loads without blocking (particles + 3D model load lazily)
