import React from "react";
import { NavigationContainer, DarkTheme as NavDarkTheme, DefaultTheme as NavLightTheme } from "@react-navigation/native";

import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";
import AuthStack from "./AuthStack";
import MainDrawer from "./MainDrawer";

const RootNavigator = () => {
  const { token, isLoading } = useAuth();
  const { theme } = useTheme();
  const c = theme.colors;

  if (isLoading) {
    return null;
  }

  const isDark = theme.dark;

  const navTheme = isDark
    ? { ...NavDarkTheme, dark: true, colors: { ...NavDarkTheme.colors, primary: c.brand, background: c.base, card: c.surface, text: c.text, border: c.line, notification: c.brand } }
    : { ...NavLightTheme, dark: false, colors: { ...NavLightTheme.colors, primary: c.brand, background: c.base, card: c.surface, text: c.text, border: c.line, notification: c.brand } };

  return (
    <NavigationContainer theme={navTheme}>
      {token ? <MainDrawer /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default RootNavigator;
