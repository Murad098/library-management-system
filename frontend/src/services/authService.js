import api from "./api";

export const login = (email, password) =>
  api.post("/auth/login", { email, password });

export const getSession = () => api.get("/auth/me");

export const changePassword = (currentPassword, newPassword) =>
  api.post("/auth/change-password", { currentPassword, newPassword });

export const getAvatar = () =>
  api.get("/auth/avatar", { responseType: "blob" });

export const uploadAvatar = (file) => {
  const form = new FormData();
  form.append("avatar", file);

  return api.post("/auth/avatar", form);
};

export const requestPasswordResetOtp = (email) =>
  api.post("/auth/forgot-password", { email });

export const verifyPasswordResetOtp = (email, otp) =>
  api.post("/auth/verify-otp", { email, otp });

export const resetPassword = (resetToken, newPassword) =>
  api.post("/auth/reset-password", { resetToken, newPassword });
