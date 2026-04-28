"use client";

import { createContext, useContext, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
  resolvedTheme: Theme | undefined;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  resolvedTheme: undefined,
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [resolvedTheme, setResolvedTheme] = useState<Theme | undefined>(() => {
    try {
      const stored = localStorage.getItem("theme") as Theme | null;
      return stored === "light" ? "light" : "dark";
    } catch {
      return "dark";
    }
  });

  const setTheme = (theme: Theme) => {
    setResolvedTheme(theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {}
    document.documentElement.classList.add("theme-transitioning");
    document.documentElement.classList.toggle("light", theme === "light");
    window.setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
    }, 800);
  };

  return (
    <ThemeContext.Provider value={{ resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
