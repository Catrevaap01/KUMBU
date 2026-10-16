"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart/useCart";
import { formatPrice } from "@/lib/format";
import { buildWhatsAppUrl, cleanAngolaPhone, buildCartOrderMessage } from "@/lib/contact/whatsapp";
import { Button } from "@/components/ui/Button";
import { KumbuLogo } from "@/components/ui/KumbuLogo";
import { Badge } from "@/components/ui/Badge";

export function CartView({
  userName,
  _userEmail,
}: {
  userName?: string | null;
  _userEmail?: string | null;
}) {
  const {
    items,
    isLoaded,
    totalCount,
    totalPrice,
    itemsBySeller,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [invoiceMode, setInvoiceMode] = useState<"SPLIT" | "UNIFIED">("SPLIT");
  const [customerName, setCustomerName] = useState(userName ?? "");
  
  // Pilares 4 e 5: Logística Local e Intermediação Multicaixa Express
  const [deliveryMode, setDeliveryMode] = useState<"PICKUP" | "DELIVERY">("PICKUP");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"DIRECT" | "MULTICAIXA">("DIRECT");

  if (!isLoaded) {
    return (
      <div className="container-page py-16 text-center text-slate-500">
        A carregar o seu carrinho…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-16">
        <div className="mx-auto max-w-md rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
          <span className="text-5xl">🛒</span>
          <h1 className="mt-4 text-xl font-bold text-ink-900">O seu carrinho está vazio</h1>
          <p className="mt-2 text-sm text-slate-600">
            Compare preços de produtos essenciais e adicione os melhores negócios à sua lista.
          </p>
          <div className="mt-6">
            <Button href="/" className="w-full">
              Explorar Produtos no KUMBU
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const invoiceNumber = `KMB-${new Date().getFullYear()}-${items.length}${items[0].reportId.slice(-3).toUpperCase()}`;
  const currentDateFormatted = new Date().toLocaleDateString("pt-AO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Cálculos Financeiros com Logística e Taxa de Conveniência Fintech
  const deliveryFee = deliveryMode === "DELIVERY" ? 1500 : 0;
  const serviceFee = paymentMethod === "MULTICAIXA" ? Math.round(totalPrice * 0.015) : 0;
  const finalTotal = totalPrice + deliveryFee + serviceFee;

  // Referência Multicaixa Express Simulada (9 dígitos)
  const multicaixaRef = `924${Math.abs(invoiceNumber.split("").reduce((a, b) => a + b.charCodeAt(0), 100) * 83).toString().slice(0, 6)}`;

  const handlePrint = () => {
    window.print();
  };

  const deliveryTextFormatted =
    deliveryMode === "DELIVERY"
      ? `Entrega ao Domicílio por Estafeta (+1.500 Kz) — Endereço: ${deliveryAddress || "A combinar"}`
      : "Levantamento no Estabelecimento (Grátis)";

  const paymentTextFormatted =
    paymentMethod === "MULTICAIXA"
      ? `Multicaixa Express (Entidade: 00542 | Ref: ${multicaixaRef})`
      : "Pagamento Direto / No ato da entrega";

  return (
    <div className="container-page py-8 space-y-8">
      {/* Cabeçalho da Página (Oculto na Impressão) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
            O Meu Carrinho de Compras
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            {totalCount} {totalCount === 1 ? "artigo" : "artigos"} de {Object.keys(itemsBySeller).length} {Object.keys(itemsBySeller).length === 1 ? "estabelecimento" : "estabelecimentos diferentes"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clearCart}
            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
          >
            Limpar Carrinho
          </button>
          <Button href="/" variant="ghost" className="!px-3 !py-1.5 text-xs">
            + Adicionar Mais Itens
          </Button>
        </div>
      </div>

      {/* Itens do Carrinho para Edição Rápida (Oculto na Impressão) */}
      <div className="print:hidden space-y-6">
        <h2 className="text-base font-bold text-ink-900">Editar Quantidades</h2>
        <div className="space-y-4">
          {Object.entries(itemsBySeller).map(([sellerId, group]) => (
            <div key={sellerId} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
                <span className="font-bold text-ink-900">{group.sellerName}</span>
                <span className="text-xs text-slate-500">{group.sellerLocation}, {group.sellerCity}</span>
              </div>

              <div className="mt-3 divide-y divide-border/60">
                {group.items.map((item) => (
                  <div key={item.reportId} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <div>
                      <p className="text-sm font-semibold text-ink-900">{item.productName}</p>
                      <p className="text-xs text-slate-500">
                        {item.unit} · {formatPrice(item.price, item.currency)} cada
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-border rounded-lg bg-slate-50 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.reportId, item.quantity - 1)}
                          className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 text-sm font-bold"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-xs font-bold text-ink-900 min-w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.reportId, item.quantity + 1)}
                          className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 text-sm font-bold"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-sm font-extrabold text-ink-900 min-w-20 text-right">
                        {formatPrice(item.price * item.quantity, item.currency)}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.reportId)}
                        className="text-slate-400 hover:text-red-600 p-1 text-sm font-bold ml-1"
                        title="Remover"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Opções de Logística Local & Intermediação de Pagamento Multicaixa (Oculto na Impressão) */}
      <div className="print:hidden grid gap-6 md:grid-cols-2">
        {/* Pilar 5: Logística Local / Entrega ao Domicílio */}
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛵</span>
            <h3 className="font-bold text-ink-900">Modalidade de Entrega / Logística</h3>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setDeliveryMode("PICKUP")}
              className={`rounded-xl border p-3 text-left transition ${
                deliveryMode === "PICKUP"
                  ? "border-green-600 bg-green-50/70 text-green-900 ring-1 ring-green-600"
                  : "border-border bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="block font-bold">🏪 Levantamento no Local</span>
              <span className="text-[11px] text-slate-500 font-normal">Grátis no estabelecimento</span>
            </button>

            <button
              type="button"
              onClick={() => setDeliveryMode("DELIVERY")}
              className={`rounded-xl border p-3 text-left transition ${
                deliveryMode === "DELIVERY"
                  ? "border-green-600 bg-green-50/70 text-green-900 ring-1 ring-green-600"
                  : "border-border bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="block font-bold">🚚 Entregar em Casa</span>
              <span className="text-[11px] text-green-700 font-normal">+1.500 Kz (Estafeta Parceiro)</span>
            </button>
          </div>

          {deliveryMode === "DELIVERY" && (
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Endereço de Entrega (Bairro / Rua / Edifício):
              </label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="ex: Centralidade do Kilamba, Quarteirão B, Prédio B14"
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-xs text-ink-900 placeholder:text-slate-400"
              />
            </div>
          )}
        </div>

        {/* Pilar 4: Intermediação de Pagamentos / Multicaixa Express */}
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">💳</span>
            <h3 className="font-bold text-ink-900">Método de Pagamento (KUMBU Pay)</h3>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setPaymentMethod("DIRECT")}
              className={`rounded-xl border p-3 text-left transition ${
                paymentMethod === "DIRECT"
                  ? "border-green-600 bg-green-50/70 text-green-900 ring-1 ring-green-600"
                  : "border-border bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="block font-bold">💬 Acordo Direto</span>
              <span className="text-[11px] text-slate-500 font-normal">Pagar ao comerciante / Dinheiro</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod("MULTICAIXA")}
              className={`rounded-xl border p-3 text-left transition ${
                paymentMethod === "MULTICAIXA"
                  ? "border-green-600 bg-green-50/70 text-green-900 ring-1 ring-green-600"
                  : "border-border bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="block font-bold">🏧 Multicaixa Express</span>
              <span className="text-[11px] text-green-700 font-normal">+1.5% taxa de conveniência</span>
            </button>
          </div>

          {paymentMethod === "MULTICAIXA" && (
            <div className="rounded-xl border border-green-300 bg-green-50/80 p-3 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-green-950">Referência Multicaixa Gerada:</span>
                <Badge tone="success" dot>Ativa</Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 font-mono text-center">
                <div className="rounded bg-white p-1.5 border border-green-200">
                  <span className="text-[10px] text-slate-500 block">Entidade</span>
                  <span className="font-bold text-ink-900">00542</span>
                </div>
                <div className="rounded bg-white p-1.5 border border-green-200">
                  <span className="text-[10px] text-slate-500 block">Referência</span>
                  <span className="font-bold text-ink-900">{multicaixaRef}</span>
                </div>
                <div className="rounded bg-white p-1.5 border border-green-200">
                  <span className="text-[10px] text-slate-500 block">Montante</span>
                  <span className="font-bold text-green-800">{formatPrice(finalTotal, "AOA")}</span>
                </div>
              </div>
              <p className="text-[11px] text-green-800">
                Pague através do aplicativo Multicaixa Express no telemóvel ou em qualquer caixa ATM.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Seletor de Tipo de Fatura (Oculto na Impressão) */}
      <div className="print:hidden rounded-2xl border border-green-200 bg-green-50/50 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-green-950">
              Como deseja emitir e finalizar o seu pedido?
            </h2>
            <p className="text-xs text-green-800">
              Escolha entre faturas separadas por comerciante ou uma fatura única consolidada.
            </p>
          </div>

          {/* Toggle Buttons */}
          <div className="inline-flex rounded-xl border border-green-300 bg-white p-1">
            <button
              type="button"
              onClick={() => setInvoiceMode("SPLIT")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                invoiceMode === "SPLIT"
                  ? "bg-green-700 text-white shadow-sm"
                  : "text-slate-600 hover:text-ink-900"
              }`}
            >
              Faturas Separadas por Vendedor
            </button>
            <button
              type="button"
              onClick={() => setInvoiceMode("UNIFIED")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                invoiceMode === "UNIFIED"
                  ? "bg-green-700 text-white shadow-sm"
                  : "text-slate-600 hover:text-ink-900"
              }`}
            >
              Fatura Única Consolidada
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Nome do Cliente para a fatura (ex: Maria Santos)"
            className="flex-1 max-w-sm rounded-lg border border-border bg-white px-3 py-1.5 text-xs text-ink-900 placeholder:text-slate-400"
          />
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-lg bg-ink-900 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-ink-800 transition"
          >
            <span>🖨️</span>
            <span>Imprimir / Baixar Fatura (PDF)</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODO 1: FATURAS SEPARADAS POR VENDEDOR */}
      {/* ============================================================== */}
      {invoiceMode === "SPLIT" && (
        <div className="space-y-6">
          <div className="print:hidden flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink-900">
              Faturas Individuais por Estabelecimento ({Object.keys(itemsBySeller).length})
            </h2>
            <span className="text-xs text-slate-500">
              Permite encomendar separadamente a cada vendedor com dados de entrega e pagamento
            </span>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {Object.entries(itemsBySeller).map(([sellerId, group]) => {
              const waMessage = buildCartOrderMessage(
                group.sellerName,
                group.items.map((i) => ({
                  productName: i.productName,
                  unit: i.unit,
                  price: i.price,
                  quantity: i.quantity,
                })),
                group.subtotal,
                "Kz",
                {
                  deliveryText: deliveryTextFormatted,
                  paymentText: paymentTextFormatted,
                },
              );

              const waUrl = group.sellerWhatsapp || group.sellerPhone
                ? buildWhatsAppUrl(group.sellerWhatsapp || group.sellerPhone || "", waMessage)
                : "";
              const telHref = group.sellerPhone
                ? `tel:${cleanAngolaPhone(group.sellerPhone)}`
                : "";

              return (
                <div
                  key={sellerId}
                  className="rounded-2xl border border-border bg-white p-6 shadow-sm flex flex-col justify-between print:border-none print:shadow-none"
                >
                  <div>
                    {/* Topo do Comerciante */}
                    <div className="flex items-start justify-between gap-4 border-b border-border/80 pb-4">
                      <div>
                        <span className="text-xs font-bold text-green-700 uppercase tracking-wider">
                          KUMBU Fatura Proforma
                        </span>
                        <h3 className="text-lg font-bold text-ink-900 mt-0.5">
                          {group.sellerName}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {group.sellerLocation}, {group.sellerCity}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-slate-600 block">
                          {invoiceNumber}-{sellerId.slice(-4).toUpperCase()}
                        </span>
                        <span className="text-[11px] text-slate-400 block">{currentDateFormatted}</span>
                      </div>
                    </div>

                    {/* Tabela de Produtos deste Vendedor */}
                    <div className="mt-4 divide-y divide-border/60">
                      {group.items.map((item) => (
                        <div key={item.reportId} className="flex justify-between py-2 text-xs">
                          <div>
                            <span className="font-semibold text-ink-900">{item.productName}</span>
                            <span className="text-slate-400 block text-[11px]">{item.quantity} x {formatPrice(item.price, item.currency)} ({item.unit})</span>
                          </div>
                          <span className="font-bold text-ink-900">
                            {formatPrice(item.price * item.quantity, item.currency)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Resumo do Subtotal */}
                    <div className="mt-4 border-t border-border/80 pt-3 flex justify-between items-baseline">
                      <span className="text-xs font-bold text-slate-700">Subtotal deste Vendedor:</span>
                      <span className="text-lg font-black text-green-700">
                        {formatPrice(group.subtotal, "AOA")}
                      </span>
                    </div>

                    {/* Indicação de Entrega & Pagamento */}
                    <div className="mt-3 rounded-lg bg-slate-50 p-2 text-[11px] text-slate-600 space-y-0.5">
                      <p><span className="font-semibold">Entrega:</span> {deliveryMode === "DELIVERY" ? "Estafeta ao domicílio" : "Levantamento na loja"}</p>
                      <p><span className="font-semibold">Pagamento:</span> {paymentMethod === "MULTICAIXA" ? `Multicaixa Express (Ref: ${multicaixaRef})` : "Direto ao vendedor"}</p>
                    </div>
                  </div>

                  {/* Ações de Contacto e Envio (Oculto na Impressão) */}
                  <div className="print:hidden mt-6 border-t border-border/80 pt-4 flex flex-wrap gap-2">
                    {waUrl ? (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-green-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-green-700 transition"
                      >
                        <span>💬</span>
                        <span>Enviar Encomenda por WhatsApp</span>
                      </a>
                    ) : null}

                    {telHref ? (
                      <a
                        href={telHref}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-semibold text-ink-900 hover:bg-slate-50 transition"
                      >
                        <span>📞 Ligar</span>
                      </a>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODO 2: FATURA ÚNICA CONSOLIDADA (PROFORMA GLOBAL) */}
      {/* ============================================================== */}
      {invoiceMode === "UNIFIED" && (
        <div className="rounded-2xl border border-border bg-white p-8 shadow-sm print:border-none print:shadow-none print:p-0">
          {/* Cabeçalho da Fatura Proforma */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b-2 border-green-700 pb-6">
            <div>
              <KumbuLogo size="md" />
              <p className="mt-2 text-xs font-medium text-slate-500">
                Plataforma de Inteligência de Preços de Angola
              </p>
              <p className="text-xs text-slate-400">www.kumbu.ao · Luanda, Angola</p>
            </div>

            <div className="sm:text-right">
              <span className="inline-block rounded-md bg-green-700/10 px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider text-green-800">
                Fatura Proforma Consolidada
              </span>
              <p className="mt-2 text-lg font-black text-ink-900">{invoiceNumber}</p>
              <p className="text-xs text-slate-500">Emissão: {currentDateFormatted}</p>
              {customerName && (
                <p className="mt-1 text-xs font-bold text-ink-900">
                  Cliente: <span className="font-semibold text-slate-700">{customerName}</span>
                </p>
              )}
            </div>
          </div>

          {/* Tabela de Produtos Consolidada */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-slate-50 text-slate-500 uppercase font-bold tracking-wider">
                  <th className="py-3 px-3">Item / Produto</th>
                  <th className="py-3 px-3">Estabelecimento / Loja</th>
                  <th className="py-3 px-3 text-center">Qtd</th>
                  <th className="py-3 px-3 text-right">Preço Unitário</th>
                  <th className="py-3 px-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item) => (
                  <tr key={item.reportId}>
                    <td className="py-3 px-3 font-semibold text-ink-900">
                      {item.productName}
                      <span className="text-[11px] text-slate-400 block font-normal">
                        {item.unit} {item.category ? `· ${item.category}` : ""}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      <span className="font-semibold">{item.sellerName}</span>
                      <span className="text-[11px] text-slate-400 block">
                        {item.sellerCity ?? "Angola"}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-ink-900">{item.quantity}</td>
                    <td className="py-3 px-3 text-right text-slate-600">
                      {formatPrice(item.price, item.currency)}
                    </td>
                    <td className="py-3 px-3 text-right font-extrabold text-ink-900">
                      {formatPrice(item.price * item.quantity, item.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Dados de Pagamento Multicaixa se selecionado */}
          {paymentMethod === "MULTICAIXA" && (
            <div className="mt-6 rounded-xl border border-green-300 bg-green-50/50 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-green-950 text-sm">Dados de Pagamento Multicaixa Express (EMIS):</h4>
                  <p className="text-xs text-green-800">Utilize os dados abaixo no seu aplicativo bancário ou ATM:</p>
                </div>
                <div className="flex gap-4 font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Entidade</span>
                    <span className="font-bold text-ink-900 text-sm">00542</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Referência</span>
                    <span className="font-bold text-ink-900 text-sm">{multicaixaRef}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Montante</span>
                    <span className="font-bold text-green-800 text-sm">{formatPrice(finalTotal, "AOA")}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Totais e Resumo Financeiro */}
          <div className="mt-8 flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-t-2 border-border pt-6">
            <div className="max-w-md text-xs text-slate-500 space-y-1">
              <p className="font-bold text-ink-900">Termos & Observações:</p>
              <p>• Esta fatura é um documento proforma oficial gerado pela plataforma KUMBU.</p>
              <p>• Modalidade: {deliveryTextFormatted}.</p>
              <p>• Pagamento: {paymentTextFormatted}.</p>
              <p>• Suporte & Validação: suporte@kumbu.ao · Luanda, Angola.</p>
            </div>

            <div className="w-full sm:w-80 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal dos Produtos:</span>
                <span className="font-semibold text-ink-900">{formatPrice(totalPrice, "AOA")}</span>
              </div>

              {deliveryMode === "DELIVERY" && (
                <div className="flex justify-between text-slate-600">
                  <span>Taxa de Entrega (Estafeta):</span>
                  <span className="font-semibold text-green-700">{formatPrice(deliveryFee, "AOA")}</span>
                </div>
              )}

              {paymentMethod === "MULTICAIXA" && (
                <div className="flex justify-between text-slate-600">
                  <span>Taxa de Intermediação (1.5%):</span>
                  <span className="font-semibold text-amber-700">{formatPrice(serviceFee, "AOA")}</span>
                </div>
              )}

              <div className="border-t border-border pt-2 flex justify-between items-baseline">
                <span className="text-base font-bold text-ink-900">Total a Liquidar:</span>
                <span className="text-2xl font-black text-green-700">
                  {formatPrice(finalTotal, "AOA")}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
