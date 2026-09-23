import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useThemeColors } from "../../context/ThemeContext";

export type SectionHeaderIcon = keyof typeof Ionicons.glyphMap;

interface SectionHeaderProps {
  icon: SectionHeaderIcon;
  title: string;
  subtitle?: string;
  rightContent?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  accentColor?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon,
  title,
  subtitle,
  rightContent,
  style,
  titleStyle,
  subtitleStyle,
  accentColor,
}) => {
  const colors = useThemeColors();
  const accent = accentColor ?? colors.brand;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftContent}>
        <View
          style={[
            styles.iconWrap,
            {
              backgroundColor: `${accent}26`,
              borderColor: `${accent}4D`,
            },
          ]}
        >
          <Ionicons name={icon} size={20} color={accent} />
        </View>
        <View style={styles.textGroup}>
          <Text
            style={[
              styles.title,
              { color: colors.white },
              titleStyle,
            ]}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text
              style={[
                styles.subtitle,
                { color: colors.textMuted },
                subtitleStyle,
              ]}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
      {rightContent ? (
        <View style={styles.rightContent}>{rightContent}</View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    flexWrap: "wrap",
    gap: 12,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flex: 0,
  },
  textGroup: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 25,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});

export default SectionHeader;
