"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/useCart";

export function CartHeaderButton() {
  const { totalCount, isLoaded } = useCart();

  return (
    <Link
      href="/cart"
      className="relative flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-ink-900 transition hover:border-green-600 hover:text-green-700"
      aria-label="Ver Carrinho e Faturas"
    >
      <span>Carrinho</span>
      {isLoaded && totalCount > 0 ? (
        <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-green-700 px-1 text-[10px] font-bold text-white">
          {totalCount}
        </span>
      ) : null}
    </Link>
  );
}
