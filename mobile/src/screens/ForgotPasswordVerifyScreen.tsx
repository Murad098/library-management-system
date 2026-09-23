import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  useNavigation,
  useRoute,
  RouteProp,
} from "@react-navigation/native";

import { useThemeColors } from "../context/ThemeContext";
import { getErrorMessage } from "../services/api";
import {
  verifyPasswordResetOtp,
  resetPassword,
} from "../services/authService";
import { useToast } from "../hooks/useToast";
import PrimaryButton from "../components/ui/PrimaryButton";
import SectionHeader from "../components/ui/SectionHeader";
import { AuthStackParamList } from "../navigation/AuthStack";

type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "ForgotPasswordVerify"
>;
type RoutePropType = RouteProp<AuthStackParamList, "ForgotPasswordVerify">;

const ForgotPasswordVerifyScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const { email } = route.params;
  const colors = useThemeColors();
  const { Toast, show } = useToast();

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (isLoading) return;

    if (!otp.trim()) {
      show("Enter the code from your email.", "error");
      return;
    }

    if (newPassword.length < 6) {
      show("New password must be at least 6 characters.", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      show("New password and confirmation do not match.", "error");
      return;
    }

    setIsLoading(true);

    try {
      const verified = await verifyPasswordResetOtp(email, otp.trim());
      const resetToken = verified.data.resetToken;

      await resetPassword(resetToken, newPassword);

      show("Password reset. You can sign in now.", "success");
      navigation.navigate({ name: "Login", params: { email } });
    } catch (error) {
      show(
        getErrorMessage(error, "Unable to reset the password."),
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeEmail = () => {
    navigation.navigate({ name: "ForgotPasswordRequest", params: { email } });
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
          <SectionHeader
            icon="shield-checkmark"
            title="Enter verification code"
            subtitle={`A 6-digit code was sent to ${email}. Enter it below, then choose a new password.`}
            style={{ marginBottom: 16 }}
          />

          <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.line }]}>
            <View style={styles.otpField}>
            <Text style={[styles.label, { color: colors.textMuted }]}>
              Verification code
            </Text>
            <View
              style={[
                styles.otpInputContainer,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.line,
                },
              ]}
            >
              <TextInput
                style={[styles.otpInput, { color: colors.text, letterSpacing: 4 }]}
                placeholder="6-digit code"
                placeholderTextColor={colors.textMuted}
                value={otp}
                onChangeText={(text) =>
                  setOtp(text.replace(/\D/g, "").slice(0, 6))
                }
                keyboardType="numeric"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                textAlign="center"
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.textMuted }]}>
              New password
            </Text>
            <View
              style={[
                styles.passwordInputContainer,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.line,
                },
              ]}
            >
              <TextInput
                style={[styles.passwordInput, { color: colors.text }]}
                placeholder="At least 6 characters"
                placeholderTextColor={colors.textMuted}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
                autoComplete="new-password"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowNewPassword(!showNewPassword)}
                activeOpacity={0.7}
              >
                <Text style={[styles.eyeText, { color: colors.brand }]}>
                  {showNewPassword ? "Hide" : "Show"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.textMuted }]}>
              Confirm new password
            </Text>
            <View
              style={[
                styles.passwordInputContainer,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.line,
                },
              ]}
            >
              <TextInput
                style={[styles.passwordInput, { color: colors.text }]}
                placeholder="Re-enter new password"
                placeholderTextColor={colors.textMuted}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirm}
                autoComplete="new-password"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirm(!showConfirm)}
                activeOpacity={0.7}
              >
                <Text style={[styles.eyeText, { color: colors.brand }]}>
                  {showConfirm ? "Hide" : "Show"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <PrimaryButton
            title="Reset password"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
            style={{ marginTop: 16 }}
          />

          <View style={styles.rowActions}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleChangeEmail}
              activeOpacity={0.7}
            >
              <Text style={[styles.secondaryText, { color: colors.textMuted }]}>
                Change email
              </Text>
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
  container: { marginBottom: 32 },
  formCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  field: { marginTop: 16, marginBottom: 4 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },
  otpField: { marginTop: 16, marginBottom: 4 },
  otpInputContainer: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  otpInput: {
    fontSize: 20,
    height: 40,
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  eyeButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  eyeText: {
    fontSize: 13,
    fontWeight: "600",
  },
  rowActions: { flexDirection: "row", gap: 16, marginTop: 12 },
  secondaryButton: {
    padding: 6,
  },
  secondaryText: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default ForgotPasswordVerifyScreen;
