import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as SecureStore from "expo-secure-store";

import { getTheme, AppTheme, ThemeColors, AccentName } from "../theme";

const THEME_KEY = "theme";
const ACCENT_KEY = "accent";

type ColorScheme = "dark" | "light";

interface ThemeContextValue {
  theme: AppTheme;
  colorScheme: ColorScheme;
  toggleTheme: () => Promise<void>;
  setTheme: (scheme: ColorScheme) => Promise<void>;
  accent: AccentName;
  setAccent: (accent: AccentName) => Promise<void>;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined
);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("dark");
  const [accent, setAccentState] = useState<AccentName>("indigo");

  useEffect(() => {
    (async () => {
      try {
        const saved = await SecureStore.getItemAsync(THEME_KEY);

        if (saved === "light" || saved === "dark") {
          setColorScheme(saved);
        }

        const savedAccent = await SecureStore.getItemAsync(ACCENT_KEY);
        if (["emerald", "crimson", "indigo", "amber", "slate", "rose"].includes(savedAccent || "")) {
          setAccentState(savedAccent as AccentName);
        }
      } catch {
        // Keep default
      }
    })();
  }, []);

  const persistTheme = useCallback(async (scheme: ColorScheme) => {
    try {
      await SecureStore.setItemAsync(THEME_KEY, scheme);
    } catch {
      // Ignore persistence errors
    }
  }, []);

  const setTheme = useCallback(
    async (scheme: ColorScheme) => {
      setColorScheme(scheme);
      await persistTheme(scheme);
    },
    [persistTheme]
  );

  const toggleTheme = useCallback(async () => {
    const next: ColorScheme = colorScheme === "dark" ? "light" : "dark";
    await setTheme(next);
  }, [colorScheme, setTheme]);

  const setAccent = useCallback(async (nextAccent: AccentName) => {
    setAccentState(nextAccent);
    try {
      await SecureStore.setItemAsync(ACCENT_KEY, nextAccent);
    } catch {
      // Keep the in-memory theme if secure storage is unavailable.
    }
  }, []);

  const theme = useMemo(() => getTheme(colorScheme === "dark", accent), [colorScheme, accent]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, colorScheme, toggleTheme, setTheme, accent, setAccent }),
    [theme, colorScheme, toggleTheme, setTheme, accent, setAccent]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = React.useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};

export const useThemeColors = (): ThemeColors => {
  const { theme } = useTheme();

  return theme.colors;
};
