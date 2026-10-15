"use client";

import { useActionState, useState } from "react";
import { submitPriceReportAction } from "@/lib/actions/priceReports";
import { emptyActionState } from "@/lib/actions/types";
import { sellerTypes, SELLER_TYPE_LABEL } from "@/lib/validation/priceReport";
import { countries, COUNTRY_LABEL, CURRENCY_BY_COUNTRY, ANGOLA_PROVINCES, type CountryCode } from "@/lib/validation/country";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Button } from "@/components/ui/Button";

export function ReportPriceForm({
  productId,
  productInfo,
  products,
  sellers,
}: {
  productId?: string;
  productInfo?: { name: string; category: string; unit: string };
  products?: { id: string; name: string; unit: string }[];
  sellers: { id: string; businessName: string; location: string; country: CountryCode }[];
}) {
  const [state, formAction] = useActionState(submitPriceReportAction, emptyActionState);
  const [addingNewSeller, setAddingNewSeller] = useState(sellers.length === 0);
  const [selectedSellerId, setSelectedSellerId] = useState("");
  const [newSellerCountry, setNewSellerCountry] = useState<CountryCode>("ANGOLA");
  const [isCustomProduct, setIsCustomProduct] = useState(Boolean(!productId && (!products || products.length === 0)));

  const currency = addingNewSeller
    ? CURRENCY_BY_COUNTRY[newSellerCountry]
    : CURRENCY_BY_COUNTRY[sellers.find((s) => s.id === selectedSellerId)?.country ?? "ANGOLA"];

  if (state.success) {
    return (
      <div className="rounded-xl bg-green-600/10 px-4 py-3 text-sm text-green-600">
        Obrigado — o seu relato de preço foi submetido com sucesso no KUMBU.
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {productId ? (
        <>
          <input type="hidden" name="productId" value={productId} />
          {productInfo && (
            <div className="rounded-lg border border-green-200 bg-green-50/70 p-3 text-xs text-green-900">
              Produto: <span className="font-bold">{productInfo.name}</span> · {productInfo.category} ({productInfo.unit})
            </div>
          )}
        </>
      ) : !isCustomProduct ? (
        <Field label="Produto" htmlFor="productId" error={state.fieldErrors?.productId}>
          <Select id="productId" name="productId" defaultValue="" required>
            <option value="" disabled>
              Selecione o produto da lista
            </option>
            {products?.map((prod) => (
              <option key={prod.id} value={prod.id}>
                {prod.name} ({prod.unit})
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
        <div className="space-y-3 rounded-xl border border-border bg-mist/60 p-3.5">
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
                ← Escolher da lista de produtos
              </button>
            ) : null}
          </div>

          <Field label="Nome do Produto" htmlFor="productName" error={state.fieldErrors?.productName}>
            <Input id="productName" name="productName" placeholder="ex: Arroz Agulha 5kg, Feijão 1kg, etc." required />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Unidade / Medida" htmlFor="productUnit" error={state.fieldErrors?.productUnit}>
              <Input id="productUnit" name="productUnit" placeholder="ex: 1kg, 5L, 25kg, 1 un" defaultValue="1 un" required />
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

      {state.error ? (
        <p role="alert" className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      {!addingNewSeller ? (
        <Field label="Comerciante ou Local" htmlFor="sellerId" error={state.fieldErrors?.sellerId}>
          <Select
            id="sellerId"
            name="sellerId"
            required
            defaultValue=""
            onChange={(event) => setSelectedSellerId(event.target.value)}
          >
            <option value="" disabled>
              Selecione o comerciante
            </option>
            {sellers.map((seller) => (
              <option key={seller.id} value={seller.id}>
                {seller.businessName} — {seller.location}
              </option>
            ))}
          </Select>
          <button
            type="button"
            onClick={() => setAddingNewSeller(true)}
            className="mt-1.5 text-xs font-medium text-green-600 hover:underline"
          >
            + Este comerciante/bancada não está na lista
          </button>
        </Field>
      ) : (
        <div className="space-y-4 rounded-lg bg-mist p-3.5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Novo Comerciante / Vendedor</p>
            {sellers.length > 0 ? (
              <button
                type="button"
                onClick={() => setAddingNewSeller(false)}
                className="text-xs font-medium text-green-600 hover:underline"
              >
                Escolher existente da lista
              </button>
            ) : null}
          </div>

          <Field label="Nome da Loja, Supermercado ou Bancada" htmlFor="newSellerName" error={state.fieldErrors?.newSellerName}>
            <Input id="newSellerName" name="newSellerName" placeholder="ex: Mercado do São Paulo - Bancada 14" />
          </Field>

          <Field label="Tipo de Comerciante" htmlFor="newSellerType" error={state.fieldErrors?.newSellerType}>
            <Select id="newSellerType" name="newSellerType" defaultValue="">
              <option value="" disabled>
                Selecione o tipo
              </option>
              {sellerTypes.map((type) => (
                <option key={type} value={type}>
                  {SELLER_TYPE_LABEL[type]}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="País" htmlFor="newSellerCountry" error={state.fieldErrors?.newSellerCountry}>
            <Select
              id="newSellerCountry"
              name="newSellerCountry"
              defaultValue="ANGOLA"
              onChange={(event) => setNewSellerCountry(event.target.value as CountryCode)}
            >
              {countries.map((code) => (
                <option key={code} value={code}>
                  {COUNTRY_LABEL[code]}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Província / Cidade" htmlFor="newSellerCity" error={state.fieldErrors?.newSellerCity}>
            <Select id="newSellerCity" name="newSellerCity" defaultValue="Luanda">
              {ANGOLA_PROVINCES.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Localização / Bairro" htmlFor="newSellerLocation" error={state.fieldErrors?.newSellerLocation}>
            <Input id="newSellerLocation" name="newSellerLocation" placeholder="ex: Rangel, Talatona ou Centro" />
          </Field>
        </div>
      )}

      <Field label={`Preço observado em ${currency === "AOA" ? "Kwanzas (Kz)" : currency}`} htmlFor="price" error={state.fieldErrors?.price}>
        <Input id="price" name="price" type="number" step="0.01" min="0.01" placeholder="ex: 14500" required />
      </Field>

      <Field label="Disponibilidade em Stock" htmlFor="availability">
        <Select id="availability" name="availability" defaultValue="UNKNOWN">
          <option value="UNKNOWN">Não tenho certeza</option>
          <option value="IN_STOCK">Em stock</option>
          <option value="OUT_OF_STOCK">Esgotado</option>
        </Select>
      </Field>

      <Field label="Observações adicionais (opcional)" htmlFor="notes" error={state.fieldErrors?.notes}>
        <Textarea id="notes" name="notes" rows={2} placeholder="Ex: Promoção válida até sexta-feira, pagamento por Multicaixa Express disponível..." />
      </Field>

      <SubmitButton pendingLabel="A enviar…">Submeter Relato de Preço</SubmitButton>
    </form>
  );
}

export function ReportPriceCancelLink({ productId }: { productId?: string }) {
  return (
    <Button href={productId ? `/products/${productId}` : "/search"} variant="ghost" className="w-full">
      Cancelar
    </Button>
  );
}
