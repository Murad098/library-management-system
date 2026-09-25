import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as SecureStore from "expo-secure-store";

export type Language = "en" | "ur";

const LANGUAGE_KEY = "language";

type TranslationKey =
  | "welcomeBack" | "signInSubtitle" | "username" | "password" | "emailOrUsername"
  | "rememberMe" | "forgotPassword" | "signIn" | "tryDemo" | "continueOwner"
  | "continueManager" | "ownerDescription" | "managerDescription" | "english" | "urdu"
  | "pleaseEnterCredentials" | "loginSuccess" | "unableToSignIn" | "demoNotConfigured"
  | "dashboard" | "members" | "expenses" | "notifications" | "profile" | "settings"
  | "addMember" | "addExpense" | "loading" | "refresh" | "markAllRead" | "language"
  | "darkMode" | "colorScheme" | "chooseAccent" | "search" | "all" | "paid" | "unpaid"
  | "thisMonth" | "noResults" | "sendCode" | "backToLogin" | "resetPassword"
   | "emailAddress" | "title" | "amount" | "date" | "category" | "save" | "cancel"
   | "menu" | "logout" | "poweredBy" | "owner" | "manager"
   | "changePassword" | "helpAndSupport" | "version"
   | "themeDark" | "themeLight";

const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    welcomeBack: "Welcome back", signInSubtitle: "Sign in to your Library Management System",
    username: "USERNAME", password: "PASSWORD", emailOrUsername: "Email or username",
    rememberMe: "Remember me", forgotPassword: "Forgot Password?", signIn: "Sign in",
    tryDemo: "TRY THE DEMO", continueOwner: "Continue as Owner", continueManager: "Continue as Manager",
    ownerDescription: "Full access to the configured administrator account", managerDescription: "Manager account configured by your administrator",
    english: "English", urdu: "Urdu", pleaseEnterCredentials: "Please enter your email and password.", loginSuccess: "Welcome back! Login successful.", unableToSignIn: "Unable to sign in. Please try again.", demoNotConfigured: "This demo account is not configured on the backend.",
    dashboard: "Dashboard", members: "Members", expenses: "Expenses", notifications: "Notifications", profile: "Profile", settings: "Settings", addMember: "Add member", addExpense: "Add expense", loading: "Loading...", refresh: "Refresh", markAllRead: "Mark all read", language: "Language", darkMode: "Dark mode", colorScheme: "Color scheme", chooseAccent: "Choose your accent color", search: "Search", all: "All", paid: "Paid", unpaid: "Unpaid", thisMonth: "This month", noResults: "No results found.", sendCode: "Send code", backToLogin: "Back to login", resetPassword: "Reset your password", emailAddress: "Email address", title: "Title", amount: "Amount", date: "Date", category: "Category", save: "Save", cancel: "Cancel",
    menu: "MAIN MENU", logout: "Log Out", poweredBy: "Powered by Library Management System",
    owner: "Owner", manager: "Manager",
    changePassword: "Change Password", helpAndSupport: "Help & Support", version: "Version",
    themeDark: "Dark theme active", themeLight: "Light theme active",
  },
  ur: {
    welcomeBack: "خوش آمدید", signInSubtitle: "اپنے لائبریری مینجمنٹ سسٹم میں سائن اِن کریں", username: "صارف نام", password: "پاس ورڈ", emailOrUsername: "ای میل یا صارف نام", rememberMe: "مجھے یاد رکھیں", forgotPassword: "پاس ورڈ بھول گئے؟", signIn: "سائن اِن", tryDemo: "ڈیمو آزمائیں", continueOwner: "مالک کے طور پر جاری رکھیں", continueManager: "منیجر کے طور پر جاری رکھیں", ownerDescription: "ترتیب دیے گئے ایڈمن اکاؤنٹ تک مکمل رسائی", managerDescription: "ایڈمنسٹریٹر کا ترتیب دیا ہوا منیجر اکاؤنٹ", english: "انگریزی", urdu: "اردو", pleaseEnterCredentials: "براہ کرم ای میل اور پاس ورڈ درج کریں۔", loginSuccess: "خوش آمدید! سائن اِن کامیاب ہے۔", unableToSignIn: "سائن اِن نہیں ہو سکا۔ دوبارہ کوشش کریں۔", demoNotConfigured: "یہ ڈیمو اکاؤنٹ بیک اینڈ پر ترتیب نہیں دیا گیا۔", dashboard: "ڈیش بورڈ", members: "ارکان", expenses: "اخراجات", notifications: "اطلاعات", profile: "پروفائل", settings: "ترتیبات", addMember: "رکن شامل کریں", addExpense: "خرچ شامل کریں", loading: "لوڈ ہو رہا ہے...", refresh: "تازہ کریں", markAllRead: "سب پڑھا ہوا کریں", language: "زبان", darkMode: "ڈارک موڈ", colorScheme: "رنگوں کا انداز", chooseAccent: "اپنا رنگ منتخب کریں", search: "تلاش", all: "سب", paid: "ادا شدہ", unpaid: "غیر ادا شدہ", thisMonth: "اس ماہ", noResults: "کوئی نتیجہ نہیں ملا۔", sendCode: "کوڈ بھیجیں", backToLogin: "لاگ اِن پر واپس جائیں", resetPassword: "پاس ورڈ ری سیٹ کریں", emailAddress: "ای میل ایڈریس", title: "عنوان", amount: "رقم", date: "تاریخ", category: "قسم", save: "محفوظ کریں", cancel: "منسوخ کریں",
    menu: "مینو", logout: "لاگ آؤٹ", poweredBy: "لائبریری مینجمنٹ سسٹم کی طرف سے",
    owner: "مالک", manager: "منیجر",
    changePassword: "پاس ورڈ تبدیل کریں", helpAndSupport: "مدد اور معاونت", version: "وزرژن",
    themeDark: "ڈارک تھیم فعال ہے", themeLight: "لائٹ تھیم فعال ہے",
  },
};

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => Promise<void>;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    SecureStore.getItemAsync(LANGUAGE_KEY).then((saved) => {
      if (saved === "en" || saved === "ur") setLanguageState(saved);
    }).catch(() => undefined);
  }, []);

  const setLanguage = useCallback(async (next: Language) => {
    setLanguageState(next);
    await SecureStore.setItemAsync(LANGUAGE_KEY, next);
  }, []);

  const value = useMemo(() => ({ language, setLanguage, t: (key: TranslationKey) => translations[language][key] }), [language, setLanguage]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};

export type { TranslationKey };
