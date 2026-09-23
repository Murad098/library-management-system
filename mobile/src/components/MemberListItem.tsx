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

import { Member } from "../types";
import { useThemeColors } from "../context/ThemeContext";
import { formatCurrency, formatDate, initials } from "../utils/format";

interface MemberListItemProps {
  member: Member;
  onDelete?: (id: string) => Promise<void>;
  disabled?: boolean;
}

const StatusBadge: React.FC<{ isPaid: boolean; colors: any }> = ({
  isPaid,
  colors,
}) => (
  <View
    style={[
      styles.statusBadge,
      {
        backgroundColor: isPaid ? `${colors.green}1A` : `${colors.red}1A`,
        borderColor: isPaid ? `${colors.green}4D` : `${colors.red}4D`,
      },
    ]}
  >
    <View
      style={[
        styles.statusDot,
        { backgroundColor: isPaid ? colors.green : colors.red },
      ]}
    />
    <Text
      style={[
        styles.statusText,
        { color: isPaid ? colors.green : colors.red },
      ]}
    >
      {isPaid ? "Paid" : "Unpaid"}
    </Text>
  </View>
);

const MemberListItem: React.FC<MemberListItemProps> = ({
  member,
  onDelete,
  disabled = false,
}) => {
  const colors = useThemeColors();

  const handleDelete = () => {
    Alert.alert(`Delete ${member.name}?`, "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          if (onDelete) {
            await onDelete(member.id);
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
          borderColor: colors.line,
        },
      ]}
    >
      <View style={styles.row}>
        <View
          style={[
            styles.avatar,
            {
              backgroundColor: `${colors.brand}26`,
              borderColor: `${colors.brand}4D`,
            },
          ]}
        >
          <Text style={[styles.avatarText, { color: colors.brand }]}>
            {initials(member.name)}
          </Text>
        </View>

        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.white }]} numberOfLines={1}>
            {member.name}
          </Text>
          <Text style={[styles.email, { color: colors.textMuted }]} numberOfLines={1}>
            {member.email}
          </Text>
        </View>

        <StatusBadge isPaid={member.status === "paid"} colors={colors} />
      </View>

      <View style={styles.rowBottom}>
        <View style={styles.rowDetails}>
          <Text style={[styles.phone, { color: colors.textMuted }]}>
            {member.phone || "—"}
          </Text>
          <Text style={[styles.joined, { color: colors.textDim }]}>
            Joined {formatDate(member.createdAt)}
          </Text>
        </View>
        <Text style={[styles.fee, { color: colors.white }]}>
          {formatCurrency(member.fee)}
        </Text>
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
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: "#000000",
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  avatarText: {
    fontSize: 13,
    fontWeight: "700",
  },
  info: {
    flex: 1,
    marginLeft: 10,
    minWidth: 0,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
  },
  email: {
    fontSize: 12,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  rowBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  rowDetails: {
    flex: 1,
  },
  phone: {
    fontSize: 13,
  },
  joined: {
    fontSize: 11,
    marginTop: 2,
  },
  fee: {
    fontSize: 15,
    fontWeight: "700",
  },
  deleteButton: {
    alignSelf: "flex-end",
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 50,
    alignItems: "center",
  },
});

export default MemberListItem;
