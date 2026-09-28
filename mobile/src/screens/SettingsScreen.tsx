import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { useTheme, useThemeColors } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import SectionHeader from "../components/ui/SectionHeader";
import { HamburgerButton } from "../components/HamburgerButton";
import { getErrorMessage } from "../services/api";
import { changePassword } from "../services/authService";

const HELP_TIPS = [
  "Add members from Members → Add member and set their monthly fee.",
  "Keep the Paid / Unpaid status current so collection totals stay accurate.",
  "Record every library expense so the dashboard net figure stays correct.",
  "Change the admin password here whenever it may have been shared.",
];

const ACCENT_OPTIONS: {
  value: string;
  label: string;
  color: string;
}[] = [
  { value: "emerald", label: "Emerald", color: "#20d6a0" },
  { value: "crimson", label: "Crimson", color: "#ff5364" },
  { value: "indigo", label: "Indigo", color: "#6252f4" },
  { value: "amber", label: "Amber", color: "#f5a623" },
  { value: "slate", label: "Slate", color: "#8fa1c0" },
  { value: "rose", label: "Rose", color: "#f04473" },
];

const SettingsScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const { toggleTheme, colorScheme, accent, setAccent } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const colors = useThemeColors();
  const { Toast, show } = useToast();
  const TEAL = colors.accent;

  const [openPanel, setOpenPanel] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [saving, setSaving] = useState(false);

  const togglePanel = useCallback((panel: string) => {
    setOpenPanel((current) => (current === panel ? "" : panel));
  }, []);

  const handlePasswordSubmit = useCallback(async () => {
    if (saving) return;

    if (newPassword.length < 6) {
      show("New password must be at least 6 characters.", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      show("New password and confirmation do not match.", "error");
      return;
    }

    setSaving(true);

    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setOpenPanel("");
      show("Password updated successfully.", "success");
    } catch (error) {
      show(getErrorMessage(error, "Unable to update password."), "error");
    } finally {
      setSaving(false);
    }
  }, [saving, currentPassword, newPassword, confirmPassword]);

  const handleLogout = useCallback(() => {
    Alert.alert("Log out?", "You will need to sign in again to continue.", [
      { text: "Cancel", style: "cancel" },
      { text: "Log out", style: "destructive", onPress: signOut },
    ]);
  }, [signOut]);

  const isDark = colorScheme === "dark";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.base }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader
          icon="settings"
          title={t("settings")}
          leftAction={<HamburgerButton />}
        />

        {/* ── Theme ── */}
        <TouchableOpacity
          style={[styles.settingRow, { backgroundColor: colors.surface, borderColor: colors.line }]}
          onPress={toggleTheme}
          activeOpacity={0.7}
        >
          <View style={[styles.settingIcon, { backgroundColor: `${TEAL}1A`, borderColor: `${TEAL}4D` }]}>
            <Ionicons name={isDark ? "moon" : "sunny"} size={18} color={TEAL} />
          </View>
          <View style={styles.settingText}>
            <Text style={[styles.settingTitle, { color: colors.text }]}>{t("darkMode")}</Text>
            <Text style={[styles.settingDesc, { color: colors.textMuted }]}>
              {isDark ? t("themeDark") : t("themeLight")}
            </Text>
          </View>
          <View style={[styles.toggleTrack, { backgroundColor: isDark ? TEAL : colors.line }]}>
            <View style={[styles.toggleThumb, { backgroundColor: isDark ? colors.black : colors.text, transform: [{ translateX: isDark ? 22 : 2 }] }]} />
          </View>
        </TouchableOpacity>

        {/* ── Color Scheme ── */}
        <View style={[styles.settingCard, { backgroundColor: colors.surface, borderColor: colors.line }]}>
          <View style={styles.settingRowLeft}>
            <View style={[styles.settingIcon, { backgroundColor: colors.accentSoft, borderColor: `${TEAL}4D` }]}>
              <Ionicons name="color-palette" size={18} color={TEAL} />
            </View>
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>{t("colorScheme")}</Text>
              <Text style={[styles.settingDesc, { color: colors.textMuted }]}>
                {t("chooseAccent")}
              </Text>
            </View>
          </View>

          <View style={styles.accentGrid}>
            {ACCENT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.accentOption,
                  accent === option.value && {
                    borderColor: option.color,
                    borderWidth: 2,
                  },
                ]}
                onPress={() => setAccent(option.value as any)}
                activeOpacity={0.8}
              >
                <View style={[styles.accentSwatch, { backgroundColor: option.color }]} />
                <Text style={[styles.accentLabel, { color: colors.text }]}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Language ── */}
        <TouchableOpacity
          style={[styles.settingRow, { backgroundColor: colors.surface, borderColor: colors.line }]}
          onPress={() =>
            setLanguage(language === "en" ? "ur" : "en")
          }
          activeOpacity={0.7}
        >
          <View style={[styles.settingIcon, { backgroundColor: `${TEAL}1A`, borderColor: `${TEAL}4D` }]}>
            <Ionicons name="language" size={18} color={TEAL} />
          </View>
          <View style={styles.settingText}>
            <Text style={[styles.settingTitle, { color: colors.text }]}>{t("language")}</Text>
            <Text style={[styles.settingDesc, { color: colors.textMuted }]}>
              {language === "en" ? t("english") : t("urdu")}
            </Text>
          </View>
          <View style={[styles.langPills, { backgroundColor: colors.raised, borderColor: colors.line }]}>
            <Text
              style={[
                styles.langPillText,
                { color: language === "en" ? colors.black : colors.textMuted },
                language === "en" && { backgroundColor: TEAL },
              ]}
            >
              EN
            </Text>
            <Text
              style={[
                styles.langPillText,
                { color: language === "ur" ? colors.black : colors.textMuted },
                language === "ur" && { backgroundColor: TEAL },
              ]}
            >
              اردو
            </Text>
          </View>
        </TouchableOpacity>

        {/* ── Change Password ── */}
        <TouchableOpacity
          style={[styles.settingRow, { backgroundColor: colors.surface, borderColor: colors.line }]}
          onPress={() => togglePanel("password")}
          activeOpacity={0.7}
        >
          <View style={[styles.settingIcon, { backgroundColor: `${colors.red}1A`, borderColor: `${colors.red}4D` }]}>
            <Ionicons name="lock-closed" size={18} color={colors.red} />
          </View>
          <View style={styles.settingText}>
            <Text style={[styles.settingTitle, { color: colors.text }]}>
              {t("changePassword")}
            </Text>
            <Text style={[styles.settingDesc, { color: colors.textMuted }]}>
              Update your account password
            </Text>
          </View>
          <Ionicons
            name={openPanel === "password" ? "chevron-up" : "chevron-down"}
            size={18}
            color={colors.textMuted}
          />
        </TouchableOpacity>

        {openPanel === "password" && (
          <View style={[styles.passwordForm, { backgroundColor: colors.surface, borderColor: colors.line }]}>
            <View style={styles.formField}>
              <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>
                Current password
              </Text>
              <View
                style={[
                  styles.passwordInputContainer,
                  { backgroundColor: colors.raised, borderColor: colors.line },
                ]}
              >
                <TextInput
                  style={[styles.passwordInput, { color: colors.text }]}
                  placeholder="Enter current password"
                  placeholderTextColor={colors.textDim}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry={!showPasswords}
                  autoComplete="current-password"
                />
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>
                New password
              </Text>
              <View
                style={[
                  styles.passwordInputContainer,
                  { backgroundColor: colors.raised, borderColor: colors.line },
                ]}
              >
                <TextInput
                  style={[styles.passwordInput, { color: colors.text }]}
                  placeholder="At least 6 characters"
                  placeholderTextColor={colors.textDim}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showPasswords}
                  autoComplete="new-password"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPasswords(!showPasswords)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.eyeText, { color: TEAL }]}>
                    {showPasswords ? "Hide" : "Show"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>
                Confirm new password
              </Text>
              <View
                style={[
                  styles.passwordInputContainer,
                  { backgroundColor: colors.raised, borderColor: colors.line },
                ]}
              >
                <TextInput
                  style={[styles.passwordInput, { color: colors.text }]}
                  placeholder="Re-enter new password"
                  placeholderTextColor={colors.textDim}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPasswords}
                  autoComplete="new-password"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPasswords(!showPasswords)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.eyeText, { color: TEAL }]}>
                    {showPasswords ? "Hide" : "Show"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formActions}>
              <TouchableOpacity
                style={[styles.textButton, { borderColor: colors.line }]}
                onPress={() => {
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setOpenPanel("");
                }}
                activeOpacity={0.7}
              >
                <Text style={[styles.textButtonText, { color: colors.text }]}>
                  {t("cancel")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  { backgroundColor: saving ? colors.textDim : TEAL },
                ]}
                onPress={handlePasswordSubmit}
                disabled={saving}
                activeOpacity={0.8}
              >
                {saving ? (
                  <ActivityIndicator size="small" color={colors.black} />
                ) : null}
                <Text style={[styles.submitButtonText, { color: colors.black }]}>
                  {saving ? t("save") : t("save")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── Help & Support ── */}
        <TouchableOpacity
          style={[styles.settingRow, { backgroundColor: colors.surface, borderColor: colors.line }]}
          onPress={() => togglePanel("support")}
          activeOpacity={0.7}
        >
          <View style={[styles.settingIcon, { backgroundColor: `${TEAL}1A`, borderColor: `${TEAL}4D` }]}>
            <Ionicons name="help-circle" size={18} color={TEAL} />
          </View>
          <View style={styles.settingText}>
            <Text style={[styles.settingTitle, { color: colors.text }]}>
              {t("helpAndSupport")}
            </Text>
            <Text style={[styles.settingDesc, { color: colors.textMuted }]}>
              Tips for using the system
            </Text>
          </View>
          <Ionicons
            name={openPanel === "support" ? "chevron-up" : "chevron-down"}
            size={18}
            color={colors.textMuted}
          />
        </TouchableOpacity>

        {openPanel === "support" && (
          <View style={[styles.supportSection, { backgroundColor: colors.surface, borderColor: colors.line }]}>
            {HELP_TIPS.map((tip) => (
              <View key={tip} style={styles.tipRow}>
                <View style={[styles.tipDot, { backgroundColor: TEAL }]} />
                <Text style={[styles.tipText, { color: colors.textMuted }]}>
                  {tip}
                </Text>
              </View>
            ))}
              <View style={[styles.versionRow, { borderColor: colors.line }]}>
              <Ionicons name="information-circle-outline" size={14} color={colors.textDim} />
              <Text style={[styles.versionText, { color: colors.textDim }]}>
                {t("version")} 1.0.0
              </Text>
            </View>
          </View>
        )}

        {/* ── Sign Out ── */}
        <TouchableOpacity
          style={[
            styles.logoutRow,
            { backgroundColor: colors.surface, borderColor: colors.line },
          ]}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.settingIcon,
              { backgroundColor: `${colors.red}1A`, borderColor: `${colors.red}4D` },
            ]}
          >
            <Ionicons name="log-out" size={18} color={colors.red} />
          </View>
          <View style={styles.settingText}>
            <Text style={[styles.settingTitle, { color: colors.red }]}>
              {t("logout")}
            </Text>
            <Text style={[styles.settingDesc, { color: colors.textDim }]}>
              End this session
            </Text>
          </View>
        </TouchableOpacity>

        <Toast />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
  },
  settingCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 10,
  },
  settingRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    flex: 1,
    minWidth: 0,
  },
  settingIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flex: 0,
  },
  settingText: { flex: 1, minWidth: 0 },
  settingTitle: { fontSize: 14, fontWeight: "600" },
  settingDesc: { fontSize: 12, marginTop: 1 },
  toggleTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    position: "relative",
  },
  toggleThumb: {
    position: "absolute",
    top: 1,
    width: 22,
    height: 22,
    borderRadius: 11,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  langPills: {
    flexDirection: "row",
    gap: 4,
    borderRadius: 999,
    padding: 3,
    borderWidth: 1,
  },
  langPillText: {
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  accentGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    padding: 14,
    paddingLeft: 52,
  },
  accentOption: {
    width: "30%",
    minWidth: 88,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "transparent",
    padding: 7,
    alignItems: "center",
  },
  accentSwatch: {
    height: 34,
    width: "100%",
    borderRadius: 8,
    marginBottom: 6,
  },
  accentLabel: {
    fontSize: 12,
    fontWeight: "700",
  },
  passwordForm: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 10,
  },
  formField: { padding: 16, paddingBottom: 0 },
  fieldLabel: { fontSize: 13, fontWeight: "600", marginBottom: 6 },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    position: "relative",
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  eyeButton: {
    position: "absolute",
    right: 14,
  },
  eyeText: { fontSize: 13, fontWeight: "600" },
  formActions: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    paddingTop: 0,
  },
  textButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
  },
  textButtonText: { fontSize: 14, fontWeight: "600" },
  submitButton: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: "700",
  },
  supportSection: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 10,
    gap: 12,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  tipDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 6,
  },
  tipText: { fontSize: 12, lineHeight: 18, flex: 1 },
  versionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    borderTopWidth: 1,
    paddingTop: 10,
  },
  versionText: { fontSize: 12 },
  logoutRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginTop: 8,
  },
});

export default SettingsScreen;
