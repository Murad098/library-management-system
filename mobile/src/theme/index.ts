import { darkColors, lightColors, ThemeColors, AccentName, getAccent } from "./colors";

export { colors, brandDark, brandLight, darkColors, lightColors, ColorName, getAccent } from "./colors";
export type { AccentName } from "./colors";
export type { ThemeColors } from "./colors";

export interface AppTheme {
  dark: boolean;
  colors: ThemeColors;
}

export const darkTheme: AppTheme = {
  dark: true,
  colors: darkColors,
};

export const lightTheme: AppTheme = {
  dark: false,
  colors: lightColors,
};

export const getTheme = (dark: boolean, accent: AccentName = "indigo"): AppTheme => {
  const base = dark ? darkTheme : lightTheme;
  const selected = getAccent(accent);

  return {
    ...base,
    colors: {
      ...base.colors,
      accent: selected.accent,
      accentSoft: selected.soft,
      brand: selected.accent,
      brandText: selected.accent,
      green: selected.accent,
    },
  };
};
