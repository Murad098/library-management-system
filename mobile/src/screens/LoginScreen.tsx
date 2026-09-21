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
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { useThemeColors } from "../context/ThemeContext";
import api, { getErrorMessage } from "../services/api";
import { AuthStackParamList } from "../navigation/AuthStack";

type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Login"
>;

const createDemoToken = (email: string): string => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const now = Math.floor(Date.now() / 1000);
  const payload = btoa(
    JSON.stringify({ email, iat: now, exp: now + 86400 })
  );
  return `${header}.${payload}.demo`;
};

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { signIn } = useAuth();
  const { Toast, show } = useToast();
  const colors = useThemeColors();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const TEAL = colors.green;

  const handleSubmit = async () => {
    if (isLoading) return;

    if (!email.trim() || !password) {
      show("Please enter your email and password.", "error");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
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

  const handleForgotPassword = () => {
    navigation.navigate({ name: "ForgotPasswordRequest", params: {} });
  };

  const handleDemoLogin = async (role: "owner" | "manager") => {
    const demoEmail =
      role === "owner" ? "owner@demo.local" : "manager@demo.local";
    const token = createDemoToken(demoEmail);
    const label = role === "owner" ? "Owner" : "Manager";

    await signIn(token, true);
    show(`Signed in as Demo ${label}.`, "success");
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
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.surface,
                borderColor: TEAL,
                shadowColor: TEAL,
              },
            ]}
          >
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
                <Ionicons
                  name="person-outline"
                  size={18}
                  color={TEAL}
                  style={styles.leftIcon}
                />
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
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color={colors.textMuted}
                  style={styles.leftIcon}
                />
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
                <ActivityIndicator
                  size="small"
                  color={colors.black}
                  style={styles.loadingIndicator}
                />
              ) : (
                <Ionicons name="arrow-forward" size={18} color={colors.black} />
              )}
              <Text style={[styles.signInText, { color: colors.black }]}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Text>
            </TouchableOpacity>

            {/* TRY THE DEMO Section */}
            <View style={[styles.demoSection, { borderColor: colors.line }]}>
              <View style={styles.demoDivider}>
                <View
                  style={[styles.demoDividerLine, { backgroundColor: colors.line }]}
                />
                <Text style={[styles.demoLabel, { color: colors.textMuted }]}>
                  TRY THE DEMO
                </Text>
                <View
                  style={[styles.demoDividerLine, { backgroundColor: colors.line }]}
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.demoButton,
                  {
                    backgroundColor: colors.base,
                    borderColor: colors.line,
                  },
                ]}
                onPress={() => handleDemoLogin("owner")}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="person-outline"
                  size={18}
                  color={TEAL}
                  style={styles.demoIcon}
                />
                <View style={styles.demoTextContainer}>
                  <Text style={[styles.demoTitle, { color: TEAL }]}>
                    Continue as Owner
                  </Text>
                  <Text style={[styles.demoSubtitle, { color: colors.textDim }]}>
                    Full access · manage everything
                  </Text>
                </View>
                <Ionicons name="arrow-forward" size={16} color={colors.textDim} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.demoButton,
                  {
                    backgroundColor: colors.base,
                    borderColor: colors.line,
                  },
                ]}
                onPress={() => handleDemoLogin("manager")}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="shield-outline"
                  size={18}
                  color={TEAL}
                  style={styles.demoIcon}
                />
                <View style={styles.demoTextContainer}>
                  <Text style={[styles.demoTitle, { color: TEAL }]}>
                    Continue as Manager
                  </Text>
                  <Text style={[styles.demoSubtitle, { color: colors.textDim }]}>
                    Limited access · manage library
                  </Text>
                </View>
                <Ionicons name="arrow-forward" size={16} color={colors.textDim} />
              </TouchableOpacity>
            </View>
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
  card: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 24,
    borderWidth: 1,
    padding: 28,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
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
  leftIcon: {
    marginLeft: 12,
    marginRight: 8,
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
    gap: 8,
    marginBottom: 24,
  },
  signInText: {
    fontSize: 16,
    fontWeight: "700",
  },
  loadingIndicator: {
    marginRight: 0,
  },
  demoSection: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 16,
    padding: 16,
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
  demoIcon: {
    width: 20,
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
});

export default LoginScreen;
