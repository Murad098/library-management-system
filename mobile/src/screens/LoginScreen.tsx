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
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";

import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { useThemeColors } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { login } from "../services/authService";
import { getErrorMessage } from "../services/api";
import { AuthStackParamList } from "../navigation/AuthStack";

type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Login"
>;
type RoutePropType = RouteProp<AuthStackParamList, "Login">;

const DEMO_OWNER_EMAIL = process.env.EXPO_PUBLIC_DEMO_OWNER_EMAIL || "";
const DEMO_OWNER_PASSWORD = process.env.EXPO_PUBLIC_DEMO_OWNER_PASSWORD || "";
const DEMO_MANAGER_EMAIL = process.env.EXPO_PUBLIC_DEMO_MANAGER_EMAIL || "";
const DEMO_MANAGER_PASSWORD = process.env.EXPO_PUBLIC_DEMO_MANAGER_PASSWORD || "";

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const { signIn } = useAuth();
  const { Toast, show } = useToast();
  const colors = useThemeColors();
  const { language, setLanguage, t } = useLanguage();

  const [email, setEmail] = useState(route.params?.email ?? "");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const TEAL = colors.accent;

  const performLogin = async (emailToLogin: string, passwordToLogin: string) => {
    if (isLoading) return;

    if (!emailToLogin.trim() || !passwordToLogin) {
      show(t("pleaseEnterCredentials"), "error");
      return;
    }

    setIsLoading(true);

    try {
      const response = await login(emailToLogin, passwordToLogin);
      const token = response.data.token as string;

      await signIn(token, rememberMe);
      show(t("loginSuccess"), "success");
    } catch (error) {
      show(
        getErrorMessage(error, t("unableToSignIn")),
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => performLogin(email, password);

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPasswordRequest");
  };

  const handleDemoLogin = async (role: "owner" | "manager") => {
    const demoEmail = role === "owner" ? DEMO_OWNER_EMAIL : DEMO_MANAGER_EMAIL;
    const demoPassword =
      role === "owner" ? DEMO_OWNER_PASSWORD : DEMO_MANAGER_PASSWORD;

    if (!demoEmail || !demoPassword || (role === "manager" && demoEmail === DEMO_OWNER_EMAIL)) {
      show(t("demoNotConfigured"), "error");
      return;
    }

    await performLogin(demoEmail, demoPassword);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.base }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <LinearGradient
        colors={["#0d2d39", "#051d2d", "#0d1c35", "#2a1d39"]}
        locations={[0, 0.32, 0.72, 1]}
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
                backgroundColor: colors.raised,
                     borderColor: colors.line,
              },
            ]}
          >
            <View style={styles.container}>
          {/* Language Toggle */}
              <View style={styles.langToggle}>
            <TouchableOpacity
              style={[
                styles.langPill,
                {
                  backgroundColor: language === "ur" ? TEAL : "transparent",
                  borderColor: language === "ur" ? TEAL : colors.lineStrong,
                  borderWidth: 1,
                },
              ]}
              onPress={() => setLanguage("ur")}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.langText, { color: language === "ur" ? colors.black : colors.textMuted }]}
              >
                {t("urdu")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.langPill,
                {
                  backgroundColor: language === "en" ? TEAL : "transparent",
                  borderColor: language === "en" ? TEAL : colors.lineStrong,
                  borderWidth: 1,
                },
              ]}
              onPress={() => setLanguage("en")}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.langText, { color: language === "en" ? colors.black : colors.textMuted }]}
              >
                {t("english")}
              </Text>
            </TouchableOpacity>
              </View>

          {/* Title */}
              <Text style={[styles.title, { color: TEAL }]}>{t("welcomeBack")}</Text>
              <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            {t("signInSubtitle")}
              </Text>

          {/* USERNAME Input */}
              <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textMuted }]}>
              {t("username")}
            </Text>
            <View
              style={[
                styles.inputRow,
                {
                  backgroundColor: colors.raised,
                  borderColor: TEAL,
                },
              ]}
            >
              <Ionicons
                    name="person-outline"
                    size={24}
                    color={TEAL}
                    style={styles.inputIcon}
                  />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder={t("emailOrUsername")}
                placeholderTextColor={colors.textDim}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoComplete="off"
                textContentType="none"
                importantForAutofill="no"
                keyboardType="email-address"
                inputMode="email"
              />
            </View>
              </View>

          {/* PASSWORD Input */}
              <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textMuted }]}>
              {t("password")}
            </Text>
            <View
              style={[
                styles.inputRow,
                {
                  backgroundColor: colors.raised,
                   borderColor: TEAL,
                },
              ]}
            >
               <Ionicons
                  name="lock-closed-outline"
                  size={24}
                  color={TEAL}
                  style={styles.inputIcon}
                />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder={t("password")}
                placeholderTextColor={colors.textDim}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete="off"
                textContentType="none"
                importantForAutofill="no"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
                style={styles.rightIcon}
              >
                <Ionicons
                   name={showPassword ? "eye-off-outline" : "eye-outline"}
                   size={24}
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
                {t("rememberMe")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleForgotPassword}
              activeOpacity={0.7}
            >
              <Text style={[styles.forgotText, { color: TEAL }]}>
                {t("forgotPassword")}
              </Text>
            </TouchableOpacity>
              </View>

          {/* Sign In Button */}
              <LinearGradient
                colors={[TEAL, colors.brand]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={[styles.signInButton, { opacity: isLoading ? 0.7 : 1 }]}
              >
              <TouchableOpacity
                style={styles.signInButtonInner}
                onPress={handleSubmit}
                disabled={isLoading}
                activeOpacity={0.8}
              >
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.black} />
            ) : (
              <>
                <Text style={[styles.signInText, { color: colors.white }] }>
                  {t("signIn")}
                </Text>
                 <Ionicons name="arrow-forward" size={22} color={colors.white} />
              </>
            )}
              </TouchableOpacity>
              </LinearGradient>

          {/* TRY THE DEMO */}
              <View style={[styles.demoSection, { borderColor: colors.lineStrong }] }>
                <View style={styles.demoDivider}>
              <Text style={[styles.demoLabel, { color: colors.textMuted }]}>
                {t("tryDemo")}
              </Text>
                </View>

                <TouchableOpacity
              style={[
                styles.demoButton,
                {
                  backgroundColor: colors.raised,
                  borderColor: colors.line,
                },
              ]}
              onPress={() => handleDemoLogin("owner")}
              activeOpacity={0.8}
            >
              <Ionicons name="person-outline" size={24} color={TEAL} />
              <View style={styles.demoTextContainer}>
                <Text style={[styles.demoTitle, { color: TEAL }]}>
                  {t("continueOwner")}
                </Text>
                <Text
                   style={[styles.demoSubtitle, { color: colors.textDim }]}
                >
                  {t("ownerDescription")}
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
                  backgroundColor: colors.raised,
                  borderColor: colors.line,
                },
              ]}
              onPress={() => handleDemoLogin("manager")}
              activeOpacity={0.8}
            >
              <Ionicons name="people-outline" size={24} color={TEAL} />
              <View style={styles.demoTextContainer}>
                <Text style={[styles.demoTitle, { color: TEAL }]}>
                  {t("continueManager")}
                </Text>
                <Text
                   style={[styles.demoSubtitle, { color: colors.textDim }]}
                >
                  {t("managerDescription")}
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
               Powered by Library Management System
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
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  card: {
    width: "100%",
    maxWidth: 430,
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  container: {
    alignItems: "center",
  },
  langToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
    width: "100%",
    marginBottom: 12,
  },
  langPill: {
    minWidth: 72,
    height: 36,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
  },
  langText: {
    fontSize: 15,
    fontWeight: "700",
  },
  title: {
    fontSize: 38,
    fontWeight: "800",
    lineHeight: 44,
    marginBottom: 4,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 19,
    lineHeight: 26,
    marginBottom: 24,
    textAlign: "center",
  },
  inputGroup: {
    width: "100%",
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    height: 60,
  },
  inputIcon: {
    width: 64,
    textAlign: "center",
  },
  input: {
    flex: 1,
    fontSize: 17,
    paddingVertical: 0,
    paddingHorizontal: 0,
    height: "100%",
  },
  rightIcon: {
    width: 50,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 0,
    marginBottom: 18,
  },
  rememberCheckbox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  rememberText: {
    fontSize: 15,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: "600",
  },
  signInButton: {
    borderRadius: 14,
    height: 60,
    width: "100%",
    overflow: "hidden",
    marginBottom: 18,
  },
  signInButtonInner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  signInText: {
    fontSize: 17,
    fontWeight: "700",
  },
  demoSection: {
    width: "100%",
    borderStyle: "dashed",
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    paddingTop: 14,
    marginBottom: 18,
  },
  demoDivider: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 12,
  },
  demoLabel: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  demoButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    minHeight: 62,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 10,
    gap: 12,
  },
  demoTextContainer: {
    flex: 1,
    flexDirection: "column",
  },
  demoTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
  demoSubtitle: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },
  footer: {
    paddingTop: 10,
  },
  footerText: {
    fontSize: 13,
    fontWeight: "500",
  },
});

export default LoginScreen;
