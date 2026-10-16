import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { PwaRegister } from "@/components/ui/PwaRegister";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#16a34a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: "KUBIKA | Compara. Poupa. Escolhe melhor.",
    template: "%s | KUBIKA",
  },
  description:
    "KUBIKA — Compara preços. Poupa. Escolhe melhor. Encontre as melhores ofertas e preços em todos os mercados de Angola.",
  manifest: "/manifest.webmanifest",
  applicationName: "KUBIKA",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KUBIKA",
  },
  formatDetection: {
    telephone: true,
  },
  icons: {
    icon: [
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/kubika-icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icons/favicon-32x32.png",
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

import { getCurrentUser } from "@/lib/auth/session";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const userRole = user?.systemRole === "ADMIN" ? "ADMIN" : user?.sellerId ? "SELLER" : user ? "CONSUMER" : null;

  return (
    <html lang="pt" suppressHydrationWarning className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-white text-ink-900 font-sans selection:bg-green-600/20 selection:text-ink-900 pb-20 sm:pb-0" suppressHydrationWarning>
        <PwaRegister />
        {children}
        <MobileBottomNav role={userRole} />
      </body>
    </html>
  );
}
