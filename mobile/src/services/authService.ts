import { AxiosResponse } from "axios";

import api from "./api";
import {
  LoginResponse,
  PasswordChangeResponse,
  ResetOtpResponse,
  SessionResponse,
} from "../types";

export const login = (
  email: string,
  password: string
): Promise<AxiosResponse<LoginResponse>> =>
  api.post("/auth/login", { email, password });

export const getSession = (): Promise<AxiosResponse<SessionResponse>> =>
  api.get("/auth/me");

export const changePassword = (
  currentPassword: string,
  newPassword: string
): Promise<AxiosResponse<PasswordChangeResponse>> =>
  api.post("/auth/change-password", { currentPassword, newPassword });

export const getAvatar = () =>
  api.get("/auth/avatar", { responseType: "blob" });

export const uploadAvatar = (file: {
  uri: string;
  name: string;
  type: string;
  size?: number;
}) => {
  const form = new FormData();

  (form as any).append("avatar", {
    uri: file.uri,
    name: file.name,
    type: file.type,
  });

  return api.post("/auth/avatar", form);
};

export const requestPasswordResetOtp = (email: string) =>
  api.post("/auth/forgot-password", { email });

export const verifyPasswordResetOtp = (
  email: string,
  otp: string
): Promise<AxiosResponse<ResetOtpResponse>> =>
  api.post("/auth/verify-otp", { email, otp });

export const resetPassword = (resetToken: string, newPassword: string) =>
  api.post("/auth/reset-password", { resetToken, newPassword });
