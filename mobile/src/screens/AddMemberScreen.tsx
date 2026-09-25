import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";

import { useThemeColors } from "../context/ThemeContext";
import { getErrorMessage } from "../services/api";
import { addMember, updateMember } from "../services/memberService";
import { useToast } from "../hooks/useToast";
import InputField from "../components/ui/InputField";
import PrimaryButton from "../components/ui/PrimaryButton";
import SecondaryButton from "../components/ui/SecondaryButton";
import SectionHeader from "../components/ui/SectionHeader";
import { HamburgerButton } from "../components/HamburgerButton";
import {
  DashboardStackParamList,
  MembersStackParamList,
} from "../navigation/MainDrawer";
import { useLanguage } from "../context/LanguageContext";

type NavigationProp = NativeStackNavigationProp<
  DashboardStackParamList & MembersStackParamList,
  "AddMember"
>;

const STATUSES = ["paid", "unpaid"] as const;

const AddMemberScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<DashboardStackParamList & MembersStackParamList, "AddMember">>();
  const editing = route.params?.member;
  const colors = useThemeColors();
  const { t } = useLanguage();
  const { Toast, show } = useToast();

  const [name, setName] = useState(editing?.name ?? "");
  const [email, setEmail] = useState(editing?.email ?? "");
  const [phone, setPhone] = useState(editing?.phone ?? "");
  const [fee, setFee] = useState(editing ? String(editing.fee) : "");
  const [status, setStatus] = useState<"paid" | "unpaid">(editing?.status ?? "unpaid");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (isLoading) return;

    if (!name.trim() || !email.trim() || !phone.trim()) {
      show("Name, email and phone are required.", "error");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        fee: Number(fee) || 0,
        status,
      };
      if (editing) await updateMember(editing.id, payload);
      else await addMember(payload);

      show(editing ? "Member updated successfully." : "Member added successfully.", "success");
      navigation.goBack();
    } catch (error) {
      show(getErrorMessage(error, "Unable to add member."), "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
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
            icon="person-add"
            leftAction={<HamburgerButton />}
            title={t("addMember")}
            style={{ marginBottom: 16 }}
          />

          <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.line }]}>
            <InputField
            label="Name"
            placeholder="Enter full name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoComplete="name"
          />

          <InputField
            label={t("emailAddress")}
            placeholder="Enter email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <InputField
            label="Phone"
            placeholder="Enter phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            leftIcon="call-outline"
          />

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.textMuted }]}>
              Monthly Fee
            </Text>
            <View
              style={[
                styles.feeRow,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.line,
                },
              ]}
            >
              <Text style={[styles.feePrefix, { color: colors.textDim }]}>
                PKR
              </Text>
              <TextInput
                style={[
                  styles.feeInput,
                  { color: colors.text },
                ]}
                placeholder="0"
                placeholderTextColor={colors.textMuted}
                value={fee}
                onChangeText={setFee}
                keyboardType="numeric"
                inputMode="numeric"
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.textMuted }]}>
              Fee Status
            </Text>
            <View style={styles.statusRow}>
              {STATUSES.map((s) => {
                const isActive = status === s;
                const isPaid = s === "paid";

                return (
                  <TouchableOpacity
                    key={s}
                    style={[
                      styles.statusButton,
                      {
                        backgroundColor: isPaid
                          ? `${colors.green}1A`
                          : `${colors.red}1A`,
                        borderColor: isActive
                          ? isPaid
                            ? colors.green
                            : colors.red
                          : colors.line,
                      },
                    ]}
                    onPress={() => setStatus(s)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.statusButtonText,
                        {
                          color: isActive
                            ? isPaid
                              ? colors.green
                              : colors.red
                            : colors.textMuted,
                          fontWeight: isActive ? "700" : "600",
                        },
                      ]}
                    >
                      {s === "paid" ? "Paid" : "Unpaid"}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.actions}>
            <SecondaryButton title="Cancel" onPress={handleCancel} />
            <PrimaryButton
              title={editing ? "Update member" : "Add member"}
              onPress={handleSubmit}
              loading={isLoading}
              disabled={isLoading}
            />
          </View>
          </View>
        </View>
      </ScrollView>

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
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  field: { marginBottom: 18 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },
  feeRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 50,
  },
  feePrefix: {
    fontSize: 15,
    fontWeight: "700",
    minWidth: 40,
  },
  feeInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
    height: "100%",
  },
  statusRow: {
    flexDirection: "row",
    gap: 10,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  statusButtonText: {
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
});

export default AddMemberScreen;
