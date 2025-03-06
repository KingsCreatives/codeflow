"use client";

import { useTheme } from "@/context/ThemeProvider";

export default function ThemedMain({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();

  return (
    <main className={theme === "dark" ? "dark" : "light"}>{children}</main>
  );
}
