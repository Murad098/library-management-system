import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { useThemeColors } from "../context/ThemeContext";
import { login } from "../services/authService";
import { getErrorMessage } from "../services/api";
import { AuthStackParamList } from "../navigation/AuthStack";

type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Login"
>;

const DEMO_OWNER_EMAIL = process.env.EXPO_PUBLIC_DEMO_OWNER_EMAIL || "";
const DEMO_OWNER_PASSWORD = process.env.EXPO_PUBLIC_DEMO_OWNER_PASSWORD || "";
const DEMO_MANAGER_EMAIL = process.env.EXPO_PUBLIC_DEMO_MANAGER_EMAIL || "";
const DEMO_MANAGER_PASSWORD = process.env.EXPO_PUBLIC_DEMO_MANAGER_PASSWORD || "";

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { signIn } = useAuth();
  const { Toast, show } = useToast();
  const colors = useThemeColors();

  const [email, setEmail] = useState(DEMO_OWNER_EMAIL);
  const [password, setPassword] = useState(DEMO_OWNER_PASSWORD);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const TEAL = colors.green;

  const performLogin = async (emailToLogin: string, passwordToLogin: string) => {
    if (isLoading) return;

    if (!emailToLogin.trim() || !passwordToLogin) {
      show("Please enter your email and password.", "error");
      return;
    }

    setIsLoading(true);

    try {
      const response = await login(emailToLogin, passwordToLogin);
      const token = response.data.token as string;

      await signIn(token, rememberMe);
      show("Welcome back! Login successful.", "success");
    } catch (error) {
      show(
        getErrorMessage(error, "Unable to sign in. Please try again."),
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => performLogin(email, password);

  const handleForgotPassword = () => {
    navigation.navigate({ name: "ForgotPasswordRequest", params: {} });
  };

  const handleDemoLogin = async (role: "owner" | "manager") => {
    const demoEmail = role === "owner" ? DEMO_OWNER_EMAIL : DEMO_MANAGER_EMAIL;
    const demoPassword =
      role === "owner" ? DEMO_OWNER_PASSWORD : DEMO_MANAGER_PASSWORD;

    if (!demoEmail || !demoPassword) {
      show("Demo credentials are not configured.", "error");
      return;
    }

    setEmail(demoEmail);
    setPassword(demoPassword);
    await performLogin(demoEmail, demoPassword);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.base }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* Language Toggle */}
          <View style={styles.langToggle}>
            <TouchableOpacity
              style={[styles.langPill, { backgroundColor: TEAL }]}
              activeOpacity={0.7}
            >
              <Text style={[styles.langText, { color: colors.black }]}>
                EN
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.langPill,
                {
                  backgroundColor: "transparent",
                  borderColor: colors.lineStrong,
                  borderWidth: 1,
                },
              ]}
              activeOpacity={0.7}
            >
              <Text style={[styles.langText, { color: colors.textMuted }]}>
                اردو
              </Text>
            </TouchableOpacity>
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: TEAL }]}>Welcome Back</Text>
          <Text style={[styles.subtitle, { color: colors.text }]}>
            Sign in to your Library Management System
          </Text>

          {/* USERNAME Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textMuted }]}>
              USERNAME
            </Text>
            <View
              style={[
                styles.inputRow,
                {
                  backgroundColor: colors.surface,
                  borderColor: TEAL,
                },
              ]}
            >
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Enter your username"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoComplete="username"
                keyboardType="email-address"
                inputMode="email"
              />
            </View>
          </View>

          {/* PASSWORD Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textMuted }]}>
              PASSWORD
            </Text>
            <View
              style={[
                styles.inputRow,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.line,
                },
              ]}
            >
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Enter your password"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete="current-password"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
                style={styles.rightIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={18}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Remember + Forgot */}
          <View style={styles.rememberRow}>
            <TouchableOpacity
              style={styles.rememberCheckbox}
              onPress={() => setRememberMe(!rememberMe)}
              activeOpacity={0.7}
              hitSlop={8}
            >
              <View
                style={[
                  styles.checkbox,
                  {
                    backgroundColor: rememberMe ? TEAL : "transparent",
                    borderColor: rememberMe ? TEAL : colors.line,
                  },
                ]}
              >
                {rememberMe && (
                  <Ionicons
                    name="checkmark"
                    size={14}
                    color={colors.black}
                  />
                )}
              </View>
              <Text style={[styles.rememberText, { color: colors.text }]}>
                Remember me
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleForgotPassword}
              activeOpacity={0.7}
            >
              <Text style={[styles.forgotText, { color: TEAL }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            style={[
              styles.signInButton,
              {
                backgroundColor: TEAL,
                opacity: isLoading ? 0.7 : 1,
              },
            ]}
            onPress={handleSubmit}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.black} />
            ) : (
              <Text style={[styles.signInText, { color: colors.black }]}>
                Sign in
              </Text>
            )}
          </TouchableOpacity>

          {/* TRY THE DEMO */}
          <View style={[styles.demoSection, { borderColor: colors.line }]}>
            <View style={styles.demoDivider}>
              <View
                style={[
                  styles.demoDividerLine,
                  { backgroundColor: colors.line },
                ]}
              />
              <Text style={[styles.demoLabel, { color: colors.textMuted }]}>
                TRY THE DEMO
              </Text>
              <View
                style={[
                  styles.demoDividerLine,
                  { backgroundColor: colors.line },
                ]}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.demoButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.line,
                },
              ]}
              onPress={() => handleDemoLogin("owner")}
              activeOpacity={0.8}
            >
              <View style={styles.demoTextContainer}>
                <Text style={[styles.demoTitle, { color: TEAL }]}>
                  Continue as Owner
                </Text>
                <Text
                  style={[styles.demoSubtitle, { color: colors.textDim }]}
                >
                  Full access · revenue, users, all data
                </Text>
              </View>
              <Ionicons
                name="arrow-forward"
                size={16}
                color={colors.textDim}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.demoButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.line,
                },
              ]}
              onPress={() => handleDemoLogin("manager")}
              activeOpacity={0.8}
            >
              <View style={styles.demoTextContainer}>
                <Text style={[styles.demoTitle, { color: TEAL }]}>
                  Continue as Manager
                </Text>
                <Text
                  style={[styles.demoSubtitle, { color: colors.textDim }]}
                >
                  Management only · no financials
                </Text>
              </View>
              <Ionicons
                name="arrow-forward"
                size={16}
                color={colors.textDim}
              />
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textDim }]}>
              Powered by Vercel
            </Text>
          </View>
        </View>
      </ScrollView>

      <Toast />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  langToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
    marginBottom: 24,
  },
  langPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  langText: {
    fontSize: 12,
    fontWeight: "700",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    height: 52,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
    paddingHorizontal: 0,
    height: "100%",
  },
  rightIcon: {
    padding: 8,
    marginRight: 8,
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 20,
  },
  rememberCheckbox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  rememberText: {
    fontSize: 14,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: "600",
  },
  signInButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    height: 52,
    width: "100%",
    gap: 8,
    marginBottom: 24,
  },
  signInText: {
    fontSize: 16,
    fontWeight: "700",
  },
  demoSection: {
    width: "100%",
    borderStyle: "dashed",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  demoDivider: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    gap: 8,
  },
  demoDividerLine: {
    flex: 1,
    height: 1,
  },
  demoLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  demoButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
    gap: 12,
  },
  demoTextContainer: {
    flex: 1,
    flexDirection: "column",
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  demoSubtitle: {
    fontSize: 11,
    fontWeight: "500",
    marginTop: 2,
  },
  footer: {
    paddingTop: 16,
  },
  footerText: {
    fontSize: 11,
    fontWeight: "500",
  },
});

export default LoginScreen;
