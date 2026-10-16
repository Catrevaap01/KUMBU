import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/client";
import { formatPrice, formatRelativeTime } from "@/lib/format";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Painel do Consumidor — KUBIKA",
  description: "Acompanhe as suas compras, faturas, relatos de preços e economia familiar.",
};

export default async function ConsumerDashboardPage() {
  const sessionUser = await requireUser("/dashboard/consumer");

  if (sessionUser.systemRole === "ADMIN") {
    redirect("/admin");
  }

  const [user, myReports, myConfirmations] = await Promise.all([
    prisma.user.findUnique({
      where: { id: sessionUser.id },
      select: { name: true, email: true, createdAt: true, phone: true },
    }),
    prisma.priceReport.findMany({
      where: { submittedById: sessionUser.id },
      orderBy: { submittedAt: "desc" },
      take: 5,
      include: {
        product: { select: { id: true, name: true, unit: true } },
        seller: { select: { id: true, businessName: true, city: true } },
      },
    }),
    prisma.priceConfirmation.findMany({
      where: { userId: sessionUser.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        priceReport: {
          include: {
            product: { select: { id: true, name: true } },
            seller: { select: { businessName: true } },
          },
        },
      },
    }),
  ]);

  return (
    <main className="container-page py-10 space-y-8">
      {/* Banner de Boas-Vindas */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-[#0B0B0D] via-[#1A1815] to-[#2B1B0E] p-6 text-white shadow-md sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-block rounded-full bg-[#FF8A00] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
              Painel do Consumidor
            </span>
            <h1 className="mt-2 text-2xl font-black sm:text-3xl">
              Olá, {user?.name ?? "Consumidor"}!
            </h1>
            <p className="mt-1 text-sm text-green-100">
              Faça a gestão das suas compras, emita faturas e consulte os melhores preços nos mercados de Angola.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button href="/cart" className="!bg-[#FFB020] !text-ink-950 font-bold hover:!bg-amber-400">
              🛒 Ver Carrinho & Faturas
            </Button>
            <Button href="/" variant="ghost" className="!text-white border-white/30 hover:!bg-white/10">
              🔍 Comparar Preços
            </Button>
          </div>
        </div>
      </div>

      {/* Cartões de Ações Rápidas */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <span className="text-2xl">🛒</span>
          <h2 className="mt-2 text-base font-bold text-ink-900">Lista & Faturas</h2>
          <p className="mt-1 text-xs text-slate-500">
            Adicione itens de vários comerciantes ao seu carrinho e gere faturas únicas ou separadas.
          </p>
          <Link
            href="/cart"
            className="mt-3 inline-flex items-center text-xs font-bold text-green-700 hover:underline"
          >
            Aceder ao Carrinho &rarr;
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <span className="text-2xl">📢</span>
          <h2 className="mt-2 text-base font-bold text-ink-900">Contribuir com Preços</h2>
          <p className="mt-1 text-xs text-slate-500">
            Viu um bom preço no mercado? Partilhe com a comunidade e ajude outras famílias a poupar.
          </p>
          <Link
            href="/report-price"
            className="mt-3 inline-flex items-center text-xs font-bold text-green-700 hover:underline"
          >
            Reportar um Preço &rarr;
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <span className="text-2xl">🏪</span>
          <h2 className="mt-2 text-base font-bold text-ink-900">Vender no KUMBU</h2>
          <p className="mt-1 text-xs text-slate-500">
            Tem uma mercearia, bancada ou armazém? Registe a sua loja para divulgar produtos e receber encomendas.
          </p>
          <Link
            href="/sellers/register"
            className="mt-3 inline-flex items-center text-xs font-bold text-green-700 hover:underline"
          >
            Registar como Vendedor &rarr;
          </Link>
        </div>
      </div>

      {/* Contribuições e Histórico do Consumidor */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-ink-900">Os Seus Relatos de Preço Recentes</h2>
          <p className="text-xs text-slate-500 mb-4">Preços que você registou na comunidade.</p>

          {myReports.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">
              Ainda não reportou nenhum preço. Partilhe o que encontrar nos mercados para ajudar a comunidade!
            </p>
          ) : (
            <div className="divide-y divide-border">
              {myReports.map((report) => (
                <div key={report.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <Link href={`/products/${report.product.id}`} className="font-bold text-ink-900 hover:underline">
                      {report.product.name}
                    </Link>
                    <p className="text-slate-500">
                      {report.seller.businessName} ({report.seller.city})
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-green-700">
                      {formatPrice(Number(report.price), report.currency)}
                    </span>
                    <p className="text-[10px] text-slate-400">{formatRelativeTime(report.submittedAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-ink-900">Confirmações Comunitárias</h2>
          <p className="text-xs text-slate-500 mb-4">Preços que você validou como corretos.</p>

          {myConfirmations.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">
              Ainda não confirmou preços. Quando encontrar um preço correto no mercado, clique em &ldquo;Confirmar&rdquo; para validar para outros utilizadores!
            </p>
          ) : (
            <div className="divide-y divide-border">
              {myConfirmations.map((conf) => (
                <div key={conf.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-ink-900">
                      {conf.priceReport.product.name}
                    </p>
                    <p className="text-slate-500">{conf.priceReport.seller.businessName}</p>
                  </div>
                  <span className="rounded bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-800">
                    Confirmado ✓
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
