"use client";

import { createContext, useContext, useEffect, useState } from "react";

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
  // Start undefined so SSR and client hydration agree (no localStorage during render).
  // The inline script in layout.tsx already set the `light` class before React hydrates,
  // so we read the DOM class in an effect to sync React state after mount.
  const [resolvedTheme, setResolvedTheme] = useState<Theme | undefined>(undefined);

  useEffect(() => {
    const initial = document.documentElement.classList.contains("light")
      ? "light"
      : "dark";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResolvedTheme(initial);
  }, []);

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
