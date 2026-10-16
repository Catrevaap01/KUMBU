import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/session";
import { getFlagsQueue } from "@/lib/admin/getFlagsQueue";
import { AdminNav } from "@/components/admin/AdminNav";
import { FlagsQueueTable } from "@/components/admin/FlagsQueueTable";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Denúncias — Administração" };

import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function AdminFlagsPage() {
  await requireAdmin("/admin/flags");
  const flags = await getFlagsQueue();

  return (
    <main className="container-page flex flex-col gap-6 py-10">
      <AdminHeader />

      <AdminNav active="/admin/flags" />

      {flags.length === 0 ? (
        <EmptyState title="Nenhuma denúncia em aberto" description="Todas as denúncias submetidas foram resolvidas." />
      ) : (
        <FlagsQueueTable flags={flags} />
      )}
    </main>
  );
}
