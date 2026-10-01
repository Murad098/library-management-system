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
  accent: string;
  accentSoft: string;
}

const accentColors = {
  emerald: { accent: "#20d6a0", soft: "rgba(32, 214, 160, 0.16)" },
  crimson: { accent: "#ff5364", soft: "rgba(255, 83, 100, 0.16)" },
  indigo: { accent: "#6252f4", soft: "rgba(98, 82, 244, 0.18)" },
  amber: { accent: "#f5a623", soft: "rgba(245, 166, 35, 0.16)" },
  slate: { accent: "#8fa1b8", soft: "rgba(143, 161, 184, 0.16)" },
  rose: { accent: "#f04473", soft: "rgba(240, 68, 115, 0.16)" },
} as const;

export type AccentName = keyof typeof accentColors;

export const getAccent = (accent: AccentName) => accentColors[accent];

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
  accent: accentColors.indigo.accent,
  accentSoft: accentColors.indigo.soft,
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
  green: "#22c55e",
  red: "#dc2626",
  amber: "#d97706",
  sky: "#0284c7",
  emerald: "#159f92",
  white: "#ffffff",
  black: "#0f172a",
  overlay: "rgba(0, 0, 0, 0.4)",
  backdrop: "rgba(0, 0, 0, 0.6)",
  accent: accentColors.indigo.accent,
  accentSoft: accentColors.indigo.soft,
};

export const colors = darkColors;

export type ColorName = keyof typeof colors;

export const brandDark = darkColors;
export const brandLight = lightColors;
