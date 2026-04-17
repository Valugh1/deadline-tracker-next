import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NeonAuthProvider from "@/components/NeonAuthProvider";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import PushNotificationSubscriber from "@/components/PushNotificationSubscriber";
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
  title: "Deadline Tracker",
  description: "A modern, mobile-first deadline app inspired by iOS",
  manifest: "/manifest.json", // PWA manifest link
  themeColor: "#007aff", // PWA theme color
  viewport: "width=device-width, initial-scale=1", // PWA viewport
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-ios-background text-slate-950">
        <NeonAuthProvider>{children}</NeonAuthProvider>
        <ServiceWorkerRegister />
        <PushNotificationSubscriber />
      </body>
    </html>
  );
}
