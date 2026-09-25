import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";

import BASE_URL from "../config/api";
import { JwtPayload, LoginResponse } from "../types";
import { decodeJwtPayload } from "../utils/jwt";

export const TOKEN_KEY = "token";
export const UNAUTHORIZED_EVENT = "auth:unauthorized";

export const storeToken = async (token: string) => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

export const readToken = async (): Promise<string> => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);

  return token ?? "";
};

export const clearTokens = async () => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
};

let sessionToken: string | null = null;

export const setSessionToken = (token: string | null) => {
  sessionToken = token;
};

export const clearSessionToken = () => {
  sessionToken = null;
};

export const getSessionToken = () => sessionToken;

export const readSessionUser = async (): Promise<{
  email: string;
  name: string;
  role: string;
  expiresAt: Date | null;
}> => {
  const token = sessionToken || (await readToken());
  const payload = token ? decodeJwtPayload(token) : null;
  const email = typeof payload?.email === "string" ? payload.email : "";
  const handle = email.split("@")[0] || "";

  return {
    email,
    name: handle
      ? handle.charAt(0).toUpperCase() + handle.slice(1)
      : "Administrator",
    role: payload?.role === "manager" ? "manager" : "owner",
    expiresAt: payload?.exp ? new Date(payload.exp * 1000) : null,
  };
};

export const getErrorMessage = (
  error: unknown,
  fallback = "Something went wrong."
): string => {
  if (error && typeof error === "object" && "response" in error) {
    const axiosErr = error as AxiosError;
    const data = axiosErr.response?.data as Record<string, unknown> | undefined;

    return (
      (typeof data?.message === "string" && data.message) ||
      (typeof data?.error === "string" && data.error) ||
      fallback
    );
  }

  if (error && typeof error === "object" && "request" in error) {
    return "Cannot reach the server. Please try again.";
  }

  return fallback;
};

const api = axios.create({ baseURL: BASE_URL });

let isClearing = false;

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = sessionToken || (await readToken());

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const token = sessionToken || (await readToken());

    if (error?.response?.status === 401 && token && !isClearing) {
      isClearing = true;

      await clearTokens();
      isClearing = false;

      if (typeof globalThis.dispatchEvent === "function") {
        const EventCtor = (
          globalThis as unknown as { Event?: new (type: string) => Event }
        ).Event;
        if (EventCtor) {
          globalThis.dispatchEvent(new EventCtor(UNAUTHORIZED_EVENT));
        }
      }
    }

    return Promise.reject(error);
  }
);

export const setAuthToken = async (token: string | null) => {
  if (token) {
    await storeToken(token);
  } else {
    await clearTokens();
  }
};

export const getStoredToken = readToken;

export default api;
