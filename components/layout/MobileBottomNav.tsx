"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart/useCart";

interface MobileBottomNavProps {
  role?: "ADMIN" | "SELLER" | "CONSUMER" | null;
}

export function MobileBottomNav({ role }: MobileBottomNavProps) {
  const pathname = usePathname();
  const { totalCount, isLoaded } = useCart();

  const isHome = pathname === "/";
  const isSearch = pathname.startsWith("/search");
  const isCart = pathname.startsWith("/cart");
  const isFlags = pathname.startsWith("/admin/flags");
  const isNewPrice = pathname.startsWith("/dashboard/seller/prices/new");

  const isAdminPanel = pathname.startsWith("/admin");
  const isSellerPanel = pathname.startsWith("/dashboard/seller");
  const isConsumerPanel =
    pathname.startsWith("/dashboard/consumer") ||
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
            isHome ? "text-green-500 font-bold" : "text-[#8E95A2] hover:text-white"
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
            isSearch ? "text-green-500 font-bold" : "text-[#8E95A2] hover:text-white"
          }`}
        >
          <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isSearch ? "2.5" : "2"}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <span className="text-[10px] tracking-tight">Pesquisar</span>
        </Link>

        {/* Terceiro Botão Condicional por Papel */}
        {role === "ADMIN" ? (
          <Link
            href="/admin/flags"
            className={`flex flex-col items-center gap-1 transition-colors ${
              isFlags ? "text-red-400 font-bold" : "text-[#8E95A2] hover:text-white"
            }`}
          >
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isFlags ? "2.5" : "2"}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.828-.957A.75.75 0 0022 15.07V4.93a.75.75 0 00-.928-.727l-3.828.957a9 9 0 01-6.086-.71l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
            </svg>
            <span className="text-[10px] tracking-tight">Denúncias</span>
          </Link>
        ) : role === "SELLER" ? (
          <Link
            href="/dashboard/seller/prices/new"
            className={`flex flex-col items-center gap-1 transition-colors ${
              isNewPrice ? "text-green-500 font-bold" : "text-[#8E95A2] hover:text-white"
            }`}
          >
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isNewPrice ? "2.5" : "2"}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span className="text-[10px] tracking-tight">+ Preço</span>
          </Link>
        ) : (
          <Link
            href="/cart"
            className={`relative flex flex-col items-center gap-1 transition-colors ${
              isCart ? "text-green-500 font-bold" : "text-[#8E95A2] hover:text-white"
            }`}
          >
            <div className="relative">
              <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isCart ? "2.5" : "2"}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              {isLoaded && totalCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-green-600 px-1 text-[9px] font-extrabold text-white shadow-sm animate-pulse">
                  {totalCount}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight">Cotação</span>
          </Link>
        )}

        {/* Quarto Botão: Painel Dinâmico */}
        {role === "ADMIN" ? (
          <Link
            href="/admin"
            className={`flex flex-col items-center gap-1 transition-colors ${
              isAdminPanel ? "text-green-400 font-bold" : "text-[#8E95A2] hover:text-white"
            }`}
          >
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isAdminPanel ? "2.5" : "2"}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <span className="text-[10px] tracking-tight font-semibold">Painel Admin</span>
          </Link>
        ) : role === "SELLER" ? (
          <Link
            href="/dashboard/seller"
            className={`flex flex-col items-center gap-1 transition-colors ${
              isSellerPanel ? "text-green-500 font-bold" : "text-[#8E95A2] hover:text-white"
            }`}
          >
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isSellerPanel ? "2.5" : "2"}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.25a.75.75 0 01-.75-.75V10.5a.75.75 0 01.22-.53l8.25-8.25a.75.75 0 011.06 0l8.25 8.25a.75.75 0 01.22.53v9.75a.75.75 0 01-.75.75h-5.25" />
            </svg>
            <span className="text-[10px] tracking-tight font-semibold">Minha Loja</span>
          </Link>
        ) : (
          <Link
            href="/dashboard/consumer"
            className={`flex flex-col items-center gap-1 transition-colors ${
              isConsumerPanel ? "text-green-500 font-bold" : "text-[#8E95A2] hover:text-white"
            }`}
          >
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isConsumerPanel ? "2.5" : "2"}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <span className="text-[10px] tracking-tight font-semibold">Meu Painel</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
