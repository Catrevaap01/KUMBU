"use client";

import { useSyncExternalStore } from "react";
import {
  addToCart as storeAddToCart,
  updateQuantity as storeUpdateQuantity,
  removeFromCart as storeRemoveFromCart,
  clearCart as storeClearCart,
  CART_UPDATED_EVENT,
  type CartItem,
} from "./cartStore";

// ---------------------------------------------------------------------------
// External store subscription — cached snapshot prevents React Error #185
// (React useSyncExternalStore requires referential equality when store hasn't changed)
// ---------------------------------------------------------------------------

const CART_STORAGE_KEY = "kumbu_cart_v1";
const EMPTY_ITEMS: CartItem[] = [];

let cachedRaw: string | null = null;
let cachedItems: CartItem[] = EMPTY_ITEMS;

function subscribeToCart(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(CART_UPDATED_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(CART_UPDATED_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getSnapshot(): CartItem[] {
  if (typeof window === "undefined") return EMPTY_ITEMS;
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (raw === cachedRaw) {
      return cachedItems;
    }
    cachedRaw = raw;
    cachedItems = raw ? (JSON.parse(raw) as CartItem[]) : EMPTY_ITEMS;
    return cachedItems;
  } catch {
    return EMPTY_ITEMS;
  }
}

function getServerSnapshot(): CartItem[] {
  return EMPTY_ITEMS;
}

export function useCart() {
  const items = useSyncExternalStore(subscribeToCart, getSnapshot, getServerSnapshot);

  const totalCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const totalPrice = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  const isLoaded = true;

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
