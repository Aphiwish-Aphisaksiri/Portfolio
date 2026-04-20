// ──────────────────────────────────────
// Types
// ──────────────────────────────────────

export interface Metric {
  icon: string;
  text: string;
}

export interface ProjectLink {
  label: string;
  url: string;
  isExternal: boolean;
}

export interface Project {
  title: string;
  star?: boolean;
  collapsed: string;
  expanded: string;
  metrics: Metric[];
  stack: string[];
  links: ProjectLink[];
}

export interface Skill {
  name: string;
  icon: string;
}

export interface SkillCategory {
  emoji: string;
  title: string;
  skills: Skill[];
}

export interface StatCardData {
  icon: string;
  label: string;
  value: string;
}

// ──────────────────────────────────────
// Personal Info
// ──────────────────────────────────────

export const PERSONAL = {
  name: "Aphiwish Aphisaksiri",
  alias: "Neal",
  title: "Software Engineer",
  location: "Bangkok, Thailand",
  summary:
    "Biomedical Engineering graduate turned Software Engineer, focused on building full-stack applications with integrated AI.",
  email: "work@aphiwish.com",
  github: {
    url: "https://github.com/Aphiwish-Aphisaksiri",
    display: "github.com/Aphiwish-Aphisaksiri",
  },
  linkedin: {
    url: "https://www.linkedin.com/in/aphiwish-aphisaksiri/",
    display: "linkedin.com/in/aphiwish-aphisaksiri",
  },
} as const;

export const RESUME_URL =
  "https://drive.google.com/uc?export=download&id=1v1EVP6Fgl6FTv9pymORpVgEdlRxPPfyt";

// ──────────────────────────────────────
// Navigation
// ──────────────────────────────────────

export const NAV_LINKS = [
  { label: "Hero", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
] as const;

// ──────────────────────────────────────
// About Section
// ──────────────────────────────────────

export const ABOUT_TEXT =
  "I started in Biomedical Engineering at Mahidol University, where I built signal processing systems and competed internationally in BCI research. That problem-solving foundation shaped how I approach software — I care about systems that work under pressure, not just in demos. Now I build full-stack applications with AI at their core.";

export const STAT_CARDS: StatCardData[] = [
  {
    icon: "🏆",
    label: "International Competition",
    value: "CYBATHLON 2024",
  },
  {
    icon: "🎓",
    label: "Academic Achievement",
    value: "First Class Honors",
  },
  {
    icon: "🚀",
    label: "Projects Shipped",
    value: "4+",
  },
];

// ──────────────────────────────────────
// Projects
// ──────────────────────────────────────

export const PROJECTS: Project[] = [
  {
    title: "ProjectHub",
    star: true,
    collapsed:
      "Full-stack project management app with an agentic AI chatbot powered by local LLMs running on consumer hardware.",
    expanded:
      "ProjectHub is a full-stack app featuring a RAG-powered agentic chatbot that reasons over project notes and tasks. The AI pipeline uses pgvector for semantic search, CRUD operations, a tool-calling loop with up to 5 iterations, native thinking mode, and real-time streaming with observability metrics. Everything runs locally via Ollama on an RTX 5070.",
    metrics: [
      { icon: "⚡", text: "185 tok/s inference (Gemma 4)" },
      { icon: "⏱", text: "1.85s avg response time" },
      { icon: "🔧", text: "5-iteration agentic tool loop" },
    ],
    stack: [
      "Next.js",
      "FastAPI",
      "PostgreSQL",
      "pgvector",
      "Docker",
      "Ollama",
      "TypeScript",
      "Python",
    ],
    links: [
      {
        label: "GitHub",
        url: "https://github.com/Aphiwish-Aphisaksiri/ProjectHub",
        isExternal: true,
      },
    ],
  },
  {
    title: "CYBATHLON 2024 BCI",
    collapsed:
      "Competed internationally building a Brain-Computer Interface system for motor-impaired pilots at CYBATHLON 2024.",
    expanded:
      "Part of Mahidol University's team at CYBATHLON 2024, an international competition where pilots with motor impairments control assistive technology using brain signals. My contributions covered EEG data collection and cleaning, LDA classifier training, a cumulative voting mechanism for signal stability, and the TCP socket layer connecting the signal pipeline to the control interface.",
    metrics: [
      { icon: "🌍", text: "International competition, ETH Zurich organized" },
      { icon: "🧠", text: "EEG signal classification with LDA" },
    ],
    stack: ["Python", "NumPy", "TCP Sockets", "EEG / BCI"],
    links: [
      {
        label: "Team",
        url: "https://cybathlon.com/en/teams/mahidol-bcilab",
        isExternal: true,
      },
    ],
  },
  {
    title: "BOAS Capstone",
    collapsed:
      "Real-time multi-threaded neural signal acquisition application with a custom circular buffer and live visualization.",
    expanded:
      "A capstone neural signal acquisition app designed for real-time performance. Built with a custom circular buffer for lock-efficient data flow between threads, a DearPyGUI frontend for live signal visualization, and HDF5/MATLAB-compatible file output for downstream analysis.",
    metrics: [],
    stack: ["Python", "DearPyGUI", "HDF5", "Multithreading", "MATLAB"],
    links: [
      {
        label: "GitHub",
        url: "https://github.com/Aphiwish-Aphisaksiri/BrainOrganoidDataAcquisitionSystem",
        isExternal: true,
      },
    ],
  },
  {
    title: "YOLO Fine-tuning",
    collapsed:
      "Custom object detection model fine-tuned on a domain-specific dataset, achieving mAP50 of 0.792.",
    expanded:
      "Fine-tuned a YOLOv11 model on a custom Roboflow dataset for domain-specific object detection. Trained across multiple checkpoints, reaching a best mAP50 of 0.792. Covers the full pipeline from dataset preparation and augmentation to evaluation.",
    metrics: [{ icon: "🎯", text: "mAP50: 0.792 at best checkpoint" }],
    stack: ["Python", "YOLOv11", "Roboflow", "PyTorch"],
    links: [
      {
        label: "GitHub",
        url: "https://github.com/Aphiwish-Aphisaksiri/DishSoapDetection",
        isExternal: true,
      },
    ],
  },
];

// ──────────────────────────────────────
// Skills
// ──────────────────────────────────────

export const SKILLS: SkillCategory[] = [
  {
    emoji: "🤖",
    title: "AI / ML",
    skills: [
      { name: "Python", icon: "devicon-python-plain" },
      { name: "Ollama", icon: "devicon-ollama-plain" },
      { name: "RAG Pipelines", icon: "devicon-postgresql-plain" },
      { name: "pgvector", icon: "devicon-postgresql-plain" },
      { name: "Embeddings", icon: "devicon-numpy-plain" },
      { name: "LDA Classifiers", icon: "devicon-python-plain" },
      { name: "Prompt Engineering", icon: "devicon-json-plain" },
      { name: "nomic-embed-text", icon: "devicon-python-plain" },
    ],
  },
  {
    emoji: "🎨",
    title: "Frontend",
    skills: [
      { name: "Next.js", icon: "devicon-nextjs-plain" },
      { name: "React", icon: "devicon-react-original" },
      { name: "TypeScript", icon: "devicon-typescript-plain" },
      { name: "Tailwind CSS", icon: "devicon-tailwindcss-original" },
      { name: "HTML", icon: "devicon-html5-plain" },
      { name: "CSS", icon: "devicon-css3-plain" },
    ],
  },
  {
    emoji: "⚙️",
    title: "Backend",
    skills: [
      { name: "FastAPI", icon: "devicon-fastapi-plain" },
      { name: "PostgreSQL", icon: "devicon-postgresql-plain" },
      { name: "Prisma ORM", icon: "devicon-prisma-original" },
      { name: "REST APIs", icon: "devicon-json-plain" },
      { name: "WebSockets", icon: "devicon-socketio-original" },
    ],
  },
  {
    emoji: "🛠",
    title: "DevOps & Tools",
    skills: [
      { name: "Docker", icon: "devicon-docker-plain" },
      { name: "Docker Compose", icon: "devicon-docker-plain" },
      { name: "GitHub Actions", icon: "devicon-githubactions-plain" },
      { name: "Git", icon: "devicon-git-plain" },
      { name: "Linux", icon: "devicon-linux-plain" },
      { name: "WSL2", icon: "devicon-ubuntu-plain" },
    ],
  },
];

// ──────────────────────────────────────
// Tech stack icon mapping (devicon class → display)
// Used by ProjectCard to show colored icons
// ──────────────────────────────────────

export const STACK_ICON_MAP: Record<string, string> = {
  "Next.js": "devicon-nextjs-plain",
  FastAPI: "devicon-fastapi-plain",
  PostgreSQL: "devicon-postgresql-plain",
  pgvector: "devicon-postgresql-plain",
  Docker: "devicon-docker-plain",
  Ollama: "devicon-ollama-plain",
  TypeScript: "devicon-typescript-plain",
  Python: "devicon-python-plain",
  NumPy: "devicon-numpy-plain",
  "TCP Sockets": "devicon-python-plain",
  "EEG / BCI": "devicon-python-plain",
  DearPyGUI: "devicon-python-plain",
  HDF5: "devicon-python-plain",
  Multithreading: "devicon-python-plain",
  MATLAB: "devicon-matlab-plain",
  YOLOv8: "devicon-python-plain",
  Roboflow: "devicon-python-plain",
  PyTorch: "devicon-pytorch-plain",
};
