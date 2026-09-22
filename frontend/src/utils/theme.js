const THEME_STORAGE_KEY = "theme";

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

export default { readTheme, applyTheme };
