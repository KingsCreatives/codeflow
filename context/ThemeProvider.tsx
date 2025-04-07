"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface ThemeContextType {
  theme: string | null;
  setTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const getSystemTheme = (): string => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const [theme, setThemeState] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      const initialTheme =
        storedTheme === "system"
          ? getSystemTheme()
          : storedTheme || getSystemTheme();
      setThemeState(initialTheme);
      applyTheme(initialTheme);
    }
  }, []);

  const applyTheme = (currentTheme: string) => {
    document.documentElement.classList.toggle("dark", currentTheme === "dark");
  };

  useEffect(() => {
    if (theme === "system") {
      const systemTheme = getSystemTheme();
      setThemeState(systemTheme);
      applyTheme(systemTheme);
    } else if (theme) {
      localStorage.setItem("theme", theme);
      applyTheme(theme);
    }
  }, [theme]);

  useEffect(() => {
    const systemThemeListener = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      if (theme === "system") {
        const newSystemTheme = event.matches ? "dark" : "light";
        setThemeState(newSystemTheme);
        applyTheme(newSystemTheme);
      }
    };

    systemThemeListener.addEventListener("change", handleSystemThemeChange);
    return () =>
      systemThemeListener.removeEventListener(
        "change",
        handleSystemThemeChange
      );
  }, [theme]);

  const setTheme = (newTheme: string) => {
    if (newTheme === "system") {
      localStorage.removeItem("theme");
    } else {
      localStorage.setItem("theme", newTheme);
    }
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {theme !== null && children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
