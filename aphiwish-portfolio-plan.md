# aphiwish.com — Portfolio Plan (Finalized)

---

## Project Overview

- **Domain:** aphiwish.com
- **Hosting:** Vercel (auto-deploy on push to main)
- **Proxy:** Cloudflare (Full Strict SSL)
- **Stack:** Next.js 15 (App Router), Tailwind CSS
- **Contact backend:** Resend (free tier)
- **Resume:** Google Drive direct download link

---

## Overall Design Direction

### Theme
Dark, minimal, AI-flavored. The background should feel like a neural network or abstract particle system — subtle enough to not distract, present enough to signal the AI/tech identity.

### Background
Animated particle network using `tsparticles` or `@tsparticles/react`. Particles should connect with lines when near each other, referencing neural network nodes. Keep opacity low (~0.4) so it doesn't compete with content.

### Color Palette
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

### Typography
- **Headings:** `Inter` or `Cal Sans` — clean, modern, widely used in dev portfolios
- **Body:** `Inter`
- **Code/monospace accents:** `JetBrains Mono` or `Fira Code` — use sparingly for labels or stat values

### Spacing & Layout
- Max content width: `1100px`, centered
- Section padding: `py-24` (generous breathing room between sections)
- Consistent `gap-8` or `gap-12` for grids

### Component Style
- Cards: `bg-[#111118]` with `border border-[#1e1e2e]` and subtle `hover:border-indigo-500` transition
- Buttons: solid accent for primary (`bg-indigo-600 hover:bg-indigo-500`), outlined for secondary
- Rounded corners: `rounded-xl` for cards, `rounded-full` for tags/badges
- Transitions: `transition-all duration-200` on all interactive elements

### Animations
- Scroll-triggered fade-in for each section using `framer-motion` or Tailwind's `animate-` with Intersection Observer
- Keep animations subtle — fade up, not dramatic slides or bounces
- Particle background loaded lazily so it doesn't block LCP

---

## Navigation

Sticky top nav, transparent that transitions to `bg-[#0a0a0f]/80 backdrop-blur` on scroll.

```
aphiwish.com          Hero  About  Projects  Skills  Contact
```

- Logo/name left, links right
- Active section highlighted with accent color (scroll spy)
- Mobile: hamburger menu collapsing to full-screen nav overlay

---

## Section 1 — Hero

**Behavior:** Full viewport height (`min-h-screen`). Vertically and horizontally centered. Nothing below the fold until the visitor scrolls.

**Layout:**
```
[small muted label]   Hi, I'm

[large bold heading]  Aphiwish Aphisaksiri

[subtitle line]       Neal  ·  Software Engineer

[location]            📍 Bangkok, Thailand

[summary paragraph]   2 lines max

[CTA buttons]         [GitHub]  [LinkedIn]  [Download CV]

[scroll indicator]    animated bouncing chevron ↓
```

**Summary text:**
> "Biomedical Engineering graduate turned Software Engineer, focused on building full-stack applications with integrated AI."

**CTA Buttons:**
- GitHub → `https://github.com/Aphiwish-Aphisaksiri` (outline button, opens new tab)
- LinkedIn → `https://www.linkedin.com/in/aphiwish-aphisaksiri/` (outline button, opens new tab)
- Download CV → direct download, no new tab

**Resume download link:**
```
https://drive.google.com/uc?export=download&id=1v1EVP6Fgl6FTv9pymORpVgEdlRxPPfyt
```
This is a permanent Google Drive link. The file ID never changes — only the contents update when a new version is uploaded via "Manage versions" in Drive.

**Notes:**
- Name `Aphiwish Aphisaksiri` is the large H1 — the domain is already the name, be consistent
- `Neal` shown as alias on the subtitle line so international/foreign visitors have an easy handle
- Scroll indicator should animate (CSS bounce) and disappear once user starts scrolling

---

## Section 2 — About
 
**Layout:** Two columns on desktop (`grid grid-cols-5`), stacked on mobile.
 
**Left column (2/5 width) — Interactive 3D Clay Model:**
 
A clay-style `.glb` 3D model rendered in a Three.js canvas. The model floats gently and reacts to mouse movement.
 
**Packages required:**
```bash
npm install @react-three/fiber @react-three/drei three
npm install @types/three
```
 
**Behavior:**
- **Floating** — uses `@react-three/drei`'s built-in `<Float>` component with gentle vertical sine motion
- **Mouse tracking** — model slowly rotates to orient toward the cursor as it moves around the page (not full OrbitControls — subtle and polished)
- **Lighting** — ambient light (soft fill) + directional light (top-right, simulates studio key light) to bring out the clay texture
- **No orbit drag** — mouse only influences rotation direction, not full user control. Keeps it feeling like a living element rather than a toy
**Loading strategy:**
- Wrap the Canvas in `next/dynamic` with `ssr: false` — Three.js is browser-only
- Wrap the model in `<Suspense>` with a fallback of a simple spinning indigo ring so there's no layout jump while the `.glb` loads
- Host the `.glb` file in the `/public` folder of the Next.js project
**Component structure:**
```
components/
└── ui/
    └── ClayModel.tsx        ← dynamic import wrapper (ssr: false)
    └── ClayModelCanvas.tsx  ← actual Canvas + Three.js scene
```
 
**ClayModelCanvas.tsx outline:**
```tsx
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Float } from '@react-three/drei'
import { useRef } from 'react'
 
function Model() {
  const { scene } = useGLTF('/model.glb')
  const ref = useRef()
  const { viewport } = useThree()
 
  useFrame(({ mouse }) => {
    if (!ref.current) return
    // Smoothly rotate toward mouse position
    ref.current.rotation.y += (mouse.x * 0.5 - ref.current.rotation.y) * 0.05
    ref.current.rotation.x += (-mouse.y * 0.2 - ref.current.rotation.x) * 0.05
  })
 
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <primitive ref={ref} object={scene} scale={2} />
    </Float>
  )
}
 
export default function ClayModelCanvas() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Suspense fallback={null}>
        <Model />
      </Suspense>
    </Canvas>
  )
}
```
 
**ClayModel.tsx (dynamic wrapper):**
```tsx
import dynamic from 'next/dynamic'
 
const ClayModel = dynamic(() => import('./ClayModelCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="w-12 h-12 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
    </div>
  )
})
 
export default ClayModel
```
 
**Right column (3/5 width) — Content:**
 
About paragraph:
> "I started in Biomedical Engineering at Mahidol University, where I built signal processing systems and competed internationally in BCI research. That problem-solving foundation shaped how I approach software — I care about systems that work under pressure, not just in demos. Now I build full-stack applications with AI at their core."
 
**Stat cards (row of 3 below the paragraph):**
 
| Icon | Label | Value |
|---|---|---|
| 🏆 | International Competition | CYBATHLON 2024 |
| 🎓 | Academic Achievement | First Class Honors |
| 🚀 | Projects Shipped | 4+ |
 
Cards styled as small bordered boxes with accent icon, muted label, and bold value. These are the visual hook — keep them compact.
 
**Mobile behavior:**
- Canvas stacks above the text on mobile
- Reduce canvas height to `300px` on mobile (`h-[300px] md:h-full`)
- Mouse tracking degrades gracefully to floating-only on touch devices (no gyroscope needed)
---

## Section 3 — Projects

**Behavior:** Accordion / expandable cards. One open at a time. Default state: first card (ProjectHub) open, rest collapsed.

**Collapsed state (always visible):**
```
[Project title]              [stack icon row — 4-5 icons max]    [chevron ↓]
[one sentence description]
```

**Expanded state (slides open smoothly):**
```
[2-3 sentence description]
[metric highlights — 1-3 key numbers in accent color]
[full tech stack icons with text labels below each]
[GitHub button]   [Live demo button if applicable]
```

**Use `devicons` or `simple-icons` for all stack icons.** Colored icons on dark background look polished. No screenshots needed — icons + metrics compensate well.

---

### Project 1 — ProjectHub ⭐ (lead project)

**Collapsed description:**
> "Full-stack project management app with an agentic AI chatbot powered by local LLMs running on consumer hardware."

**Expanded description:**
> "ProjectHub is a full-stack app featuring a RAG-powered agentic chatbot that reasons over project notes and tasks. The AI pipeline uses pgvector for semantic search, a tool-calling loop with up to 5 iterations, native thinking mode, and real-time streaming with observability metrics. Everything runs locally via Ollama on an RTX 5070."

**Metrics (display as highlight chips):**
- ⚡ 185 tok/s inference (Gemma 4)
- ⏱ 1.85s avg response time
- 🔧 5-iteration agentic tool loop

**Stack icons:**
`Next.js · FastAPI · PostgreSQL · pgvector · Docker · Ollama · TypeScript · Python`

**Links:** GitHub repo
https://github.com/Aphiwish-Aphisaksiri/ProjectHub

---

### Project 2 — CYBATHLON 2024 BCI

**Collapsed description:**
> "Competed internationally building a Brain-Computer Interface system for motor-impaired pilots at CYBATHLON 2024."

**Expanded description:**
> "Part of Mahidol University's team at CYBATHLON 2024, an international competition where pilots with motor impairments control assistive technology using brain signals. My contributions covered EEG data collection and cleaning, LDA classifier training, a cumulative voting mechanism for signal stability, and the TCP socket layer connecting the signal pipeline to the control interface."

**Metrics:**
- 🌍 International competition, ETH Zurich organized
- 🧠 EEG signal classification with LDA

**Stack icons:**
`Python · NumPy · TCP Sockets · EEG / BCI`

**Link:** Team
https://cybathlon.com/en/teams/mahidol-bcilab

---

### Project 3 — BOAS Capstone

**Collapsed description:**
> "Real-time multi-threaded neural signal acquisition application with a custom circular buffer and live visualization."

**Expanded description:**
> "A capstone neural signal acquisition app designed for real-time performance. Built with a custom circular buffer for lock-efficient data flow between threads, a DearPyGUI frontend for live signal visualization, and HDF5/MATLAB-compatible file output for downstream analysis."

**Stack icons:**
`Python · DearPyGUI · HDF5 · Multithreading · MATLAB`

**Link:** GitHub Repo
https://github.com/Aphiwish-Aphisaksiri/BrainOrganoidDataAcquisitionSystem

---

### Project 4 — YOLO Fine-tuning

**Collapsed description:**
> "Custom object detection model fine-tuned on a domain-specific dataset, achieving mAP50 of 0.792."

**Expanded description:**
> "Fine-tuned a YOLOv8 model on a custom Roboflow dataset for domain-specific object detection. Trained across multiple checkpoints, reaching a best mAP50 of 0.792. Covers the full pipeline from dataset preparation and augmentation to evaluation."

**Metrics:**
- 🎯 mAP50: 0.792 at best checkpoint

**Stack icons:**
`Python · YOLOv8 · Roboflow · PyTorch`

**Link:** GitHub Repo
https://github.com/Aphiwish-Aphisaksiri/DishSoapDetection

---

## Section 4 — Skills

**Layout:** 2×2 grid of category cards on desktop, stacked on mobile.

**Each card:** Category title, then icon grid (4–6 columns) with icon above and label below each item.

**No progress bars.** Just clean icons + labels.

---

**🤖 AI / ML**
`Python · Ollama · RAG Pipelines · pgvector · Embeddings · LDA Classifiers · Prompt Engineering · nomic-embed-text`

**🎨 Frontend**
`Next.js · React · TypeScript · Tailwind CSS · HTML · CSS`

**⚙️ Backend**
`FastAPI · PostgreSQL · Prisma ORM · REST APIs · WebSockets`

**🛠 DevOps & Tools**
`Docker · Docker Compose · GitHub Actions · Git · Linux · WSL2`

---

## Section 5 — Contact

**Layout:** Two columns on desktop, stacked on mobile.

**Left column (40%):**
```
"Let's Connect"

Open to opportunities, collaborations, or just a chat.

📧  work@aphiwish.com
🐙  github.com/Aphiwish-Aphisaksiri
💼  linkedin.com/in/aphiwish-aphisaksiri
```

**Right column (60%):**
Form fields:
- Name (text input)
- Email (email input)
- Message (textarea, ~4 rows)
- Send button (full width, accent color)

**Email service: Resend**
- Free tier: 3,000 emails/month
- Recipient: `work@aphiwish.com` (forwarded to main Gmail)
- Install: `npm install resend`
- Create a Next.js API route: `app/api/contact/route.ts`
- Add `RESEND_API_KEY` to Vercel environment variables

**Form behavior:**
- Loading state on Send button while submitting
- Success toast: "Message sent! I'll get back to you soon."
- Error toast: "Something went wrong. Please try again."
- Use `react-hook-form` + `zod` for validation

---

## Packages to Install

```bash
npm install tailwindcss framer-motion
npm install @tsparticles/react @tsparticles/slim   # background animation
npm install react-hook-form zod @hookform/resolvers  # contact form validation
npm install resend                                   # email service
npm install react-icons                             # icons (includes devicons, simple-icons)
```

---

## File Structure

```
app/
├── layout.tsx              # global font, metadata, particle bg wrapper
├── page.tsx                # assembles all sections
├── api/
│   └── contact/
│       └── route.ts        # Resend email handler
components/
├── Nav.tsx
├── sections/
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Projects.tsx
│   ├── Skills.tsx
│   └── Contact.tsx
├── ui/
│   ├── ProjectCard.tsx     # accordion card
│   ├── SkillCard.tsx       # category skill card
│   ├── StatCard.tsx        # about stat chips
│   └── ParticleBackground.tsx
lib/
└── constants.ts            # all text content, links, project data
```

Keep all text content (project descriptions, links, stat values) in `constants.ts` so updates don't require touching component files.

---

## Environment Variables (Vercel)

```
RESEND_API_KEY=your_resend_api_key
```

Add via Vercel dashboard → Project Settings → Environment Variables.

---

## Build Order

```
1.  Tailwind setup + global CSS tokens (colors, fonts)
2.  ParticleBackground component
3.  Nav component
4.  Hero section
5.  About section (decide avatar vs no photo first)
6.  Projects accordion
7.  Skills grid
8.  Contact form + Resend API route
9.  Scroll animations (framer-motion, add last)
10. Mobile responsiveness pass (test at 375px, 768px, 1280px)
11. Metadata + Open Graph tags (for link previews)
12. Final deploy check on aphiwish.com
```

---

## Open Graph / SEO (don't skip this)

Add to `layout.tsx` metadata:

```typescript
export const metadata = {
  title: "Aphiwish Aphisaksiri — Software Engineer",
  description: "Full-stack Software Engineer focused on AI-integrated applications. Based in Bangkok, Thailand.",
  openGraph: {
    title: "Aphiwish Aphisaksiri",
    description: "Software Engineer · Bangkok, Thailand",
    url: "https://aphiwish.com",
    siteName: "Aphiwish Aphisaksiri",
  },
}
```

This ensures a clean preview card when you share the link on LinkedIn or anywhere else.
