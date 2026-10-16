import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getSellerListings } from "@/lib/sellers/getSellerListings";
import { SellerListingsTable } from "@/components/dashboard/SellerListingsTable";
import { SellerPlanCard } from "@/components/dashboard/SellerPlanCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Painel do Comerciante — KUBIKA" };

import Link from "next/link";

export default async function SellerDashboardPage() {
  const user = await requireUser("/dashboard/seller");
  if (!user.sellerId) redirect("/sellers/register");

  const result = await getSellerListings(user.sellerId, { viewerId: user.id });
  const listings = result?.listings ?? [];
  const seller = result?.seller;

  return (
    <main className="container-page flex flex-col gap-6 py-10">
      {/* Banner Oficial do Comerciante */}
      <div className="rounded-2xl border border-green-800/40 bg-gradient-to-r from-ink-950 via-ink-900 to-[#0d3d24] p-6 text-white shadow-md sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-block rounded-full bg-green-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                Painel do Comerciante
              </span>
              <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                seller?.verificationStatus === "VERIFIED"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
              }`}>
                {seller?.verificationStatus === "VERIFIED" ? "Loja Verificada" : "Em Análise"}
              </span>
              {seller?.plan === "PRO" && (
                <span className="inline-block rounded-full bg-amber-400 text-ink-950 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">
                  PRO
                </span>
              )}
            </div>

            <h1 className="text-2xl font-black tracking-tight sm:text-3xl text-white">
              {seller?.businessName ?? "Minha Loja"}
            </h1>

            <p className="max-w-xl text-xs sm:text-sm text-green-100/80">
              {seller?.location ? `${seller.location}, ` : ""}{seller?.city ?? "Angola"} · {listings.length} {listings.length === 1 ? "produto ativo no catálogo" : "produtos ativos no catálogo"}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-300">
              <span>Localização: <strong className="text-white">{seller?.city}, {seller?.location}</strong></span>
              <span>·</span>
              <span>Contacto: <strong className="text-white">{seller?.contactPhone || seller?.contactWhatsapp || "Não configurado"}</strong></span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
            <Button href="/dashboard/seller/prices/new" className="!bg-green-600 hover:!bg-green-500 text-white font-bold text-center">
              Adicionar Novo Preço
            </Button>
            {seller && (
              <Link
                href={`/sellers/${seller.id}`}
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 transition text-center"
              >
                Ver Como Cliente
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Cartão de Assinatura Freemium & Métricas */}
      {seller && (
        <SellerPlanCard
          plan={seller.plan}
          productsCount={listings.length}
          whatsappClicks={seller.whatsappClicks}
          isFeatured={seller.isFeatured}
        />
      )}

      {/* Tabela de Preços e Anúncios */}
      {listings.length === 0 ? (
        <EmptyState
          title="Ainda não publicou nenhum preço"
          description="Adicione o seu primeiro preço para que os consumidores locais possam encontrar, comparar e encomendar os seus produtos."
          action={<Button href="/dashboard/seller/prices/new">Adicionar preço</Button>}
        />
      ) : (
        <SellerListingsTable listings={listings} />
      )}
    </main>
  );
}
