import { formatPrice } from "@/lib/format";
import { formatRelativeTime } from "@/lib/format";

export interface OrderNotificationItem {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone: string | null;
  totalAmount: any;
  deliveryMode: string;
  deliveryAddress: string | null;
  itemsSummary: string;
  status: string;
  createdAt: Date;
}

export function SellerOrderNotificationsCard({
  notifications,
}: {
  notifications: OrderNotificationItem[];
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-xs sm:p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-ink-900 sm:text-lg">
              Notificações de Faturas & Encomendas dos Clientes
            </h2>
            {notifications.length > 0 && (
              <span className="rounded-full bg-green-100 border border-green-200 px-2 py-0.5 text-[11px] font-extrabold text-green-800">
                {notifications.length} {notifications.length === 1 ? "nova" : "novas"}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Alertas automáticos gerados sempre que um consumidor imprime uma fatura proforma para pagar e levantar na loja ou receber por estafeta.
          </p>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-slate-50/50 p-6 text-center text-xs text-slate-500">
          Nenhuma fatura emitida recentemente para o seu estabelecimento.
        </div>
      ) : (
        <div className="divide-y divide-border/60">
          {notifications.map((notif) => (
            <div key={notif.id} className="py-3.5 first:pt-1 last:pb-1 space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-ink-900 bg-slate-100 px-2 py-0.5 rounded">
                    {notif.invoiceNumber}
                  </span>
                  <span className="text-xs font-bold text-ink-900">
                    Cliente: {notif.customerName}
                  </span>
                  {notif.customerPhone && (
                    <span className="text-xs text-slate-500">({notif.customerPhone})</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    notif.deliveryMode === "DELIVERY"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "bg-green-50 text-green-700 border border-green-200"
                  }`}>
                    {notif.deliveryMode === "DELIVERY" ? "Entrega ao Domicílio" : "Levantamento na Loja"}
                  </span>
                  <span className="rounded-full bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 text-[10px] font-bold">
                    Aguardando Pagamento
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg">
                <strong className="text-slate-800">Produtos:</strong> {notif.itemsSummary}
              </p>

              {notif.deliveryAddress && (
                <p className="text-xs text-blue-800 bg-blue-50/50 p-2 rounded-lg">
                  <strong>Endereço de Entrega:</strong> {notif.deliveryAddress}
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-slate-500 pt-0.5">
                <span>Emitida {formatRelativeTime(notif.createdAt)}</span>
                <span className="font-bold text-ink-900">
                  Total a Receber:{" "}
                  <span className="text-green-700 font-extrabold text-sm">
                    {formatPrice(Number(notif.totalAmount), "AOA")}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
