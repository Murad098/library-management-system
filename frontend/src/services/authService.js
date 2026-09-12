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

export const generateRecoveryCode = () => api.post("/auth/recovery-code");

export const resetPassword = (email, code, newPassword) =>
  api.post("/auth/reset-password", { email, code, newPassword });
