import type { Metadata } from "next";
import {
  ClerkProvider,
} from "@clerk/nextjs";

import "../styles/prism.css";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeProvider";

const inter = { variable: 'font-sans' };
const spaceGrotesk = { variable: 'font-sans' };

export const metadata: Metadata = {
  title: "CodeFlow",
  description:
    "A community-driven platform for asking and answering programming questions.",
  icons: {
    icon: "/assets/images/site-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary: "primary-gradient",
          footerActionLink: "primary-text-gradient hover:text-primary-500",
        },
      }}
    >
      <html lang="en">
        <body
          className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
        >
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
