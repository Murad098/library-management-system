import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useThemeColors } from "../../context/ThemeContext";

export type StatusVariant =
  | "paid"
  | "unpaid"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "brand";

interface StatusBadgeProps {
  label: string;
  variant: StatusVariant;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  variant,
  icon,
  style,
}) => {
  const colors = useThemeColors();

  const variantConfig: Record<
    StatusVariant,
    { bg: string; text: string; border: string }
  > = {
    paid: {
      bg: `${colors.green}1A`,
      text: colors.green,
      border: `${colors.green}4D`,
    },
    unpaid: {
      bg: `${colors.red}1A`,
      text: colors.red,
      border: `${colors.red}4D`,
    },
    success: {
      bg: `${colors.green}1A`,
      text: colors.green,
      border: `${colors.green}4D`,
    },
    warning: {
      bg: `${colors.amber}1A`,
      text: colors.amber,
      border: `${colors.amber}4D`,
    },
    error: {
      bg: `${colors.red}1A`,
      text: colors.red,
      border: `${colors.red}4D`,
    },
    info: {
      bg: `${colors.sky}1A`,
      text: colors.sky,
      border: `${colors.sky}4D`,
    },
    brand: {
      bg: `${colors.brand}1A`,
      text: colors.brand,
      border: `${colors.brand}4D`,
    },
  };

  const cfg = variantConfig[variant];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: cfg.bg,
          borderColor: cfg.border,
        },
        style,
      ]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={10}
          color={cfg.text}
          style={styles.icon}
        />
      )}
      <Text style={[styles.text, { color: cfg.text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  icon: {
    marginRight: 2,
  },
  text: {
    fontSize: 11,
    fontWeight: "600",
  },
});

export default StatusBadge;
