"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { updateUserRoleAction } from "@/lib/actions/admin";
import type { AdminUserItem } from "@/lib/admin/getUsersForAdmin";

export function UserManagementTable({
  users,
  currentAdminId,
}: {
  users: AdminUserItem[];
  currentAdminId: string;
}) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "ADMIN" | "SELLER" | "USER">("ALL");
  const [isPending, startTransition] = useTransition();

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.phone && u.phone.includes(search)) ||
      (u.seller && u.seller.businessName.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    if (roleFilter === "ADMIN") return u.systemRole === "ADMIN";
    if (roleFilter === "SELLER") return Boolean(u.seller);
    if (roleFilter === "USER") return u.systemRole === "USER" && !u.seller;
    return true;
  });

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.systemRole === "ADMIN").length;
  const sellerCount = users.filter((u) => Boolean(u.seller)).length;
  const totalReports = users.reduce((acc, u) => acc + u.submittedReportsCount, 0);

  const handleRoleToggle = (userId: string, newRole: "ADMIN" | "USER", userName: string) => {
    const actionText = newRole === "ADMIN" ? "promover a Administrador" : "alterar para Utilizador Comum";
    if (!window.confirm(`Tem certeza que deseja ${actionText} o utilizador "${userName}"?`)) {
      return;
    }

    startTransition(async () => {
      try {
        await updateUserRoleAction(userId, newRole);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Erro ao atualizar permissões.");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Cadastrados</p>
          <p className="mt-1.5 text-2xl font-extrabold text-ink-900">{totalUsers}</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">Administradores</p>
          <p className="mt-1.5 text-2xl font-extrabold text-amber-600">{adminCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-green-700">Comerciantes</p>
          <p className="mt-1.5 text-2xl font-extrabold text-green-700">{sellerCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Relatos Gerados</p>
          <p className="mt-1.5 text-2xl font-extrabold text-ink-900">{totalReports}</p>
        </div>
      </div>

      {/* Barra de Pesquisa e Filtros */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar por nome, email, telefone ou loja..."
            className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-sm text-ink-900 placeholder:text-slate-400 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setRoleFilter("ALL")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              roleFilter === "ALL"
                ? "bg-ink-900 text-white"
                : "bg-white text-slate-600 border border-border hover:bg-mist"
            }`}
          >
            Todos ({totalUsers})
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter("ADMIN")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              roleFilter === "ADMIN"
                ? "bg-amber-500 text-ink-950 font-bold"
                : "bg-white text-slate-600 border border-border hover:bg-mist"
            }`}
          >
            Admins ({adminCount})
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter("SELLER")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              roleFilter === "SELLER"
                ? "bg-green-700 text-white"
                : "bg-white text-slate-600 border border-border hover:bg-mist"
            }`}
          >
            Comerciantes ({sellerCount})
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter("USER")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              roleFilter === "USER"
                ? "bg-slate-700 text-white"
                : "bg-white text-slate-600 border border-border hover:bg-mist"
            }`}
          >
            Consumidores
          </button>
        </div>
      </div>

      {/* Lista / Tabela de Utilizadores */}
      {filteredUsers.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white p-12 text-center">
          <p className="text-base font-semibold text-ink-900">Nenhum utilizador encontrado</p>
          <p className="mt-1 text-sm text-slate-500">Tente ajustar os termos de pesquisa ou remover os filtros aplicados.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="border-b border-border bg-slate-50/75 text-xs font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th scope="col" className="px-5 py-3.5">Utilizador</th>
                  <th scope="col" className="px-5 py-3.5">Função</th>
                  <th scope="col" className="px-5 py-3.5">Comércio Vinculado</th>
                  <th scope="col" className="px-5 py-3.5 text-center">Contribuições</th>
                  <th scope="col" className="px-5 py-3.5">Data de Registo</th>
                  <th scope="col" className="px-5 py-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => {
                  const isCurrentAdmin = user.id === currentAdminId;
                  const initials = user.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase();

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition">
                      {/* Dados Principais */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                            user.systemRole === "ADMIN"
                              ? "bg-amber-100 text-amber-800 border border-amber-300"
                              : "bg-green-100 text-green-800 border border-green-300"
                          }`}>
                            {initials}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-ink-900">{user.name}</span>
                              {isCurrentAdmin && (
                                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                                  Você
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500">{user.email}</p>
                            {user.phone && <p className="text-[11px] text-slate-400">{user.phone}</p>}
                          </div>
                        </div>
                      </td>

                      {/* Função */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {user.systemRole === "ADMIN" ? (
                          <Badge tone="accent" dot>
                            Administrador
                          </Badge>
                        ) : user.seller ? (
                          <Badge tone="success">
                            Vendedor
                          </Badge>
                        ) : (
                          <Badge tone="neutral">
                            Consumidor
                          </Badge>
                        )}
                      </td>

                      {/* Negócio */}
                      <td className="px-5 py-4">
                        {user.seller ? (
                          <div>
                            <Link
                              href={`/sellers/${user.seller.id}`}
                              className="font-medium text-green-700 hover:underline"
                            >
                              {user.seller.businessName}
                            </Link>
                            <p className="text-xs text-slate-500">
                              {user.seller.city ?? "Angola"} · {user.seller.verificationStatus}
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>

                      {/* Contribuições */}
                      <td className="px-5 py-4 text-center whitespace-nowrap">
                        <div className="inline-flex items-center gap-2 text-xs">
                          <span className="rounded-md bg-slate-100 px-2 py-1 font-semibold text-slate-700" title="Relatos de Preço">
                            {user.submittedReportsCount} relatos
                          </span>
                          {user.confirmationsCount > 0 && (
                            <span className="rounded-md bg-green-50 px-2 py-1 font-semibold text-green-700" title="Confirmações de Preço">
                              {user.confirmationsCount} conf.
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Data de Registo */}
                      <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-500">
                        {new Date(user.createdAt).toLocaleDateString("pt-AO", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Ações */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        {isCurrentAdmin ? (
                          <span className="text-xs italic text-slate-400">Conta atual</span>
                        ) : user.systemRole === "ADMIN" ? (
                          <Button
                            type="button"
                            variant="danger"
                            disabled={isPending}
                            onClick={() => handleRoleToggle(user.id, "USER", user.name)}
                            className="!px-3 !py-1 text-xs"
                          >
                            Remover Admin
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            variant="ghost"
                            disabled={isPending}
                            onClick={() => handleRoleToggle(user.id, "ADMIN", user.name)}
                            className="!px-3 !py-1 text-xs text-amber-700 hover:bg-amber-50 border border-amber-300"
                          >
                            Promover a Admin
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
