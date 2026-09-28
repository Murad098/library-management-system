import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DrawerRoute, DRAWER_ROUTES, useDrawer } from "../context/DrawerContext";
import { useAuth } from "../hooks/useAuth";
import { useThemeColors } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { initials } from "../utils/format";

export const DrawerContent: React.FC = () => {
  const { activeRoute, setActiveRoute } = useDrawer();
  const { user, signOut } = useAuth();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();

  const handleNavigate = (route: DrawerRoute) => {
    setActiveRoute(route);
  };

  const handleLogout = () => {
    signOut();
  };

  const userInitials = user ? initials(user.name) : "—";

  return (
    <View style={[styles.container, { backgroundColor: colors.base }]}>
      {/* Header / Logo */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.logoContainer}>
          <Ionicons name="library-outline" size={32} color={colors.accent} />
          <Text style={[styles.logoText, { color: colors.text }]}>
            Library
          </Text>
          <Text style={[styles.logoTextSub, { color: colors.accent }]}>
            {" "}
            Management
          </Text>
        </View>
      </View>

      {/* Menu Title */}
      <Text style={[styles.menuTitle, { color: colors.textMuted }]}>
        {t("menu")}
      </Text>

      {/* Menu Items */}
      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {DRAWER_ROUTES.map((route) => {
          const isActive = activeRoute === route.key;

          return (
            <TouchableOpacity
              key={route.key}
              style={[
                styles.menuItem,
                isActive && { backgroundColor: colors.accent },
              ]}
              onPress={() => handleNavigate(route.key)}
            >
              <Ionicons
                name={isActive ? (route.iconFocused as any) : (route.icon as any)}
                size={22}
                color={isActive ? colors.black : colors.textMuted}
                style={styles.menuIcon}
              />
              <Text
                style={[
                  styles.menuLabel,
                  {
                    color: isActive ? colors.black : colors.text,
                    fontWeight: isActive ? "600" : "400",
                  },
                ]}
              >
                {t(route.labelKey)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <View
        style={[
          styles.footer,
          {
            paddingBottom: insets.bottom + 16,
            borderTopColor: colors.line,
          },
        ]}
      >
        {/* User Info */}
        <View style={styles.userInfo}>
          <View style={[styles.avatar, { backgroundColor: colors.accent + "30" }]}>
            <Text style={[styles.avatarText, { color: colors.accent }]}>
              {userInitials}
            </Text>
          </View>
          <View style={styles.userMeta}>
            <Text style={[styles.userName, { color: colors.text }]}>
              {user?.name || "Guest"}
            </Text>
            <Text style={[styles.userRole, { color: colors.textMuted }]}>
              {user?.role === "manager" ? t("manager") : t("owner")}
            </Text>
          </View>
        </View>

        {/* Log out */}
        <TouchableOpacity
          style={[styles.logoutButton, { borderColor: colors.line }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.text} />
          <Text style={[styles.logoutText, { color: colors.text }]}>
            {t("logout")}
          </Text>
        </TouchableOpacity>

        {/* Branding */}
        <Text style={[styles.poweredBy, { color: colors.textMuted }]}>
          {t("poweredBy")}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "72%",
    maxWidth: 300,
    paddingTop: 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoText: {
    fontSize: 24,
    fontWeight: "700",
    marginLeft: 8,
  },
  logoTextSub: {
    fontSize: 24,
    fontWeight: "700",
  },
  menuTitle: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
    marginBottom: 6,
  },
  menuIcon: {
    marginRight: 14,
  },
  menuLabel: {
    fontSize: 16,
  },
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "700",
  },
  userMeta: {
    marginLeft: 14,
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: "600",
  },
  userRole: {
    fontSize: 13,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 16,
    marginLeft: 12,
  },
  poweredBy: {
    fontSize: 11,
    textAlign: "center",
    opacity: 0.6,
  },
});
