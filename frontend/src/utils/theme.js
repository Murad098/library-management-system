const THEME_STORAGE_KEY = "theme";
export const ACCENT_STORAGE_KEY = "accent";

export const ACCENTS = {
  emerald: { label: "Emerald", value: "#20d6a0", rgb: "32, 214, 160" },
  crimson: { label: "Crimson", value: "#ff5364", rgb: "255, 83, 100" },
  indigo: { label: "Indigo", value: "#6252f4", rgb: "98, 82, 244" },
  amber: { label: "Amber", value: "#f5a623", rgb: "245, 166, 35" },
  slate: { label: "Slate", value: "#8fa1b8", rgb: "143, 161, 184" },
  rose: { label: "Rose", value: "#f04473", rgb: "240, 68, 115" },
};

/**
 * Reads the active color-scheme preference.
 * Resolves in priority order: explicit data-theme attribute →
 * stored preference → OS / browser default.
 */
export const readTheme = () => {
  const current = document.documentElement.getAttribute("data-theme");

  if (current === "light" || current === "dark") return current;

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (stored === "light" || stored === "dark") return stored;

  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
};

/**
 * Persists and applies a theme so every screen stays in sync without
 * duplicating the DOM / localStorage write logic.
 */
export const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
};

export const readAccent = () => {
  const stored = window.localStorage.getItem(ACCENT_STORAGE_KEY);
  return Object.prototype.hasOwnProperty.call(ACCENTS, stored) ? stored : "indigo";
};

export const applyAccent = (accent) => {
  const next = Object.prototype.hasOwnProperty.call(ACCENTS, accent) ? accent : "indigo";
  const value = ACCENTS[next].value;
  document.documentElement.setAttribute("data-accent", next);
  document.documentElement.style.setProperty("--brand", value);
  document.documentElement.style.setProperty("--brand-hover", value);
  document.documentElement.style.setProperty("--brand-text", value);
  document.documentElement.style.setProperty("--teal", value);
  document.documentElement.style.setProperty("--teal-rgb", ACCENTS[next].rgb);
  window.localStorage.setItem(ACCENT_STORAGE_KEY, next);
};

export default { readTheme, applyTheme };
