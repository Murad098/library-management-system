import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import { Member, Expense } from "../types";
import { useThemeColors } from "../context/ThemeContext";
import { useDrawer } from "../context/DrawerContext";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  formatCurrency,
  formatDate,
  formatMonthYear,
  initials,
} from "../utils/format";
import { normalizeMember, normalizeExpense } from "../utils/normalize";
import { getMembers } from "../services/memberService";
import { getExpenses } from "../services/expenseService";
import { getErrorMessage } from "../services/api";
import StatCard from "../components/StatCard";
import SectionHeader from "../components/ui/SectionHeader";
import { HamburgerButton } from "../components/HamburgerButton";
import { Ionicons } from "@expo/vector-icons";
import { DashboardStackParamList } from "../navigation/MainDrawer";
import { useLanguage } from "../context/LanguageContext";

type NavigationProp = NativeStackNavigationProp<
  DashboardStackParamList,
  "Dashboard"
>;

interface DashboardState {
  members: Member[];
  expenses: Expense[];
  loading: boolean;
  refreshing: boolean;
  error: string;
}

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const colors = useThemeColors();
  const { t } = useLanguage();
  const TEAL = colors.accent;

  const [state, setState] = useState<DashboardState>({
    members: [],
    expenses: [],
    loading: true,
    refreshing: false,
    error: "",
  });

  const loadData = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: "" }));

    try {
      const [membersResponse, expensesResponse] = await Promise.all([
        getMembers(),
        getExpenses(),
      ]);

      setState((s) => ({
        ...s,
        members: membersResponse.data.map(normalizeMember),
        expenses: expensesResponse.data.map(normalizeExpense),
        loading: false,
      }));
    } catch (err) {
      setState((s) => ({
        ...s,
        loading: false,
        error: getErrorMessage(err, "Unable to load library data."),
      }));
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setState((s) => ({ ...s, refreshing: true, error: "" }));

    try {
      const [membersResponse, expensesResponse] = await Promise.all([
        getMembers(),
        getExpenses(),
      ]);

      setState((s) => ({
        ...s,
        members: membersResponse.data.map(normalizeMember),
        expenses: expensesResponse.data.map(normalizeExpense),
        refreshing: false,
      }));
    } catch (err) {
      setState((s) => ({
        ...s,
        refreshing: false,
        error: getErrorMessage(err, "Unable to load library data."),
      }));
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const { setActiveRoute } = useDrawer();
  const { members, expenses, loading, error } = state;

  const paidMembers = members.filter((m) => m.status === "paid");
  const unpaidMembers = members.filter((m) => m.status !== "paid");

  const expected = members.reduce((sum, m) => sum + m.fee, 0);
  const collected = paidMembers.reduce((sum, m) => sum + m.fee, 0);
  const outstanding = expected - collected;
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const net = collected - totalExpenses;
  const collectionRate =
    expected > 0 ? Math.round((collected / expected) * 100) : 0;

  const comparisonMax = Math.max(collected, totalExpenses, 1);
  const collectedWidth = Math.round((collected / comparisonMax) * 100);
  const expensesWidth = Math.round((totalExpenses / comparisonMax) * 100);

  const recentMembers = members.slice(0, 4);
  const recentExpenses = expenses.slice(0, 4);

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.loadingContainer, { backgroundColor: colors.base }]}
      >
        <ActivityIndicator size="large" color={TEAL} />
        <Text style={[styles.loadingText, { color: colors.textMuted }]}>
          {t("loading")}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.base }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
        <RefreshControl
          refreshing={state.refreshing}
          onRefresh={handleRefresh}
          tintColor={TEAL}
          colors={[TEAL]}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      <SectionHeader
        icon="grid"
        leftAction={<HamburgerButton />}
        title={t("dashboard")}
        subtitle={`Summary for ${formatMonthYear()}`}
        accentColor={TEAL}
        rightContent={
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: TEAL }]}
            onPress={() => navigation.navigate("AddMember")}
            activeOpacity={0.8}
          >
            <Ionicons name="person-add" size={18} color={colors.black} />
            <Text style={[styles.addButtonText, { color: colors.black }]}>{t("addMember")}</Text>
          </TouchableOpacity>
        }
      />

      {error ? (
        <View
          style={[
            styles.errorBox,
            {
              backgroundColor: `${colors.red}1A`,
              borderColor: `${colors.red}4D`,
            },
          ]}
        >
          <Ionicons name="alert-circle" size={16} color={colors.red} />
          <Text style={[styles.errorText, { color: colors.red }]}>
            {error}
          </Text>
          <TouchableOpacity onPress={loadData}>
            <Text style={[styles.retryText, { color: colors.red }]}>
              {t("retry")}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <View style={styles.statsGrid}>
        <StatCard
          label={t("members")}
          value={members.length}
          hint={`${paidMembers.length} paid • ${unpaidMembers.length} unpaid`}
          icon={(props) => <Ionicons name="people" {...props} />}
          tone="default"
        />
        <StatCard
          label={t("feesCollected")}
          value={formatCurrency(collected)}
          hint={`of ${formatCurrency(expected)} expected`}
          icon={(props) => <Ionicons name="wallet" {...props} />}
          tone="green"
        />
        <StatCard
          label={t("outstanding")}
          value={formatCurrency(outstanding)}
          hint={`${unpaidMembers.length} member${
            unpaidMembers.length === 1 ? "" : "s"
          } unpaid`}
          icon={(props) => (
            <Ionicons name="alert-circle" {...props} />
          )}
          tone={outstanding > 0 ? "red" : "green"}
        />
        <StatCard
          label={t("expenses")}
          value={formatCurrency(totalExpenses)}
          hint={`${expenses.length} record${
            expenses.length === 1 ? "" : "s"
          }`}
          icon={(props) => <Ionicons name="receipt-outline" {...props} />}
          tone="default"
        />
      </View>

      <View style={styles.chartRow}>
        <View
          style={[
            styles.chartCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.line,
              shadowColor: TEAL,
            },
          ]}
        >
          <View style={styles.chartHeader}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>
             {t("feeCollection")}
            </Text>
            <Text style={[styles.chartSubtitle, { color: colors.textMuted }]}>
              {t("feeCollectionSubtitle")}
            </Text>
          </View>
          <View style={styles.chartContent}>
            <View style={styles.chartStatRow}>
              <Text style={[styles.chartStatValue, { color: colors.text }]}>
                {collectionRate}%
              </Text>
              <Text
                style={[styles.chartStatHint, { color: colors.textDim }]}
              >
                {formatCurrency(collected)} / {formatCurrency(expected)}
              </Text>
            </View>
            <View
              style={[styles.barContainer, { backgroundColor: colors.raised }]}
            >
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${collectionRate}%`,
                    backgroundColor: TEAL,
                  },
                ]}
              />
            </View>
            <Text
              style={[styles.chartHint, { color: colors.textMuted }]}
            >
              {members.length === 0
                ? t("noMembersYet")
                : `${paidMembers.length} of ${members.length} members have paid.`}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.chartCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.line,
              shadowColor: TEAL,
            },
          ]}
        >
          <View style={styles.chartHeader}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>
              Collected vs expenses
            </Text>
            <Text style={[styles.chartSubtitle, { color: colors.textMuted }]}>
              Fees collected compared with recorded spending
            </Text>
          </View>
          <View style={styles.chartContent}>
            <View style={styles.chartStatRow}>
              <View style={styles.chartStatRowItem}>
                <View style={styles.chartStatLabelRow}>
                  <View style={[styles.dot, { backgroundColor: TEAL }]} />
                  <Text
                    style={[styles.chartStatLabel, { color: colors.textMuted }]}
                  >
                    Collected
                  </Text>
                </View>
                <Text style={[styles.chartStatValue, { color: colors.text }]}>
                  {formatCurrency(collected)}
                </Text>
              </View>
              <View
                style={[styles.barContainer, { backgroundColor: colors.raised }]}
              >
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${collectedWidth}%`,
                      backgroundColor: TEAL,
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.chartStatRow}>
              <View style={styles.chartStatRowItem}>
                <View style={styles.chartStatLabelRow}>
                  <View
                    style={[styles.dot, { backgroundColor: colors.textDim }]}
                  />
                  <Text
                    style={[styles.chartStatLabel, { color: colors.textMuted }]}
                  >
                    Expenses
                  </Text>
                </View>
                <Text style={[styles.chartStatValue, { color: colors.text }]}>
                  {formatCurrency(totalExpenses)}
                </Text>
              </View>
              <View
                style={[styles.barContainer, { backgroundColor: colors.raised }]}
              >
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${expensesWidth}%`,
                      backgroundColor: colors.textDim,
                    },
                  ]}
                />
              </View>
            </View>

            <View style={[styles.netRow, { borderTopColor: colors.line }]}>
              <View style={styles.netLabelRow}>
                <Ionicons name="trending-up" size={16} color={TEAL} />
                <Text style={[styles.netLabel, { color: colors.textMuted }]}>
                  Net
                </Text>
              </View>
              <Text
                style={[
                  styles.netValue,
                  { color: net >= 0 ? colors.green : colors.red },
                ]}
              >
                {formatCurrency(net)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.recentSection}>
        <View style={styles.recentHeader}>
          <View>
            <Text style={[styles.recentTitle, { color: colors.text }]}>
              {t("recentMembers")}
            </Text>
            <Text
              style={[styles.recentSubtitle, { color: colors.textMuted }]}
            >
              Most recently added records
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setActiveRoute("Members")}
            style={styles.viewAllLink}
          >
            <Text style={[styles.viewAllText, { color: TEAL }]}>
              View all
            </Text>
            <Ionicons name="chevron-forward" size={16} color={TEAL} />
          </TouchableOpacity>
        </View>

        {recentMembers.length === 0 ? (
          <View
            style={[
              styles.emptyNote,
              {
                backgroundColor: colors.surface,
                borderColor: colors.line,
              },
            ]}
          >
            <Ionicons
              name="people-outline"
              size={24}
              color={colors.textDim}
            />
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              No members yet.
            </Text>
          </View>
        ) : (
          <View style={styles.recentList}>
            {recentMembers.map((member) => (
              <View
                key={member.id}
                style={[
                  styles.recentMemberRow,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.line,
                  },
                ]}
              >
                <View
                  style={[
                    styles.recentMemberAvatar,
                    {
                      backgroundColor: `${TEAL}26`,
                      borderColor: `${TEAL}4D`,
                    },
                  ]}
                >
                  <Text style={[styles.recentMemberInitial, { color: TEAL }]}>
                    {initials(member.name)}
                  </Text>
                </View>
                <View style={styles.recentMemberInfo}>
                  <Text
                    style={[styles.recentMemberName, { color: colors.text }]}
                    numberOfLines={1}
                  >
                    {member.name}
                  </Text>
                  <Text
                    style={[
                      styles.recentMemberEmail,
                      { color: colors.textMuted },
                    ]}
                    numberOfLines={1}
                  >
                    {member.email}
                  </Text>
                </View>
                <View
                  style={[
                    styles.recentStatusBadge,
                    member.status === "paid"
                      ? {
                          backgroundColor: `${colors.green}1A`,
                          borderColor: `${colors.green}4D`,
                        }
                      : {
                          backgroundColor: `${colors.red}1A`,
                          borderColor: `${colors.red}4D`,
                        },
                  ]}
                >
                  <Text
                    style={[
                      styles.recentStatusText,
                      {
                        color:
                          member.status === "paid"
                            ? colors.green
                            : colors.red,
                      },
                    ]}
                  >
                    {member.status === "paid" ? t("paid") : t("unpaid")}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.recentSection}>
        <View style={styles.recentHeader}>
          <View>
            <Text style={[styles.recentTitle, { color: colors.text }]}>
              {t("recentExpenses")}
            </Text>
            <Text
              style={[styles.recentSubtitle, { color: colors.textMuted }]}
            >
              {t("latestSpending")}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setActiveRoute("Expenses")}
            style={styles.viewAllLink}
          >
            <Text style={[styles.viewAllText, { color: TEAL }]}>
              View all
            </Text>
            <Ionicons name="chevron-forward" size={16} color={TEAL} />
          </TouchableOpacity>
        </View>

        {recentExpenses.length === 0 ? (
          <View
            style={[
              styles.emptyNote,
              {
                backgroundColor: colors.surface,
                borderColor: colors.line,
              },
            ]}
          >
            <Ionicons
              name="receipt-outline"
              size={24}
              color={colors.textDim}
            />
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              {t("noExpensesRecorded")}
            </Text>
          </View>
        ) : (
          <View style={styles.recentList}>
            {recentExpenses.map((expense) => (
              <View
                key={expense.id}
                style={[
                  styles.recentExpenseRow,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.line,
                  },
                ]}
              >
                <View
                  style={[
                    styles.recentExpenseIcon,
                    {
                      backgroundColor: colors.raised,
                      borderColor: colors.line,
                    },
                  ]}
                >
                  <Ionicons
                    name="receipt-outline"
                    size={18}
                    color={TEAL}
                  />
                </View>
                <View style={styles.recentExpenseInfo}>
                  <Text
                    style={[
                      styles.recentExpenseTitle,
                      { color: colors.text },
                    ]}
                    numberOfLines={1}
                  >
                    {expense.title}
                  </Text>
                  <Text
                    style={[
                      styles.recentExpenseMeta,
                      { color: colors.textMuted },
                    ]}
                  >
                    {expense.category} • {formatDate(expense.date)}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.recentExpenseAmount,
                    { color: colors.text },
                  ]}
                >
                  {formatCurrency(expense.amount)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {members.length > 0 && outstanding === 0 ? (
        <View
          style={[
            styles.allCollectedBadge,
            {
              backgroundColor: `${colors.green}1A`,
              borderColor: `${colors.green}4D`,
            },
          ]}
        >
          <Ionicons name="checkmark-circle" size={16} color={colors.green} />
          <Text style={[styles.allCollectedText, { color: colors.green }]}>
            {t("allFeesCollected")}
          </Text>
        </View>
      ) : null}
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: { fontSize: 14 },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "700",
  },
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
  retryText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 14,
  },
  chartRow: {
    flexDirection: "column",
    gap: 12,
    marginBottom: 20,
  },
  chartCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  chartHeader: { marginBottom: 12 },
  chartTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  chartSubtitle: { fontSize: 13, marginTop: 3 },
  chartHint: { fontSize: 12, marginTop: 4 },
  chartContent: { gap: 10 },
  chartStatRow: { gap: 6 },
  chartStatRowItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chartStatLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  chartStatLabel: { fontSize: 12 },
  chartStatValue: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 2,
  },
  chartStatHint: { fontSize: 11, marginTop: 4 },
  barContainer: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 3,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  netRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 8,
  },
  netLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  netLabel: { fontSize: 13 },
  netValue: { fontSize: 16, fontWeight: "700" },
  recentSection: { marginBottom: 20 },
  recentHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 12,
    flexWrap: "wrap",
    gap: 8,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  recentSubtitle: { fontSize: 13 },
  viewAllLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: "600",
  },
  emptyNote: {
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    gap: 8,
  },
  emptyText: { fontSize: 13 },
  recentList: { gap: 10 },
  recentMemberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
  },
  recentMemberAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  recentMemberInitial: {
    fontSize: 13,
    fontWeight: "700",
  },
  recentMemberInfo: { flex: 1, minWidth: 0 },
  recentMemberName: {
    fontSize: 14,
    fontWeight: "600",
  },
  recentMemberEmail: { fontSize: 11 },
  recentStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  recentStatusText: { fontSize: 11, fontWeight: "600" },
  recentExpenseRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
  },
  recentExpenseIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  recentExpenseInfo: { flex: 1, minWidth: 0 },
  recentExpenseTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  recentExpenseMeta: { fontSize: 11 },
  recentExpenseAmount: {
    fontSize: 13,
    fontWeight: "700",
  },
  allCollectedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginTop: 8,
  },
  allCollectedText: { fontSize: 12, fontWeight: "600" },
});

export default DashboardScreen;
