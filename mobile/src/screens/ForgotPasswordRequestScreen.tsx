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
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";

import { useThemeColors } from "../context/ThemeContext";
import { getErrorMessage } from "../services/api";
import { requestPasswordResetOtp } from "../services/authService";
import { useToast } from "../hooks/useToast";
import InputField from "../components/ui/InputField";
import PrimaryButton from "../components/ui/PrimaryButton";
import SectionHeader from "../components/ui/SectionHeader";
import { AuthStackParamList } from "../navigation/AuthStack";

type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "ForgotPasswordRequest"
>;
type RoutePropType = RouteProp<AuthStackParamList, "ForgotPasswordRequest">;

const ForgotPasswordRequestScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const colors = useThemeColors();
  const { Toast, show } = useToast();

  const [email, setEmail] = useState(route.params?.email ?? "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (isLoading) return;

    if (!email.trim()) {
      show("Enter the administrator email address.", "error");
      return;
    }

    setIsLoading(true);

    try {
      const response = await requestPasswordResetOtp(email.trim());

      show(
        response.data.message ||
          `A 6-digit code was sent to ${email.trim()}.`,
        "success"
      );

      navigation.navigate("ForgotPasswordVerify", { email: email.trim() });
    } catch (error) {
      show(
        getErrorMessage(error, "Unable to send the reset code."),
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate({ name: "Login", params: {} });
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
            icon="key"
            title="Reset your password"
            subtitle="Enter your administrator email to receive a 6-digit code."
            style={{ marginBottom: 16 }}
          />

          <InputField
            label="Email address"
            placeholder="Admin email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            inputMode="email"
            autoCapitalize="none"
            autoComplete="email"
            leftIcon="mail-outline"
          />

          <PrimaryButton
            title="Send code"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
            style={{ marginTop: 8 }}
          />

          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackToLogin}
            activeOpacity={0.7}
          >
            <Text style={[styles.backText, { color: colors.textMuted }]}>
              Back to login
            </Text>
          </TouchableOpacity>
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
  backButton: {
    alignItems: "center",
    marginTop: 16,
    paddingVertical: 8,
  },
  backText: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default ForgotPasswordRequestScreen;
