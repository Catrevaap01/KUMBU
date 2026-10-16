import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ConfirmFlagButtons } from "@/components/priceReports/ConfirmFlagButtons";
import { SellerContactButtons } from "@/components/contact/SellerContactButtons";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { cn } from "@/lib/cn";
import { formatPrice, formatRelativeTime } from "@/lib/format";
import { STALE_INLINE_MESSAGE, type TrustLabel } from "@/lib/trust/labels";
import type { PriceReportView } from "@/lib/products/getProductComparison";

const TRUST_LABEL_TONE: Record<TrustLabel, "neutral" | "success" | "warning" | "danger"> = {
  "Novo registo": "neutral",
  "Confirmado pela comunidade": "success",
  "Vários relatos": "success",
  "Possivelmente desatualizado": "warning",
  "Sinalizado para revisão": "danger",
};

const AVAILABILITY_LABEL: Record<string, { text: string; tone: "success" | "danger" } | null> = {
  IN_STOCK: { text: "Em stock", tone: "success" },
  OUT_OF_STOCK: { text: "Esgotado", tone: "danger" },
  UNKNOWN: null,
};

export function PriceReportCard({
  report,
  product,
  isBestValue,
  isLowestReported,
  isAuthenticated,
  redirectPath,
  showCart = true,
}: {
  report: PriceReportView;
  product?: { id: string; name: string; category?: string; unit: string };
  isBestValue?: boolean;
  isLowestReported?: boolean;
  isAuthenticated: boolean;
  redirectPath: string;
  showCart?: boolean;
}) {
  const availability = AVAILABILITY_LABEL[report.availability];
  const highlighted = isBestValue || isLowestReported;

  return (
    <div
      className={cn(
        "relative flex flex-col justify-between rounded-2xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
        isBestValue
          ? "border-amber-500/50 shadow-amber-500/10 ring-1 ring-amber-500/30"
          : isLowestReported
            ? "border-green-600/40 shadow-green-600/10 ring-1 ring-green-600/20"
            : "border-border shadow-ink-900/5",
      )}
    >
      <div>
        {highlighted ? (
          <div className="mb-3 flex flex-wrap gap-2">
            {isBestValue ? <Badge tone="accent">MELHOR VALOR</Badge> : null}
            {isLowestReported ? <Badge tone="success" dot>MENOR PREÇO</Badge> : null}
          </div>
        ) : null}

        <div className="flex items-baseline justify-between gap-3">
          <p className="text-3xl font-extrabold tracking-tight text-ink-900">
            {formatPrice(report.price, report.currency)}
          </p>
          {availability ? <Badge tone={availability.tone} dot>{availability.text}</Badge> : null}
        </div>

        <Link
          href={`/sellers/${report.seller.id}`}
          className="mt-2 block text-sm font-semibold text-ink-900 hover:text-green-600"
        >
          {report.seller.businessName}
        </Link>
        <p className="text-sm text-slate-600">
          {report.seller.location}, {report.seller.city}, {report.seller.countryLabel}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <Badge tone="neutral">{report.sourceLabel}</Badge>
          <Badge tone={TRUST_LABEL_TONE[report.trustLabel]} dot>
            {report.trustLabel}
          </Badge>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          Relatado {formatRelativeTime(report.submittedAt)}
          {report.confirmationCount > 0
            ? ` · ${report.confirmationCount} ${report.confirmationCount === 1 ? "confirmação" : "confirmações"}`
            : ""}
        </p>

        {report.trustLabel === "Possivelmente desatualizado" ? (
          <p className="mt-2 rounded-lg bg-amber-500/10 px-2.5 py-1.5 text-xs text-amber-600">
            {STALE_INLINE_MESSAGE}
          </p>
        ) : null}

        {report.notes ? <p className="mt-2 text-sm text-slate-600">{report.notes}</p> : null}
      </div>

      <div className="mt-5 space-y-3 border-t border-border/80 pt-4">
        {/* Contacto directo com o Vendedor (WhatsApp ou Ligação) */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <SellerContactButtons
            sellerName={report.seller.businessName}
            contactPhone={report.seller.contactPhone}
            contactWhatsapp={report.seller.contactWhatsapp}
            productContext={
              product
                ? {
                    name: product.name,
                    price: report.price,
                    currency: report.currency,
                  }
                : undefined
            }
            compact
          />

          {product && showCart && (
            <AddToCartButton
              item={{
                reportId: report.id,
                productId: product.id,
                productName: product.name,
                category: product.category,
                unit: product.unit,
                price: report.price,
                currency: report.currency,
                sellerId: report.seller.id,
                sellerName: report.seller.businessName,
                sellerCity: report.seller.city,
                sellerLocation: report.seller.location,
                sellerPhone: report.seller.contactPhone,
                sellerWhatsapp: report.seller.contactWhatsapp,
              }}
            />
          )}
        </div>

        <ConfirmFlagButtons
          priceReportId={report.id}
          redirectPath={redirectPath}
          isAuthenticated={isAuthenticated}
          viewerHasConfirmed={report.viewerHasConfirmed}
          viewerHasFlagged={report.viewerHasFlagged}
        />
      </div>
    </div>
  );
}
