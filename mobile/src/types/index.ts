export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  fee: number;
  status: "paid" | "unpaid";
  createdAt: string | null;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string | null;
}

export type NotificationType = "info" | "success" | "warning" | "alert";

export interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  notifications: NotificationItem[];
  unread: number;
}

export interface AuthSession {
  email: string;
  name: string;
  role: string;
  expiresAt: Date | null;
}

export interface LoginResponse {
  token: string;
  email: string;
}

export interface SessionResponse {
  email: string;
  passwordUpdatedAt: string;
}

export interface AvatarUploadResponse {
  message: string;
  avatarUpdatedAt: string;
}

export interface PasswordChangeResponse {
  message: string;
}

export interface ResetOtpResponse {
  resetToken: string;
}

export interface MessageResponse {
  message: string;
}

export interface MemberApiResponse {
  _id: string;
  name: string;
  email: string;
  phone: string;
  fee: number;
  status: "paid" | "unpaid";
  createdAt: string;
}

export interface ExpenseApiResponse {
  _id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}

export interface JwtPayload {
  email?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}
