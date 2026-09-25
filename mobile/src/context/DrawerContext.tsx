import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

import { TranslationKey } from "./LanguageContext";

export type DrawerRoute =
  | "Dashboard"
  | "Members"
  | "Expenses"
  | "Notifications"
  | "Profile"
  | "Settings";

export const DRAWER_ROUTES: {
  key: DrawerRoute;
  labelKey: TranslationKey;
  icon: string;
  iconFocused: string;
}[] = [
  { key: "Dashboard", labelKey: "dashboard", icon: "home-outline", iconFocused: "home" },
  { key: "Members", labelKey: "members", icon: "people-outline", iconFocused: "people" },
  { key: "Expenses", labelKey: "expenses", icon: "wallet-outline", iconFocused: "wallet" },
  { key: "Notifications", labelKey: "notifications", icon: "notifications-outline", iconFocused: "notifications" },
  { key: "Profile", labelKey: "profile", icon: "person-outline", iconFocused: "person" },
  { key: "Settings", labelKey: "settings", icon: "settings-outline", iconFocused: "settings" },
];

interface DrawerContextValue {
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  activeRoute: DrawerRoute;
  setActiveRoute: (route: DrawerRoute) => void;
}

const DrawerContext = createContext<DrawerContextValue | undefined>(
  undefined,
);

export const useDrawer = () => {
  const ctx = useContext(DrawerContext);

  if (!ctx) {
    throw new Error("useDrawer must be used within a DrawerProvider");
  }

  return ctx;
};

export const DrawerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeRoute, setActiveRouteState] = useState<DrawerRoute>(
    "Dashboard",
  );

  const openDrawer = useCallback(() => setIsOpen(true), []);
  const closeDrawer = useCallback(() => setIsOpen(false), []);
  const toggleDrawer = useCallback(() => setIsOpen((v) => !v), []);
  const setActiveRoute = useCallback((route: DrawerRoute) => {
    setActiveRouteState(route);
    setIsOpen(false);
  }, []);

  return (
    <DrawerContext.Provider
      value={{
        isOpen,
        openDrawer,
        closeDrawer,
        toggleDrawer,
        activeRoute,
        setActiveRoute,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
};
