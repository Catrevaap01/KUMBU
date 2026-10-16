/**
 * Utilitários para contacto via WhatsApp e chamadas telefónicas em Angola (+244)
 */

export function cleanAngolaPhone(rawPhone?: string | null): string {
  if (!rawPhone) return "";
  // Remove todos os caracteres não numéricos
  const digits = rawPhone.replace(/\D/g, "");

  // Se começar por 244 e tiver mais de 9 dígitos, mantém
  if (digits.startsWith("244") && digits.length >= 12) {
    return digits;
  }

  // Se tiver 9 dígitos (ex: 923000000), adiciona o código de Angola (244)
  if (digits.length === 9) {
    return `244${digits}`;
  }

  // Caso já comece com zero ou outro prefixo local
  if (digits.startsWith("0") && digits.length === 10) {
    return `244${digits.slice(1)}`;
  }

  return digits;
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const clean = cleanAngolaPhone(phone);
  if (!clean) return "";
  const encoded = encodeURIComponent(message.trim());
  return `https://wa.me/${clean}?text=${encoded}`;
}

export function buildProductInquiryMessage(productName: string, price: number, currency: string, sellerName: string): string {
  return `Olá ${sellerName}! Vi o produto "${productName}" no KUBIKA por ${price.toLocaleString("pt-AO")} ${currency}. Ainda está disponível para encomenda?`;
}

export function buildCartOrderMessage(
  sellerName: string,
  items: { productName: string; unit: string; price: number; quantity: number }[],
  subtotal: number,
  currency = "Kz",
  options?: {
    deliveryText?: string;
    paymentText?: string;
  },
): string {
  const itemList = items
    .map((i) => `• ${i.quantity}x ${i.productName} (${i.unit}) — ${(i.price * i.quantity).toLocaleString("pt-AO")} ${currency}`)
    .join("\n");

  let msg = `*Olá ${sellerName}!* 🛒\nGostaria de fazer a seguinte encomenda que preparei através da plataforma *KUBIKA*:\n\n${itemList}\n\n*Total a Pagar:* ${subtotal.toLocaleString("pt-AO")} ${currency}`;

  if (options?.deliveryText) {
    msg += `\n*Entrega:* ${options.deliveryText}`;
  }
  if (options?.paymentText) {
    msg += `\n*Pagamento:* ${options.paymentText}`;
  }

  msg += `\n\nPode confirmar a disponibilidade e o pedido? Obrigado!`;
  return msg;
}
