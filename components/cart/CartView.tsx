"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart/useCart";
import { formatPrice } from "@/lib/format";
import { buildWhatsAppUrl, cleanAngolaPhone, buildCartOrderMessage } from "@/lib/contact/whatsapp";
import { Button } from "@/components/ui/Button";
import { KumbuLogo } from "@/components/ui/KumbuLogo";
import { recordInvoiceOrderAction } from "@/lib/actions/orders";

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

  // Pilar 5: Logística Local
  const [deliveryMode, setDeliveryMode] = useState<"PICKUP" | "DELIVERY">("PICKUP");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [isNotifying, setIsNotifying] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);

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
          <h1 className="text-xl font-bold text-ink-900">O seu carrinho está vazio</h1>
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

  // Cálculos Financeiros com Logística
  const deliveryFee = deliveryMode === "DELIVERY" ? 1500 : 0;
  const finalTotal = totalPrice + deliveryFee;

  const handlePrint = async () => {
    setIsNotifying(true);
    try {
      await recordInvoiceOrderAction({
        invoiceNumber,
        customerName: customerName.trim() || undefined,
        deliveryMode,
        deliveryAddress: deliveryAddress.trim() || undefined,
        items: items.map((i) => ({
          reportId: i.reportId,
          productName: i.productName,
          quantity: i.quantity,
          price: i.price,
          unit: i.unit,
          sellerId: i.sellerId,
          sellerName: i.sellerName,
        })),
        finalTotal,
      });
      setNotificationSent(true);
    } catch (err) {
      console.error("Falha ao registar notificação de fatura:", err);
    } finally {
      setIsNotifying(false);
      window.print();
    }
  };

  const deliveryTextFormatted =
    deliveryMode === "DELIVERY"
      ? `Entrega ao Domicílio por Estafeta (+1.500 Kz) — Endereço: ${deliveryAddress || "A combinar"}`
      : "Levantamento no Estabelecimento (Grátis)";

  const paymentTextFormatted = "Pagamento Direto / No ato da entrega";

  return (
    <div className="container-page py-8 space-y-8 print:py-0 print:space-y-0 print:p-0 print:max-w-none">
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
                        className="text-slate-400 hover:text-red-600 p-1 text-base font-bold ml-1 leading-none"
                        title="Remover produto do carrinho"
                      >
                        <span aria-hidden="true">&times;</span>
                        <span className="sr-only">Remover</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Opções de Logística Local (Oculto na Impressão) */}
      <div className="print:hidden">
        {/* Pilar 5: Logística Local / Entrega ao Domicílio */}
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
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
              <span className="block font-bold">Levantamento no Local</span>
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
              <span className="block font-bold">Entregar em Casa</span>
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
      </div>

      {/* Seletor de Tipo de Fatura (Oculto na Impressão) */}
      <div className="print:hidden rounded-2xl border border-border bg-white p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#0B0B0D]">
              Como deseja emitir e finalizar o seu pedido?
            </h2>
            <p className="text-xs text-[#687280]">
              Escolha entre faturas separadas por comerciante ou uma fatura única consolidada.
            </p>
          </div>

          {/* Toggle Buttons */}
          <div className="inline-flex rounded-xl border border-border bg-[#F1F3F7] p-1">
            <button
              type="button"
              onClick={() => setInvoiceMode("SPLIT")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                invoiceMode === "SPLIT"
                  ? "bg-[#0B0B0D] text-white shadow-sm"
                  : "text-slate-600 hover:text-ink-900"
              }`}
            >
              Faturas por Vendedor
            </button>
            <button
              type="button"
              onClick={() => setInvoiceMode("UNIFIED")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                invoiceMode === "UNIFIED"
                  ? "bg-[#0B0B0D] text-white shadow-sm"
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
            disabled={isNotifying}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B0B0D] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#1E1F24] transition disabled:opacity-60"
          >
            <span>{isNotifying ? "A registar notificação…" : "Imprimir / Baixar Fatura (PDF)"}</span>
          </button>
        </div>

        {notificationSent && (
          <div className="mt-2 text-xs font-semibold text-green-800 bg-green-50 border border-green-200 px-3.5 py-2 rounded-xl animate-fade-in">
            Notificação registada com sucesso: o comerciante {deliveryMode === "DELIVERY" ? "e a central de logística KUBIKA " : ""}receberam o alerta automático de que vai efetuar o pagamento.
          </div>
        )}
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
                        <span className="text-xs font-bold text-green-600 uppercase tracking-wider">
                          KUBIKA Fatura Proforma
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
                      <span className="text-lg font-black text-green-600">
                        {formatPrice(group.subtotal, "AOA")}
                      </span>
                    </div>

                    {/* Indicação de Entrega & Pagamento */}
                    <div className="mt-3 rounded-lg bg-slate-50 p-2 text-[11px] text-slate-600 space-y-0.5">
                      <p><span className="font-semibold">Entrega:</span> {deliveryMode === "DELIVERY" ? "Estafeta ao domicílio" : "Levantamento na loja"}</p>
                      <p><span className="font-semibold">Pagamento:</span> Direto ao vendedor</p>
                    </div>
                  </div>

                  {/* Ações de Contacto e Envio (Oculto na Impressão) */}
                  <div className="print:hidden mt-6 border-t border-border/80 pt-4 flex flex-wrap gap-2">
                    {waUrl ? (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#1EBE5D] transition"
                      >
                        <span>Enviar Encomenda por WhatsApp</span>
                      </a>
                    ) : null}

                    {telHref ? (
                      <a
                        href={telHref}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-semibold text-ink-900 hover:bg-slate-50 transition"
                      >
                        <span>Ligar</span>
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
        <div className="rounded-2xl border border-border bg-white p-8 shadow-sm print:border-none print:shadow-none print:p-0 print:m-0">
          {/* Cabeçalho da Fatura Proforma */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b-2 border-green-600 pb-6 print:pb-3 print:gap-2">
            <div>
              <KumbuLogo size="sm" />
              <p className="mt-1 text-xs font-medium text-slate-500 print:text-[10px]">
                Plataforma de Inteligência de Preços de Angola
              </p>
              <p className="text-xs text-slate-400 print:text-[9.5px]">www.kubika.ao · Luanda, Angola</p>
            </div>

            <div className="sm:text-right">
              <span className="inline-block rounded-md bg-green-600/10 px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider text-green-600 print:text-[9.5px] print:px-2 print:py-0.5">
                Fatura Proforma Consolidada
              </span>
              <p className="mt-1 text-base font-black text-ink-900 print:text-sm">{invoiceNumber}</p>
              <p className="text-xs text-slate-500 print:text-[10px]">Emissão: {currentDateFormatted}</p>
              {customerName && (
                <p className="text-xs font-bold text-ink-900 print:text-[10px]">
                  Cliente: <span className="font-semibold text-slate-700">{customerName}</span>
                </p>
              )}
            </div>
          </div>

          {/* Tabela de Produtos Consolidada */}
          <div className="mt-5 overflow-x-auto print:mt-2">
            <table className="w-full text-left text-xs print:text-[11px]">
              <thead>
                <tr className="border-b border-border bg-slate-50 text-slate-500 uppercase font-bold tracking-wider print:bg-slate-100">
                  <th className="py-2.5 px-3 print:py-1.5 print:px-2">Item / Produto</th>
                  <th className="py-2.5 px-3 print:py-1.5 print:px-2">Estabelecimento / Loja</th>
                  <th className="py-2.5 px-3 text-center print:py-1.5 print:px-2">Qtd</th>
                  <th className="py-2.5 px-3 text-right print:py-1.5 print:px-2">Preço Unitário</th>
                  <th className="py-2.5 px-3 text-right print:py-1.5 print:px-2">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item) => (
                  <tr key={item.reportId} className="print-avoid-break">
                    <td className="py-2.5 px-3 font-semibold text-ink-900 print:py-1.5 print:px-2">
                      {item.productName}
                      <span className="text-[11px] text-slate-400 block font-normal print:inline print:text-[10px] print:ml-1">
                        ({item.unit})
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 print:py-1.5 print:px-2">
                      <span className="font-semibold">{item.sellerName}</span>
                      <span className="text-[11px] text-slate-400 block print:inline print:text-[10px] print:ml-1">
                        ({item.sellerCity ?? "Angola"})
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-ink-900 print:py-1.5 print:px-2">{item.quantity}</td>
                    <td className="py-2.5 px-3 text-right text-slate-600 print:py-1.5 print:px-2">
                      {formatPrice(item.price, item.currency)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-extrabold text-ink-900 print:py-1.5 print:px-2">
                      {formatPrice(item.price * item.quantity, item.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totais e Resumo Financeiro */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-t-2 border-border pt-5 print:mt-3 print:pt-2 print:border-t print:gap-3 print-avoid-break">
            <div className="max-w-md text-xs text-slate-500 space-y-1 print:text-[9.5px] print:space-y-0.5 print:max-w-xs">
              <p className="font-bold text-ink-900">Termos & Observações:</p>
              <p>• Documento proforma oficial KUBIKA para cotação e encomenda direta.</p>
              <p>• Modalidade: {deliveryTextFormatted}.</p>
              <p>• Pagamento: {paymentTextFormatted}.</p>
              <p>• Suporte & Validação: suporte@kubika.ao · Luanda, Angola.</p>
            </div>

            <div className="w-full sm:w-80 space-y-2 text-sm print:w-64 print:space-y-1 print:text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal dos Produtos:</span>
                <span className="font-semibold text-ink-900">{formatPrice(totalPrice, "AOA")}</span>
              </div>

              {deliveryMode === "DELIVERY" && (
                <div className="flex justify-between text-slate-600">
                  <span>Taxa de Entrega (Estafeta):</span>
                  <span className="font-semibold text-green-600">{formatPrice(deliveryFee, "AOA")}</span>
                </div>
              )}

              <div className="border-t border-border pt-1.5 flex justify-between items-baseline print:pt-1">
                <span className="text-sm font-bold text-ink-900 print:text-xs">Total a Liquidar:</span>
                <span className="text-xl font-black text-green-600 print:text-base">
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
