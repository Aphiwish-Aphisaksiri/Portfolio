"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import { Experience } from "@/lib/constants";

interface ExperienceCardProps {
  experience: Experience;
  isOpen: boolean;
  isLast: boolean;
  onToggle: () => void;
}

export default function ExperienceCard({
  experience,
  isOpen,
  isLast,
  onToggle,
}: ExperienceCardProps) {
  return (
    <div className="relative flex items-start gap-3 md:gap-6">
      {/* Left column: dot + line */}
      <div className="flex flex-col items-center self-stretch">
        {/* Dot — mt nudges to align with header center */}
        {experience.current ? (
          <div className="mt-[1.1rem] relative w-4 h-4 rounded-full bg-accent shadow-[0_0_12px_theme(--color-accent)] after:absolute after:inset-0 after:rounded-full after:bg-accent-hover after:opacity-75 after:animate-ping" />
        ) : (
          <div className="mt-[1.1rem] w-3 h-3 rounded-full border-2 border-accent bg-transparent" />
        )}
        {/* Connecting line */}
        {!isLast && (
          <div className="flex-1 w-px mt-1 bg-linear-to-b from-accent/60 to-accent/5" />
        )}
      </div>

      {/* Right column: card */}
      <div className="flex-1 pb-8">
        <div
          className={`bg-surface border rounded-xl transition-all duration-200 p-5 ${
            isOpen
              ? "border-accent"
              : "border-border hover:border-accent/50"
          }`}
        >
          {/* Header — always visible */}
          <button
            onClick={onToggle}
            className="w-full text-left cursor-pointer"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">
                  {experience.role}
                </h3>
                {experience.companyUrl ? (
                  <a
                    href={experience.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-sm text-accent hover:underline mt-0.5 inline-block"
                  >
                    {experience.company}
                  </a>
                ) : (
                  <p className="text-sm text-accent mt-0.5">
                    {experience.company}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {experience.current && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/30">
                    Present
                  </span>
                )}
                <span className="hidden sm:inline text-sm text-text-muted">
                  {experience.period}
                </span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiChevronDown size={16} className="text-text-muted" />
                </motion.div>
              </div>
            </div>

            {/* Period on mobile — below header */}
            <span className="sm:hidden text-xs text-text-muted mt-1 block">
              {experience.period}
            </span>
          </button>

          {/* Expanded content */}
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
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-text-muted"
                      >
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-accent shrink-0" />
                        {bullet}
                      </li>
                    ))}
                  </ul>

                  {/* Skill tags */}
                  {experience.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-3 border-t border-border mt-4">
                      {experience.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2.5 py-1 rounded-full bg-surface text-text-muted border border-border"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
