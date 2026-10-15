import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/session";
import { getAdminOverview } from "@/lib/admin/getAdminOverview";
import { AdminNav } from "@/components/admin/AdminNav";
import { formatRelativeTime } from "@/lib/format";

import Link from "next/link";

export const metadata: Metadata = { title: "Visão Geral — Administração" };

const METRICS = [
  { key: "openFlagCount", label: "Denúncias abertas", href: "/admin/flags" },
  { key: "sellerCount", label: "Comerciantes", href: "/admin/sellers" },
  { key: "activeReportCount", label: "Relatos de preço ativos", href: null },
  { key: "userCount", label: "Utilizadores", href: "/admin/users" },
] as const;

export default async function AdminOverviewPage() {
  await requireAdmin("/admin");
  const overview = await getAdminOverview();

  return (
    <main className="container-page flex flex-col gap-6 py-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink-900">Administração</h1>
        <p className="text-sm text-slate-600">Moderação e atividade da plataforma.</p>
      </div>

      <AdminNav active="/admin" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((metric) => {
          const content = (
            <div className="h-full rounded-2xl border border-border bg-white p-5 shadow-sm shadow-ink-900/5 transition hover:border-green-600 hover:shadow-md">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{metric.label}</p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-ink-900">{overview[metric.key]}</p>
              {metric.href && (
                <span className="mt-2 inline-flex items-center text-xs font-semibold text-green-700 hover:underline">
                  Gerir &rarr;
                </span>
              )}
            </div>
          );

          return metric.href ? (
            <Link key={metric.key} href={metric.href} className="block">
              {content}
            </Link>
          ) : (
            <div key={metric.key}>{content}</div>
          );
        })}
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-ink-900">Atividade recente</p>
        {overview.recentAuditLog.length === 0 ? (
          <p className="text-sm text-slate-600">Nenhuma atividade de moderação ainda.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {overview.recentAuditLog.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between rounded-lg border border-border bg-white px-4 py-2.5 text-sm"
              >
                <span className="text-ink-900">
                  <span className="font-medium">{entry.actorName}</span> — {entry.action.replaceAll("_", " ")}
                </span>
                <span className="text-xs text-slate-500">{formatRelativeTime(entry.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
