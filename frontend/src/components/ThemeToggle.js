import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "theme";

const readTheme = () => {
  const current = document.documentElement.getAttribute("data-theme");

  if (current === "light" || current === "dark") return current;

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (stored === "light" || stored === "dark") return stored;

  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
};

function ThemeToggle() {
  const [theme, setTheme] = useState(readTheme);
  const isLight = theme === "light";

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return (
    <button
      type="button"
      className="icon-button"
      onClick={() => setTheme(isLight ? "dark" : "light")}
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
      title={isLight ? "Switch to dark theme" : "Switch to light theme"}
    >
      {isLight ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}

export default ThemeToggle;
