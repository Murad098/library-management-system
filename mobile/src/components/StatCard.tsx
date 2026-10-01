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
    borderRadius: 14,
    padding: 12,
    minHeight: 80,
    borderWidth: 1,
    marginBottom: 0,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 24,
    fontWeight: "800",
    marginTop: 4,
    lineHeight: 28,
  },
  hint: {
    fontSize: 11,
    marginTop: 4,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    borderWidth: 1,
  },
});

export default StatCard;
