import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export const useIsAuthenticated = () => {
  const { token, isLoading } = useAuth();

  return !isLoading && Boolean(token);
};

export const useRequireAuth = () => {
  const { token, isLoading, signOut } = useAuth();

  const isAuthenticated = !isLoading && Boolean(token);

  if (isLoading) {
    return { isAuthenticated: false, isLoading: true, signOut: null };
  }

  return { isAuthenticated, isLoading: false, signOut };
};
