export type CartItem = {
  reportId: string;
  productId: string;
  productName: string;
  category?: string;
  unit: string;
  price: number;
  currency: string;
  sellerId: string;
  sellerName: string;
  sellerCity?: string;
  sellerLocation?: string;
  sellerPhone?: string | null;
  sellerWhatsapp?: string | null;
  quantity: number;
};

const CART_STORAGE_KEY = "kumbu_cart_v1";
export const CART_UPDATED_EVENT = "kumbu-cart-updated";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
  } catch (err) {
    console.error("Falha ao guardar o carrinho:", err);
  }
}

export function addToCart(
  item: Omit<CartItem, "quantity">,
  quantity = 1,
): void {
  const current = getCart();
  const existingIndex = current.findIndex((i) => i.reportId === item.reportId);

  if (existingIndex >= 0) {
    current[existingIndex].quantity += quantity;
  } else {
    current.push({ ...item, quantity: Math.max(1, quantity) });
  }

  saveCart(current);
}

export function updateQuantity(reportId: string, quantity: number): void {
  const current = getCart();
  if (quantity <= 0) {
    saveCart(current.filter((i) => i.reportId !== reportId));
    return;
  }

  const item = current.find((i) => i.reportId === reportId);
  if (item) {
    item.quantity = quantity;
    saveCart(current);
  }
}

export function removeFromCart(reportId: string): void {
  const current = getCart();
  saveCart(current.filter((i) => i.reportId !== reportId));
}

export function clearCart(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
  } catch (err) {
    console.error("Falha ao limpar o carrinho:", err);
  }
}
