import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import DashboardScreen from "../screens/DashboardScreen";
import MembersScreen from "../screens/MembersScreen";
import AddMemberScreen from "../screens/AddMemberScreen";
import ExpensesScreen from "../screens/ExpensesScreen";
import AddExpenseScreen from "../screens/AddExpenseScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import ProfileScreen from "../screens/ProfileScreen";

import { useTheme } from "../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

export type MainTabsParamList = {
  DashboardTab: undefined;
  MembersTab: undefined;
  ExpensesTab: undefined;
  NotificationsTab: undefined;
  ProfileTab: undefined;
};

export type DashboardStackParamList = {
  Dashboard: undefined;
  AddMember: undefined;
};

export type MembersStackParamList = {
  Members: undefined;
  AddMember: undefined;
};

export type ExpensesStackParamList = {
  Expenses: undefined;
  AddExpense: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();
const DashboardStack = createNativeStackNavigator<DashboardStackParamList>();
const MembersStack = createNativeStackNavigator<MembersStackParamList>();
const ExpensesStack = createNativeStackNavigator<ExpensesStackParamList>();

const DashboardStackGroup = () => {
  const { theme } = useTheme();
  const c = theme.colors;

  return (
    <DashboardStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: c.surface },
        headerTintColor: c.text,
        headerTitleStyle: { color: c.text, fontWeight: "700", fontSize: 19 },
        contentStyle: { backgroundColor: c.base },
      }}
    >
      <DashboardStack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: "Dashboard" }}
      />
      <DashboardStack.Screen
        name="AddMember"
        component={AddMemberScreen}
        options={{ title: "Add member", presentation: "modal" }}
      />
    </DashboardStack.Navigator>
  );
};

const MembersStackGroup = () => {
  const { theme } = useTheme();
  const c = theme.colors;

  return (
    <MembersStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: c.surface },
        headerTintColor: c.text,
        headerTitleStyle: { color: c.text, fontWeight: "600" },
        contentStyle: { backgroundColor: c.base },
      }}
    >
      <MembersStack.Screen
        name="Members"
        component={MembersScreen}
        options={{ title: "Members" }}
      />
      <MembersStack.Screen
        name="AddMember"
        component={AddMemberScreen}
        options={{ title: "Add member", presentation: "modal" }}
      />
    </MembersStack.Navigator>
  );
};

const ExpensesStackGroup = () => {
  const { theme } = useTheme();
  const c = theme.colors;

  return (
    <ExpensesStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: c.surface },
        headerTintColor: c.text,
        headerTitleStyle: { color: c.text, fontWeight: "600" },
        contentStyle: { backgroundColor: c.base },
      }}
    >
      <ExpensesStack.Screen
        name="Expenses"
        component={ExpensesScreen}
        options={{ title: "Expenses" }}
      />
      <ExpensesStack.Screen
        name="AddExpense"
        component={AddExpenseScreen}
        options={{ title: "Add expense", presentation: "modal" }}
      />
    </ExpensesStack.Navigator>
  );
};

interface TabIconProps {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
}

const TabIcon: React.FC<TabIconProps> = ({ name, color }) => (
  <Ionicons name={name} size={22} color={color} />
);

const MainTabs = () => {
  const { theme } = useTheme();
  const c = theme.colors;

  return (
    <Tab.Navigator
      initialRouteName="DashboardTab"
      screenOptions={{
        tabBarActiveTintColor: c.white,
        tabBarInactiveTintColor: c.textMuted,
        tabBarStyle: {
          backgroundColor: "rgba(18, 21, 31, 0.9)",
          borderTopWidth: 0,
          height: 72,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarItemStyle: {
          borderRadius: 16,
          marginHorizontal: 6,
        },
        tabBarActiveBackgroundColor: `${c.brand}22`,
        headerShown: false,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700" },
      }}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardStackGroup}
        options={{
          tabBarLabel: "Dashboard",
          tabBarIcon: ({ color }) => (
            <TabIcon name="grid" color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MembersTab"
        component={MembersStackGroup}
        options={{
          tabBarLabel: "Members",
          tabBarIcon: ({ color }) => (
            <TabIcon name="people" color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ExpensesTab"
        component={ExpensesStackGroup}
        options={{
          tabBarLabel: "Expenses",
          tabBarIcon: ({ color }) => (
            <TabIcon name="receipt" color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="NotificationsTab"
        component={NotificationsScreen}
        options={{
          tabBarLabel: "Notifications",
          tabBarIcon: ({ color }) => (
            <TabIcon name="notifications" color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => (
            <TabIcon name="person" color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;
