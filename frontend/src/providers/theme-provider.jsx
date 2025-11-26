import React from "react";
import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "taskly_theme";
const ThemeContext = createContext({
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
});

const getInitialTheme = () => {
  if (typeof window === "undefined") {
    return "light";
  }
  try {
    const persisted = window.localStorage.getItem(STORAGE_KEY);
    if (persisted === "light" || persisted === "dark") {
      return persisted;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  } catch (error) {
    console.warn("Failed to read theme preference", error);
    return "light";
  }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      console.warn("Failed to persist theme preference", error);
    }
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
