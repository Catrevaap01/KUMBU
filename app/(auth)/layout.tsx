import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { KubikaLogo } from "@/components/ui/KubikaLogo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-[#FFF8F0] via-white to-[#FBFAFC]">
        <KubikaLogo size="lg" variant="vertical" className="mb-6" />
        <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 shadow-xs">
          {children}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
