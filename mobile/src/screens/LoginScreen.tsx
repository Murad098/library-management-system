import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { BRAND_NAME, BRAND_MARK } from "../config/brand";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { useThemeColors } from "../context/ThemeContext";
import api, { getErrorMessage } from "../services/api";
import InputField from "../components/ui/InputField";
import PrimaryButton from "../components/ui/PrimaryButton";
import { AuthStackParamList } from "../navigation/AuthStack";

type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Login"
>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { signIn } = useAuth();
  const { Toast, show } = useToast();
  const colors = useThemeColors();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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
          <View style={styles.brandSection}>
            {BRAND_MARK ? (
              <Image source={BRAND_MARK} style={styles.logo} resizeMode="contain" />
            ) : (
              <View
                style={[
                  styles.logoSquare,
                  { backgroundColor: `${colors.brand}26`, borderColor: `${colors.brand}4D` },
                ]}
              />
            )}
            <Text style={[styles.title, { color: colors.text }]}>
              Member <Text style={{ fontWeight: "400" }}>Stack</Text>
            </Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              Library management
            </Text>
          </View>

          <View style={styles.formSection}>
            <InputField
              label="Email address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              inputMode="email"
              autoCapitalize="none"
              autoComplete="username"
            />

            <InputField
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              showPasswordToggle
              autoComplete="current-password"
            />

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
                      backgroundColor: rememberMe ? colors.brand : "transparent",
                      borderColor: rememberMe ? colors.brand : colors.line,
                    },
                  ]}
                >
                  {rememberMe && (
                    <Ionicons name="checkmark" size={14} color={colors.black} />
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
                <Text style={[styles.forgotText, { color: colors.brand }]}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>

            <PrimaryButton
              title="Login"
              onPress={handleSubmit}
              loading={isLoading}
              disabled={isLoading}
              style={{ marginTop: 12 }}
            />
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textDim }]}>
              © {new Date().getFullYear()} {BRAND_NAME}
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
  },
  brandSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: { width: 70, height: 70, marginBottom: 12 },
  logoSquare: {
    width: 70,
    height: 70,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  formSection: {
    marginBottom: 16,
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 12,
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
  footer: {
    alignItems: "center",
    marginTop: 24,
  },
  footerText: {
    fontSize: 12,
  },
});

export default LoginScreen;
