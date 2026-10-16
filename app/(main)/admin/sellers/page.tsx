import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/session";
import { getSellersForReview } from "@/lib/admin/getSellersForReview";
import { AdminNav } from "@/components/admin/AdminNav";
import { SellerReviewTable } from "@/components/admin/SellerReviewTable";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Comerciantes — Administração" };

import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function AdminSellersPage() {
  await requireAdmin("/admin/sellers");
  const sellers = await getSellersForReview();

  return (
    <main className="container-page flex flex-col gap-6 py-10">
      <AdminHeader />

      <AdminNav active="/admin/sellers" />

      {sellers.length === 0 ? (
        <EmptyState title="Nenhum comerciante registado ainda" />
      ) : (
        <SellerReviewTable sellers={sellers} />
      )}
    </main>
  );
}
