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

const ProfileScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const { toggleTheme, colorScheme } = useTheme();
  const colors = useThemeColors();
  const { Toast, show } = useToast();

  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [avatarLoading, setAvatarLoading] = useState(true);
  const [avatarError, setAvatarError] = useState("");

  const [openPanel, setOpenPanel] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [saving, setSaving] = useState(false);

  const togglePanel = (panel: string) => {
    setOpenPanel((current) => (current === panel ? "" : panel));
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
          icon="person"
          title="Profile"
          subtitle="Manage your account"
          rightContent={
            <TouchableOpacity
              style={[
                styles.themeToggle,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.line,
                },
              ]}
              onPress={toggleTheme}
              activeOpacity={0.7}
            >
              <Ionicons
                name={colorScheme === "dark" ? "sunny" : "moon"}
                size={20}
                color={colors.brand}
              />
            </TouchableOpacity>
          }
        />

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
            style={styles.avatar}
            onPress={handleAvatarChange}
            disabled={avatarLoading}
            activeOpacity={0.7}
          >
            {avatarLoading ? (
              <ActivityIndicator size="small" color={colors.brand} />
            ) : avatarUrl ? (
              <Image
                source={{ uri: avatarUrl }}
                style={{ width: "100%", height: "100%", borderRadius: 31 }}
              />
            ) : (
              <Text style={[styles.avatarInitials, { color: colors.brand }]}>
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
            <Text style={[styles.profileName, { color: colors.white }]}>
              {name || "Administrator"}
            </Text>
            <Text style={[styles.profileEmail, { color: colors.textMuted }]}>
              {email || "Signed in"}
            </Text>

            <View
              style={[
                styles.roleBadge,
                {
                  backgroundColor: `${colors.brand}1A`,
                  borderColor: `${colors.brand}4D`,
                },
              ]}
            >
              <Ionicons name="shield-checkmark" size={12} color={colors.brand} />
              <Text style={[styles.roleText, { color: colors.brandText }]}>
                {role || "Administrator"}
              </Text>
            </View>
          </View>
        </View>

        {hasSession && (
          <View style={[styles.sessionRow, { backgroundColor: colors.surface, borderColor: colors.line }]}>
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

        <View
          style={[
            styles.menuSection,
            { backgroundColor: colors.surface, borderColor: colors.line },
          ]}
        >
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
                    backgroundColor: `${colors.brand}1A`,
                    borderColor: `${colors.brand}4D`,
                  },
                ]}
              >
                <Ionicons name="lock-closed" size={18} color={colors.brand} />
              </View>
              <View style={styles.menuText}>
                <Text style={[styles.menuTitle, { color: colors.white }]}>
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
                <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>
                  Current password
                </Text>
                <View
                  style={[
                    styles.passwordInputContainer,
                    { backgroundColor: colors.base, borderColor: colors.line },
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
                <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>
                  New password
                </Text>
                <View
                  style={[
                    styles.passwordInputContainer,
                    { backgroundColor: colors.base, borderColor: colors.line },
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
                    <Text style={[styles.eyeText, { color: colors.brand }]}>
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
                    { backgroundColor: colors.base, borderColor: colors.line },
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
                    <Text style={[styles.eyeText, { color: colors.brand }]}>
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
                      backgroundColor: saving ? colors.textDim : colors.brand,
                    },
                  ]}
                  onPress={handlePasswordSubmit}
                  disabled={saving}
                  activeOpacity={0.8}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color={colors.black} />
                  ) : null}
                  <Text style={styles.submitButtonText}>
                    {saving ? "Saving..." : "Update password"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

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
                    backgroundColor: `${colors.brand}1A`,
                    borderColor: `${colors.brand}4D`,
                  },
                ]}
              >
                <Ionicons name="help-circle" size={18} color={colors.brand} />
              </View>
              <View style={styles.menuText}>
                <Text style={[styles.menuTitle, { color: colors.white }]}>
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
                    style={[styles.tipDot, { backgroundColor: colors.brand }]}
                  />
                  <Text style={[styles.tipText, { color: colors.textMuted }]}>
                    {tip}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

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
  scrollContent: { padding: 16, paddingBottom: 32 },
  identitySection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    minWidth: 0,
  },
  avatar: {
    position: "relative",
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#c9a84c26",
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
  themeToggle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
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
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
    marginBottom: 16,
  },
  sessionText: {
    fontSize: 12,
  },
  menuSection: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
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
    backgroundColor: "#f871711a",
    borderColor: "#f871714d",
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
  passwordForm: {
    borderTopWidth: 1,
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
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
  },
});

export default ProfileScreen;
