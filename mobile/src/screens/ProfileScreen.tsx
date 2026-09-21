import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from "expo-image-picker";

import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { useTheme, useThemeColors } from "../context/ThemeContext";
import SectionHeader from "../components/ui/SectionHeader";
import { getErrorMessage } from "../services/api";
import { getAvatar, uploadAvatar, changePassword } from "../services/authService";
import { initials } from "../utils/format";

const HELP_TIPS = [
  "Add members from Members → Add member and set their monthly fee.",
  "Keep the Paid / Unpaid status current so collection totals stay accurate.",
  "Record every library expense so the dashboard net figure stays correct.",
  "Change the admin password here whenever it may have been shared.",
];

const LANGUAGE_STORAGE_KEY = "language";

const ProfileScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const { toggleTheme, colorScheme } = useTheme();
  const colors = useThemeColors();
  const { Toast, show } = useToast();
  const TEAL = colors.green;

  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [avatarLoading, setAvatarLoading] = useState(true);
  const [avatarError, setAvatarError] = useState("");

  const [openPanel, setOpenPanel] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [saving, setSaving] = useState(false);

  const [language, setLanguage] = useState<"en" | "ur">("en");

  const togglePanel = (panel: string) => {
    setOpenPanel((current) => (current === panel ? "" : panel));
  };

  useEffect(() => {
    (async () => {
      const saved = await SecureStore.getItemAsync(LANGUAGE_STORAGE_KEY);
      if (saved === "en" || saved === "ur") {
        setLanguage(saved);
      }
    })();
  }, []);

  const handleLanguage = async (lang: "en" | "ur") => {
    setLanguage(lang);
    await SecureStore.setItemAsync(LANGUAGE_STORAGE_KEY, lang);
  };

  const loadAvatar = async () => {
    setAvatarLoading(true);
    setAvatarError("");

    try {
      const response = await getAvatar();
      const blob: Blob = response.data;

      const dataUri = await new Promise<string>((resolve) => {
        const reader = new FileReader();

        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          }
        };
        reader.readAsDataURL(blob);
      });

      setAvatarUrl(dataUri);
    } catch {
      // No photo set — initials fallback is used.
    } finally {
      setAvatarLoading(false);
    }
  };

  useEffect(() => {
    loadAvatar();
  }, []);

  const handleAvatarChange = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Please allow access to your photos to change the profile picture."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return;
    }

    const asset = result.assets[0];
    const file = {
      uri: asset.uri,
      name: asset.fileName || "avatar.jpg",
      type: asset.mimeType || "image/jpeg",
    };

    setAvatarLoading(true);
    setAvatarError("");

    try {
      await uploadAvatar(file);
      await loadAvatar();
      setAvatarError("");
      show("Profile photo updated.", "success");
    } catch (error) {
      setAvatarError(getErrorMessage(error, "Unable to update the profile photo."));
      show(getErrorMessage(error, "Unable to update the profile photo."), "error");
    } finally {
      setAvatarLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
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
  };

  const handleLogout = () => {
    Alert.alert("Log out?", "You will need to sign in again to continue.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: signOut,
      },
    ]);
  };

  const passwordType = showPasswords ? "text" : "password";

  const name = user?.name ?? "";
  const email = user?.email ?? "";
  const role = user?.role ?? "";
  const expiresAt = user?.expiresAt ?? null;

  const hasSession = expiresAt && !Number.isNaN(expiresAt.getTime());

  return (
    <View style={[styles.container, { backgroundColor: colors.base }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader
          icon="settings"
          title="Settings"
          subtitle="Manage your account and preferences"
          accentColor={TEAL}
          rightContent={
            <TouchableOpacity
              style={[
                styles.themeToggle,
                {
                  backgroundColor: colors.base,
                  borderColor: colors.line,
                },
              ]}
              onPress={toggleTheme}
              activeOpacity={0.7}
            >
              <Ionicons
                name={colorScheme === "dark" ? "moon" : "sunny"}
                size={20}
                color={TEAL}
              />
            </TouchableOpacity>
          }
        />

        {/* ── Account Details ── */}
        <View
          style={[
            styles.identitySection,
            {
              backgroundColor: colors.surface,
              borderColor: colors.line,
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.avatar, { backgroundColor: TEAL }]}
            onPress={handleAvatarChange}
            disabled={avatarLoading}
            activeOpacity={0.7}
          >
            {avatarLoading ? (
              <ActivityIndicator size="small" color={colors.black} />
            ) : avatarUrl ? (
              <Image
                source={{ uri: avatarUrl }}
                style={{ width: "100%", height: "100%", borderRadius: 31 }}
              />
            ) : (
              <Text style={[styles.avatarInitials, { color: colors.black }]}>
                {initials(name)}
              </Text>
            )}

            {!avatarLoading && (
              <View
                style={[
                  styles.avatarOverlay,
                  { backgroundColor: colors.overlay },
                ]}
              >
                <Ionicons name="camera" size={20} color={colors.white} />
              </View>
            )}
          </TouchableOpacity>

          {avatarError ? (
            <Text style={[styles.avatarError, { color: colors.red }]}>
              {avatarError}
            </Text>
          ) : null}

          <View style={styles.identityText}>
            <Text style={[styles.profileName, { color: colors.text }]}>
              {name || "Administrator"}
            </Text>
            <Text style={[styles.profileEmail, { color: colors.textMuted }]}>
              {email || "Signed in"}
            </Text>

            <View
              style={[
                styles.roleBadge,
                {
                  backgroundColor: `${TEAL}1A`,
                  borderColor: `${TEAL}4D`,
                },
              ]}
            >
              <Ionicons
                name="shield-checkmark"
                size={12}
                color={TEAL}
              />
              <Text style={[styles.roleText, { color: TEAL }]}>
                {role || "Administrator"}
              </Text>
            </View>
          </View>
        </View>

        {hasSession && (
          <View
            style={[
              styles.sessionRow,
              { backgroundColor: colors.surface, borderColor: colors.line },
            ]}
          >
            <Ionicons name="time" size={14} color={colors.textMuted} />
            <Text style={[styles.sessionText, { color: colors.textMuted }]}>
              Session active until{" "}
              {expiresAt!.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </Text>
          </View>
        )}

        {/* ── Settings Menu ── */}
        <View
          style={[
            styles.menuSection,
            { backgroundColor: colors.surface, borderColor: colors.line },
          ]}
        >
          {/* Appearance */}
          <TouchableOpacity
            style={styles.menuRow}
            activeOpacity={0.7}
          >
            <View style={styles.menuRowLeft}>
              <View
                style={[
                  styles.menuIcon,
                  {
                    backgroundColor: `${TEAL}1A`,
                    borderColor: `${TEAL}4D`,
                  },
                ]}
              >
                <Ionicons
                  name={colorScheme === "dark" ? "moon" : "sunny"}
                  size={18}
                  color={TEAL}
                />
              </View>
              <View style={styles.menuText}>
                <Text style={[styles.menuTitle, { color: colors.text }]}>
                  Dark mode
                </Text>
                <Text style={[styles.menuDesc, { color: colors.textMuted }]}>
                  {colorScheme === "dark"
                    ? "Dark theme active"
                    : "Light theme active"}
                </Text>
              </View>
            </View>
            <View style={styles.toggleSwitch}>
              <TouchableOpacity
                style={[
                  styles.toggleTrack,
                  {
                    backgroundColor:
                      colorScheme === "dark" ? TEAL : colors.line,
                  },
                ]}
                onPress={toggleTheme}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.toggleThumb,
                    {
                      backgroundColor: colors.surface,
                      transform: [
                        {
                          translateX: colorScheme === "dark" ? 22 : 2,
                        },
                      ],
                    },
                  ]}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Language */}
          <View style={styles.menuRow}>
            <View style={styles.menuRowLeft}>
              <View
                style={[
                  styles.menuIcon,
                  {
                    backgroundColor: `${TEAL}1A`,
                    borderColor: `${TEAL}4D`,
                  },
                ]}
              >
                <Ionicons name="language" size={18} color={TEAL} />
              </View>
              <View style={styles.menuText}>
                <Text style={[styles.menuTitle, { color: colors.text }]}>
                  Language
                </Text>
                <Text style={[styles.menuDesc, { color: colors.textMuted }]}>
                  {language === "en" ? "English" : "اردو"}
                </Text>
              </View>
            </View>
            <View style={styles.langPills}>
              <TouchableOpacity
                style={[
                  styles.langPill,
                  language === "en"
                    ? { backgroundColor: TEAL }
                    : {
                        backgroundColor: colors.base,
                        borderColor: colors.line,
                      },
                ]}
                onPress={() => handleLanguage("en")}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.langPillText,
                    {
                      color:
                        language === "en" ? colors.black : colors.textMuted,
                    },
                  ]}
                >
                  EN
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.langPill,
                  language === "ur"
                    ? { backgroundColor: TEAL }
                    : {
                        backgroundColor: colors.base,
                        borderColor: colors.line,
                      },
                ]}
                onPress={() => handleLanguage("ur")}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.langPillText,
                    {
                      color:
                        language === "ur" ? colors.black : colors.textMuted,
                    },
                  ]}
                >
                  اردو
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Change Password */}
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => togglePanel("password")}
            activeOpacity={0.7}
          >
            <View style={styles.menuRowLeft}>
              <View
                style={[
                  styles.menuIcon,
                  {
                    backgroundColor: `${TEAL}1A`,
                    borderColor: `${TEAL}4D`,
                  },
                ]}
              >
                <Ionicons name="lock-closed" size={18} color={TEAL} />
              </View>
              <View style={styles.menuText}>
                <Text style={[styles.menuTitle, { color: colors.text }]}>
                  Change Password
                </Text>
                <Text style={[styles.menuDesc, { color: colors.textMuted }]}>
                  Update your account password
                </Text>
              </View>
            </View>
            <Ionicons
              name={openPanel === "password" ? "chevron-up" : "chevron-down"}
              size={18}
              color={colors.textMuted}
            />
          </TouchableOpacity>

          {openPanel === "password" && (
            <View style={styles.passwordForm}>
              <View style={styles.formField}>
                <Text
                  style={[styles.fieldLabel, { color: colors.textMuted }]}
                >
                  Current password
                </Text>
                <View
                  style={[
                    styles.passwordInputContainer,
                    {
                      backgroundColor: colors.base,
                      borderColor: colors.line,
                    },
                  ]}
                >
                  <TextInput
                    style={[
                      styles.passwordInput,
                      { color: colors.text },
                    ]}
                    placeholder="Enter current password"
                    placeholderTextColor={colors.textMuted}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry={!showPasswords}
                    autoComplete="current-password"
                  />
                </View>
              </View>

              <View style={styles.formField}>
                <Text
                  style={[styles.fieldLabel, { color: colors.textMuted }]}
                >
                  New password
                </Text>
                <View
                  style={[
                    styles.passwordInputContainer,
                    {
                      backgroundColor: colors.base,
                      borderColor: colors.line,
                    },
                  ]}
                >
                  <TextInput
                    style={[
                      styles.passwordInput,
                      { color: colors.text },
                    ]}
                    placeholder="At least 6 characters"
                    placeholderTextColor={colors.textMuted}
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
                <Text
                  style={[styles.fieldLabel, { color: colors.textMuted }]}
                >
                  Confirm new password
                </Text>
                <View
                  style={[
                    styles.passwordInputContainer,
                    {
                      backgroundColor: colors.base,
                      borderColor: colors.line,
                    },
                  ]}
                >
                  <TextInput
                    style={[
                      styles.passwordInput,
                      { color: colors.text },
                    ]}
                    placeholder="Re-enter new password"
                    placeholderTextColor={colors.textMuted}
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
                  style={[
                    styles.textButton,
                    { borderColor: colors.line },
                  ]}
                  onPress={() => {
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setOpenPanel("");
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.textButtonText, { color: colors.text }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    {
                      backgroundColor: saving ? colors.textDim : TEAL,
                    },
                  ]}
                  onPress={handlePasswordSubmit}
                  disabled={saving}
                  activeOpacity={0.8}
                >
                  {saving ? (
                    <ActivityIndicator
                      size="small"
                      color={colors.black}
                    />
                  ) : null}
                  <Text style={styles.submitButtonText}>
                    {saving ? "Saving..." : "Update password"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.divider} />

          {/* Help & Support */}
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => togglePanel("support")}
            activeOpacity={0.7}
          >
            <View style={styles.menuRowLeft}>
              <View
                style={[
                  styles.menuIcon,
                  {
                    backgroundColor: `${TEAL}1A`,
                    borderColor: `${TEAL}4D`,
                  },
                ]}
              >
                <Ionicons name="help-circle" size={18} color={TEAL} />
              </View>
              <View style={styles.menuText}>
                <Text style={[styles.menuTitle, { color: colors.text }]}>
                  Help &amp; Support
                </Text>
                <Text style={[styles.menuDesc, { color: colors.textMuted }]}>
                  Tips for using the system
                </Text>
              </View>
            </View>
            <Ionicons
              name={openPanel === "support" ? "chevron-up" : "chevron-down"}
              size={18}
              color={colors.textMuted}
            />
          </TouchableOpacity>

          {openPanel === "support" && (
            <View style={styles.supportSection}>
              {HELP_TIPS.map((tip) => (
                <View key={tip} style={styles.tipRow}>
                  <View
                    style={[styles.tipDot, { backgroundColor: TEAL }]}
                  />
                  <Text style={[styles.tipText, { color: colors.textMuted }]}>
                    {tip}
                  </Text>
                </View>
              ))}
            </View>
          )}

        </View>

        {/* ── Logout ── */}
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
              styles.menuIcon,
              styles.logoutIcon,
              {
                backgroundColor: `${colors.red}1A`,
                borderColor: `${colors.red}4D`,
              },
            ]}
          >
            <Ionicons name="log-out" size={18} color={colors.red} />
          </View>
          <View style={styles.menuText}>
            <Text style={[styles.menuTitle, { color: colors.red }]}>
              Logout
            </Text>
            <Text style={[styles.menuDesc, { color: colors.textMuted }]}>
              End this session
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32, gap: 16 },
  themeToggle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  identitySection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    minWidth: 0,
  },
  avatar: {
    position: "relative",
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarInitials: {
    fontSize: 22,
    fontWeight: "700",
  },
  avatarOverlay: {
    position: "absolute",
    inset: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarError: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: "600",
    marginLeft: 78,
  },
  identityText: {
    flex: 1,
    minWidth: 0,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
  },
  profileEmail: {
    fontSize: 13,
    marginTop: 3,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  roleText: {
    fontSize: 11,
    fontWeight: "700",
  },
  sessionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
  },
  sessionText: {
    fontSize: 12,
  },
  menuSection: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    padding: 14,
  },
  menuRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  menuIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flex: 0,
  },
  logoutIcon: {
    backgroundColor: "rgba(248, 111, 111, 0.1)",
    borderColor: "rgba(248, 111, 111, 0.32)",
  },
  menuText: {
    flex: 1,
    minWidth: 0,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  menuDesc: {
    fontSize: 12,
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(42, 58, 83, 0.5)",
    marginLeft: 52,
    marginRight: 14,
  },
  toggleSwitch: {
    width: 48,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(42, 58, 83, 0.5)",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: 2,
  },
  toggleTrack: {
    width: "100%",
    height: "100%",
    borderRadius: 13,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  langPills: {
    flexDirection: "row",
    gap: 4,
    padding: 3,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(42, 58, 83, 0.5)",
    borderRadius: 999,
  },
  langPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  langPillText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.03,
  },
  passwordForm: {
    borderTopWidth: 1,
    borderColor: "rgba(42, 58, 83, 0.5)",
    padding: 16,
  },
  formField: { marginBottom: 16 },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    position: "relative",
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
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  eyeText: {
    fontSize: 13,
    fontWeight: "600",
  },
  formActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  textButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  textButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  submitButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000000",
  },
  supportSection: {
    borderTopWidth: 1,
    borderColor: "rgba(42, 58, 83, 0.5)",
    padding: 16,
    gap: 10,
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
  tipText: {
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },
  logoutRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
  },
});

export default ProfileScreen;
