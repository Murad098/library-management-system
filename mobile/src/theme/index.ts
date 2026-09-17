import { darkColors, lightColors, ThemeColors } from "./colors";

export { colors, brandDark, brandLight, darkColors, lightColors, ColorName } from "./colors";
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

export const getTheme = (dark: boolean): AppTheme =>
  dark ? darkTheme : lightTheme;
