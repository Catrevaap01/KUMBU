"use client";

import { useActionState, useState } from "react";
import { submitSellerPriceAction } from "@/lib/actions/sellers";
import { emptyActionState } from "@/lib/actions/types";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function PriceForm({
  products,
  lockedProduct,
  currency,
  defaultPrice,
  defaultAvailability,
  defaultNotes,
}: {
  products?: { id: string; name: string; unit: string }[];
  lockedProduct?: { id: string; name: string; unit: string };
  currency: string;
  defaultPrice?: number;
  defaultAvailability?: "IN_STOCK" | "OUT_OF_STOCK" | "UNKNOWN";
  defaultNotes?: string;
}) {
  const [state, formAction] = useActionState(submitSellerPriceAction, emptyActionState);
  const [isCustomProduct, setIsCustomProduct] = useState(Boolean(!lockedProduct && (!products || products.length === 0)));

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {state.error ? (
        <p role="alert" className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      {lockedProduct ? (
        <Field label="Produto" htmlFor="productDisplay">
          <input type="hidden" name="productId" value={lockedProduct.id} />
          <div
            id="productDisplay"
            className="w-full rounded-lg border border-border bg-mist px-3.5 py-2.5 text-sm text-ink-900"
          >
            {lockedProduct.name} ({lockedProduct.unit})
          </div>
        </Field>
      ) : !isCustomProduct ? (
        <Field label="Produto" htmlFor="productId" error={state.fieldErrors?.productId}>
          <Select id="productId" name="productId" defaultValue="" required>
            <option value="" disabled>
              Selecione o produto da lista
            </option>
            {products?.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} ({product.unit})
              </option>
            ))}
          </Select>
          <button
            type="button"
            onClick={() => setIsCustomProduct(true)}
            className="mt-1.5 text-xs font-semibold text-green-600 hover:underline flex items-center gap-1"
          >
            + O produto não está na lista? Escrever o nome do produto
          </button>
        </Field>
      ) : (
        <div className="space-y-3 rounded-xl border border-border bg-mist/60 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Novo Produto
            </span>
            {products && products.length > 0 ? (
              <button
                type="button"
                onClick={() => setIsCustomProduct(false)}
                className="text-xs font-medium text-green-600 hover:underline"
              >
                ← Escolher da lista existente
              </button>
            ) : null}
          </div>

          <Field label="Nome do Produto" htmlFor="productName" error={state.fieldErrors?.productName}>
            <Input
              id="productName"
              name="productName"
              placeholder="ex: Arroz Agulha 5kg, Feijão Preto 1kg, etc."
              required
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Unidade / Medida" htmlFor="productUnit" error={state.fieldErrors?.productUnit}>
              <Input
                id="productUnit"
                name="productUnit"
                placeholder="ex: 1kg, 5L, 25kg, 1 un"
                defaultValue="1 un"
                required
              />
            </Field>

            <Field label="Categoria" htmlFor="productCategory" error={state.fieldErrors?.productCategory}>
              <Select id="productCategory" name="productCategory" defaultValue="Mercearia">
                <option value="Mercearia">Mercearia</option>
                <option value="Cereais e Farinhas">Cereais e Farinhas</option>
                <option value="Óleos e Gorduras">Óleos e Gorduras</option>
                <option value="Leguminosas">Leguminosas</option>
                <option value="Laticínios">Laticínios</option>
                <option value="Massas">Massas</option>
                <option value="Carnes e Peixes">Carnes e Peixes</option>
                <option value="Higiene e Limpeza">Higiene e Limpeza</option>
                <option value="Outros">Outros</option>
              </Select>
            </Field>
          </div>
        </div>
      )}

      <Field label={`Preço em ${currency === "AOA" ? "Kwanzas (Kz)" : currency}`} htmlFor="price" error={state.fieldErrors?.price}>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="ex: 14500"
          defaultValue={defaultPrice}
          required
        />
      </Field>

      <Field label="Disponibilidade em Stock" htmlFor="availability">
        <Select id="availability" name="availability" defaultValue={defaultAvailability ?? "IN_STOCK"}>
          <option value="IN_STOCK">Em stock</option>
          <option value="OUT_OF_STOCK">Esgotado</option>
          <option value="UNKNOWN">Não verificado</option>
        </Select>
      </Field>

      <Field label="Observações adicionais (opcional)" htmlFor="notes" error={state.fieldErrors?.notes}>
        <Textarea id="notes" name="notes" rows={2} defaultValue={defaultNotes} placeholder="ex: Preço por atacado ou condições especiais..." />
      </Field>

      <SubmitButton pendingLabel="A guardar…">Guardar Preço</SubmitButton>
    </form>
  );
}
