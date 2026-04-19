"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PROJECTS } from "@/lib/constants";
import ProjectCard from "@/components/ui/ProjectCard";

export default function Projects() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="projects" className="relative z-10 py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-[1100px] mx-auto px-6"
      >
        <h2 className="text-3xl font-bold text-text-primary mb-12">
          Projects
        </h2>

        <div className="flex flex-col gap-4">
          {PROJECTS.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              isOpen={openIndex === index}
              onToggle={() =>
                setOpenIndex(openIndex === index ? -1 : index)
              }
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
