import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { Button } from "@/components/ui/Button";
import { KubikaLogo } from "@/components/ui/KubikaLogo";
import { CartHeaderButton } from "@/components/cart/CartHeaderButton";

export async function SiteHeader() {
  const user = await getCurrentUser();
  const isSeller = Boolean(user?.sellerId);
  const isAdmin = user?.systemRole === "ADMIN";
  const showCart = !isSeller && !isAdmin;

  return (
    <header className="border-b border-border bg-white/95 sticky top-0 z-40 backdrop-blur-md">
      <div className="container-page flex h-14 items-center justify-between gap-2">
        <Link href="/" aria-label="KUBIKA Início" className="flex items-center gap-2 shrink-0">
          <KubikaLogo size="sm" showTagline={false} />
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Carrinho só visível para Consumidores ou visitantes */}
          {showCart && <CartHeaderButton />}

          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              {user.systemRole === "ADMIN" ? (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-900 bg-slate-900 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition"
                >
                  <span className="size-2 rounded-full bg-green-400 animate-pulse" />
                  <span>Painel Admin</span>
                </Link>
              ) : user.sellerId ? (
                <Link
                  href="/dashboard/seller"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-green-600 bg-green-50 px-3 py-1.5 text-xs font-bold text-green-800 hover:bg-green-100 transition"
                >
                  <span className="size-2 rounded-full bg-green-600" />
                  <span>Painel da Loja</span>
                </Link>
              ) : (
                <Link
                  href="/dashboard/consumer"
                  className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-ink-900 hover:border-green-600 hover:text-green-700 transition"
                >
                  Meu Painel
                </Link>
              )}

              <SignOutButton />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button href="/sign-in" variant="ghost" className="!px-3 !py-1.5 text-xs">
                Entrar
              </Button>
              <Button href="/sign-up" className="!px-3 !py-1.5 text-xs">
                Criar conta
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
