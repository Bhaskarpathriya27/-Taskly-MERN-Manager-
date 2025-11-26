import React from "react";
import { createContext, useContext, useMemo, useState } from "react";
import { toast } from "sonner";
import { apiClient } from "../services/api-client";

const TOKEN_KEY = "taskly_token";
const USER_KEY = "taskly_user";

const AuthContext = createContext({
  user: null,
  token: null,
  isAdmin: false,
  loading: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  setUser: () => {},
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const persist = (nextToken, nextUser) => {
    if (nextToken) {
      localStorage.setItem(TOKEN_KEY, nextToken);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }

    if (nextUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  };

  const login = async (payload) => {
    setLoading(true);
    try {
      const { data } = await apiClient.post("/api/auth/signin", payload);
      setToken(data.token);
      setUser(data.user);
      persist(data.token, data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to sign in");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const { data } = await apiClient.post("/api/auth/signup", payload);
      setToken(data.token);
      setUser(data.user);
      persist(data.token, data.user);
      toast.success("Account created successfully");
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to sign up");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (token) {
      try {
        await apiClient.post(
          "/api/auth/signout",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (err) {
        console.warn("Signout failed", err.message);
      }
    }
    setToken(null);
    setUser(null);
    persist(null, null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAdmin: user?.role === "admin",
      loading,
      login,
      register,
      logout,
      setUser,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
