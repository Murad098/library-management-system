import React from "react";
import { Text, TextStyle } from "react-native";

import { useThemeColors } from "../../context/ThemeContext";

export type TextVariant =
  | "title"
  | "subtitle"
  | "body"
  | "caption"
  | "dim"
  | "label"
  | "button"
  | "overline";

const variantStyles: Record<TextVariant, TextStyle> = {
  title: { fontSize: 26, fontWeight: "700" },
  subtitle: { fontSize: 14, fontWeight: "400" },
  body: { fontSize: 15, fontWeight: "400" },
  caption: { fontSize: 13, fontWeight: "400" },
  dim: { fontSize: 12, fontWeight: "400" },
  label: { fontSize: 13, fontWeight: "600" },
  button: { fontSize: 15, fontWeight: "600" },
  overline: { fontSize: 10, fontWeight: "700", letterSpacing: 0.5 },
};

interface ThemedTextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  style?: TextStyle | TextStyle[];
  color?: "default" | "muted" | "dim" | "brand" | "white" | "error";
  align?: "left" | "center" | "right";
  numberOfLines?: number;
}

export const ThemedText: React.FC<ThemedTextProps> = ({
  children,
  variant = "body",
  style,
  color = "default",
  align = "left",
  numberOfLines,
}) => {
  const colors = useThemeColors();

  const colorMap: Record<string, string> = {
    default: colors.text,
    muted: colors.textMuted,
    dim: colors.textDim,
    brand: colors.brand,
    white: colors.white,
    error: colors.red,
  };

  const textColor = colorMap[color] || colors.text;

  return (
    <Text
      style={[variantStyles[variant], { color: textColor, textAlign: align }, style]}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
};

export default ThemedText;
