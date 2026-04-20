"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { EXPERIENCES } from "@/lib/constants";
import ExperienceCard from "@/components/ui/ExperienceCard";

export default function Experience() {
  const [openIndex, setOpenIndex] = useState(0);

  const sorted = [...EXPERIENCES].sort((a, b) => {
    if (a.current && !b.current) return -1;
    if (!a.current && b.current) return 1;
    return 0;
  });

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="experience" className="relative z-10 py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-[1100px] mx-auto px-6"
      >
        <h2 className="text-3xl font-bold text-text-primary mb-12">
          Experience
        </h2>

        <div className="relative">
          {sorted.map((exp, i) => (
            <ExperienceCard
              key={`${exp.company}-${exp.period}`}
              experience={exp}
              isOpen={openIndex === i}
              isLast={i === sorted.length - 1}
              onToggle={() => handleToggle(i)}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
