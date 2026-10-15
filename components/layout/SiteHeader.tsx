import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { signOutAction } from "@/lib/actions/sign-out";
import { Button } from "@/components/ui/Button";
import { KumbuLogo } from "@/components/ui/KumbuLogo";
import { CartHeaderButton } from "@/components/cart/CartHeaderButton";

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-border bg-white sticky top-0 z-40 backdrop-blur-md bg-white/95">
      <div className="container-page flex h-14 items-center justify-between gap-2">
        <Link href="/" aria-label="KUMBU Início" className="flex items-center gap-2 shrink-0">
          <KumbuLogo size="sm" showTagline={false} />
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Botão de Carrinho sempre acessível */}
          <CartHeaderButton />

          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              {user.sellerId ? (
                <Link
                  href="/dashboard/seller"
                  className="text-xs sm:text-sm font-semibold text-green-800 hover:text-green-600"
                >
                  Painel do Vendedor
                </Link>
              ) : (
                <Link
                  href="/dashboard/consumer"
                  className="text-xs sm:text-sm font-semibold text-ink-900 hover:text-green-600"
                >
                  Meu Painel
                </Link>
              )}

              {user.systemRole === "ADMIN" ? (
                <Link
                  href="/admin"
                  className="text-xs sm:text-sm font-semibold text-amber-600 hover:text-amber-700"
                >
                  Administração
                </Link>
              ) : null}

              <form action={signOutAction}>
                <Button type="submit" variant="ghost" className="!px-2.5 sm:!px-3 !py-1 text-xs">
                  Sair
                </Button>
              </form>
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
