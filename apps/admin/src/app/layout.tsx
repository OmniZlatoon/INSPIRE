import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inspire Admin Portal",
  description: "Secure Administrative Access for Inspire",
};

import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Force Cleanup of lingering Service Workers and Caches from browser memory
  if (typeof window !== 'undefined') {
    // 1. Unregister all Service Workers
    navigator.serviceWorker?.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
        console.log("🛠️ Ghost Service Worker Unregistered");
      }
    });

    // 2. Clear all Cache Storage (The root cause of "Response body already used")
    if ('caches' in window) {
      caches.keys().then((names) => {
        for (const name of names) {
          caches.delete(name);
          console.log(`🧹 Cache Cleared: ${name}`);
        }
      });
    }

    // 3. Instruction for the user
    console.log("🚀 AGGRESSIVE CLEANUP: Please press CTRL + F5 to hard-refresh your browser.");
  }

  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-full bg-white dark:bg-[#121212] text-gray-900 dark:text-gray-100 transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
