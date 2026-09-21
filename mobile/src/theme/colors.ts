export interface ThemeColors {
  base: string;
  surface: string;
  raised: string;
  inset: string;
  line: string;
  lineStrong: string;
  brand: string;
  brandText: string;
  text: string;
  textMuted: string;
  textDim: string;
  green: string;
  red: string;
  amber: string;
  sky: string;
  emerald: string;
  white: string;
  black: string;
  overlay: string;
  backdrop: string;
}

export const darkColors: ThemeColors = {
  base: "#070b14",
  surface: "#0e1626",
  raised: "#131d30",
  inset: "#1b273f",
  line: "#2a3a59",
  lineStrong: "#3b4f71",
  brand: "#22c58e",
  brandText: "#4ade80",
  text: "#e2e8f0",
  textMuted: "#94a3b8",
  textDim: "#64748b",
  green: "#22c58e",
  red: "#f87171",
  amber: "#f59e0b",
  sky: "#06b6d4",
  emerald: "#22c58e",
  white: "#ffffff",
  black: "#070b14",
  overlay: "rgba(0, 0, 0, 0.4)",
  backdrop: "rgba(0, 0, 0, 0.6)",
};

export const lightColors: ThemeColors = {
  base: "#f8fafc",
  surface: "#ffffff",
  raised: "#f1f5f9",
  inset: "#e2e8f0",
  line: "#cbd5e1",
  lineStrong: "#94a3b8",
  brand: "#16a34a",
  brandText: "#064e31",
  text: "#0f172a",
  textMuted: "#64748b",
  textDim: "#94a3b8",
  green: "#16a34a",
  red: "#dc2626",
  amber: "#d97706",
  sky: "#0284c7",
  emerald: "#16a34a",
  white: "#ffffff",
  black: "#0f172a",
  overlay: "rgba(0, 0, 0, 0.4)",
  backdrop: "rgba(0, 0, 0, 0.6)",
};

export const colors = darkColors;

export type ColorName = keyof typeof colors;

export const brandDark = darkColors;
export const brandLight = lightColors;
