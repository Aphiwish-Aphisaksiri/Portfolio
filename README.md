# aphiwish.com — Personal Portfolio

Personal portfolio site for **Aphiwish Aphisaksiri (Neal)** — Biomedical Engineering graduate specializing in AI systems, RAG pipelines, agentic LLMs, and the full-stack infrastructure to ship them.

Live at [aphiwish.com](https://aphiwish.com)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI Library | React 19 |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| 3D / WebGL | Three.js, React Three Fiber, @react-three/drei |
| Particle FX | @tsparticles/react, @tsparticles/slim |
| Forms | React Hook Form + Zod |
| Icons | react-icons, Devicon (CDN), custom SVGs |
| Email | Resend |
| Hosting | Vercel (auto-deploy on push to `main`) |
| Proxy / SSL | Cloudflare (Full Strict SSL) |

---

## Project Structure

```
portfolio/
├── app/
│   ├── layout.tsx          # Root layout — metadata, fonts, global providers
│   ├── page.tsx            # Single-page app shell — composes all sections
│   ├── globals.css         # Tailwind base, CSS custom properties (color tokens)
│   └── api/
│       └── contact/
│           └── route.ts    # POST /api/contact — email sending via Resend
│
├── components/
│   ├── Nav.tsx             # Sticky navbar with active-section highlighting
│   └── sections/
│   │   ├── Hero.tsx        # Full-screen intro with name, title, CTA buttons
│   │   ├── About.tsx       # Bio text + stat cards (awards, education, projects)
│   │   ├── Experience.tsx  # Timeline of work experience
│   │   ├── Projects.tsx    # Project cards with expand/collapse detail view
│   │   ├── Skills.tsx      # Skill grid grouped by category
│   │   ├── Contact.tsx     # Contact form with validation and toast feedback
│   │   └── ScrollIndicator.tsx  # Animated scroll-down arrow on the Hero
│   └── ui/
│       ├── ClayModel.tsx        # Three.js clay-style sphere mesh component
│       ├── ClayModelCanvas.tsx  # R3F Canvas wrapper for the clay model
│       ├── ExperienceCard.tsx   # Single experience entry with role, bullets, tags
│       ├── ParticleBackground.tsx  # tsparticles config (neural-network aesthetic)
│       ├── ParticleWrapper.tsx  # Client-side lazy wrapper for ParticleBackground
│       ├── ProjectCard.tsx      # Expandable project card with metrics and stack icons
│       ├── SkillCard.tsx        # Individual skill badge with icon
│       ├── StatCard.tsx         # Clickable highlight card used in the About section
│       └── Toast.tsx            # Lightweight toast notification (success / error)
│
├── lib/
│   ├── constants.ts        # All site content — personal info, projects, skills, experience
│   └── rate-limit.ts       # In-memory IP rate limiter (1 request / IP / 24 h)
│
├── public/
│   └── icons/              # Custom SVG icons (Ollama, Ultralytics, Roboflow, etc.)
│
└── docs/                   # Planning and design documents (not deployed)
```

---

## Sections

### Hero
Full-screen landing with name, title, a short summary, and two CTA buttons (View Projects / Contact). Includes a `ScrollIndicator` animated arrow. A `ClayModelCanvas` renders an interactive 3D clay-style sphere in the background using React Three Fiber.

### About
Two-column layout. Left side contains bio text rendered as JSX (supporting `<strong>` highlights). Right side shows four `StatCard` components linking to notable achievements:
- **8th Delta International Contest** — Grand Prize among 100+ global teams
- **CYBATHLON 2024** — International BCI competition at ETH Zurich
- **First Class Honors · Ranked #1** — Engineering, Mahidol University
- **4+ Projects Shipped**

### Experience
Chronological list of roles rendered as `ExperienceCard` components. Each card displays role, company (with link), period, bullet-point responsibilities, and a tag row of technologies used. Supports a `current: true` flag that renders a "Present" badge for active roles.

Current entries:
- **Software Engineer in Test Intern** — LINE MAN Wongnai (May – Jul 2024)

### Projects
Grid of `ProjectCard` components. Each card has a collapsed summary and an expanded detail view (toggled on click) that includes:
- Full project description
- Performance / impact metrics with emoji icons
- Tech stack with colored Devicon / SVG icons
- External links (GitHub, Live Demo, Team Page)

Current projects:
| Project | Summary |
|---|---|
| **ProjectHub** ⭐ | Full-stack project management app with an agentic AI assistant (RAG + pgvector + Ollama), deployed on Cloudflare Tunnel |
| **CYBATHLON 2024 BCI** | BCI competition system with real-time EEG dashboard, TCP game-server socket, MQTT HUD, and cascade state machine |
| **BOAS — Neural Signal Acquisition** | Real-time multi-threaded desktop app with O(1) circular buffer for neural signal acquisition at 8,000 Hz / 24-bit |
| **YOLO Object Detection Fine-tuning** | Fine-tuned YOLOv11n on a custom Roboflow dataset; mAP50 of 0.792 deployed in a live webcam inference app |

### Skills
Four category grids rendered from `SKILLS` in `lib/constants.ts`:
- **AI / ML** — Python, Ollama, RAG Pipelines, pgvector, Scikit-Learn, PyTorch, Embeddings, Prompt Engineering
- **Frontend** — Next.js, React, TypeScript, Tailwind CSS, HTML, CSS
- **Backend** — FastAPI, Node.js, PostgreSQL, Prisma ORM, REST APIs, WebSockets
- **DevOps & Tools** — Docker, Docker Compose, GitHub Actions, Git, Linux, WSL2

### Contact
A form with three fields — Name, Email, Message — built with React Hook Form and Zod client-side validation. On submit it calls `POST /api/contact`. A `Toast` component shows success or error feedback. The form also includes a hidden honeypot field (`website`) to silently discard bot submissions.

---

## API

### `POST /api/contact`

Sends a contact form message via Resend to `work@aphiwish.com`.

**Request body**
```json
{
  "name": "string",
  "email": "string",
  "message": "string",
  "website": "string (honeypot, must be empty)"
}
```

**Validation layers (in order)**
1. **Honeypot** — if `website` is non-empty the request is silently accepted (bot discard).
2. **Rate limiting** — 1 request per IP per 24 hours (in-memory, cleaned up hourly). Returns `429` if exceeded.
3. **Required fields** — name, email, and message must all be present. Returns `400` if missing.
4. **Email format** — basic regex check. Returns `400` on invalid format.
5. **Message length** — minimum 10 characters. Returns `400` if too short.

**Responses**

| Status | Body |
|---|---|
| `200` | `{ "success": true }` |
| `400` | `{ "error": "..." }` |
| `429` | `{ "error": "Too many requests. Please try again later." }` |
| `500` | `{ "error": "Failed to send message." }` |

---

## Getting Started

### Prerequisites
- Node.js 20+
- A [Resend](https://resend.com) account with a verified sending domain

### Install dependencies
```bash
npm install
```

### Set up environment variables
Create a `.env.local` file in the project root:
```bash
cp .env.example .env.local
```
Then fill in the values (see [Environment Variables](#environment-variables) below).

### Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `RESEND_API_KEY` | Yes | API key from your [Resend dashboard](https://resend.com/api-keys). Used by `POST /api/contact` to send emails. |

> The sending address is hardcoded as `noreply@aphiwish.com` and the recipient as `work@aphiwish.com` in `app/api/contact/route.ts`. Update those strings if deploying under a different domain.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Next.js development server with hot reload on [http://localhost:3000](http://localhost:3000) |
| `npm run build` | Compile and bundle the app for production |
| `npm start` | Start the production server (requires a prior `npm run build`) |
| `npm run lint` | Run ESLint across the codebase |

---

## Updating Site Content

All text content, links, and data are centralized in `lib/constants.ts`. You do not need to touch any component files for most content changes.

| What to change | Where |
|---|---|
| Name, title, email, social links | `PERSONAL` object |
| Resume download link | `RESUME_URL` constant |
| Navigation links | `NAV_LINKS` array |
| About section stat cards | `STAT_CARDS` array |
| Work experience entries | `EXPERIENCES` array |
| Projects | `PROJECTS` array |
| Skills grid | `SKILLS` array |
| Project stack icon mapping | `STACK_ICON_MAP` object |

---

## Deployment

The site is deployed on **Vercel** with automatic deployments triggered on every push to `main`.

**Cloudflare** sits in front of Vercel as a proxy with Full (Strict) SSL mode enabled. The SSL certificate is issued by Vercel; Cloudflare terminates TLS from the browser and re-encrypts to origin.

### Deploy to Vercel
1. Import the repository in the [Vercel dashboard](https://vercel.com/new).
2. Add the `RESEND_API_KEY` environment variable under **Settings → Environment Variables**.
3. Deploy. Vercel auto-detects Next.js and applies the correct build settings.
