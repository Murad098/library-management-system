import React from "react";
import { View, ViewStyle } from "react-native";

import { useThemeColors } from "../../context/ThemeContext";

interface ThemedViewProps {
  children?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  padded?: boolean;
  flex?: boolean;
}

export const ThemedView: React.FC<ThemedViewProps> = ({
  children,
  style,
  padded = false,
  flex = false,
}) => {
  const colors = useThemeColors();

  return (
    <View
      style={[
        { backgroundColor: colors.base },
        flex && { flex: 1 },
        padded && { padding: 16 },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default ThemedView;
