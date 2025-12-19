"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export const useThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Wait until mounted to avoid hydration mismatch.
  // Schedule the state update in the next animation frame to avoid
  // calling setState synchronously within the effect.
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const currentTheme = mounted ? (resolvedTheme ?? theme) : null;

  const toggleTheme = () => {
    const t = resolvedTheme ?? theme;
    if (t === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return { theme: currentTheme as "light" | "dark" | null, toggleTheme };
};
