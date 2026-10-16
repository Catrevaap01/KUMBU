import Link from "next/link";
import { KubikaLogo } from "@/components/ui/KubikaLogo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-[#0B0B0D] text-[#FBFAFC]">
      <div className="container-page flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/" aria-label="KUBIKA Início">
            <KubikaLogo size="sm" showTagline={true} theme="dark" />
          </Link>
          <p className="mt-3 max-w-sm text-xs text-[#687280]">
            Compara preços. Poupa. Escolhe melhor. A plataforma de inteligência de preços que conecta consumidores aos melhores mercados de Angola.
          </p>
        </div>

        <nav aria-label="Rodapé" className="flex flex-wrap gap-4 text-xs font-medium text-[#8E95A2]">
          <Link href="/search" className="hover:text-green-400 transition">
            Pesquisar Produtos
          </Link>
          <Link href="/sign-up" className="hover:text-green-400 transition">
            Criar Conta
          </Link>
          <Link href="/sellers/register" className="hover:text-green-400 transition">
            Registo de Comerciante
          </Link>
          <Link href="/analytics" className="hover:text-green-400 text-amber-400 font-semibold transition">
            Inteligência de Mercado (B2B)
          </Link>
        </nav>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-1 py-4 text-xs text-[#687280] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} KUBIKA Angola · Compara. Poupa. Escolhe melhor.</p>
          <p className="text-green-500">www.kubika.ao</p>
        </div>
      </div>
    </footer>
  );
}
