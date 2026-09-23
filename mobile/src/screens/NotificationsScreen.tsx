import React, { useCallback, useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { NotificationItem, NotificationType } from "../types";
import { useThemeColors } from "../context/ThemeContext";
import { getErrorMessage } from "../services/api";
import {
  getNotifications,
  addNotification,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "../services/notificationService";
import NotificationListItem from "../components/NotificationListItem";
import PrimaryButton from "../components/ui/PrimaryButton";
import SectionHeader from "../components/ui/SectionHeader";
import { useToast } from "../hooks/useToast";

const NOTIFICATION_TYPES: NotificationType[] = ["info", "success", "warning", "alert"];

const typeLabels: Record<NotificationType, string> = {
  info: "Info",
  success: "Success",
  warning: "Warning",
  alert: "Alert",
};

const typeColors: Record<NotificationType, string> = {
  info: "#06b6d4",
  success: "#22c58e",
  warning: "#f59e0b",
  alert: "#f87171",
};

const NotificationsScreen: React.FC = () => {
  const colors = useThemeColors();
  const { Toast, show } = useToast();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [formTitle, setFormTitle] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formType, setFormType] = useState<NotificationType>("info");
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getNotifications();
      const data = response.data;

      const sorted = (data.notifications || []).sort(
        (a: NotificationItem, b: NotificationItem) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setNotifications(sorted);
      setUnreadCount(data.unread || 0);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load notifications."));
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setError("");

    try {
      const response = await getNotifications();
      const data = response.data;

      const sorted = (data.notifications || []).sort(
        (a: NotificationItem, b: NotificationItem) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setNotifications(sorted);
      setUnreadCount(data.unread || 0);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load notifications."));
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleAddNotification = async () => {
    if (submitting) return;

    if (!formTitle.trim()) {
      show("Notification title is required.", "error");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await addNotification({
        title: formTitle.trim(),
        message: formMessage.trim(),
        type: formType,
      });

      const newNotification: NotificationItem = {
        _id: response.data._id,
        title: response.data.title,
        message: response.data.message || "",
        type: response.data.type,
        read: response.data.read || false,
        createdAt: response.data.createdAt,
      };

      setNotifications((current) => [newNotification, ...current]);
      setUnreadCount((c) => c + (newNotification.read ? 0 : 1));
      setFormTitle("");
      setFormMessage("");
    } catch (err) {
      show(getErrorMessage(err, "Unable to add notification."), "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleRead = async (id: string, read: boolean) => {
    try {
      await markNotificationRead(id, !read);
      setNotifications((current) =>
        current.map((n) => (n._id === id ? { ...n, read: !read } : n))
      );

      if (!read) {
        setUnreadCount((c) => Math.max(0, c - 1));
      } else {
        setUnreadCount((c) => c + 1);
      }
    } catch (err) {
      setError(getErrorMessage(err, "Unable to update notification."));
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((current) =>
        current.map((n) => ({ ...n, read: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to mark notifications read."));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications((current) => {
        const deleted = current.find((n) => n._id === id);

        setUnreadCount((c) =>
          deleted && !deleted.read ? c - 1 : c
        );
        return current.filter((n) => n._id !== id);
      });
    } catch (err) {
      setError(getErrorMessage(err, "Unable to delete notification."));
    }
  };

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <NotificationListItem
      item={item}
      onToggleRead={handleToggleRead}
      onDelete={handleDelete}
    />
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.base }]}>
        <ActivityIndicator size="large" color={colors.brand} />
        <Text style={[styles.loadingText, { color: colors.textMuted }]}>
          Loading notifications...
        </Text>
        <Toast />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.base }]}>
      <SectionHeader
        icon="notifications"
        title="Notifications"
        subtitle={`${unreadCount} unread of ${notifications.length} total`}
        accentColor={colors.accent}
        rightContent={
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={[
                styles.headerButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: `${colors.accent}66`,
                  opacity: unreadCount === 0 ? 0.4 : 1,
                },
              ]}
              onPress={handleMarkAllRead}
              activeOpacity={0.7}
              disabled={unreadCount === 0}
            >
              <Ionicons
                name="checkmark-done"
                size={18}
                color={unreadCount > 0 ? colors.brand : colors.textDim}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.headerButton,
                { backgroundColor: colors.surface, borderColor: `${colors.accent}66` },
              ]}
              onPress={handleRefresh}
              activeOpacity={0.7}
            >
              <Ionicons name="refresh" size={18} color={colors.brand} />
            </TouchableOpacity>
          </View>
        }
      />

      {error ? (
        <View
          style={[
            styles.errorBox,
            { backgroundColor: `${colors.red}1A`, borderColor: `${colors.red}4D` },
          ]}
        >
          <Ionicons name="alert-circle" size={16} color={colors.red} />
          <Text style={[styles.errorText, { color: colors.red }]}>
            {error}
          </Text>
        </View>
      ) : null}

      <View
        style={[
          styles.formCard,
          {
            backgroundColor: colors.surface,
            borderColor: `${colors.accent}66`,
            shadowColor: colors.accent,
          },
        ]}
      >
        <Text style={[styles.formLabel, { color: colors.textMuted }]}>
          New notification
        </Text>

        <View style={styles.formField}>
          <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>
            Title
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.base,
                color: colors.text,
                borderColor: colors.line,
              },
            ]}
            placeholder="Notification title"
            placeholderTextColor={colors.textMuted}
            value={formTitle}
            onChangeText={setFormTitle}
            autoCapitalize="sentences"
          />
        </View>

        <View style={styles.formField}>
          <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>
            Type
          </Text>
          <TouchableOpacity
            style={[
              styles.categoryButton,
              {
                backgroundColor: colors.base,
                borderColor: colors.line,
              },
            ]}
            onPress={() => setShowTypePicker(true)}
            activeOpacity={0.7}
          >
            <Text style={[styles.categoryButtonText, { color: typeColors[formType] }]}>
              {typeLabels[formType]}
            </Text>
            <Ionicons
              name="chevron-down"
              size={18}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.formField}>
          <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>
            Message (optional)
          </Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              {
                backgroundColor: colors.base,
                color: colors.text,
                borderColor: colors.line,
              },
            ]}
            placeholder="Notification message..."
            placeholderTextColor={colors.textMuted}
            value={formMessage}
            onChangeText={setFormMessage}
            autoCapitalize="sentences"
            multiline
            numberOfLines={3}
          />
        </View>

        <PrimaryButton
          title="Add notification"
          onPress={handleAddNotification}
          loading={submitting}
          disabled={submitting}
        />
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="notifications-outline"
            size={48}
            color={colors.textDim}
          />
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            No notifications yet.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.brand}
              colors={[colors.brand]}
            />
          }
        />
      )}

      <Modal
        visible={showTypePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTypePicker(false)}
      >
        <TouchableOpacity
          style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}
          activeOpacity={1}
          onPress={() => setShowTypePicker(false)}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.surface, borderColor: colors.line },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.textMuted }]}>
              Select type
            </Text>
            {NOTIFICATION_TYPES.map((t) => {
              const isSelected = formType === t;

              return (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.modalOption,
                    isSelected && { backgroundColor: `${colors.brand}26` },
                  ]}
                  onPress={() => {
                    setFormType(t);
                    setShowTypePicker(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      { color: isSelected ? colors.brand : colors.text },
                    ]}
                  >
                    {typeLabels[t]}
                  </Text>
                  {isSelected && (
                    <Ionicons
                      name="checkmark"
                      size={16}
                      color={colors.brand}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>

      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: { fontSize: 14 },
  headerButtons: {
    flexDirection: "row",
    gap: 6,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  errorText: { fontSize: 13, flex: 1 },
  formCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  formField: { marginBottom: 16 },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
  },
  textArea: {
    minHeight: 72,
    textAlignVertical: "top",
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  categoryButtonText: {
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emptyText: { fontSize: 14, textAlign: "center" },
  listContent: { paddingBottom: 80 },
  modalOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    width: "80%",
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  modalTitle: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  modalOptionText: {
    fontSize: 15,
  },
});

export default NotificationsScreen;
