"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Project, STACK_ICON_MAP } from "@/lib/constants";
import { FiChevronDown, FiExternalLink } from "react-icons/fi";

interface ProjectCardProps {
  project: Project;
  isOpen: boolean;
  onToggle: () => void;
}

export default function ProjectCard({
  project,
  isOpen,
  onToggle,
}: ProjectCardProps) {
  // Show first 5 stack icons in collapsed mode
  const previewStack = project.stack.slice(0, 5);

  return (
    <div
      className={`bg-surface border rounded-xl transition-all duration-200 ${
        isOpen ? "border-accent" : "border-border hover:border-accent/50"
      }`}
    >
      {/* Collapsed header — always visible */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-text-primary">
              {project.title}
            </h3>
            {project.star && <span className="text-yellow-400">⭐</span>}
          </div>
          <p className="text-text-muted text-sm line-clamp-1">
            {project.collapsed}
          </p>
        </div>

        {/* Stack icons preview + chevron */}
        <div className="flex items-center gap-3 ml-4 shrink-0">
          <div className="hidden sm:flex items-center gap-2">
            {previewStack.map((tech) => (
              <i
                key={tech}
                className={`${STACK_ICON_MAP[tech] || "devicon-plain"} colored text-lg`}
                title={tech}
              />
            ))}
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <FiChevronDown size={20} className="text-text-muted" />
          </motion.div>
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 flex flex-col gap-5 border-t border-border pt-5">
              {/* Full description */}
              <p className="text-text-muted text-sm leading-relaxed">
                {project.expanded}
              </p>

              {/* Metrics */}
              {project.metrics.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {project.metrics.map((metric, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-accent/30 text-accent text-xs font-medium font-[family-name:var(--font-geist-mono)]"
                    >
                      <span>{metric.icon}</span>
                      {metric.text}
                    </span>
                  ))}
                </div>
              )}

              {/* Full tech stack with labels */}
              <div className="flex flex-wrap gap-4">
                {project.stack.map((tech) => (
                  <div
                    key={tech}
                    className="flex flex-col items-center gap-1"
                  >
                    <i
                      className={`${STACK_ICON_MAP[tech] || "devicon-plain"} colored text-2xl`}
                    />
                    <span className="text-text-muted text-[10px]">{tech}</span>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3">
                {project.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target={link.isExternal ? "_blank" : undefined}
                    rel={link.isExternal ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border text-text-primary text-sm font-medium hover:border-accent hover:text-accent transition-all duration-200"
                  >
                    {link.label}
                    {link.isExternal && <FiExternalLink size={14} />}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
