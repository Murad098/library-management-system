import React, { useCallback, useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { Member } from "../types";
import { useThemeColors } from "../context/ThemeContext";
import { getErrorMessage } from "../services/api";
import { getMembers, deleteMember } from "../services/memberService";
import { normalizeMember } from "../utils/normalize";
import MemberListItem from "../components/MemberListItem";
import SectionHeader from "../components/ui/SectionHeader";
import { HamburgerButton } from "../components/HamburgerButton";
import { MembersStackParamList } from "../navigation/MainDrawer";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../hooks/useAuth";

type NavigationProp = NativeStackNavigationProp<
  MembersStackParamList,
  "Members"
>;

const STATUS_FILTERS = ["All", "Paid", "Unpaid"] as const;

const MembersScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const colors = useThemeColors();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadMembers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getMembers();
      setMembers(response.data.map(normalizeMember));
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load members."));
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setError("");

    try {
      const response = await getMembers();
      setMembers(response.data.map(normalizeMember));
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load members."));
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return members.filter((member) => {
      if (statusFilter !== "All" && member.status !== statusFilter.toLowerCase()) {
        return false;
      }

      if (!query) return true;

      return (
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.phone.toLowerCase().includes(query)
      );
    });
  }, [members, search, statusFilter]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setError("");

    try {
      await deleteMember(id);
      setMembers((current) => current.filter((m) => m.id !== id));
    } catch (err) {
      setError(getErrorMessage(err, "Unable to delete member."));
    } finally {
      setDeletingId(null);
    }
  };

  const paidCount = members.filter((m) => m.status === "paid").length;

  const renderItem = ({ item }: { item: Member }) => (
    <MemberListItem
      member={item}
      onDelete={user?.role === "owner" ? handleDelete : undefined}
        onEdit={(member) => navigation.navigate("AddMember", { member })}
      disabled={deletingId === item.id}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.base }]}>
      <SectionHeader
        icon="people"
        leftAction={<HamburgerButton />}
        title={t("members")}
        subtitle={`${members.length} registered • ${paidCount} paid • ${members.length - paidCount} unpaid`}
      />

      <View style={styles.toolbar}>
        <View
          style={[
            styles.searchContainer,
            { backgroundColor: colors.surface, borderColor: colors.line },
          ]}
        >
          <Ionicons
            name="search"
            size={18}
            color={colors.textMuted}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder={`${t("search")} name, email or phone...`}
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoComplete="off"
          />
          {search.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearch("")}
              activeOpacity={0.7}
              hitSlop={8}
            >
              <Ionicons
                name="close-circle"
                size={18}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View
        style={[
          styles.filterContainer,
          { backgroundColor: colors.raised, borderTopColor: colors.lineStrong },
        ]}
      >
        {STATUS_FILTERS.map((filter) => {
          const isActive = statusFilter === filter;

          return (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                isActive
                  ? { backgroundColor: colors.brand }
                  : { borderWidth: 0 },
              ]}
              onPress={() => setStatusFilter(filter)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  {
                    color: isActive ? colors.black : colors.textMuted,
                  },
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

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

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.brand} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>
            Loading members...
          </Text>
        </View>
      ) : members.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View
            style={[
              styles.emptyIcon,
              { backgroundColor: colors.surface, borderColor: colors.line },
            ]}
          >
            <Ionicons name="people-outline" size={32} color={colors.textDim} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.white }]}>
            No members yet
          </Text>
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            Add your first member to start tracking fees.
          </Text>
          <TouchableOpacity
            style={[styles.emptyButton, { backgroundColor: colors.brand }]}
            onPress={() => navigation.navigate("AddMember")}
            activeOpacity={0.8}
          >
            <Text style={styles.emptyButtonText}>Add member</Text>
          </TouchableOpacity>
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
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Ionicons
                name="search-outline"
                size={40}
                color={colors.textDim}
              />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                No members match the current search or filter.
              </Text>
            </View>
          )}
        />
      )}

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.brand }]}
        onPress={() => navigation.navigate("AddMember")}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={24} color={colors.black} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  toolbar: { marginBottom: 12 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 46,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    fontSize: 15,
    height: "100%",
  },
  filterContainer: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 12,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  errorText: { fontSize: 13, flex: 1 },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: { fontSize: 14 },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: { fontSize: 16, fontWeight: "600" },
  emptyText: { fontSize: 13, textAlign: "center" },
  emptyButton: {
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 8,
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000000",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 40,
  },
  listContent: { paddingBottom: 80 },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 90,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
});

export default MembersScreen;
