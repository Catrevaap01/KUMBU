"use client";

import { useActionState } from "react";
import { upgradeSellerPlanAction } from "@/lib/actions/sellers";
import { emptyActionState } from "@/lib/actions/types";
import { Badge } from "@/components/ui/Badge";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function SellerPlanCard({
  plan,
  productsCount,
  whatsappClicks,
  isFeatured,
}: {
  plan: string;
  productsCount: number;
  whatsappClicks: number;
  isFeatured: boolean;
}) {
  const [state, formAction] = useActionState(upgradeSellerPlanAction, emptyActionState);
  const isPro = plan === "PRO";

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {/* 1. Cartão do Plano SaaS */}
      <div className="sm:col-span-2 rounded-2xl border border-border bg-gradient-to-br from-white to-green-50/40 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Assinatura do Comerciante
            </span>
            <div className="mt-1 flex items-center gap-2">
              <h3 className="text-xl font-extrabold text-ink-900">
                {isPro ? "Plano KUMBU Pro ⭐" : "Plano Grátis (Freemium)"}
              </h3>
              <Badge tone={isPro ? "accent" : "neutral"}>
                {isPro ? "PRO ATIVO" : "BÁSICO"}
              </Badge>
              {isFeatured && <Badge tone="success" dot>Em Destaque</Badge>}
            </div>
          </div>

          <form action={formAction}>
            <input type="hidden" name="plan" value={isPro ? "FREE" : "PRO"} />
            <SubmitButton
              className={isPro ? "!bg-slate-700 hover:!bg-slate-800" : "!bg-green-700 hover:!bg-green-800"}
              pendingLabel="A atualizar plano…"
            >
              {isPro ? "Voltar ao Plano Grátis" : "Ativar Plano Pro (9.500 Kz/mês)"}
            </SubmitButton>
          </form>
        </div>

        {state.error ? (
          <p className="mt-3 text-xs text-red-600 bg-red-50 p-2 rounded-lg">{state.error}</p>
        ) : null}

        {/* Barra de Progresso / Limite de Produtos */}
        <div className="mt-4 pt-3 border-t border-border/70">
          <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
            <span>Limite de Produtos Ativos</span>
            <span>{isPro ? `${productsCount} produtos (Ilimitado)` : `${productsCount} de 5 produtos`}</span>
          </div>
          {!isPro ? (
            <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  productsCount >= 5 ? "bg-red-500" : "bg-green-600"
                }`}
                style={{ width: `${Math.min(100, (productsCount / 5) * 100)}%` }}
              />
            </div>
          ) : (
            <p className="text-xs text-green-700 font-medium">
              ✓ Pode publicar e gerir quantos produtos e preços desejar.
            </p>
          )}
        </div>

        {/* Benefícios do Plano Pro */}
        {!isPro ? (
          <div className="mt-3 grid gap-2 sm:grid-cols-2 text-xs text-slate-600">
            <span className="flex items-center gap-1.5 text-green-800 font-medium">
              ⭐ Posição prioritária no topo das pesquisas
            </span>
            <span className="flex items-center gap-1.5 text-green-800 font-medium">
              ⭐ Selo oficial de Comerciante Pro em Destaque
            </span>
          </div>
        ) : null}
      </div>

      {/* 2. Cartão de Métricas & Desempenho B2B */}
      <div className="rounded-2xl border border-border bg-white p-5 shadow-sm flex flex-col justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Impacto no Negócio
          </span>
          <p className="mt-2 text-3xl font-black text-ink-900">{whatsappClicks}</p>
          <p className="text-xs text-slate-600 mt-0.5">
            Contactos diretos de clientes recebidos via WhatsApp e Telefone.
          </p>
        </div>

        <div className="mt-4 border-t border-border/80 pt-3 text-[11px] text-slate-500">
          <span>Relatórios em tempo real de interesse e conversão comercial.</span>
        </div>
      </div>
    </div>
  );
}
