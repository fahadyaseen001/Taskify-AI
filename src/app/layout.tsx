"use-client"

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThemeToggleButton } from "@/components/theme/theme-toggle-button";
import { Toaster } from "@/components/ui/toaster";
import ReactQueryProvider from "@/components/tanstack-query/query-provider";
import { UserProvider } from "@/components/tanstack-query/user-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Todo App",
  description: "A simple todo app",};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      > <UserProvider>
                <ReactQueryProvider>

       <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ThemeToggleButton />
            {children} 
            <Toaster />

          </ThemeProvider>
          </ReactQueryProvider></UserProvider>
      </body>
    </html>
  );
}
