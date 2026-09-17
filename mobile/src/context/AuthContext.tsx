import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as SecureStore from "expo-secure-store";

import { AuthSession, LoginResponse } from "../types";
import { decodeJwtPayload } from "../utils/jwt";
import { clearTokens, storeToken, readToken, TOKEN_KEY } from "../services/api";

interface AuthContextValue {
  user: AuthSession | null;
  token: string | null;
  isLoading: boolean;
  signIn: (token: string, remember?: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const buildSession = useCallback((storedToken: string): AuthSession => {
    const payload = storedToken ? decodeJwtPayload(storedToken) : null;
    const email = typeof payload?.email === "string" ? payload.email : "";
    const handle = email.split("@")[0] || "";

    return {
      email,
      name: handle
        ? handle.charAt(0).toUpperCase() + handle.slice(1)
        : "Administrator",
      role: "Administrator",
      expiresAt: payload?.exp ? new Date(payload.exp * 1000) : null,
    };
  }, []);

  const checkSession = useCallback(async () => {
    try {
      const storedToken = await readToken();

      if (!storedToken) {
        setToken(null);
        setUser(null);
        return;
      }

      const session = buildSession(storedToken);
      const isExpired =
        session.expiresAt &&
        !Number.isNaN(session.expiresAt.getTime()) &&
        session.expiresAt.getTime() < Date.now();

      if (isExpired) {
        await clearTokens();
        setToken(null);
        setUser(null);
        return;
      }

      setToken(storedToken);
      setUser(session);
    } catch {
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [buildSession]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    const handleUnauthorized = () => {
      setToken(null);
      setUser(null);
      SecureStore.deleteItemAsync(TOKEN_KEY);
    };

    if (typeof globalThis.addEventListener === "function") {
      globalThis.addEventListener("auth:unauthorized" as never, handleUnauthorized);
    }

    return () => {
      if (typeof globalThis.removeEventListener === "function") {
        globalThis.removeEventListener(
          "auth:unauthorized" as never,
          handleUnauthorized
        );
      }
    };
  }, []);

  const signIn = useCallback(
    async (loginToken: string, remember = true) => {
      if (remember) {
        await storeToken(loginToken);
      }
      const session = buildSession(loginToken);
      setToken(loginToken);
      setUser(session);
    },
    [buildSession]
  );

  const signOut = useCallback(async () => {
    await clearTokens();
    setToken(null);
    setUser(null);
  }, []);

  const refreshSession = useCallback(async () => {
    await checkSession();
  }, [checkSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      signIn,
      signOut,
      refreshSession,
    }),
    [user, token, isLoading, signIn, signOut, refreshSession]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export interface AuthState {
  user: AuthSession | null;
  token: string | null;
  login: (response: LoginResponse) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}
