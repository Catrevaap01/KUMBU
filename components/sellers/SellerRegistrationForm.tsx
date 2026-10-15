"use client";

import { useActionState } from "react";
import { registerSellerAction } from "@/lib/actions/sellers";
import { emptyActionState } from "@/lib/actions/types";
import { sellerTypes, SELLER_TYPE_LABEL } from "@/lib/validation/priceReport";
import { ANGOLA_PROVINCES } from "@/lib/validation/country";
import { Field, Input, Select } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function SellerRegistrationForm() {
  const [state, formAction] = useActionState(registerSellerAction, emptyActionState);

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {state.error ? (
        <p role="alert" className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <Field label="Nome do Estabelecimento ou Bancada" htmlFor="businessName" error={state.fieldErrors?.businessName}>
        <Input id="businessName" name="businessName" placeholder="ex: Mini-mercado Kilamba ou Armazém Central" required />
      </Field>

      <Field label="Tipo de Comerciante" htmlFor="sellerType" error={state.fieldErrors?.sellerType}>
        <Select id="sellerType" name="sellerType" defaultValue="" required>
          <option value="" disabled>
            Selecione o tipo de comércio
          </option>
          {sellerTypes.map((type) => (
            <option key={type} value={type}>
              {SELLER_TYPE_LABEL[type]}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="País" htmlFor="country">
        <input type="hidden" name="country" value="ANGOLA" />
        <div className="w-full rounded-lg border border-border bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-ink-900">
          Angola
        </div>
      </Field>

      <Field label="Província / Cidade" htmlFor="city" error={state.fieldErrors?.city}>
        <Select id="city" name="city" defaultValue="Luanda" required>
          {ANGOLA_PROVINCES.map((province) => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Bairro ou Endereço" htmlFor="location" error={state.fieldErrors?.location}>
        <Input id="location" name="location" placeholder="ex: Talatona, Rangel, Maianga ou Centro" required />
      </Field>

      <Field label="Telefone de contacto (opcional)" htmlFor="contactPhone" error={state.fieldErrors?.contactPhone}>
        <Input id="contactPhone" name="contactPhone" placeholder="+244 9..." />
      </Field>

      <Field
        label="Contacto WhatsApp (opcional)"
        htmlFor="contactWhatsapp"
        error={state.fieldErrors?.contactWhatsapp}
      >
        <Input id="contactWhatsapp" name="contactWhatsapp" placeholder="+244 9..." />
      </Field>

      <SubmitButton pendingLabel="A registar…">Registar como Vendedor</SubmitButton>
    </form>
  );
}
