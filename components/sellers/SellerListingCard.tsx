import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ConfirmFlagButtons } from "@/components/priceReports/ConfirmFlagButtons";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { formatPrice, formatRelativeTime } from "@/lib/format";
import { STALE_INLINE_MESSAGE, type TrustLabel } from "@/lib/trust/labels";
import type { SellerListingView } from "@/lib/sellers/getSellerListings";

const TRUST_LABEL_TONE: Record<TrustLabel, "neutral" | "success" | "warning" | "danger"> = {
  "Novo registo": "neutral",
  "Confirmado pela comunidade": "success",
  "Vários relatos": "success",
  "Possivelmente desatualizado": "warning",
  "Sinalizado para revisão": "danger",
};

export function SellerListingCard({
  listing,
  seller,
  isAuthenticated,
  redirectPath,
  showCart = true,
}: {
  listing: SellerListingView;
  seller?: {
    id: string;
    businessName: string;
    city?: string;
    location?: string;
    contactPhone?: string | null;
    contactWhatsapp?: string | null;
  };
  isAuthenticated: boolean;
  redirectPath: string;
  showCart?: boolean;
}) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-border bg-white p-5 shadow-sm shadow-ink-900/5 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div>
        <div className="flex items-baseline justify-between gap-3">
          <Link
            href={`/products/${listing.product.id}`}
            className="font-semibold text-ink-900 hover:text-green-600"
          >
            {listing.product.name}
          </Link>
          <p className="text-xl font-bold tracking-tight text-ink-900">
            {formatPrice(listing.price, listing.currency)}
          </p>
        </div>

        <p className="text-xs text-slate-500 mt-0.5">Unidade: {listing.product.unit}</p>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <Badge tone="neutral">{listing.sourceLabel}</Badge>
          <Badge tone={TRUST_LABEL_TONE[listing.trustLabel]} dot>
            {listing.trustLabel}
          </Badge>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          Relatado {formatRelativeTime(listing.submittedAt)}
          {listing.confirmationCount > 0
            ? ` · ${listing.confirmationCount} ${listing.confirmationCount === 1 ? "confirmação" : "confirmações"}`
            : ""}
        </p>

        {listing.trustLabel === "Possivelmente desatualizado" ? (
          <p className="mt-2 rounded-lg bg-amber-500/10 px-2.5 py-1.5 text-xs text-amber-600">
            {STALE_INLINE_MESSAGE}
          </p>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/80 pt-3">
        {seller && showCart && (
          <AddToCartButton
            item={{
              reportId: listing.id,
              productId: listing.product.id,
              productName: listing.product.name,
              unit: listing.product.unit,
              price: listing.price,
              currency: listing.currency,
              sellerId: seller.id,
              sellerName: seller.businessName,
              sellerCity: seller.city,
              sellerLocation: seller.location,
              sellerPhone: seller.contactPhone,
              sellerWhatsapp: seller.contactWhatsapp,
            }}
          />
        )}

        <ConfirmFlagButtons
          priceReportId={listing.id}
          redirectPath={redirectPath}
          isAuthenticated={isAuthenticated}
          viewerHasConfirmed={listing.viewerHasConfirmed}
          viewerHasFlagged={listing.viewerHasFlagged}
        />
      </div>
    </div>
  );
}
