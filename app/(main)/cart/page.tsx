import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth/session";
import { CartView } from "@/components/cart/CartView";
import { prisma } from "@/lib/db/client";

export const metadata: Metadata = {
  title: "Carrinho & Fatura de Compras — KUMBU",
  description: "Faça a gestão da sua lista de compras, emita faturas únicas consolidadas ou envie encomendas diretamente aos vendedores via WhatsApp.",
};

export default async function CartPage() {
  const sessionUser = await getCurrentUser();
  let userName: string | null = null;
  let userEmail: string | null = null;

  if (sessionUser?.id) {
    const user = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      select: { name: true, email: true },
    });
    userName = user?.name ?? null;
    userEmail = user?.email ?? null;
  }

  return (
    <main className="min-h-[calc(100vh-14rem)] bg-mist">
      <CartView userName={userName} _userEmail={userEmail} />
    </main>
  );
}
