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

import { Expense } from "../types";
import { useThemeColors } from "../context/ThemeContext";
import { formatCurrencyPrecise, formatDate } from "../utils/format";

export const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Other",
] as const;

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Food: "restaurant",
  Transport: "bus",
  Shopping: "cart",
  Bills: "receipt",
  Entertainment: "book",
  Other: "pricetag",
};

interface ExpenseListItemProps {
  expense: Expense;
  onDelete?: (id: string) => Promise<void>;
  disabled?: boolean;
}

const ExpenseListItem: React.FC<ExpenseListItemProps> = ({
  expense,
  onDelete,
  disabled = false,
}) => {
  const colors = useThemeColors();

  const handleDelete = () => {
    Alert.alert(`Delete "${expense.title}"?`, "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          if (onDelete) {
            await onDelete(expense.id);
          }
        },
      },
    ]);
  };

  const iconName = CATEGORY_ICONS[expense.category] || CATEGORY_ICONS.Other;

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
            styles.iconWrap,
            {
              backgroundColor: colors.raised,
              borderColor: colors.line,
            },
          ]}
        >
          <Ionicons name={iconName} size={20} color={colors.textMuted} />
        </View>

        <View style={styles.info}>
          <Text style={[styles.title, { color: colors.white }]} numberOfLines={1}>
            {expense.title}
          </Text>
          <View style={styles.metaRow}>
            <View
              style={[
                styles.categoryBadge,
                {
                  backgroundColor: colors.raised,
                  borderColor: colors.lineStrong,
                },
              ]}
            >
              <Text style={[styles.categoryText, { color: colors.textMuted }]}>
                {expense.category}
              </Text>
            </View>
            <Text style={[styles.date, { color: colors.textDim }]}>
              {formatDate(expense.date)}
            </Text>
          </View>
        </View>

        <View style={styles.amountRow}>
          <Text style={[styles.amount, { color: colors.white }]}>
            {formatCurrencyPrecise(expense.amount)}
          </Text>
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "600",
  },
  date: {
    fontSize: 11,
  },
  amountRow: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 13,
    fontWeight: "700",
  },
  deleteButton: {
    marginTop: 4,
    padding: 4,
    minWidth: 36,
    alignItems: "center",
  },
});

export default ExpenseListItem;
