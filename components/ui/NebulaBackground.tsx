"use client";

import { useTheme } from "@/components/ThemeProvider";

export default function NebulaBackground() {
  // const { resolvedTheme } = useTheme();
  // if (resolvedTheme !== "light") return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <div className="nebula-blob nebula-1" />
      <div className="nebula-blob nebula-2" />
      <div className="nebula-blob nebula-3" />
      <div className="nebula-blob nebula-4" />
    </div>
  );
}
