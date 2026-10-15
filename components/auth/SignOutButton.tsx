"use client";

import { useTransition } from "react";
import { signOutAction } from "@/lib/actions/sign-out";
import { clearCart } from "@/lib/cart/cartStore";
import { Button } from "@/components/ui/Button";

export function SignOutButton() {
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    // Ao terminar sessão, limpa completamente o carrinho do consumidor
    clearCart();

    startTransition(async () => {
      await signOutAction();
    });
  };

  return (
    <Button
      type="button"
      onClick={handleSignOut}
      disabled={isPending}
      variant="ghost"
      className="!px-2.5 sm:!px-3 !py-1 text-xs"
    >
      {isPending ? "A sair…" : "Sair"}
    </Button>
  );
}
