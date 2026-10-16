"use client";

import { useState } from "react";
import { addToCart, type CartItem } from "@/lib/cart/cartStore";

export function AddToCartButton({
  item,
  className = "",
}: {
  item: Omit<CartItem, "quantity">;
  className?: string;
}) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(item, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      className={`inline-flex items-center justify-center rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
        added
          ? "border-green-600 bg-green-600 text-white shadow-sm"
          : "border-border bg-white text-ink-900 hover:border-green-600 hover:bg-green-50/50 hover:text-green-800"
      } ${className}`}
    >
      <span>{added ? "No Carrinho!" : "+ Carrinho"}</span>
    </button>
  );
}
