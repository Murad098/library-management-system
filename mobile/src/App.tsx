import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  Provider as PaperProvider,
  MD3DarkTheme as PaperDarkTheme,
  MD3LightTheme as PaperLightTheme,
} from "react-native-paper";

import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import RootNavigator from "./navigation/RootNavigator";

const PaperProviderWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { theme } = useTheme();

  const paperTheme = theme.dark
    ? { ...PaperDarkTheme, colors: { ...PaperDarkTheme.colors, ...paperColors(theme.colors) } }
    : { ...PaperLightTheme, colors: { ...PaperLightTheme.colors, ...paperColors(theme.colors) } };

  return <PaperProvider theme={paperTheme}>{children}</PaperProvider>;
};

const paperColors = (c: any) => ({
  primary: c.brand,
  accent: c.brandText,
  background: c.base,
  surface: c.surface,
  text: c.text,
  disabled: c.textDim,
  border: c.line,
  outline: c.line,
  inverseSurface: c.surface,
  inverseOnSurface: c.text,
  inversePrimary: c.brand,
});

const AppContent: React.FC = () => {
  const { theme } = useTheme();

  return (
    <>
      <StatusBar style={theme.dark ? "light" : "dark"} />
      <RootNavigator />
    </>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <PaperProviderWrapper>
        <AuthProvider>
          <LanguageProvider>
            <AppContent />
          </LanguageProvider>
        </AuthProvider>
      </PaperProviderWrapper>
    </ThemeProvider>
  );
}
