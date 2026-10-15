"use client";

import Link from "next/link";
import { updateSellerVerificationAction } from "@/lib/actions/admin";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { SellerReviewItem } from "@/lib/admin/getSellersForReview";

const STATUS_TONE = {
  UNVERIFIED: "neutral",
  VERIFIED: "success",
  SUSPENDED: "danger",
} as const;

const STATUS_LABEL = {
  UNVERIFIED: "Não verificado",
  VERIFIED: "Verificado",
  SUSPENDED: "Suspenso",
} as const;

function StatusActions({ sellerId, status }: { sellerId: string; status: SellerReviewItem["verificationStatus"] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {status !== "VERIFIED" ? (
        <form action={updateSellerVerificationAction.bind(null, sellerId, "VERIFIED")}>
          <Button type="submit" variant="ghost" className="!px-3 !py-1.5 text-xs">
            Verificar
          </Button>
        </form>
      ) : null}
      {status !== "SUSPENDED" ? (
        <form
          action={updateSellerVerificationAction.bind(null, sellerId, "SUSPENDED")}
          onSubmit={(event) => {
            if (!window.confirm("Suspender este comerciante? Os seus anúncios continuarão visíveis mas identificados como suspensos.")) {
              event.preventDefault();
            }
          }}
        >
          <Button type="submit" variant="danger" className="!px-3 !py-1.5 text-xs">
            Suspender
          </Button>
        </form>
      ) : null}
      {status !== "UNVERIFIED" ? (
        <form action={updateSellerVerificationAction.bind(null, sellerId, "UNVERIFIED")}>
          <Button type="submit" variant="ghost" className="!px-3 !py-1.5 text-xs">
            Definir como não verificado
          </Button>
        </form>
      ) : null}
    </div>
  );
}

export function SellerReviewTable({ sellers }: { sellers: SellerReviewItem[] }) {
  return (
    <div className="flex flex-col gap-4">
      {sellers.map((seller) => (
        <div key={seller.id} className="rounded-2xl border border-border bg-white p-5 shadow-sm shadow-ink-900/5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/sellers/${seller.id}`} className="font-semibold text-ink-900 hover:text-green-600">
                  {seller.businessName}
                </Link>
                <Badge tone={STATUS_TONE[seller.verificationStatus]} dot>
                  {STATUS_LABEL[seller.verificationStatus]}
                </Badge>
                {!seller.hasAccount ? <Badge tone="neutral">Comércio informal — sem conta</Badge> : null}
                {seller.openFlagCount > 0 ? (
                  <Badge tone="danger">
                    {seller.openFlagCount} {seller.openFlagCount === 1 ? "denúncia aberta" : "denúncias abertas"}
                  </Badge>
                ) : null}
              </div>
              <p className="mt-1 text-sm text-slate-600">
                {seller.location}, {seller.city}, {seller.countryLabel} · {seller.activeListingCount} {seller.activeListingCount === 1 ? "anúncio ativo" : "anúncios ativos"}
              </p>
            </div>
            <StatusActions sellerId={seller.id} status={seller.verificationStatus} />
          </div>
        </div>
      ))}
    </div>
  );
}
