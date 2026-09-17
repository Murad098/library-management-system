import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
} from "react-native";

import { useThemeColors } from "../../context/ThemeContext";

interface SecondaryButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
  size?: "small" | "medium" | "large";
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  title,
  onPress,
  disabled = false,
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
          borderColor: disabled ? colors.textDim : colors.line,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.text,
          { color: colors.text, fontSize: fontSize[size] },
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
    borderWidth: 1,
  },
  text: {
    fontWeight: "600",
  },
});

export default SecondaryButton;
