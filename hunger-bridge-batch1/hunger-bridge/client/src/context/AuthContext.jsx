import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { loginUser, registerUser, fetchCurrentUser } from "../services/authService";

const TOKEN_KEY = "hungerbridge_token";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }

    fetchCurrentUser()
      .then((restoredUser) => setUser(restoredUser))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (credentials) => {
    setAuthError(null);
    try {
      const data = await loginUser(credentials);
      localStorage.setItem(TOKEN_KEY, data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  }, []);

  const register = useCallback(async (payload) => {
    setAuthError(null);
    try {
      const data = await registerUser(payload);
      localStorage.setItem(TOKEN_KEY, data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    authError,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
