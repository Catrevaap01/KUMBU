"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart/useCart";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { totalCount, isLoaded } = useCart();

  const isHome = pathname === "/";
  const isSearch = pathname.startsWith("/search");
  const isCart = pathname.startsWith("/cart");
  const isProfile =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up");

  return (
    <nav
      aria-label="Navegação Móvel"
      className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0B0B0D]/95 backdrop-blur-lg border-t border-white/10 px-3 py-2 text-white safe-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.3)]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Início */}
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 transition-colors ${
            isHome ? "text-[#FF8A00] font-bold" : "text-[#8E95A2] hover:text-white"
          }`}
        >
          <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isHome ? "2.5" : "2"}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75M4.5 10.5V20.25a.75.75 0 00.75.75h4.5a.75.75 0 00.75-.75v-4.5a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v4.5a.75.75 0 00.75.75h4.5a.75.75 0 00.75-.75V10.5" />
          </svg>
          <span className="text-[10px] tracking-tight">Início</span>
        </Link>

        {/* Comparar / Pesquisa */}
        <Link
          href="/search"
          className={`flex flex-col items-center gap-1 transition-colors ${
            isSearch ? "text-[#FF8A00] font-bold" : "text-[#8E95A2] hover:text-white"
          }`}
        >
          <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isSearch ? "2.5" : "2"}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <span className="text-[10px] tracking-tight">Comparar</span>
        </Link>

        {/* Cotação / Carrinho */}
        <Link
          href="/cart"
          className={`relative flex flex-col items-center gap-1 transition-colors ${
            isCart ? "text-[#FF8A00] font-bold" : "text-[#8E95A2] hover:text-white"
          }`}
        >
          <div className="relative">
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isCart ? "2.5" : "2"}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            {isLoaded && totalCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF8A00] px-1 text-[9px] font-extrabold text-white shadow-sm animate-pulse">
                {totalCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Cotação</span>
        </Link>

        {/* Perfil / Painel */}
        <Link
          href="/dashboard/consumer"
          className={`flex flex-col items-center gap-1 transition-colors ${
            isProfile ? "text-[#FF8A00] font-bold" : "text-[#8E95A2] hover:text-white"
          }`}
        >
          <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isProfile ? "2.5" : "2"}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
          <span className="text-[10px] tracking-tight">Perfil</span>
        </Link>
      </div>
    </nav>
  );
}
