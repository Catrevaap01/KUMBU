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
    <header className="border-b border-border bg-[#FBFAFC]/95 sticky top-0 z-40 backdrop-blur-md">
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
                  className="text-xs sm:text-sm font-semibold text-[#FF8A00] hover:text-[#E67A00]"
                >
                  Administração
                </Link>
              ) : user.sellerId ? (
                <Link
                  href="/dashboard/seller"
                  className="text-xs sm:text-sm font-semibold text-[#0B0B0D] hover:text-[#FF8A00]"
                >
                  Painel do Vendedor
                </Link>
              ) : (
                <Link
                  href="/dashboard/consumer"
                  className="text-xs sm:text-sm font-semibold text-[#0B0B0D] hover:text-[#FF8A00]"
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
