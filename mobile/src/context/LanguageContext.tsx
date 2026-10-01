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
   | "name" | "phone" | "monthlyFee" | "feeStatus" | "updateMember" | "updateExpense" | "selectCategory"
   | "emailAddress" | "title" | "amount" | "date" | "category" | "save" | "saving" | "cancel"
   | "menu" | "logout" | "poweredBy" | "owner" | "manager"
   | "feesCollected" | "outstanding" | "feeCollection" | "feeCollectionSubtitle"
   | "noMembersYet" | "recentExpenses" | "latestSpending" | "noExpensesRecorded"
   | "recentMembers" | "allFeesCollected" | "retry" | "allTime" | "clearFilter"
   | "changePassword" | "helpAndSupport" | "version"
   | "themeDark" | "themeLight"
   | "requiredFields" | "memberAdded" | "memberUpdated" | "unableToAddMember" | "unableToUpdateMember"
   | "enterName" | "enterEmail" | "enterPhone"
   | "expenseRequired" | "amountPositive" | "expenseAdded" | "expenseUpdated"
    | "unableToAddExpense" | "unableToUpdateExpense" | "enterExpenseTitle"
    | "typeInfo" | "typeSuccess" | "typeWarning" | "typeAlert"
    | "markRead" | "markUnread"
    | "newNotification" | "notificationTitle" | "notificationMessage"
    | "typeLabel" | "messageOptional" | "addNotification"
    | "noNotificationsYet" | "titleRequired"
    | "unableToLoadNotifications" | "unableToAddNotification"
    | "unableToUpdateNotification" | "unableToMarkRead" | "unableToDeleteNotification"
    | "helpTip1" | "helpTip2" | "helpTip3" | "helpTip4"
    | "permissionRequired" | "photoAccessRequired" | "profilePhotoUpdated" | "unableToUpdatePhoto"
    | "passwordTooShort" | "passwordsDoNotMatch" | "passwordChanged" | "unableToChangePassword"
    | "logoutConfirm" | "administrator" | "signedIn" | "currentPassword"
    | "passwordMinLength" | "reEnterPassword" | "hide" | "show" | "updatePassword"
    | "accentEmerald" | "accentCrimson" | "accentIndigo" | "accentAmber" | "accentSlate" | "accentRose"
    | "pwdCurrent" | "pwdNew" | "pwdConfirm" | "tipsForUsing" | "endSession" | "updateAccountPassword"

const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    welcomeBack: "Welcome back", signInSubtitle: "Sign in to your Library Management System",
    username: "USERNAME", password: "PASSWORD", emailOrUsername: "Email or username",
    rememberMe: "Remember me", forgotPassword: "Forgot Password?", signIn: "Sign in",
    tryDemo: "TRY THE DEMO", continueOwner: "Continue as Owner", continueManager: "Continue as Manager",
    ownerDescription: "Full access to the configured administrator account", managerDescription: "Manager account configured by your administrator",
    english: "English", urdu: "Urdu", pleaseEnterCredentials: "Please enter your email and password.", loginSuccess: "Welcome back! Login successful.", unableToSignIn: "Unable to sign in. Please try again.", demoNotConfigured: "This demo account is not configured on the backend.",
    dashboard: "Dashboard", members: "Members", expenses: "Expenses", notifications: "Notifications", profile: "Profile", settings: "Settings", addMember: "Add member", addExpense: "Add expense", loading: "Loading...", refresh: "Refresh", markAllRead: "Mark all read", language: "Language", darkMode: "Dark mode", colorScheme: "Color scheme", chooseAccent: "Choose your accent color", search: "Search", all: "All", paid: "Paid", unpaid: "Unpaid", thisMonth: "This month", noResults: "No results found.", sendCode: "Send code", backToLogin: "Back to login", resetPassword: "Reset your password", emailAddress: "Email address", title: "Title", amount: "Amount", date: "Date", category: "Category", save: "Save", saving: "Saving...", cancel: "Cancel",
    name: "Name", phone: "Phone", monthlyFee: "Monthly Fee", feeStatus: "Fee Status",
    updateMember: "Update member", updateExpense: "Update expense", selectCategory: "Select category",
    menu: "MAIN MENU", logout: "Log Out", poweredBy: "Powered by Library Management System",
    owner: "Owner", manager: "Manager",
    changePassword: "Change Password", helpAndSupport: "Help & Support", version: "Version",
    themeDark: "Dark theme active", themeLight: "Light theme active",
    feesCollected: "Fees collected", outstanding: "Outstanding", feeCollection: "Fee collection", feeCollectionSubtitle: "Paid members against expected monthly fees",
    noMembersYet: "No members yet. Add a member to start tracking fees.", recentExpenses: "Recent expenses", latestSpending: "Latest spending recorded", noExpensesRecorded: "No expenses recorded yet.",
    recentMembers: "Recent members", allFeesCollected: "All member fees are fully collected.", retry: "Retry", allTime: "All time", clearFilter: "Clear filter", requiredFields: "Name, email and phone are required.", memberAdded: "Member added successfully.", memberUpdated: "Member updated successfully.", unableToAddMember: "Unable to add member.", unableToUpdateMember: "Unable to update member.", enterName: "Enter full name", enterEmail: "Enter email address", enterPhone: "Enter phone number", expenseRequired: "Expense title is required.", amountPositive: "Amount must be greater than zero.", expenseAdded: "Expense added successfully.", expenseUpdated: "Expense updated successfully.", unableToAddExpense: "Unable to add expense.", unableToUpdateExpense: "Unable to update expense.", enterExpenseTitle: "What was this expense for?", typeInfo: "Info", typeSuccess: "Success", typeWarning: "Warning", typeAlert: "Alert", markRead: "Mark read", markUnread: "Mark unread", newNotification: "New notification", notificationTitle: "Notification title", notificationMessage: "Notification message...", typeLabel: "Type", messageOptional: "Message (optional)", addNotification: "Add notification", noNotificationsYet: "No notifications yet.", titleRequired: "Notification title is required.", unableToLoadNotifications: "Unable to load notifications.", unableToAddNotification: "Unable to add notification.", unableToUpdateNotification: "Unable to update notification.", unableToMarkRead: "Unable to mark notifications read.", unableToDeleteNotification: "Unable to delete notification.", helpTip1: "Add members from Members → Add member and set their monthly fee.", helpTip2: "Keep the Paid / Unpaid status current so collection totals stay accurate.", helpTip3: "Record every library expense so the dashboard net figure stays correct.", helpTip4: "Change the admin password here whenever it may have been shared.", permissionRequired: "Permission required", photoAccessRequired: "Please allow access to your photos to change the profile picture.", profilePhotoUpdated: "Profile photo updated.", unableToUpdatePhoto: "Unable to update the profile photo.", passwordTooShort: "New password must be at least 6 characters.", passwordsDoNotMatch: "New password and confirmation do not match.", passwordChanged: "Password changed successfully.", unableToChangePassword: "Unable to change password.", logoutConfirm: "You will need to sign in again to continue.", administrator: "Administrator", signedIn: "Signed in", currentPassword: "Enter current password", passwordMinLength: "At least 6 characters", reEnterPassword: "Re-enter new password", hide: "Hide", show: "Show", updatePassword: "Update password", accentEmerald: "Emerald", accentCrimson: "Crimson", accentIndigo: "Indigo", accentAmber: "Amber", accentSlate: "Slate", accentRose: "Rose", pwdCurrent: "Current password", pwdNew: "New password", pwdConfirm: "Confirm new password", tipsForUsing: "Tips for using the system", endSession: "End this session", updateAccountPassword: "Update your account password",
  },
  ur: {
    welcomeBack: "خوش آمدید", signInSubtitle: "اپنے لائبریری مینجمنٹ سسٹم میں سائن اِن کریں", username: "صارف نام", password: "پاس ورڈ", emailOrUsername: "ای میل یا صارف نام", rememberMe: "مجھے یاد رکھیں", forgotPassword: "پاس ورڈ بھول گئے؟", signIn: "سائن اِن", tryDemo: "ڈیمو آزمائیں", continueOwner: "مالک کے طور پر جاری رکھیں", continueManager: "منیجر کے طور پر جاری رکھیں", ownerDescription: "ترتیب دیے گئے ایڈمن اکاؤنٹ تک مکمل رسائی", managerDescription: "ایڈمنسٹریٹر کا ترتیب دیا ہوا منیجر اکاؤنٹ", english: "انگریزی", urdu: "اردو", pleaseEnterCredentials: "براہ کرم ای میل اور پاس ورڈ درج کریں۔", loginSuccess: "خوش آمدید! سائن اِن کامیاب ہے۔", unableToSignIn: "سائن اِن نہیں ہو سکا۔ دوبارہ کوشش کریں۔", demoNotConfigured: "یہ ڈیمو اکاؤنٹ بیک اینڈ پر ترتیب نہیں دیا گیا۔", dashboard: "ڈیش بورڈ", members: "ارکان", expenses: "اخراجات", notifications: "اطلاعات", profile: "پروفائل", settings: "ترتیبات", addMember: "رکن شامل کریں", addExpense: "خرچ شامل کریں", loading: "لوڈ ہو رہا ہے...", refresh: "تازہ کریں", markAllRead: "سب پڑھا ہوا کریں", language: "زبان", darkMode: "ڈارک موڈ", colorScheme: "رنگوں کا انداز", chooseAccent: "اپنا رنگ منتخب کریں", search: "تلاش", all: "سب", paid: "ادا شدہ", unpaid: "غیر ادا شدہ", thisMonth: "اس ماہ", noResults: "کوئی نتیجہ نہیں ملا۔", sendCode: "کوڈ بھیجیں", backToLogin: "لاگ اِن پر واپس جائیں", resetPassword: "پاس ورڈ ری سیٹ کریں", emailAddress: "ای میل ایڈریس", title: "عنوان", amount: "رقم", date: "تاریخ", category: "قسم", save: "محفوظ کریں", saving: "محفوظ ہو رہا ہے...", cancel: "منسوخ کریں",
    name: "نام", phone: "فون", monthlyFee: "ماہانہ فیس", feeStatus: "فیس کی حیثیت",
    updateMember: "رکن کو اپ ڈیٹ کریں", updateExpense: "اخراج کو اپ ڈیٹ کریں", selectCategory: "قسم منتخب کریں",
    menu: "مینو", logout: "لاگ آؤٹ", poweredBy: "لائبریری مینجمنٹ سسٹم کی طرف سے",
    owner: "مالک", manager: "منیجر",
    changePassword: "پاس ورڈ تبدیل کریں", helpAndSupport: "مدد اور معاونت", version: "وزرژن",
    themeDark: "ڈارک تھیم فعال ہے", themeLight: "لائٹ تھیم فعال ہے",
    feesCollected: "اجراءت جمع ہوئیں", outstanding: "بقایا", feeCollection: "فیس کا جمع اورت", feeCollectionSubtitle: "ادا شدہ اراکین متوقع ماہانہ فیس کے ساتھ",
    noMembersYet: "ابھی تک کوئی رکن نہیں۔ فیس ٹریک کرنے کے لیے ایک رکن شامل کریں۔", recentExpenses: "حالیہ اخراجات", latestSpending: "درج شدہ تازہ ترین اخراج", noExpensesRecorded: "ابھی تک کوئی خرچ نہیں درج کیا گیا۔",
    recentMembers: "حالیہ اراکین", allFeesCollected: "تمام اراکین کی فیس مکمل طور پر جمع ہو گئی ہے۔", retry: "دوبارہ کوشش کریں", allTime: " تمام وقت", clearFilter: "فلٹر صاف کریں", requiredFields: "براہ کرم نام، ای میل اور فون نمبر درج کریں۔", memberAdded: "رکن کامیابی سے شامل ہو گیا۔", memberUpdated: "رکن کامیابی سے اپ ڈیٹ ہو گیا۔", unableToAddMember: "رکن شامل کرنا ممکن نہیں۔", unableToUpdateMember: "رکن اپ ڈیٹ کرنا ممکن نہیں۔", enterName: "پورا نام درج کریں", enterEmail: "ای میل ایڈریس درج کریں", enterPhone: "فون نمبر درج کریں", expenseRequired: "اخراج کا عنوان لازمی ہے۔", amountPositive: "رقم صفر سے زیادہ ہونی چاہیے۔", expenseAdded: "اخراج کامیابی سے شامل ہو گیا۔", expenseUpdated: "اخراج کامیابی سے اپ ڈیٹ ہو گیا۔", unableToAddExpense: "اخراج شامل کرنا ممکن نہیں۔", unableToUpdateExpense: "اخراج اپ ڈیٹ کرنا ممکن نہیں۔", enterExpenseTitle: "یہ خرچ کیا تھا؟", typeInfo: "معلومات", typeSuccess: "کامیابی", typeWarning: "چیخ کی ٹون", typeAlert: "انتباہ", markRead: "پڑھا ہوا نشان زد کریں", markUnread: "نا پڑھا ہوا نشان زد کریں", newNotification: "نئی اطلاع", notificationTitle: "اطلاع کا عنوان", notificationMessage: "اطلاع کا پیغام...", typeLabel: "قسم", messageOptional: "پیغام (اختیاری)", addNotification: "اطلاع شامل کریں", noNotificationsYet: "ابھی تک کوئی اطلاع نہیں۔", titleRequired: "اطلاع کا عنوان لازمی ہے۔", unableToLoadNotifications: "اطلاعیں لوڈ نہیں ہوئیں۔", unableToAddNotification: "اطلاع شامل کرنا ممکن نہیں۔", unableToUpdateNotification: "اطلاع اپ ڈیٹ کرنا ممکن نہیں۔", unableToMarkRead: "اطلاعیں پڑھا ہوا نشان زد کرنا ممکن نہیں۔", unableToDeleteNotification: "اطلاع کو حذف کرنا ممکن نہیں۔", helpTip1: "اراکین صفحہ → رکن شامل کریں سے رکن شامل کریں اور ان کی ماہانہ فیس مقرر کریں۔", helpTip2: "ادا شدہ/غیر ادا کی حیثیت کو حال رکھیں تاکہ جمع آٹ ہ کیلکولیشن درست رہے۔", helpTip3: "ہر لائبریری کے خرچ کو ریکارڈ کریں تاکہ ڈیش بورڈ کا خالص اعداد درست رہے۔", helpTip4: "اپنے ایڈمن پاس ورڈ کو یہاں تبدیل کریں جب بھی یہ مشترکہ کرنے کے لیے مخصوص ہو۔", permissionRequired: "اجازت کی ضرورت ہے", photoAccessRequired: "براہ کرم اپنی تصاویر تک رسائی حاصل کرنے کی اجازت دیں۔", profilePhotoUpdated: "پروفائل فوٹو اپ ڈیٹ ہو گیا۔", unableToUpdatePhoto: "پروفائل فوٹو اپ ڈیٹ نہیں ہو سکا۔", passwordTooShort: "نیا پاس ورڈ کم از کم 6 حروف کا ہونا چاہیے۔", passwordsDoNotMatch: "نیا پاس ورڈ اور تصدیق مماثل نہیں ہیں۔", passwordChanged: "پاس ورڈ کامیابی سے تبدیل ہو گیا۔", unableToChangePassword: "پاس ورڈ تبدیل نہیں ہو سکا۔", logoutConfirm: "آپ کو دوبارہ سائن اِن کرنا ہوگا۔", administrator: "ایڈمنسٹریٹر", signedIn: "سائن اِن ہوا ہے", currentPassword: "موجودہ پاس ورڈ درج کریں", passwordMinLength: "کم از کم 6 حروف", reEnterPassword: "نیا پاس ورڈ دوبارہ درج کریں", hide: "چھپائیں", show: "ظاہر کریں", updatePassword: "پاس ورڈ اپ ڈیٹ کریں", accentEmerald: "ایمرلڈ", accentCrimson: "کریمزن", accentIndigo: "انڈیگو", accentAmber: "ایینبر", accentSlate: "سلیٹ", accentRose: "روز", pwdCurrent: "موجودہ پاس ورڈ", pwdNew: "نیا پاس ورڈ", pwdConfirm: "پاس ورڈ کی تصدیق کریں", tipsForUsing: "سسٹم کے استعمال کے مشورے", endSession: "اس سیشن کو ختم کریں", updateAccountPassword: "اپنے اکاؤنٹ کا پاس ورڈ اپ ڈیٹ کریں",
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
