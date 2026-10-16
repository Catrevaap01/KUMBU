import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getSellerListings } from "@/lib/sellers/getSellerListings";
import { SellerListingsTable } from "@/components/dashboard/SellerListingsTable";
import { SellerPlanCard } from "@/components/dashboard/SellerPlanCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Painel do Comerciante — KUMBU" };

export default async function SellerDashboardPage() {
  const user = await requireUser("/dashboard/seller");
  if (!user.sellerId) redirect("/sellers/register");

  const result = await getSellerListings(user.sellerId, { viewerId: user.id });
  const listings = result?.listings ?? [];
  const seller = result?.seller;

  return (
    <main className="container-page flex flex-col gap-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink-900">Painel do Comerciante</h1>
          <p className="text-sm text-slate-600">
            {seller?.businessName} · {listings.length} {listings.length === 1 ? "produto ativo" : "produtos ativos"}
          </p>
        </div>
        <Button href="/dashboard/seller/prices/new">Adicionar Novo Preço</Button>
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
