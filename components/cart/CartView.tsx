"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart/useCart";
import { formatPrice } from "@/lib/format";
import { buildWhatsAppUrl, cleanAngolaPhone, buildCartOrderMessage } from "@/lib/contact/whatsapp";
import { Button } from "@/components/ui/Button";
import { KumbuLogo } from "@/components/ui/KumbuLogo";

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

  const handlePrint = () => {
    window.print();
  };

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
              <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
                <div>
                  <h3 className="font-bold text-ink-900">{group.sellerName}</h3>
                  <p className="text-xs text-slate-500">
                    {group.sellerLocation ?? "Angola"} · {group.sellerCity ?? "Luanda"}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500">Subtotal:</span>
                  <p className="font-bold text-green-700">{formatPrice(group.subtotal, "AOA")}</p>
                </div>
              </div>

              <div className="divide-y divide-border/60">
                {group.items.map((item) => (
                  <div key={item.reportId} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-ink-900">{item.productName}</p>
                      <p className="text-xs text-slate-500">
                        {formatPrice(item.price, item.currency)} · {item.unit}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center rounded-lg border border-border bg-slate-50">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.reportId, item.quantity - 1)}
                          className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-l-lg"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-xs font-bold text-ink-900">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.reportId, item.quantity + 1)}
                          className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-r-lg"
                        >
                          +
                        </button>
                      </div>

                      <span className="w-24 text-right font-bold text-sm text-ink-900">
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
              Permite encomendar separadamente a cada vendedor
            </span>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {Object.entries(itemsBySeller).map(([sellerId, group], index) => {
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
                  className="rounded-2xl border border-border bg-white p-6 shadow-sm flex flex-col justify-between print:border-black print:shadow-none print:break-inside-avoid"
                >
                  <div>
                    {/* Cabeçalho da Sub-Fatura */}
                    <div className="flex items-start justify-between border-b border-border pb-4">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="rounded bg-green-700 px-1.5 py-0.5 text-[10px] font-bold text-white">
                            KUMBU
                          </span>
                          <span className="text-xs font-bold text-slate-500">
                            Fatura Parcial #{index + 1}
                          </span>
                        </div>
                        <h3 className="mt-1.5 text-lg font-extrabold text-ink-900">
                          {group.sellerName}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {group.sellerLocation ?? "Angola"} · {group.sellerCity ?? "Luanda"}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] text-slate-400">Data:</span>
                        <p className="text-xs font-semibold text-slate-700">{currentDateFormatted}</p>
                      </div>
                    </div>

                    {/* Tabela de Produtos deste Vendedor */}
                    <div className="mt-4">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-border/80 text-slate-400 uppercase font-semibold">
                            <th className="py-2">Item</th>
                            <th className="py-2 text-center">Qtd</th>
                            <th className="py-2 text-right">Preço</th>
                            <th className="py-2 text-right">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {group.items.map((item) => (
                            <tr key={item.reportId}>
                              <td className="py-2 font-medium text-ink-900">
                                {item.productName}
                                <span className="text-[11px] text-slate-400 block font-normal">
                                  {item.unit}
                                </span>
                              </td>
                              <td className="py-2 text-center font-bold">{item.quantity}</td>
                              <td className="py-2 text-right text-slate-600">
                                {formatPrice(item.price, item.currency)}
                              </td>
                              <td className="py-2 text-right font-bold text-ink-900">
                                {formatPrice(item.price * item.quantity, item.currency)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold uppercase text-slate-500">
                        Total a Pagar a Este Vendedor:
                      </span>
                      <span className="text-lg font-extrabold text-green-700">
                        {formatPrice(group.subtotal, "AOA")}
                      </span>
                    </div>

                    {/* Botões de Ação para este Vendedor (Ocultos na Impressão) */}
                    <div className="print:hidden flex flex-wrap items-center gap-2">
                      {waUrl ? (
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#1EBE5D] transition active:scale-95"
                        >
                          <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                          </svg>
                          <span>Enviar Encomenda no WhatsApp</span>
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

          {/* Totais e Resumo Financeiro */}
          <div className="mt-8 flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-t-2 border-border pt-6">
            <div className="max-w-md text-xs text-slate-500 space-y-1">
              <p className="font-bold text-ink-900">Termos & Observações:</p>
              <p>• Esta fatura é um orçamento de compra proforma gerado via KUMBU.</p>
              <p>• Os valores refletem os preços cotados nos estabelecimentos indicados.</p>
              <p>• A liquidação e entrega devem ser combinadas diretamente com cada vendedor.</p>
            </div>

            <div className="w-full sm:w-72 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Total de Itens:</span>
                <span className="font-semibold text-ink-900">{totalCount}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Vendedores Envolvidos:</span>
                <span className="font-semibold text-ink-900">{Object.keys(itemsBySeller).length}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between items-baseline">
                <span className="text-base font-bold text-ink-900">Total Global:</span>
                <span className="text-2xl font-black text-green-700">
                  {formatPrice(totalPrice, "AOA")}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
