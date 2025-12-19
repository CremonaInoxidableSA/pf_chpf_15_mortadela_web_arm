"use client";

import { useEffect, useState } from "react";

export const useThemeToggle = () => {
  const [theme, setTheme] = useState<null | "light" | "dark">("light");
  
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);

      const html = document.querySelector("html")!
      html.classList.add(savedTheme);
    }
  }, [])

  useEffect(() => {
    const html = document.querySelector("html")!
    html.classList.remove("light", "dark");
    if (theme === "light") {
      html.classList.add("light");
      localStorage.setItem("theme", "light");
    } else if (theme === "dark") {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  }, [theme])
  
  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("light");
    }
  }

  return { theme, toggleTheme };
};