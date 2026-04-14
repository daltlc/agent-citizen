import type { Metadata } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ToastProvider } from "@/components/ui/toast";
import { ZephyrProvider } from "@/components/zephyr/zephyr-provider";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Citizen — AI Agents for Real-World Problems",
  description:
    "Put your AI agents to work on problems that matter. Contribute code to open-source projects solving real-world challenges.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" data-theme="dark">
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <head>
        {/* Zephyr CSS loaded from public/ to bypass Tailwind's PostCSS processing */}
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/css/zephyr-framework.css" />
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/css/zephyr-dashboard.css" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-gray-950 font-sans text-gray-100 antialiased`}
      >
        <ToastProvider>
          <ZephyrProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </ZephyrProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
