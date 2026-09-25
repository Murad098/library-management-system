import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDrawer } from "../context/DrawerContext";
import { useThemeColors } from "../context/ThemeContext";

export const HamburgerButton: React.FC = () => {
  const { openDrawer } = useDrawer();
  const colors = useThemeColors();

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors.surface, borderColor: colors.line }]}
      onPress={openDrawer}
      accessibilityLabel="Open menu"
      hitSlop={12}
    >
      <Ionicons name="menu" size={24} color={colors.text} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
});
