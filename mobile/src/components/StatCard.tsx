import React from "react";
import { StyleSheet, View, Text, ViewStyle } from "react-native";

import { useThemeColors } from "../context/ThemeContext";

type Tone = "default" | "brand" | "green" | "red";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon: React.ComponentType<{ color: string; size: number }>;
  tone?: Tone;
  style?: ViewStyle;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
  style,
}) => {
  const colors = useThemeColors();

  const colorMap: Record<Tone, { bg: string; text: string; icon: string }> = {
    default: {
      bg: colors.raised,
      text: colors.textMuted,
      icon: colors.textMuted,
    },
    brand: {
      bg: `${colors.brand}1A`,
      text: colors.brand,
      icon: colors.brand,
    },
    green: {
      bg: `${colors.green}1A`,
      text: colors.green,
      icon: colors.green,
    },
    red: {
      bg: `${colors.red}1A`,
      text: colors.red,
      icon: colors.red,
    },
  };

  const toneStyle = colorMap[tone];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: toneStyle.bg,
          borderColor: colors.line,
        },
        style,
      ]}
    >
      <View style={styles.content}>
        <Text style={[styles.label, { color: colors.textMuted }]}>
          {label}
        </Text>
        <Text style={[styles.value, { color: toneStyle.text }]} numberOfLines={1}>
          {value}
        </Text>
        {hint ? <Text style={[styles.hint, { color: colors.textDim }]}>{hint}</Text> : null}
      </View>
      <View
        style={[styles.iconWrap, { backgroundColor: `${toneStyle.icon}20`, borderColor: `${toneStyle.icon}30` }]}
      >
        <Icon color={toneStyle.icon} size={22} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    padding: 16,
    minHeight: 110,
    borderWidth: 1,
    marginBottom: 0,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 32,
    fontWeight: "800",
    marginTop: 6,
    lineHeight: 34,
  },
  hint: {
    fontSize: 12,
    marginTop: 6,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
    borderWidth: 1,
  },
});

export default StatCard;
