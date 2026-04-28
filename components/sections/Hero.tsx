import { PERSONAL, RESUME_URL } from "@/lib/constants";
import { FiGithub, FiLinkedin, FiDownload } from "react-icons/fi";
import ScrollIndicator from "./ScrollIndicator";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-10 text-center"
    >
      {/* Small muted label */}
      <p className="text-text-muted text-sm tracking-widest uppercase mb-3 landscape-compact:mb-1">
        Hi, I&apos;m
      </p>

      {/* Name */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl landscape-compact:text-3xl font-bold text-text-primary tracking-tight mb-3 landscape-compact:mb-1">
        {PERSONAL.name}
      </h1>

      {/* Subtitle */}
      <p className="text-lg sm:text-xl text-text-muted mb-2 landscape-compact:mb-3">
        <span className="text-accent font-medium">{PERSONAL.alias}</span>
        <span className="mx-2 text-border">·</span>
        {PERSONAL.title}
      </p>

      {/* Location — hidden in landscape-compact to save vertical space */}
      <p className="text-text-muted text-sm mb-6 landscape-compact:hidden">
        📍 {PERSONAL.location}
      </p>

      {/* Summary — hidden in landscape-compact to save vertical space */}
      <p className="text-text-muted text-base sm:text-lg max-w-xl leading-relaxed mb-8 landscape-compact:hidden">
        {PERSONAL.summary}
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-16 landscape-compact:mb-0">
        <a
          href={PERSONAL.github.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-text-primary text-sm font-medium hover:border-accent hover:text-accent transition-all duration-200"
        >
          <FiGithub size={16} />
          GitHub
        </a>
        <a
          href={PERSONAL.linkedin.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-text-primary text-sm font-medium hover:border-accent hover:text-accent transition-all duration-200"
        >
          <FiLinkedin size={16} />
          LinkedIn
        </a>
        <a
          href={RESUME_URL}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-all duration-200"
        >
          <FiDownload size={16} />
          Download Resume
        </a>
      </div>

      {/* Scroll indicator — hidden in landscape-compact (little vertical room) */}
      <div className="landscape-compact:hidden">
        <ScrollIndicator />
      </div>
    </section>
  );
}
