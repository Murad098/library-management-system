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
  base: "#0b1225",
  surface: "#191f3a",
  raised: "#242b48",
  inset: "#131b35",
  line: "#303b5b",
  lineStrong: "#465475",
  brand: "#ff9da1",
  brandText: "#ffb4b6",
  text: "#f3f5fb",
  textMuted: "#a6afc5",
  textDim: "#7b87a2",
  green: "#ff9da1",
  red: "#f87171",
  amber: "#f59e0b",
  sky: "#06b6d4",
  emerald: "#35d5c0",
  white: "#ffffff",
  black: "#070b14",
  overlay: "rgba(0, 0, 0, 0.4)",
  backdrop: "rgba(0, 0, 0, 0.6)",
};

export const lightColors: ThemeColors = {
  base: "#f3f5fa",
  surface: "#ffffff",
  raised: "#f1f5f9",
  inset: "#e2e8f0",
  line: "#cbd5e1",
  lineStrong: "#94a3b8",
  brand: "#ee7881",
  brandText: "#b94850",
  text: "#0f172a",
  textMuted: "#64748b",
  textDim: "#94a3b8",
  green: "#ee7881",
  red: "#dc2626",
  amber: "#d97706",
  sky: "#0284c7",
  emerald: "#159f92",
  white: "#ffffff",
  black: "#0f172a",
  overlay: "rgba(0, 0, 0, 0.4)",
  backdrop: "rgba(0, 0, 0, 0.6)",
};

export const colors = darkColors;

export type ColorName = keyof typeof colors;

export const brandDark = darkColors;
export const brandLight = lightColors;
