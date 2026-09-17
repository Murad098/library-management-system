import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
} from "react-native";

import { useThemeColors } from "../../context/ThemeContext";
import { initials } from "../../utils/format";

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: number;
  loading?: boolean;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  name = "",
  size = 44,
  loading = false,
  style,
}) => {
  const colors = useThemeColors();

  const containerStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  return (
    <View
      style={[
        styles.container,
        containerStyle,
        {
          backgroundColor: `${colors.brand}26`,
          borderColor: `${colors.brand}4D`,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.brand} />
      ) : uri ? (
        <Image
          source={{ uri }}
          style={{ width: "100%", height: "100%", borderRadius: size / 2 }}
        />
      ) : (
        <Text style={[styles.initials, { fontSize: size * 0.34, color: colors.brand }]}>
          {initials(name)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    overflow: "hidden",
  },
  initials: {
    fontWeight: "700",
  },
});

export default Avatar;
