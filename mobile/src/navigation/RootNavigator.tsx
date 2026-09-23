import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, DarkTheme as NavDarkTheme, DefaultTheme as NavLightTheme } from "@react-navigation/native";

import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";
import AuthStack from "./AuthStack";
import MainTabs from "./MainTabs";

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { token, isLoading } = useAuth();
  const { theme } = useTheme();
  const c = theme.colors;

  if (isLoading) {
    return null;
  }

  const initialRouteName = token ? "MainTabs" : "AuthStack";
  const isDark = theme.dark;

  const navTheme = isDark
    ? { ...NavDarkTheme, dark: true, colors: { ...NavDarkTheme.colors, primary: c.brand, background: c.base, card: c.surface, text: c.text, border: c.line, notification: c.brand } }
    : { ...NavLightTheme, dark: false, colors: { ...NavLightTheme.colors, primary: c.brand, background: c.base, card: c.surface, text: c.text, border: c.line, notification: c.brand } };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          headerStyle: { backgroundColor: c.surface },
          headerTintColor: c.text,
          headerTitleStyle: { color: c.text, fontWeight: "700", fontSize: 19 },
          contentStyle: { backgroundColor: c.base },
        }}
      >
        <Stack.Screen
          name="AuthStack"
          component={AuthStack}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
