import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { PwaRegister } from "@/components/ui/PwaRegister";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  themeColor: "#0B5D3B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: "KUMBU | Compara. Poupa. Escolhe melhor.",
    template: "%s | KUMBU",
  },
  description:
    "KUMBU — Os melhores preços, em todos os mercados. Encontre, compare e faça escolhas inteligentes em Angola.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KUMBU",
  },
  formatDetection: {
    telephone: true,
  },
  icons: {
    icon: "/kumbu-icon.svg",
    shortcut: "/kumbu-icon.svg",
    apple: "/kumbu-icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt" suppressHydrationWarning className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-mist text-ink-900" suppressHydrationWarning>
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
