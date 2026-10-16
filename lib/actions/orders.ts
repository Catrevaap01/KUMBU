"use server";

import { prisma } from "@/lib/db/client";

export interface CartInvoiceItemInput {
  reportId?: string;
  productName: string;
  quantity: number;
  price: number;
  unit: string;
  sellerId: string;
  sellerName: string;
}

export interface RecordInvoiceNotificationInput {
  invoiceNumber: string;
  customerName?: string;
  customerPhone?: string;
  deliveryMode: "PICKUP" | "DELIVERY";
  deliveryAddress?: string;
  items: CartInvoiceItemInput[];
  finalTotal: number;
}

/**
 * Registado automaticamente quando o consumidor imprime a fatura proforma.
 * Notifica os comerciantes que o cliente vai pagar.
 * Se for entrega em casa, notifica também a plataforma (admin de logística).
 */
export async function recordInvoiceOrderAction(input: RecordInvoiceNotificationInput) {
  try {
    if (!input.items || input.items.length === 0) {
      return { success: false, error: "Nenhum item na fatura" };
    }

    const customer = (input.customerName || "").trim() || "Consumidor KUBIKA";
    const address = (input.deliveryAddress || "").trim();

    // 1. Agrupar itens por comerciante
    const itemsBySeller: Record<string, { sellerName: string; items: CartInvoiceItemInput[]; subtotal: number }> = {};
    for (const item of input.items) {
      if (!itemsBySeller[item.sellerId]) {
        itemsBySeller[item.sellerId] = {
          sellerName: item.sellerName,
          items: [],
          subtotal: 0,
        };
      }
      itemsBySeller[item.sellerId].items.push(item);
      itemsBySeller[item.sellerId].subtotal += item.price * item.quantity;
    }

    const createdNotifications = [];

    // 2. Notificação individual para cada Comerciante
    for (const [sellerId, group] of Object.entries(itemsBySeller)) {
      const summary = group.items
        .map((i) => `${i.quantity}x ${i.productName} (${i.unit}) — ${i.price * i.quantity} Kz`)
        .join("; ");

      const notif = await prisma.orderNotification.create({
        data: {
          invoiceNumber: input.invoiceNumber,
          customerName: customer,
          customerPhone: input.customerPhone || null,
          sellerId,
          sellerName: group.sellerName,
          totalAmount: group.subtotal,
          deliveryMode: input.deliveryMode,
          deliveryAddress: input.deliveryMode === "DELIVERY" ? address || "Endereço a combinar" : null,
          itemsSummary: summary,
          status: "PENDING_PAYMENT",
          isPlatformAlert: false,
        },
      });

      createdNotifications.push(notif);
    }

    // 3. Se escolheu Entrega em Casa, notificar TAMBÉM a Plataforma (Logística KUBIKA)
    if (input.deliveryMode === "DELIVERY") {
      const allSellers = Object.values(itemsBySeller).map((g) => g.sellerName).join(", ");
      const allItemsSummary = input.items
        .map((i) => `${i.quantity}x ${i.productName} [Loja: ${i.sellerName}]`)
        .join("; ");

      const platformAlert = await prisma.orderNotification.create({
        data: {
          invoiceNumber: input.invoiceNumber,
          customerName: customer,
          customerPhone: input.customerPhone || null,
          sellerId: null,
          sellerName: `Lojas: ${allSellers}`,
          totalAmount: input.finalTotal,
          deliveryMode: "DELIVERY",
          deliveryAddress: address || "Endereço a combinar",
          itemsSummary: allItemsSummary,
          status: "PENDING_PAYMENT",
          isPlatformAlert: true,
        },
      });

      createdNotifications.push(platformAlert);
    }

    return {
      success: true,
      notificationsCount: createdNotifications.length,
      platformAlerted: input.deliveryMode === "DELIVERY",
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Erro ao registar notificação de fatura:", errorMsg);
    return { success: false, error: errorMsg };
  }
}

/**
 * Consulta as notificações de encomendas e faturas recebidas pelo comerciante.
 */
export async function getSellerOrderNotifications(sellerId: string) {
  return prisma.orderNotification.findMany({
    where: {
      sellerId,
      isPlatformAlert: false,
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

/**
 * Consulta os alertas de encomendas de entrega ao domicílio recebidas pela plataforma (Admin).
 */
export async function getPlatformDeliveryNotifications() {
  return prisma.orderNotification.findMany({
    where: {
      isPlatformAlert: true,
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}
