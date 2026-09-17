import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";

import { useThemeColors } from "../../context/ThemeContext";

interface CardProps {
  children?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  padding?: number;
  borderRadius?: number;
  bordered?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = 16,
  borderRadius = 16,
  bordered = true,
}) => {
  const colors = useThemeColors();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: bordered ? colors.line : "transparent",
          borderRadius,
          padding,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
});

export default Card;
