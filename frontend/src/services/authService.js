import api from "./api";

export const login = (email, password) =>
  api.post("/auth/login", { email, password });

export const getSession = () => api.get("/auth/me");

export const changePassword = (currentPassword, newPassword) =>
  api.post("/auth/change-password", { currentPassword, newPassword });
