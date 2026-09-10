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
