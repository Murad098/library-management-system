import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { NotificationItem, NotificationType } from "../types";
import { useThemeColors } from "../context/ThemeContext";
import { useLanguage, TranslationKey } from "../context/LanguageContext";
import { formatDate } from "../utils/format";

type TypeMeta = {
  icon: keyof typeof Ionicons.glyphMap;
  colorKey: "sky" | "green" | "amber" | "red";
  bgAlpha: string;
};

const TYPE_META: Record<NotificationType, TypeMeta> = {
  info: {
    icon: "information-circle",
    colorKey: "sky",
    bgAlpha: "1A",
  },
  success: {
    icon: "checkmark-circle",
    colorKey: "green",
    bgAlpha: "1A",
  },
  warning: {
    icon: "warning",
    colorKey: "amber",
    bgAlpha: "1A",
  },
  alert: {
    icon: "alert-circle",
    colorKey: "red",
    bgAlpha: "1A",
  },
};

const TYPE_LABELS: Record<NotificationType, TranslationKey> = {
  info: "typeInfo",
  success: "typeSuccess",
  warning: "typeWarning",
  alert: "typeAlert",
};

interface NotificationListItemProps {
  item: NotificationItem;
  onToggleRead?: (id: string, read: boolean) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  disabled?: boolean;
}

const NotificationListItem: React.FC<NotificationListItemProps> = ({
  item,
  onToggleRead,
  onDelete,
  disabled = false,
}) => {
  const colors = useThemeColors();
  const { t } = useLanguage();

  const meta = TYPE_META[item.type] || TYPE_META.info;
  const color = colors[meta.colorKey];
  const bgColor = `${color}${meta.bgAlpha}`;
  const typeLabel = t(TYPE_LABELS[item.type]);

  const handleToggleRead = () => {
    if (onToggleRead && !disabled) {
      onToggleRead(item._id, !item.read);
    }
  };

  const handleDelete = () => {
    if (disabled) return;

    Alert.alert(`Delete "${item.title}"?`, undefined, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          if (onDelete) {
            await onDelete(item._id);
          }
        },
      },
    ]);
  };

  return (
    <View
      style={[
        styles.container,
        {
           backgroundColor: colors.surface,
          borderColor: colors.accentSoft,
        },
        !item.read && { backgroundColor: colors.accentSoft },
      ]}
    >
      <View
        style={[
          styles.iconWrap,
          { backgroundColor: bgColor, borderColor: `${color}66` },
        ]}
      >
        <Ionicons name={meta.icon} size={20} color={color} />
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text
            style={[styles.title, { color: colors.text }]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          {!item.read && (
            <View style={[styles.unreadDot, { backgroundColor: colors.brand }]} />
          )}
        </View>

        {item.message ? (
          <Text
            style={[styles.message, { color: colors.textMuted }]}
            numberOfLines={3}
          >
            {item.message}
          </Text>
        ) : null}

        <View style={styles.metaRow}>
          <Text style={[styles.meta, { color: colors.textDim }]}>
             {typeLabel} • {formatDate(item.createdAt)}
          </Text>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleToggleRead}
            hitSlop={6}
            disabled={disabled}
            activeOpacity={0.7}
          >
            {disabled ? (
              <ActivityIndicator size="small" color={colors.textDim} />
            ) : (
              <Text style={[styles.actionText, { color: colors.textMuted }]}>
                {item.read ? t("markUnread") : t("markRead")}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {onDelete && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          hitSlop={8}
          disabled={disabled}
          activeOpacity={0.7}
        >
          {disabled ? (
            <ActivityIndicator size="small" color={colors.red} />
          ) : (
            <Ionicons name="trash" size={16} color={colors.red} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    shadowColor: "#000000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
    borderWidth: 1,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  message: {
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 6,
  },
  meta: {
    fontSize: 11,
  },
  actionButton: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  actionText: {
    fontSize: 11,
    fontWeight: "600",
  },
  deleteButton: {
    padding: 4,
    minWidth: 36,
    alignItems: "center",
  },
});

export default NotificationListItem;
