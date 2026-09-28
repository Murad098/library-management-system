import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { useThemeColors } from "../context/ThemeContext";
import { getErrorMessage } from "../services/api";
import { addExpense, updateExpense } from "../services/expenseService";
import { useToast } from "../hooks/useToast";
import InputField from "../components/ui/InputField";
import PrimaryButton from "../components/ui/PrimaryButton";
import SecondaryButton from "../components/ui/SecondaryButton";
import SectionHeader from "../components/ui/SectionHeader";
import { HamburgerButton } from "../components/HamburgerButton";
import { ExpensesStackParamList } from "../navigation/MainDrawer";
import { EXPENSE_CATEGORIES } from "../components/ExpenseListItem";
import { toDateInputValue } from "../utils/format";
import { useLanguage } from "../context/LanguageContext";

type NavigationProp = NativeStackNavigationProp<
  ExpensesStackParamList,
  "AddExpense"
>;

const AddExpenseScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<ExpensesStackParamList, "AddExpense">>();
  const editing = route.params?.expense;
  const colors = useThemeColors();
  const { t } = useLanguage();
  const { Toast, show } = useToast();

  const [title, setTitle] = useState(editing?.title ?? "");
  const [amount, setAmount] = useState(editing ? String(editing.amount) : "");
  const [date, setDate] = useState(editing?.date ? toDateInputValue(new Date(editing.date)) : toDateInputValue(new Date()));
  const [category, setCategory] = useState<typeof EXPENSE_CATEGORIES[number]>(
    () => editing?.category as typeof EXPENSE_CATEGORIES[number] || EXPENSE_CATEGORIES[0]
  );
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (isLoading) return;

    if (!title.trim()) {
      show("Expense title is required.", "error");
      return;
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      show("Amount must be greater than zero.", "error");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        title: title.trim(),
        amount: numericAmount,
        category,
        date,
      };
      if (editing) await updateExpense(editing.id, payload);
      else await addExpense(payload);

      show(editing ? "Expense updated successfully." : "Expense added successfully.", "success");
      navigation.goBack();
    } catch (error) {
      show(getErrorMessage(error, "Unable to add expense."), "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleCategorySelect = (selected: string) => {
    setCategory(selected as typeof EXPENSE_CATEGORIES[number]);
    setShowCategoryPicker(false);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.base }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <SectionHeader
            icon="receipt"
            leftAction={<HamburgerButton />}
            title={t("addExpense")}
            style={{ marginBottom: 16 }}
          />

          <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.line }]}>
            <InputField
            label={t("title")}
            placeholder="What was this expense for?"
            value={title}
            onChangeText={setTitle}
            autoCapitalize="sentences"
          />

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.textMuted }]}>
              {t("amount")}
            </Text>
            <View
              style={[
                styles.amountRow,
                { backgroundColor: colors.surface, borderColor: colors.line },
              ]}
            >
              <Text style={[styles.amountPrefix, { color: colors.textDim }]}>
                PKR
              </Text>
              <TextInput
                style={[
                  styles.amountInput,
                  { color: colors.text },
                ]}
                placeholder="0.00"
                placeholderTextColor={colors.textMuted}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                inputMode="decimal"
              />
            </View>
          </View>

          <InputField
            label="Date"
            placeholder="YYYY-MM-DD"
            value={date}
            onChangeText={setDate}
            autoCapitalize="none"
            leftIcon="calendar-outline"
          />

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.textMuted }]}>
              {t("category")}
            </Text>
            <TouchableOpacity
              style={[
                styles.categoryButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.line,
                },
              ]}
              onPress={() => setShowCategoryPicker(true)}
              activeOpacity={0.7}
            >
              <Text style={[styles.categoryButtonText, { color: colors.text }]}>
                {category}
              </Text>
              <Ionicons
                name="chevron-down"
                size={18}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.actions}>
            <SecondaryButton title="Cancel" onPress={handleCancel} />
            <PrimaryButton
              title={editing ? "Update expense" : "Add expense"}
              onPress={handleSubmit}
              loading={isLoading}
              disabled={isLoading}
            />
          </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showCategoryPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCategoryPicker(false)}
      >
        <TouchableOpacity
          style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}
          activeOpacity={1}
          onPress={() => setShowCategoryPicker(false)}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.surface, borderColor: colors.line },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.textMuted }]}>
              Select category
            </Text>
            <FlatList
              data={EXPENSE_CATEGORIES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const isSelected = category === item;

                return (
                  <TouchableOpacity
                    style={[
                      styles.modalOption,
                      isSelected && { backgroundColor: `${colors.brand}26` },
                    ]}
                    onPress={() => handleCategorySelect(item)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        {
                          color: isSelected ? colors.brand : colors.text,
                          fontWeight: isSelected ? "700" : "600",
                        },
                      ]}
                    >
                      {item}
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
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      <Toast />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  container: { paddingBottom: 24 },
  formCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  field: { marginBottom: 16 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 52,
  },
  amountPrefix: {
    fontSize: 15,
    fontWeight: "700",
    minWidth: 44,
  },
  amountInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
    height: "100%",
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  categoryButtonText: {
    fontSize: 16,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    width: "80%",
    maxHeight: 320,
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

export default AddExpenseScreen;
