"use client";

import { useSyncExternalStore } from "react";
import {
  getCart,
  addToCart as storeAddToCart,
  updateQuantity as storeUpdateQuantity,
  removeFromCart as storeRemoveFromCart,
  clearCart as storeClearCart,
  CART_UPDATED_EVENT,
  type CartItem,
} from "./cartStore";

// ---------------------------------------------------------------------------
// External store subscription — React-approved pattern for localStorage carts
// ---------------------------------------------------------------------------

function subscribeToCart(onStoreChange: () => void) {
  window.addEventListener(CART_UPDATED_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(CART_UPDATED_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

const getSnapshot = () => getCart();
const getServerSnapshot = (): CartItem[] => [];

export function useCart() {
  // useSyncExternalStore properly handles SSR, hydration and concurrent mode —
  // no setState-in-effect needed.
  const items = useSyncExternalStore(subscribeToCart, getSnapshot, getServerSnapshot);

  const totalCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const totalPrice = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  const isLoaded = true; // always true on client with useSyncExternalStore

  const itemsBySeller = items.reduce<Record<string, {
    sellerName: string;
    sellerCity?: string;
    sellerLocation?: string;
    sellerPhone?: string | null;
    sellerWhatsapp?: string | null;
    items: CartItem[];
    subtotal: number;
  }>>((acc, item) => {
    if (!acc[item.sellerId]) {
      acc[item.sellerId] = {
        sellerName: item.sellerName,
        sellerCity: item.sellerCity,
        sellerLocation: item.sellerLocation,
        sellerPhone: item.sellerPhone,
        sellerWhatsapp: item.sellerWhatsapp,
        items: [],
        subtotal: 0,
      };
    }
    acc[item.sellerId].items.push(item);
    acc[item.sellerId].subtotal += item.price * item.quantity;
    return acc;
  }, {});

  return {
    items,
    isLoaded,
    totalCount,
    totalPrice,
    itemsBySeller,
    addToCart: storeAddToCart,
    updateQuantity: storeUpdateQuantity,
    removeFromCart: storeRemoveFromCart,
    clearCart: storeClearCart,
  };
}
