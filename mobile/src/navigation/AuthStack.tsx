import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useTheme } from "../context/ThemeContext";
import LoginScreen from "../screens/LoginScreen";
import ForgotPasswordRequestScreen from "../screens/ForgotPasswordRequestScreen";
import ForgotPasswordVerifyScreen from "../screens/ForgotPasswordVerifyScreen";

export type AuthStackParamList = {
  Login: { email?: string };
  ForgotPasswordRequest: { email?: string };
  ForgotPasswordVerify: { email: string };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  const { theme } = useTheme();
  const c = theme.colors;

  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: { backgroundColor: c.surface },
        headerTintColor: c.text,
        headerTitleStyle: { color: c.text },
        contentStyle: { backgroundColor: c.base },
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgotPasswordRequest"
        component={ForgotPasswordRequestScreen}
        options={{ title: "Reset password" }}
      />
      <Stack.Screen
        name="ForgotPasswordVerify"
        component={ForgotPasswordVerifyScreen}
        options={{ title: "Verify code" }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
