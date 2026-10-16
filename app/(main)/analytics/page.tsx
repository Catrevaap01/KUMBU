import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db/client";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Inteligência de Mercado & Relatórios B2B — KUBIKA Data",
  description: "Observatório de preços e dados em tempo real da cesta básica angolana para empresas, bancos e instituições.",
};

const PROVINCE_STATS = [
  { province: "Luanda", avgBasket: "84.500 Kz", trend: "+2.1%", informalDiff: "-28%", activeSellers: "120+" },
  { province: "Benguela", avgBasket: "79.200 Kz", trend: "-1.4%", informalDiff: "-31%", activeSellers: "45+" },
  { province: "Huambo", avgBasket: "76.800 Kz", trend: "+0.8%", informalDiff: "-34%", activeSellers: "38+" },
  { province: "Huíla", avgBasket: "78.400 Kz", trend: "+1.2%", informalDiff: "-26%", activeSellers: "30+" },
  { province: "Cabinda", avgBasket: "89.100 Kz", trend: "+3.5%", informalDiff: "-22%", activeSellers: "25+" },
];

export default async function AnalyticsPage() {
  const [totalVerifiedSellers, totalReports, totalProducts] = await Promise.all([
    prisma.seller.count({ where: { verificationStatus: "VERIFIED" } }),
    prisma.priceReport.count({ where: { moderationStatus: "ACTIVE" } }),
    prisma.product.count(),
  ]);

  return (
    <main className="container-page py-10 space-y-10">
      {/* Hero Header */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-[#0B0B0D] via-[#16161A] to-[#1E120A] p-6 sm:p-10 text-white shadow-md">
        <div className="max-w-3xl space-y-3">
          <Badge tone="accent" dot className="!text-xs font-bold uppercase tracking-wider !bg-green-600 !text-white border-none">
            KUBIKA Data & Market Intelligence (B2B)
          </Badge>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Observatório de Preços da Cesta Básica em Angola
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Inteligência de dados em tempo real para bancos, seguradoras, importadoras e instituições que precisam acompanhar a inflação real e o consumo das famílias angolanas.
          </p>
        </div>

        {/* Big Numbers */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 border-t border-white/10 pt-6">
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-green-400">18</p>
            <p className="text-xs text-slate-400 mt-1">Províncias Monitoradas</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#F6C23E]">~30%</p>
            <p className="text-xs text-slate-400 mt-1">Disparidade Formal vs. Informal</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">{totalVerifiedSellers}</p>
            <p className="text-xs text-slate-400 mt-1">Comerciantes Auditados</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-green-400">{totalProducts}</p>
            <p className="text-xs text-slate-400 mt-1">Itens Essenciais no Catálogo</p>
          </div>
        </div>
      </div>

      {/* Indicadores Regionais */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[#0B0B0D]">
            Índice de Preços Médios da Cesta Básica por Província
          </h2>
          <p className="text-xs text-[#687280]">
            Dados amostrais consolidados através da monitorização diária do KUBIKA em armazéns, supermercados e praças.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border bg-white shadow-xs">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F1F3F7] text-xs font-bold uppercase tracking-wider text-[#0B0B0D] border-b border-border">
              <tr>
                <th className="py-3.5 px-4">Província</th>
                <th className="py-3.5 px-4">Custo Médio Cesta (AOA)</th>
                <th className="py-3.5 px-4">Variação Mensal</th>
                <th className="py-3.5 px-4">Poupança no Mercado Informal</th>
                <th className="py-3.5 px-4">Rede Monitorizada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {PROVINCE_STATS.map((stat) => (
                <tr key={stat.province} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 font-semibold text-[#0B0B0D]">{stat.province}</td>
                  <td className="py-3.5 px-4 font-bold text-green-600">{stat.avgBasket}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                        stat.trend.startsWith("+")
                          ? "bg-red-50 text-red-700"
                          : "bg-green-50 text-green-700"
                      }`}
                    >
                      {stat.trend}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[#F6C23E]">{stat.informalDiff}</td>
                  <td className="py-3.5 px-4 text-xs text-[#687280]">{stat.activeSellers} estabelecimentos</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Seção Comercial B2B: Monetização e Venda de Relatórios */}
      <section className="rounded-2xl border border-green-600/30 bg-gradient-to-br from-green-50/50 via-white to-green-50/30 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <Badge tone="accent" dot className="!bg-green-600 !text-white border-none">Serviços Corporativos B2B</Badge>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0B0B0D]">
              Precisa de Relatórios Executivos ou Acesso à API de Preços?
            </h2>
            <p className="text-sm text-[#0B0B0D]">
              Fornecemos relatórios analíticos em formato PDF/Excel e API REST em tempo real para departamentos de compras, análise de risco financeiro, logística e consultoria económica.
            </p>
            <ul className="grid sm:grid-cols-2 gap-2 text-xs font-semibold text-[#0B0B0D] pt-2">
              <li>Séries temporais de preços por produto</li>
              <li>Comparativo de margens entre cadeias de distribuição</li>
              <li>Previsão de escassez e abastecimento regional</li>
              <li>Dados exportáveis via API para ERPs</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <a
              href="mailto:parcerias@kubika.ao?subject=Solicitação de Relatório de Mercado B2B — KUBIKA Data"
              className="inline-flex items-center justify-center rounded-xl bg-green-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-green-500 transition"
            >
              Solicitar Proposta B2B
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl border border-border bg-white px-6 py-3 text-sm font-semibold text-[#0B0B0D] hover:bg-slate-50 transition text-center"
            >
              Voltar à Comparação
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
