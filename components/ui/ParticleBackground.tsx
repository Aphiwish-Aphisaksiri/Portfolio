"use client";

import { useEffect, useState, useCallback } from "react";
import Particles from "@tsparticles/react";
import type { ISourceOptions } from "@tsparticles/engine";

const particleOptions: ISourceOptions = {
  fullScreen: false,
  background: {
    color: { value: "transparent" },
  },
  fpsLimit: 60,
  particles: {
    color: { value: "#6366f1" },
    links: {
      color: "#6366f1",
      distance: 150,
      enable: true,
      opacity: 0.15,
      width: 1,
    },
    move: {
      enable: true,
      speed: 0.8,
      direction: "none",
      random: false,
      straight: false,
      outModes: { default: "bounce" },
    },
    number: {
      density: { enable: true, width: 1200, height: 800 },
      value: 60,
    },
    opacity: {
      value: 0.3,
    },
    shape: {
      type: "circle",
    },
    size: {
      value: { min: 1, max: 3 },
    },
  },
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: "grab",
      },
    },
    modes: {
      grab: {
        distance: 140,
        links: {
          opacity: 0.4,
        },
      },
    },
  },
  detectRetina: true,
};

export default function ParticleBackground() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const { loadSlim } = await import("@tsparticles/slim");
      const { initParticlesEngine } = await import("@tsparticles/react");
      await initParticlesEngine(async (engine) => {
        await loadSlim(engine);
      });
      if (!cancelled) setReady(true);
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  const particlesLoaded = useCallback(async () => {}, []);

  if (!ready) return null;

  return (
    <div className="fixed inset-0 z-0">
      <Particles
        id="tsparticles"
        options={particleOptions}
        particlesLoaded={particlesLoaded}
      />
    </div>
  );
}
