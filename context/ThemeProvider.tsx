"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const getSystemTheme = () => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const [theme, setThemeState] = useState(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      return storedTheme === "system"
        ? getSystemTheme()
        : storedTheme || getSystemTheme();
    }
    return "light"; // Default for SSR
  });

  useEffect(() => {
    const applyTheme = (currentTheme: string) => {
      document.documentElement.classList.toggle(
        "dark",
        currentTheme === "dark"
      );
    };

    if (theme === "system") {
      localStorage.removeItem("theme");
      const systemTheme = getSystemTheme();
      setThemeState(systemTheme);
      applyTheme(systemTheme);
    } else {
      localStorage.setItem("theme", theme);
      applyTheme(theme);
    }
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const systemThemeListener = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        setThemeState(event.matches ? "dark" : "light");
      }
    };

    systemThemeListener.addEventListener("change", handleSystemThemeChange);
    return () =>
      systemThemeListener.removeEventListener(
        "change",
        handleSystemThemeChange
      );
  }, []);

  const setTheme = (newTheme: string) => {
    if (newTheme === "system") {
      localStorage.removeItem("theme");
      setThemeState("system");
    } else {
      localStorage.setItem("theme", newTheme);
      setThemeState(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
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
