import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { PwaRegister } from "@/components/ui/PwaRegister";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#FF8A00",
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
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "KUBIKA",
  },
  formatDetection: {
    telephone: true,
  },
  icons: {
    icon: [
      { url: "/kubika-icon.svg", type: "image/svg+xml" },
      { url: "/kumbu-icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/kubika-icon.svg",
    apple: "/kubika-icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt" suppressHydrationWarning className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#FBFAFC] text-[#0B0B0D] font-sans selection:bg-[#FF8A00]/20 selection:text-[#0B0B0D] pb-16 sm:pb-0" suppressHydrationWarning>
        <PwaRegister />
        {children}
        <MobileBottomNav />
      </body>
    </html>
  );
}
