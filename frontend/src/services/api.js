import axios from "axios";
import BASE_URL from "../config/api";

export const TOKEN_KEY = "token";
export const UNAUTHORIZED_EVENT = "auth:unauthorized";

export const readToken = () =>
  localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || "";

export const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
};

const decodeJwtPayload = (token) => {
  try {
    const segment = token.split(".")[1];
    if (!segment) return null;

    const base64 = segment
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(segment.length / 4) * 4, "=");

    const binary = atob(base64);
    const json = decodeURIComponent(
      Array.from(binary, (char) =>
        `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`
      ).join("")
    );

    return JSON.parse(json);
  } catch {
    return null;
  }
};

export const readSessionUser = () => {
  const token = readToken();
  const payload = token ? decodeJwtPayload(token) : null;
  const email = typeof payload?.email === "string" ? payload.email : "";
  const role = payload?.role === "manager" ? "manager" : "owner";
  const handle = email.split("@")[0] || "";

  return {
    email,
    name: handle ? handle.charAt(0).toUpperCase() + handle.slice(1) : "Administrator",
    role,
    expiresAt: payload?.exp ? new Date(payload.exp * 1000) : null,
  };
};

export const getErrorMessage = (error, fallback = "Something went wrong.") =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  (error?.request ? "Cannot reach the server. Please try again." : fallback);

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = readToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && readToken()) {
      clearTokens();
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }

    return Promise.reject(error);
  }
);

export default api;
