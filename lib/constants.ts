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
  customIcon?: string;
  darkIcon?: boolean;
}

export interface StackIconEntry {
  icon: string;
  type: "devicon" | "svg";
  darkIcon?: boolean;
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

export interface Experience {
  role: string;
  company: string;
  companyUrl?: string;
  period: string;
  current: boolean; // set to true for active role — used to show "Present" badge
  bullets: string[];
  tags: string[];
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
    "Biomedical Engineering graduate specializing in AI systems — RAG pipelines, agentic LLMs, and the full-stack infrastructure to ship them",
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
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
] as const;

// ──────────────────────────────────────
// About Section
// ──────────────────────────────────────

export const ABOUT_TEXT =
  "I started in Biomedical Engineering at Mahidol University, where I built signal processing systems and competed internationally in BCI research. That problem-solving foundation shaped how I approach software — I care about systems that work under pressure, not just in demos. Now I design and ship AI systems: agentic pipelines, RAG architectures, and the full-stack layer that makes them usable.";

export const STAT_CARDS: StatCardData[] = [
  {
    icon: "🏆",
    label: "Grand Prize · 100+ Global Teams",
    value: "8th Delta International Contest",
  },
  {
    icon: "🌍",
    label: "International BCI Competition",
    value: "CYBATHLON 2024",
  },
  {
    icon: "🎓",
    label: "Engineering, Mahidol University",
    value: "First Class Honors · Ranked #1",
  },
  {
    icon: "🚀",
    label: "Projects Shipped",
    value: "4+",
  },
];

// ──────────────────────────────────────
// Experience
// ──────────────────────────────────────

// To add a new role (e.g. Omise), append an entry with current: true.
// The Experience component should sort by current first, then by period descending.

export const EXPERIENCES: Experience[] = [
  // {
  //   role: "Software Engineer (AI)",
  //   company: "Omise",
  //   companyUrl: "https://omise.co/",
  //   period: "May 2026 – Present",
  //   current: true,
  //   bullets: [
  //     "-"
  //   ],
  //   tags: [""],
  // },
  {
    role: "Software Engineer in Test Intern",
    company: "LINE MAN Wongnai",
    companyUrl: "https://lmwn.com/",
    period: "May 2024 – Jul 2024",
    current: false,
    bullets: [
      "Designed and executed comprehensive test plans for new features on the LINE MAN food delivery platform, covering boundary and edge cases including Figma UI validation, payment gateway flow (K-Bank Mock API), coupon issuance, and 15-minute session timeout.",
      "Developed automated API tests in JavaScript using Postman to validate feature requests, data flow, and response integrity, and performed manual database validation checks in MongoDB to verify data consistency.",
      "Documented all testing methodology and results in Confluence for team visibility and participated in the CI/CD delivery pipeline by logging verified issues with build versions into the deployment queue.",
    ],
    tags: ["JavaScript", "Postman", "MongoDB", "Confluence", "Jira"],
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
      "Full-stack project management app with an agentic AI assistant powered by local LLMs, deployed via Cloudflare Tunnel.",
    expanded:
      "A full-stack project management platform with full CRUD for projects, tasks, and notes — built on Next.js App Router with React Server Components, Server Actions, and NextAuth v4 authentication. A separate async FastAPI service owns the AI pipeline: RAG-powered agentic chatbot with pgvector semantic search, a tool-calling loop up to 5 iterations, native thinking mode, and real-time multiplexed streaming surfacing generation metrics. The 4-service stack runs in Docker Compose with NVIDIA GPU passthrough, CI via GitHub Actions, and is deployed to projecthub.aphiwish.com through a Cloudflare-secured tunnel.",
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
      {
        label: "Live Demo",
        url: "https://projecthub.aphiwish.com",
        isExternal: true,
      },
    ],
  },
  {
    title: "CYBATHLON 2024 BCI",
    collapsed:
      "Competed internationally building a Brain-Computer Interface system for motor-impaired pilots at CYBATHLON 2024, ETH Zurich.",
    expanded:
      "Part of Mahidol University's team at CYBATHLON 2024, an international BCI competition organized by ETH Zurich where pilots with tetraplegia control assistive technology using motor-imagery brain signals. I built the full communication layer: a DearPyGUI real-time dashboard with EEG signal plotter, probability bars, and joystick visualizer; a custom TCP binary socket to the game server with heartbeat and auto-reconnect; and MQTT over WebSocket broadcasting live HUD status to a web frontend. I also implemented the cascade state machine driving seamless mode transitions between three device types (wheelchair → robotic arm → screen cursor) based on game server events, and a cumulative voting mechanism requiring 3 matching 0.2s prediction windows before issuing a command to reduce false triggers.",
    metrics: [
      { icon: "🌍", text: "ETH Zurich organized · international competition" },
      { icon: "🧠", text: "4-class motor-imagery EEG (Left/Right/Foot/Action)" },
      { icon: "🔁", text: "Cascade state machine across 3 device types" },
    ],
    stack: ["Python", "DearPyGUI", "TCP Sockets", "MQTT", "EEG / BCI", "Scikit-Learn"],
    links: [
      {
        label: "Team Page",
        url: "https://cybathlon.com/en/teams/mahidol-bcilab",
        isExternal: true,
      },
    ],
  },
  {
    title: "BOAS — Neural Signal Acquisition",
    collapsed:
      "Real-time multi-threaded Python desktop application for neural signal acquisition with a custom O(1) circular buffer.",
    expanded:
      "A capstone neural signal acquisition app engineered for deterministic real-time performance. I designed an abstract base thread framework enforcing clean lifecycle management across all system components, then replaced a naive array-shifting FIFO with a pointer-based circular buffer achieving O(1) writes for low-latency inter-thread data flow between the DAQ producer and multiple consumers (filter, plotter, recorder). A key challenge was diagnosing data loss traced to MCU throughput limits on the BlueNRG-LP — I determined 4 channels at 8,000 Hz/24-bit as the hardware ceiling through systematic testing, and identified CPU saturation from concurrent 1.25 Mbaud serial ports as the bottleneck of a dual-MCU alternative. The DearPyGUI frontend renders 4 live signal channels with runtime-adjustable filters, and the app ships as a standalone executable via PyInstaller + PyArmor with an automated obfuscation pipeline.",
    metrics: [
      { icon: "⚡", text: "O(1) circular buffer — pointer-based, no array shifting" },
      { icon: "🔬", text: "4-channel real-time acquisition at 8,000 Hz / 24-bit" },
      { icon: "📦", text: "Standalone executable via PyInstaller + PyArmor" },
    ],
    stack: ["Python", "DearPyGUI", "HDF5", "Multithreading", "MATLAB", "NumPy"],
    links: [
      {
        label: "GitHub",
        url: "https://github.com/Aphiwish-Aphisaksiri/BrainOrganoidDataAcquisitionSystem",
        isExternal: true,
      },
    ],
  },
  {
    title: "YOLO Object Detection Fine-tuning",
    collapsed:
      "Fine-tuned YOLOv11n on a custom Roboflow dataset for real-time shelf detection, reaching mAP50 of 0.792.",
    expanded:
      "Fine-tuned YOLOv11n on a 1,256-image Roboflow dataset (25 classes, 640×640, 70/20/10 split) as a proof-of-concept for medical supply-chain inventory systems. I ran systematic hyperparameter experiments across optimizers (SGD vs Adam), batch sizes (16/32), and learning rates (0.01/0.001), selecting Adam with lr=0.001 as the optimal config. Best-checkpoint results reached mAP50 of 0.792 and mAP50-95 of 0.715 at epoch 75/100. The trained model was deployed into a real-time Python application using Ultralytics + OpenCV + webcam for live inference with bounding boxes and confidence scores.",
    metrics: [
      { icon: "🎯", text: "mAP50: 0.792 · mAP50-95: 0.715 at epoch 75" },
      { icon: "🔬", text: "25 classes · 1,256 images · systematic HPO runs" },
    ],
    stack: ["Python", "YOLOv11", "Roboflow", "PyTorch", "OpenCV"],
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
      { name: "Ollama", icon: "", customIcon: "/icons/ollama.svg", darkIcon: true },
      { name: "RAG Pipelines", icon: "devicon-postgresql-plain" },
      { name: "pgvector", icon: "devicon-postgresql-plain" },
      { name: "Scikit-Learn", icon: "devicon-scikitlearn-plain" },
      { name: "PyTorch", icon: "devicon-pytorch-plain" },
      { name: "Embeddings", icon: "devicon-numpy-plain" },
      { name: "Prompt Engineering", icon: "devicon-json-plain" },
    ],
  },
  {
    emoji: "🎨",
    title: "Frontend",
    skills: [
      { name: "Next.js", icon: "devicon-nextjs-plain", darkIcon: true },
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
      { name: "Node.js", icon: "devicon-nodejs-plain" },
      { name: "PostgreSQL", icon: "devicon-postgresql-plain" },
      { name: "Prisma ORM", icon: "devicon-prisma-original" },
      { name: "REST APIs", icon: "devicon-json-plain" },
      { name: "WebSockets", icon: "devicon-socketio-original", darkIcon: true },
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
      { name: "Linux", icon: "devicon-linux-plain", darkIcon: true },
      { name: "WSL2", icon: "devicon-ubuntu-plain" },
    ],
  },
];

// ──────────────────────────────────────
// Tech stack icon mapping (devicon class → display)
// Used by ProjectCard to show colored icons
// ──────────────────────────────────────

export const STACK_ICON_MAP: Record<string, StackIconEntry> = {
  "Next.js": { icon: "devicon-nextjs-plain", type: "devicon", darkIcon: true },
  FastAPI: { icon: "devicon-fastapi-plain", type: "devicon" },
  PostgreSQL: { icon: "devicon-postgresql-plain", type: "devicon" },
  pgvector: { icon: "devicon-postgresql-plain", type: "devicon" },
  Docker: { icon: "devicon-docker-plain", type: "devicon" },
  Ollama: { icon: "/icons/ollama.svg", type: "svg", darkIcon: true },
  TypeScript: { icon: "devicon-typescript-plain", type: "devicon" },
  Python: { icon: "devicon-python-plain", type: "devicon" },
  NumPy: { icon: "devicon-numpy-plain", type: "devicon" },
  "TCP Sockets": { icon: "/icons/globe.svg", type: "svg", darkIcon: true },
  MQTT: { icon: "/icons/globe.svg", type: "svg", darkIcon: true },
  "EEG / BCI": { icon: "/icons/brain.svg", type: "svg", darkIcon: true },
  "Scikit-Learn": { icon: "devicon-scikitlearn-plain", type: "devicon" },
  DearPyGUI: { icon: "devicon-python-plain", type: "devicon" },
  HDF5: { icon: "devicon-python-plain", type: "devicon" },
  Multithreading: { icon: "/icons/cpu.svg", type: "svg" },
  MATLAB: { icon: "devicon-matlab-plain", type: "devicon" },
  YOLOv11: { icon: "/icons/ultralytics.svg", type: "svg" },
  Roboflow: { icon: "/icons/roboflow.svg", type: "svg" },
  PyTorch: { icon: "devicon-pytorch-plain", type: "devicon" },
  OpenCV: { icon: "devicon-opencv-plain", type: "devicon" },
  "Node.js": { icon: "devicon-nodejs-plain", type: "devicon" },
  JavaScript: { icon: "devicon-javascript-plain", type: "devicon" },
  Postman: { icon: "devicon-postman-plain", type: "devicon" },
  MongoDB: { icon: "devicon-mongodb-plain", type: "devicon" },
  Confluence: { icon: "devicon-confluence-plain", type: "devicon" },
  Jira: { icon: "devicon-jira-plain", type: "devicon" },
};