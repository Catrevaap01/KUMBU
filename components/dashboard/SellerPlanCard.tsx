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
      <div className="sm:col-span-2 rounded-2xl border border-border bg-gradient-to-br from-white to-[#FFF6EB] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#687280]">
              Assinatura do Estabelecimento
            </span>
            <div className="mt-1 flex items-center gap-2">
              <h3 className="text-xl font-extrabold text-[#0B0B0D]">
                {isPro ? "Plano KUBIKA Pro ⭐" : "Plano Grátis (Freemium)"}
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
              className={isPro ? "!bg-[#0B0B0D] hover:!bg-[#1E1F24]" : "!bg-[#FF8A00] hover:!bg-[#E67A00] text-white"}
              pendingLabel="A atualizar plano…"
            >
              {isPro ? "Mudar para Grátis" : "Ativar KUBIKA Pro (9.500 Kz/mês)"}
            </SubmitButton>
          </form>
        </div>

        {state.error ? (
          <p className="mt-3 text-xs text-red-600 bg-red-50 p-2 rounded-lg">{state.error}</p>
        ) : null}

        {/* Barra de Progresso / Limite de Produtos */}
        <div className="mt-4 pt-3 border-t border-border/70">
          <div className="flex justify-between text-xs font-semibold text-[#0B0B0D] mb-1">
            <span>Limite de Produtos Ativos</span>
            <span>{isPro ? `${productsCount} produtos (Ilimitado)` : `${productsCount} de 5 produtos`}</span>
          </div>
          {!isPro ? (
            <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  productsCount >= 5 ? "bg-red-500" : "bg-[#FF8A00]"
                }`}
                style={{ width: `${Math.min(100, (productsCount / 5) * 100)}%` }}
              />
            </div>
          ) : (
            <p className="text-xs text-[#FF8A00] font-semibold">
              ✓ Pode publicar e gerir cotações de quantos produtos desejar.
            </p>
          )}
        </div>

        {/* Benefícios do Plano Pro */}
        {!isPro ? (
          <div className="mt-3 grid gap-2 sm:grid-cols-2 text-xs text-[#687280]">
            <span className="flex items-center gap-1.5 text-[#0B0B0D] font-medium">
              ⭐ Posição prioritária no topo das pesquisas
            </span>
            <span className="flex items-center gap-1.5 text-[#0B0B0D] font-medium">
              ⭐ Selo oficial de Comerciante KUBIKA Pro
            </span>
          </div>
        ) : null}
      </div>

      {/* 2. Cartão de Métricas & Desempenho B2B */}
      <div className="rounded-2xl border border-border bg-white p-5 shadow-xs flex flex-col justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#687280]">
            Impacto no Negócio
          </span>
          <p className="mt-2 text-3xl font-black text-[#0B0B0D]">{whatsappClicks}</p>
          <p className="text-xs text-[#687280] mt-0.5">
            Contactos diretos de clientes recebidos via WhatsApp e Telefone.
          </p>
        </div>

        <div className="mt-4 border-t border-border/80 pt-3 text-[11px] text-[#687280]">
          <span>Métricas em tempo real de interesse e conversão comercial na KUBIKA.</span>
        </div>
      </div>
    </div>
  );
}
