import Link from "next/link";
import { KumbuLogo } from "@/components/ui/KumbuLogo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="container-page flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/" aria-label="KUMBU Início">
            <KumbuLogo size="sm" showTagline={true} />
          </Link>
          <p className="mt-2 max-w-sm text-xs text-slate-500">
            Os melhores preços, em todos os mercados. A plataforma inteligente que te ajuda a comparar, poupar e escolher melhor em Angola.
          </p>
        </div>

        <nav aria-label="Rodapé" className="flex flex-wrap gap-4 text-xs font-medium text-slate-600">
          <Link href="/search" className="hover:text-green-600">
            Pesquisar Produtos
          </Link>
          <Link href="/sign-up" className="hover:text-green-600">
            Criar Conta
          </Link>
          <Link href="/sellers/register" className="hover:text-green-600">
            Registo de Comerciante
          </Link>
        </nav>
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col gap-1 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} KUMBU Angola · Compara. Poupa. Escolhe melhor.</p>
          <p>www.kumbu.com</p>
        </div>
      </div>
    </footer>
  );
}
