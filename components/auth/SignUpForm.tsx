"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signUpAction } from "@/lib/actions/auth";
import { emptyActionState } from "@/lib/actions/types";
import { sellerTypes, SELLER_TYPE_LABEL } from "@/lib/validation/priceReport";
import { ANGOLA_PROVINCES } from "@/lib/validation/country";
import { Field, Input, Select } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function SignUpForm({ from }: { from?: string }) {
  const [state, formAction] = useActionState(signUpAction, emptyActionState);
  const [accountType, setAccountType] = useState<"CONSUMER" | "SELLER">("CONSUMER");

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <input type="hidden" name="from" value={from ?? ""} />
      <input type="hidden" name="accountType" value={accountType} />

      {state.error ? (
        <p role="alert" className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      {/* Seleção de Tipo de Perfil */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
          Eu pretendo criar conta como:
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => setAccountType("CONSUMER")}
            className={`flex flex-col items-center justify-center rounded-xl border p-3.5 text-center transition ${
              accountType === "CONSUMER"
                ? "border-green-600 bg-green-50/70 text-green-900 shadow-sm ring-1 ring-green-600"
                : "border-border bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <span className="font-bold text-sm">Consumidor</span>
            <span className="mt-0.5 text-[11px] text-slate-500">
              Pesquisar, comparar e criar carrinho/faturas
            </span>
          </button>

          <button
            type="button"
            onClick={() => setAccountType("SELLER")}
            className={`flex flex-col items-center justify-center rounded-xl border p-3.5 text-center transition ${
              accountType === "SELLER"
                ? "border-green-600 bg-green-50/70 text-green-900 shadow-sm ring-1 ring-green-600"
                : "border-border bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <span className="font-bold text-sm">Vendedor / Loja</span>
            <span className="mt-0.5 text-[11px] text-slate-500">
              Publicar preços e gerir catálogo de produtos
            </span>
          </button>
        </div>
      </div>

      {/* Campos Pessoais Básicos */}
      <Field label="Nome completo" htmlFor="name" error={state.fieldErrors?.name}>
        <Input id="name" name="name" placeholder="ex: António Sebastião" autoComplete="name" required />
      </Field>

      <Field label="Correio Electrónico (E-mail)" htmlFor="email" error={state.fieldErrors?.email}>
        <Input id="email" name="email" type="email" placeholder="seu-email@exemplo.com" autoComplete="email" required />
      </Field>

      <Field label="Palavra-passe (mínimo 8 caracteres)" htmlFor="password" error={state.fieldErrors?.password}>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </Field>

      {/* Seção adicional para Vendedores */}
      {accountType === "SELLER" && (
        <div className="space-y-4 rounded-xl border border-green-200 bg-green-50/40 p-4 pt-3 mt-4">
          <div className="border-b border-green-200/80 pb-2">
            <p className="text-xs font-bold uppercase tracking-wider text-green-900">
              Dados do Estabelecimento Comercial
            </p>
            <p className="text-[11px] text-green-800">
              Estes dados ficarão visíveis para os consumidores entrarem em contacto.
            </p>
          </div>

          <Field
            label="Nome do Negócio / Loja / Bancada"
            htmlFor="businessName"
            error={state.fieldErrors?.businessName}
          >
            <Input
              id="businessName"
              name="businessName"
              placeholder="ex: Mercearia do Povo ou Supermercado Aliança"
              required
            />
          </Field>

          <Field
            label="Tipo de Estabelecimento"
            htmlFor="sellerType"
            error={state.fieldErrors?.sellerType}
          >
            <Select id="sellerType" name="sellerType" defaultValue="GROCERY" required>
              {sellerTypes.map((type) => (
                <option key={type} value={type}>
                  {SELLER_TYPE_LABEL[type]}
                </option>
              ))}
            </Select>
          </Field>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Província (Angola)" htmlFor="city" error={state.fieldErrors?.city}>
              <Select id="city" name="city" defaultValue="Luanda" required>
                {ANGOLA_PROVINCES.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </Select>
            </Field>

            <Field
              label="Bairro / Mercado / Rua"
              htmlFor="location"
              error={state.fieldErrors?.location}
            >
              <Input
                id="location"
                name="location"
                placeholder="ex: Bairro Azul ou Mercado do 30"
                required
              />
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Telefone para Chamadas"
              htmlFor="contactPhone"
              hint="Visível para o cliente ligar diretamente"
              error={state.fieldErrors?.contactPhone}
            >
              <Input
                id="contactPhone"
                name="contactPhone"
                type="tel"
                placeholder="ex: +244 923 000 000"
              />
            </Field>

            <Field
              label="Número do WhatsApp"
              htmlFor="contactWhatsapp"
              hint="Para encomendas e contacto rápido"
              error={state.fieldErrors?.contactWhatsapp}
            >
              <Input
                id="contactWhatsapp"
                name="contactWhatsapp"
                type="tel"
                placeholder="ex: +244 923 000 000"
              />
            </Field>
          </div>
        </div>
      )}

      <SubmitButton pendingLabel="A criar a sua conta…">
        {accountType === "SELLER" ? "Criar Conta de Vendedor" : "Criar Conta de Consumidor"}
      </SubmitButton>

      <p className="text-center text-sm text-slate-600">
        Já tem uma conta?{" "}
        <Link
          href={from ? `/sign-in?from=${encodeURIComponent(from)}` : "/sign-in"}
          className="font-semibold text-green-600 hover:underline"
        >
          Iniciar sessão
        </Link>
      </p>
    </form>
  );
}
