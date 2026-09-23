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
  base: "#0d1120",
  surface: "#1b1d2c",
  raised: "#242a3a",
  inset: "#171b29",
  line: "#2d3347",
  lineStrong: "#404a69",
  brand: "#8a7df5",
  brandText: "#b4a9ff",
  text: "#f3f5ff",
  textMuted: "#b7bfd7",
  textDim: "#8290b5",
  green: "#2fe3c2",
  red: "#ff5a5f",
  amber: "#f6be66",
  sky: "#80d3ff",
  emerald: "#30d0b6",
  white: "#ffffff",
  black: "#090d14",
  overlay: "rgba(0, 0, 0, 0.45)",
  backdrop: "rgba(0, 0, 0, 0.65)",
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
