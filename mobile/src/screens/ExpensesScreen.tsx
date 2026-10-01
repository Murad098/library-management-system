import React, { useCallback, useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { Expense } from "../types";
import { useThemeColors } from "../context/ThemeContext";
import { getErrorMessage } from "../services/api";
import { getExpenses, deleteExpense } from "../services/expenseService";
import { normalizeExpense } from "../utils/normalize";
import {
  formatCurrency,
  formatCurrencyPrecise,
  isSameMonth,
  formatMonthYear,
} from "../utils/format";
import SectionHeader from "../components/ui/SectionHeader";
import { HamburgerButton } from "../components/HamburgerButton";
import ExpenseListItem, {
  EXPENSE_CATEGORIES,
} from "../components/ExpenseListItem";
import { ExpensesStackParamList } from "../navigation/MainDrawer";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../hooks/useAuth";

type NavigationProp = NativeStackNavigationProp<
  ExpensesStackParamList,
  "Expenses"
>;

const ALL_EXPENSES = "All";
const THIS_MONTH = "This month";
const FILTERS = [ALL_EXPENSES, THIS_MONTH, ...EXPENSE_CATEGORIES];

const ExpensesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const colors = useThemeColors();
  const { t } = useLanguage();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const fabBottom = 24 + insets.bottom;
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState(ALL_EXPENSES);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filterLabel = (f: string) => {
    if (f === ALL_EXPENSES) return t("all");
    if (f === THIS_MONTH) return t("thisMonth");
    return f;
  };

  const loadExpenses = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getExpenses();
      setExpenses(response.data.map(normalizeExpense));
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load expenses."));
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setError("");

    try {
      const response = await getExpenses();
      setExpenses(response.data.map(normalizeExpense));
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load expenses."));
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteExpense(id);
      setExpenses((current) => current.filter((e) => e.id !== id));
    } catch (err) {
      setError(getErrorMessage(err, "Unable to delete expense."));
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = useMemo(() => {
    return expenses.filter((expense) => {
      if (filter === THIS_MONTH) {
        return isSameMonth(expense.date);
      }

      if (filter !== ALL_EXPENSES) {
        return expense.category === filter;
      }

      return true;
    });
  }, [expenses, filter]);

  const thisMonthExpenses = useMemo(
    () => expenses.filter((e) => isSameMonth(e.date)),
    [expenses]
  );

  const thisMonthTotal = thisMonthExpenses.reduce(
    (sum, e) => sum + e.amount,
    0
  );
  const allTimeTotal = expenses.reduce((sum, e) => sum + e.amount, 0);

  const handleClearFilter = () => setFilter(ALL_EXPENSES);

  const renderItem = ({ item }: { item: Expense }) => (
    <ExpenseListItem
      expense={item}
      onDelete={user?.role === "owner" ? handleDelete : undefined}
      onEdit={(expense) => navigation.navigate("AddExpense", { expense })}
      disabled={deletingId === item.id}
    />
  );

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.loadingContainer, { backgroundColor: colors.base }]}
      >
        <ActivityIndicator size="large" color={colors.brand} />
        <Text style={[styles.loadingText, { color: colors.textMuted }]}>
          {t("loading")}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.base }]}>
      <SectionHeader
        icon="receipt"
        leftAction={<HamburgerButton />}
        title={t("expenses")}
        subtitle={`${expenses.length} record${expenses.length === 1 ? "" : "s"}`}
        accentColor={colors.accent}
      />

      {error ? (
        <View
          style={[
            styles.errorBox,
            { backgroundColor: `${colors.red}1A`, borderColor: `${colors.red}4D` },
          ]}
        >
          <Ionicons name="alert-circle" size={16} color={colors.red} />
          <Text style={[styles.errorText, { color: colors.red }]}>{error}</Text>
        </View>
      ) : null}

      <View
        style={[
          styles.summaryCard,
          {
            backgroundColor: colors.surface,
            borderColor: `${colors.accent}66`,
            shadowColor: colors.accent,
          },
        ]}
      >
        <View>
          <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>
            {t("thisMonth")}
          </Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>
            {formatCurrency(thisMonthTotal)}
          </Text>
        </View>
        <View style={[styles.summaryDivider, { backgroundColor: colors.line }]} />
        <View>
          <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>
            {t("allTime")}
          </Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>
            {formatCurrency(allTimeTotal)}
          </Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {FILTERS.map((f) => {
            const isActive = filter === f;

            return (
              <TouchableOpacity
                key={f}
                style={[
                  styles.filterChip,
                  isActive
                    ? { backgroundColor: colors.brand, borderColor: colors.brand }
                    : { backgroundColor: colors.raised, borderColor: colors.line },
                ]}
                onPress={() => setFilter(f)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    { color: isActive ? colors.black : colors.textMuted },
                  ]}
                >
                  {filterLabel(f)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {filtered.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={48} color={colors.textDim} />
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
             {t("noResults")}
          </Text>
          {filter !== ALL_EXPENSES && (
            <TouchableOpacity onPress={handleClearFilter} activeOpacity={0.7}>
              <Text style={[styles.clearFilterText, { color: colors.brand }]}>
                {t("clearFilter")}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
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

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.brand, bottom: fabBottom }]}
        onPress={() => navigation.navigate("AddExpense")}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={24} color={colors.black} />
      </TouchableOpacity>
    </SafeAreaView>
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
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  errorText: { fontSize: 13, flex: 1 },
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 12,
    marginBottom: 16,
    shadowOpacity: 0.14,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  summaryLabel: { fontSize: 12, textTransform: "uppercase", fontWeight: "700" },
  summaryValue: { fontSize: 22, fontWeight: "700", marginTop: 2 },
  summaryDivider: {
    width: 1,
    height: "60%",
    alignSelf: "center",
  },
  filterContainer: { marginBottom: 12 },
  filterScroll: { gap: 8, paddingVertical: 4 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emptyText: { fontSize: 13, textAlign: "center" },
  clearFilterText: { fontSize: 13, fontWeight: "600", marginTop: 8 },
  listContent: { paddingBottom: 80 },
  fab: {
    position: "absolute",
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
});

export default ExpensesScreen;
