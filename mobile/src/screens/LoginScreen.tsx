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
import { LinearGradient } from "expo-linear-gradient";
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
      <LinearGradient
        colors={[colors.base, "#321c32", "#11182c", "#162d38"]}
        locations={[0, 0.26, 0.62, 1]}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.base,
                borderColor: colors.lineStrong,
              },
            ]}
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
              <Text style={[styles.title, { color: TEAL }]}>Welcome back</Text>
              <Text style={[styles.subtitle, { color: colors.textMuted }] }>
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
                <Ionicons
                  name="person-outline"
                  size={28}
                  color={TEAL}
                  style={styles.inputIcon}
                />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Email or username"
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
                <Ionicons
                  name="lock-closed-outline"
                  size={27}
                  color={TEAL}
                  style={styles.inputIcon}
                />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Password"
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
                  name={showPassword ? "eye-outline" : "eye-outline"}
                  size={27}
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
              <>
                <Text style={[styles.signInText, { color: colors.white }] }>
                  Sign in
                </Text>
                <Ionicons name="arrow-forward" size={27} color={colors.white} />
              </>
            )}
              </TouchableOpacity>

          {/* TRY THE DEMO */}
              <View style={[styles.demoSection, { borderColor: colors.lineStrong }] }>
                <View style={styles.demoDivider}>
              <Text style={[styles.demoLabel, { color: colors.textMuted }]}>
                TRY THE DEMO
              </Text>
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
              <Ionicons name="person-outline" size={29} color={TEAL} />
              <View style={styles.demoTextContainer}>
                <Text style={[styles.demoTitle, { color: TEAL }]}>
                  Continue as Owner
                </Text>
                <Text
                  style={[styles.demoSubtitle, { color: colors.textDim }]}
                >
                  Full access · books, members, reports, all features
                </Text>
              </View>
              <Ionicons
                name="arrow-forward"
                size={22}
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
              <Ionicons name="people-outline" size={29} color={TEAL} />
              <View style={styles.demoTextContainer}>
                <Text style={[styles.demoTitle, { color: TEAL }]}>
                  Continue as Manager
                </Text>
                <Text
                  style={[styles.demoSubtitle, { color: colors.textDim }]}
                >
                  Limited access · manage books and members
                </Text>
              </View>
              <Ionicons
                name="arrow-forward"
                size={22}
                color={colors.textDim}
              />
            </TouchableOpacity>
              </View>

          {/* Footer */}
              <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textDim }]}>
              Powered by Library
            </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>

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
  card: {
    width: "100%",
    maxWidth: 672,
    borderWidth: 1,
    borderRadius: 24,
    padding: 48,
  },
  container: {
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
    fontSize: 40,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 34,
    textAlign: "center",
  },
  inputGroup: {
    width: "100%",
    marginBottom: 28,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 9,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    height: 62,
  },
  inputIcon: {
    width: 66,
    textAlign: "center",
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
    marginTop: 0,
    marginBottom: 26,
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
    fontSize: 16,
  },
  forgotText: {
    fontSize: 16,
    fontWeight: "600",
  },
  signInButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    height: 74,
    width: "100%",
    gap: 8,
    marginBottom: 26,
  },
  signInText: {
    fontSize: 23,
    fontWeight: "700",
  },
  demoSection: {
    width: "100%",
    borderStyle: "dashed",
    borderWidth: 1,
    borderRadius: 16,
    padding: 26,
    marginBottom: 20,
  },
  demoDivider: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 18,
  },
  demoLabel: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },
  demoButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 80,
    paddingVertical: 13,
    paddingHorizontal: 18,
    marginBottom: 10,
    gap: 12,
  },
  demoTextContainer: {
    flex: 1,
    flexDirection: "column",
  },
  demoTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  demoSubtitle: {
    fontSize: 13,
    fontWeight: "500",
    marginTop: 2,
  },
  footer: {
    paddingTop: 12,
  },
  footerText: {
    fontSize: 14,
    fontWeight: "500",
  },
});

export default LoginScreen;
