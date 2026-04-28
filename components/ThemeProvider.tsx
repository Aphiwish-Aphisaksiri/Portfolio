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
  const [resolvedTheme, setResolvedTheme] = useState<Theme | undefined>(
    undefined
  );

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    const initial = stored === "light" ? "light" : "dark";
    setResolvedTheme(initial);
  }, []);

  const setTheme = (theme: Theme) => {
    setResolvedTheme(theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {}
    document.documentElement.classList.toggle("light", theme === "light");
  };

  return (
    <ThemeContext.Provider value={{ resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
