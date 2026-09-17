import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  GestureResponderEvent,
} from "react-native";

import { useThemeColors } from "../../context/ThemeContext";

interface PrimaryButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
  size?: "small" | "medium" | "large";
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  style,
  textStyle,
  size = "medium",
}) => {
  const colors = useThemeColors();

  const sizeStyles: Record<string, ViewStyle> = {
    small: { paddingVertical: 8 },
    medium: { paddingVertical: 14 },
    large: { paddingVertical: 18 },
  };

  const fontSize: Record<string, number> = {
    small: 13,
    medium: 15,
    large: 17,
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        sizeStyles[size],
        {
          backgroundColor: disabled || loading ? colors.textDim : colors.brand,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={colors.black}
          style={styles.loading}
        />
      ) : null}
      <Text
        style={[
          styles.text,
          { color: colors.black, fontSize: fontSize[size] },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  text: {
    fontWeight: "700",
  },
  loading: {
    marginRight: 4,
  },
});

export default PrimaryButton;
