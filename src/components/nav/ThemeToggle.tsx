"use client";
import {useTheme} from "next-themes";
import {useEffect, useState} from "react";

export function ThemeToggle() {
  const {theme, setTheme} = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const isDark = theme === "dark" || (!theme && typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="text-xs underline"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? "Light" : "Dark"}
    </button>
  );
}


