import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { DrawerProvider, useDrawer } from "../context/DrawerContext";
import { DrawerLayout } from "../components/DrawerLayout";
import DashboardScreen from "../screens/DashboardScreen";
import MembersScreen from "../screens/MembersScreen";
import ExpensesScreen from "../screens/ExpensesScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";
import AddMemberScreen from "../screens/AddMemberScreen";
import AddExpenseScreen from "../screens/AddExpenseScreen";
import { Member, Expense } from "../types";

export type DashboardStackParamList = {
  Dashboard: undefined;
  AddMember: { member?: Member } | undefined;
};

export type MembersStackParamList = {
  Members: undefined;
  AddMember: { member?: Member } | undefined;
};

export type ExpensesStackParamList = {
  Expenses: undefined;
  AddExpense: { expense?: Expense } | undefined;
};

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: "transparent" },
  animation: "slide_from_right" as const,
};

const DashboardStack = () => (
  <Stack.Navigator initialRouteName="Dashboard" screenOptions={screenOptions}>
    <Stack.Screen name="Dashboard" component={DashboardScreen} />
    <Stack.Screen
      name="AddMember"
      component={AddMemberScreen}
      options={{ presentation: "modal" }}
    />
  </Stack.Navigator>
);

const MembersStack = () => (
  <Stack.Navigator initialRouteName="Members" screenOptions={screenOptions}>
    <Stack.Screen name="Members" component={MembersScreen} />
    <Stack.Screen
      name="AddMember"
      component={AddMemberScreen}
      options={{ presentation: "modal" }}
    />
  </Stack.Navigator>
);

const ExpensesStack = () => (
  <Stack.Navigator initialRouteName="Expenses" screenOptions={screenOptions}>
    <Stack.Screen name="Expenses" component={ExpensesScreen} />
    <Stack.Screen
      name="AddExpense"
      component={AddExpenseScreen}
      options={{ presentation: "modal" }}
    />
  </Stack.Navigator>
);

const MainContent: React.FC = () => {
  const { activeRoute } = useDrawer();

  const renderScreen = () => {
    switch (activeRoute) {
      case "Members":
        return <MembersStack />;
      case "Expenses":
        return <ExpensesStack />;
      case "Notifications":
        return <NotificationsScreen />;
      case "Profile":
        return <ProfileScreen />;
      case "Settings":
        return <SettingsScreen />;
      case "Dashboard":
      default:
        return <DashboardStack />;
    }
  };

  return <React.Fragment>{renderScreen()}</React.Fragment>;
};

const MainDrawer: React.FC = () => {
  return (
    <DrawerProvider>
      <DrawerLayout>
        <MainContent />
      </DrawerLayout>
    </DrawerProvider>
  );
};

export default MainDrawer;
