import Link from "next/link";
import { prisma } from "@/lib/db/client";
import { SearchBar } from "@/components/search/SearchBar";
import { KubikaLogo } from "@/components/ui/KubikaLogo";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";



const STEPS = [
  {
    title: "Compara",
    description: "Pesquise produtos da cesta básica e compare cotações entre supermercados, armazéns e bancadas de mercados informais.",
  },
  {
    title: "Poupa",
    description: "Encontre os menores preços e o melhor custo-benefício da sua província para poupar dinheiro em todas as compras.",
  },
  {
    title: "Escolhe Melhor",
    description: "Tome decisões com base em cotações atualizadas e compras diretas de estabelecimentos comerciais verificados.",
  },
];

const SELLER_TYPE_LABEL: Record<string, string> = {
  SUPERMARKET: "Supermercado",
  GROCERY: "Mercearia / Loja",
  WHOLESALER: "Grossista",
  MARKET_SELLER: "Bancada de Mercado",
  INDEPENDENT_RETAILER: "Retalhista",
};

export default async function HomePage() {
  const [products, verifiedSellers] = await Promise.all([
    prisma.product.findMany({ orderBy: { name: "asc" }, take: 8 }),
    prisma.seller.findMany({
      where: { verificationStatus: "VERIFIED" },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        _count: {
          select: { priceReports: { where: { moderationStatus: "ACTIVE" } } },
        },
      },
    }),
  ]);

  return (
    <main className="flex flex-col">
      {/* Hero Section otimizado para Desktop e Mobile */}
      <section className="bg-gradient-to-b from-white via-[#FFF8F0] to-[#FBFAFC] border-b border-border/60 animate-fade-in">
        <div className="container-page flex flex-col items-center gap-5 py-12 text-center sm:py-20">
          <KubikaLogo size="xl" variant="vertical" className="mb-1" />
          <h1 className="sr-only">KUBIKA — Compara. Poupa. Escolhe melhor.</h1>

          {/* Destaque Oficial: Garantia de Comerciantes Verificados */}
          <div className="inline-flex items-center gap-2 rounded-full border border-green-600/30 bg-green-50 px-4 py-1.5 text-xs font-bold text-[#0B0B0D] shadow-sm">
            <span className="flex size-2 rounded-full bg-green-600 animate-pulse" />
            <span>Preços e Produtos Exclusivos de Comerciantes Verificados</span>
          </div>

          <p className="max-w-md text-balance text-base font-semibold text-[#0B0B0D] sm:text-lg">
            Compare preços e encontre as melhores ofertas <span className="text-green-600">perto de si</span>.
          </p>

          <div className="w-full max-w-xl">
            <SearchBar />
          </div>


        </div>
      </section>

      {/* Destaque de Comerciantes Verificados se existirem */}
      {verifiedSellers.length > 0 && (
        <section className="container-page pt-10 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block size-2.5 rounded-full bg-green-600" />
                <h2 className="text-base font-bold text-[#0B0B0D] sm:text-lg">
                  Comerciantes Verificados em Destaque
                </h2>
                <Badge tone="success" dot>Auditados</Badge>
              </div>
              <p className="text-xs text-[#687280] mt-0.5">
                Estabelecimentos comerciais e bancadas com autenticidade confirmada pela equipa KUBIKA.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {verifiedSellers.map((seller) => (
              <Link
                key={seller.id}
                href={`/sellers/${seller.id}`}
                className="group flex flex-col justify-between rounded-2xl border border-border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-green-600/50 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-[#0B0B0D] group-hover:text-green-600">
                      {seller.businessName}
                    </span>
                    <Badge tone="success" dot className="!text-[10px]">
                      Verificado
                    </Badge>
                  </div>
                  <p className="text-xs text-[#687280] mt-1">
                    {SELLER_TYPE_LABEL[seller.sellerType] ?? seller.sellerType} · {seller.location}, {seller.city}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2 text-xs text-[#687280]">
                  <span>{seller._count.priceReports} {seller._count.priceReports === 1 ? "preço ativo" : "preços ativos"}</span>
                  <span className="font-semibold text-green-600 group-hover:underline">Ver catálogo →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}



      {/* Os 3 Pilares da Marca: Compara. Poupa. Escolhe Melhor. */}
      <section className="container-page py-10">
        <div className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className="rounded-2xl border border-border bg-white p-5 shadow-xs transition hover:border-green-600/30 hover:shadow-sm"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-green-100 text-sm font-black text-green-700">
                {index + 1}
              </span>
              <p className="mt-3 font-bold text-[#0B0B0D] text-base">{step.title}</p>
              <p className="mt-1 text-xs text-[#687280] leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {products.length > 0 ? (
        <section className="container-page pb-16">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#687280]">
                Cesta Básica Angolana em Destaque
              </p>
              <p className="text-xs text-green-600 font-semibold">
                Exibição de preços de comerciantes com verificação ativa
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group flex items-center gap-3 rounded-xl border border-border bg-white p-3.5 shadow-xs transition-all hover:-translate-y-0.5 hover:border-green-600/50 hover:shadow-md"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                  {product.name.charAt(0)}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-[#0B0B0D] group-hover:text-green-600">
                    {product.name}
                  </span>
                  <span className="block text-xs text-[#687280]">{product.unit}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <section className="container-page pb-16">
          <div className="rounded-2xl border border-dashed border-border bg-white p-8 text-center sm:p-12 shadow-xs">
            <h3 className="text-lg font-bold text-[#0B0B0D]">
              Produtos Publicados Exclusivamente por Comerciantes
            </h3>
            <p className="mx-auto mt-2 max-w-lg text-sm text-[#687280]">
              Sem produtos fictícios. Na KUBIKA, os produtos e preços são publicados diretamente por comerciantes e estabelecimentos reais de Angola.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Button href="/sellers/register">
                Registar Estabelecimento e Adicionar Produtos
              </Button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
