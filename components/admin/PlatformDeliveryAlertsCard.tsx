import { formatPrice } from "@/lib/format";
import { formatRelativeTime } from "@/lib/format";

export interface PlatformAlertItem {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone: string | null;
  sellerName: string;
  totalAmount: any;
  deliveryAddress: string | null;
  itemsSummary: string;
  status: string;
  createdAt: Date;
}

export function PlatformDeliveryAlertsCard({
  alerts,
}: {
  alerts: PlatformAlertItem[];
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-blue-600 animate-pulse" />
            <h2 className="text-base font-bold text-ink-900 sm:text-lg">
              Alertas de Logística & Entrega ao Domicílio (KUBIKA)
            </h2>
            {alerts.length > 0 && (
              <span className="rounded-full bg-blue-100 border border-blue-200 px-2 py-0.5 text-[11px] font-extrabold text-blue-800">
                {alerts.length} {alerts.length === 1 ? "solicitação ativa" : "solicitações ativas"}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Notificações em tempo real geradas quando os consumidores solicitam entregas ao domicílio via estafeta da plataforma.
          </p>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-slate-50/50 p-6 text-center text-xs text-slate-500">
          Nenhuma solicitação de entrega ao domicílio registada nas últimas faturas.
        </div>
      ) : (
        <div className="divide-y divide-border/60">
          {alerts.map((alert) => (
            <div key={alert.id} className="py-3.5 first:pt-1 last:pb-1 space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                    {alert.invoiceNumber}
                  </span>
                  <span className="text-xs font-bold text-ink-900">
                    Cliente: {alert.customerName}
                  </span>
                  {alert.customerPhone && (
                    <span className="text-xs text-slate-500">({alert.customerPhone})</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-blue-600 text-white px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider">
                    Logística / Estafeta
                  </span>
                  <span className="rounded-full bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 text-[10px] font-bold">
                    Aguardando Pagamento
                  </span>
                </div>
              </div>

              <div className="text-xs bg-slate-50 p-2.5 rounded-lg space-y-1">
                <p>
                  <strong className="text-slate-800">Origem ({alert.sellerName}):</strong> {alert.itemsSummary}
                </p>
                <p className="text-blue-900 font-medium">
                  <strong>Destino / Endereço:</strong> {alert.deliveryAddress ?? "A confirmar com o cliente"}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-0.5">
                <span>Registado {formatRelativeTime(alert.createdAt)}</span>
                <span className="font-bold text-ink-900">
                  Total da Fatura (c/ Taxa de Estafeta):{" "}
                  <span className="text-green-700 font-extrabold text-sm">
                    {formatPrice(Number(alert.totalAmount), "AOA")}
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
