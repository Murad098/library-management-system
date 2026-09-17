import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  GestureResponderEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useThemeColors } from "../../context/ThemeContext";

export type IconName = keyof typeof Ionicons.glyphMap;

interface IconButtonProps {
  name: IconName;
  size?: number;
  color?: string;
  onPress: (event: GestureResponderEvent) => void;
  style?: ViewStyle | ViewStyle[];
  hitSlop?: number;
  disabled?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  name,
  size = 20,
  color,
  onPress,
  style,
  hitSlop = 8,
  disabled = false,
}) => {
  const colors = useThemeColors();

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: "transparent" }, style]}
      onPress={onPress}
      hitSlop={hitSlop}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Ionicons
        name={name}
        size={size}
        color={color || colors.textMuted}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default IconButton;
