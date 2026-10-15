import { notFound } from "next/navigation";
import { getSellerListings } from "@/lib/sellers/getSellerListings";
import { SellerListingCard } from "@/components/sellers/SellerListingCard";
import { SellerContactButtons } from "@/components/contact/SellerContactButtons";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { getCurrentUser } from "@/lib/auth/session";
import { COUNTRY_LABEL } from "@/lib/validation/country";

const SELLER_TYPE_LABEL: Record<string, string> = {
  SUPERMARKET: "Supermercado",
  GROCERY: "Mini-mercado / Mercearia",
  WHOLESALER: "Armazém Grossista",
  MARKET_SELLER: "Bancada de Mercado / Vendedor Informal",
  INDEPENDENT_RETAILER: "Retalhista Independente",
};

export default async function SellerPage({
  params,
}: {
  params: Promise<{ sellerId: string }>;
}) {
  const { sellerId } = await params;
  const user = await getCurrentUser();
  const result = await getSellerListings(sellerId, { viewerId: user?.id });
  if (!result) notFound();

  const { seller, listings } = result;

  return (
    <main className="flex flex-col">
      <div className="hero-surface border-b border-border">
        <div className="container-page flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-8">
          <div className="flex items-center gap-4">
            <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-green-700/10 text-2xl font-black text-green-700 border border-green-200">
              {seller.businessName.charAt(0)}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
                  {seller.businessName}
                </h1>
                {seller.verificationStatus === "VERIFIED" ? (
                  <Badge tone="success" dot>
                    Verificado
                  </Badge>
                ) : null}
              </div>
              <p className="text-sm text-slate-600 mt-0.5">
                {SELLER_TYPE_LABEL[seller.sellerType] ?? seller.sellerType} · {seller.location},{" "}
                {seller.city}, {COUNTRY_LABEL[seller.country]}
              </p>
            </div>
          </div>

          {/* Botões de Contacto Directo */}
          <div className="flex flex-col sm:items-end gap-1.5">
            <span className="text-xs font-semibold text-slate-500">Contactar Estabelecimento:</span>
            <SellerContactButtons
              sellerName={seller.businessName}
              contactPhone={seller.contactPhone}
              contactWhatsapp={seller.contactWhatsapp}
            />
          </div>
        </div>
      </div>

      <div className="container-page py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink-900">
            Produtos e Preços Registados ({listings.length})
          </h2>
          <span className="text-xs text-slate-500">
            Adicione ao carrinho ou envie encomenda direta via WhatsApp
          </span>
        </div>

        {listings.length === 0 ? (
          <EmptyState title="Este comerciante ainda não possui preços ativos registados." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {listings.map((listing) => (
              <SellerListingCard
                key={listing.id}
                listing={listing}
                seller={seller}
                isAuthenticated={Boolean(user)}
                redirectPath={`/sellers/${seller.id}`}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
