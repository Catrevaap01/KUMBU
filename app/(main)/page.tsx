import Link from "next/link";
import { prisma } from "@/lib/db/client";
import { SearchBar } from "@/components/search/SearchBar";
import { KumbuLogo } from "@/components/ui/KumbuLogo";
import { Badge } from "@/components/ui/Badge";

const STEPS = [
  {
    title: "Compara",
    description: "Pesquise por produtos da cesta básica e compare preços entre supermercados, armazéns e bancadas de mercados informais.",
  },
  {
    title: "Poupa",
    description: "Encontre os menores preços e os melhores custos-benefícios da sua província para poupar dinheiro todos os dias.",
  },
  {
    title: "Escolhe Melhor",
    description: "Tome decisões com base em dados atualizados e preços exclusivos de estabelecimentos comerciais verificados.",
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
      <section className="hero-surface animate-fade-in">
        <div className="container-page flex flex-col items-center gap-6 py-16 text-center sm:py-24">
          <KumbuLogo size="xl" variant="vertical" className="mb-2" />
          <h1 className="sr-only">KUMBU — Compara. Poupa. Escolhe melhor.</h1>

          {/* Destaque Oficial: Garantia de Comerciantes Verificados */}
          <div className="inline-flex items-center gap-2 rounded-full border border-green-600/30 bg-green-50 px-4 py-1.5 text-xs font-semibold text-green-900 shadow-sm">
            <span className="flex size-2 rounded-full bg-green-600 animate-pulse" />
            <span>Destaque: Preços e Produtos Exclusivos de Comerciantes Verificados ✓</span>
          </div>

          <p className="max-w-lg text-balance text-base font-medium text-slate-600 sm:text-lg">
            Os melhores preços, em todos os mercados. A inteligência de quem compara para poupar no seu dia a dia em Angola.
          </p>
          <SearchBar />
        </div>
      </section>

      {/* Destaque de Comerciantes Verificados se existirem */}
      {verifiedSellers.length > 0 && (
        <section className="container-page pt-10 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block size-2.5 rounded-full bg-green-600" />
                <h2 className="text-base font-bold text-ink-900 sm:text-lg">
                  Comerciantes Verificados em Destaque
                </h2>
                <Badge tone="success" dot>Auditados</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Estabelecimentos comerciais e bancadas com autenticidade confirmada pela equipa KUMBU.
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
                    <span className="font-bold text-ink-900 group-hover:text-green-700">
                      {seller.businessName}
                    </span>
                    <Badge tone="success" dot className="!text-[10px]">
                      Verificado
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    {SELLER_TYPE_LABEL[seller.sellerType] ?? seller.sellerType} · {seller.location}, {seller.city}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2 text-xs text-slate-500">
                  <span>{seller._count.priceReports} {seller._count.priceReports === 1 ? "preço ativo" : "preços ativos"}</span>
                  <span className="font-semibold text-green-700 group-hover:underline">Ver catálogo →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="container-page py-10">
        <div className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className="rounded-2xl border border-border bg-white p-5 shadow-sm shadow-ink-900/5"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-green-600/10 text-sm font-bold text-green-600">
                {index + 1}
              </span>
              <p className="mt-3 font-semibold text-ink-900">{step.title}</p>
              <p className="mt-1 text-sm text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {products.length > 0 ? (
        <section className="container-page pb-16">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Cesta Básica Angolana em Destaque
              </p>
              <p className="text-xs text-green-700 font-medium">
                ✓ Exibição de preços de comerciantes com verificação ativa
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group flex items-center gap-3 rounded-xl border border-border bg-white p-3.5 shadow-sm shadow-ink-900/5 transition-all hover:-translate-y-0.5 hover:border-green-600/40 hover:shadow-md"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-green-600/10 text-sm font-bold text-green-600">
                  {product.name.charAt(0)}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink-900 group-hover:text-green-600">
                    {product.name}
                  </span>
                  <span className="block text-xs text-slate-500">{product.unit}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
