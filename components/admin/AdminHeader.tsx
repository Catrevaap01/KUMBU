import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/client";

export async function AdminHeader() {
  const user = await getCurrentUser();
  const dbUser = user
    ? await prisma.user.findUnique({
        where: { id: user.id },
        select: { name: true, email: true },
      })
    : null;

  return (
    <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-neutral-900 p-6 text-white shadow-lg sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-block rounded-full bg-slate-800 border border-slate-700 px-3 py-1 text-xs font-bold uppercase tracking-wider text-green-400">
              Modo de Administração Geral
            </span>
            <span className="inline-block rounded-full bg-red-950/80 border border-red-800/60 px-2.5 py-0.5 text-[11px] font-semibold text-red-300">
              Acesso Restrito
            </span>
          </div>

          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
            Centro de Controlo & Gestão do Sistema
          </h1>

          <p className="max-w-2xl text-xs sm:text-sm text-slate-300 leading-relaxed">
            Painel exclusivo para governança da plataforma KUBIKA. Audite cotações, aprove comerciantes locais, resolva denúncias de preços e supervisione contas de utilizadores.
          </p>

          <div className="pt-1 text-xs text-slate-400">
            Sessão autenticada como:{" "}
            <span className="font-semibold text-white">{dbUser?.name ?? "Administrador"}</span>{" "}
            {dbUser?.email ? <span className="text-slate-500">({dbUser.email})</span> : null}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
          <Link
            href="/admin/sellers"
            className="inline-flex items-center justify-center rounded-xl bg-green-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-green-500 transition text-center"
          >
            Revisar Comerciantes
          </Link>
          <Link
            href="/admin/flags"
            className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/10 transition text-center"
          >
            Fila de Denúncias
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center text-xs font-medium text-slate-400 hover:text-white transition text-center pt-1"
          >
            Ver Plataforma como Visitante &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
