"use client";

import { motion } from "framer-motion";
import { STAT_CARDS } from "@/lib/constants";
import StatCard from "@/components/ui/StatCard";
import ClayModel from "@/components/ui/ClayModel";

export default function About() {
  return (
    <section id="about" className="relative z-10 py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-[1100px] mx-auto px-6"
      >
        <h2 className="text-3xl font-bold text-text-primary mb-12">
          About Me
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 items-center">
          {/* Left column — 3D Clay Model */}
          <div className="md:col-span-2 h-[300px] md:h-[450px]">
            <ClayModel />
          </div>

          {/* Right column — Text + Stats */}
          <div className="md:col-span-3 flex flex-col gap-8">
            <p className="text-text-muted text-base sm:text-lg leading-relaxed">
              <strong>Biomedical Engineer turned AI Software Engineer.</strong>{" "}
              I spent four years at Mahidol University building signal-processing
              systems and competing on the international stage with BCI research
              — which taught me to care about systems that work under pressure,
              not just in demos. Today I design and ship{" "}
              <strong>
                agentic AI pipelines, RAG architectures, and the full-stack
                infrastructure
              </strong>{" "}
              that makes them actually usable.
            </p>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {STAT_CARDS.map((stat) => (
                <StatCard key={stat.label} data={stat} />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
