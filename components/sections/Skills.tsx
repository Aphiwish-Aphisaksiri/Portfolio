"use client";

import { motion } from "framer-motion";
import { SKILLS } from "@/lib/constants";
import SkillCard from "@/components/ui/SkillCard";

export default function Skills() {
  return (
    <section id="skills" className="relative z-10 py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-[1100px] mx-auto px-6"
      >
        <h2 className="text-3xl font-bold text-text-primary mb-12">
          Skills
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SKILLS.map((category) => (
            <SkillCard key={category.title} category={category} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
