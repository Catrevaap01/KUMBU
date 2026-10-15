import Link from "next/link";
import { prisma } from "@/lib/db/client";
import { SearchBar } from "@/components/search/SearchBar";
import { KumbuLogo } from "@/components/ui/KumbuLogo";

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
    description: "Tome decisões com base em dados atualizados e relatos verificados pela comunidade angolana.",
  },
];

export default async function HomePage() {
  const products = await prisma.product.findMany({ orderBy: { name: "asc" }, take: 8 });

  return (
    <main className="flex flex-col">
      <section className="hero-surface animate-fade-in">
        <div className="container-page flex flex-col items-center gap-6 py-16 text-center sm:py-24">
          <KumbuLogo size="xl" variant="vertical" className="mb-2" />
          <h1 className="sr-only">KUMBU — Compara. Poupa. Escolhe melhor.</h1>
          <p className="max-w-lg text-balance text-base font-medium text-slate-600 sm:text-lg">
            Os melhores preços, em todos os mercados. A inteligência de quem compara para poupar no seu dia a dia em Angola.
          </p>
          <SearchBar />
        </div>
      </section>

      <section className="container-page py-12">
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
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Produtos da Cesta Básica em Destaque
          </p>
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
