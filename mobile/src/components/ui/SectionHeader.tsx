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
  leftAction?: React.ReactNode;
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
  leftAction,
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
      {leftAction ? <View style={styles.leftActionWrap}>{leftAction}</View> : null}
      <View style={styles.leftContent}>
        <View style={styles.iconWrap}>
          <Ionicons name={icon} size={23} color={accent} />
        </View>
        <View style={styles.textGroup}>
          <Text
            style={[
              styles.title,
              { color: colors.text },
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
    marginBottom: 18,
    flexWrap: "wrap",
    gap: 12,
  },
  leftActionWrap: {
    marginRight: 8,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconWrap: {
    width: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
    flex: 0,
  },
  textGroup: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 29,
    fontWeight: "800",
    lineHeight: 33,
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
