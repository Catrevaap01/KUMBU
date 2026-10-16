import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { SellerRegistrationForm } from "@/components/sellers/SellerRegistrationForm";

export const metadata: Metadata = { title: "Registar como Vendedor" };

export default async function SellerRegisterPage() {
  const user = await requireUser("/sellers/register");
  if (user.sellerId) redirect("/dashboard/seller");

  return (
    <main className="container-page flex justify-center py-10">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-white p-6 shadow-sm shadow-ink-900/5 sm:p-8">
        <h1 className="text-xl font-bold text-ink-900">Registar como Vendedor</h1>
        <p className="mt-1 text-sm text-slate-600">
          Adicione o seu estabelecimento ou bancada para publicar e gerir os seus próprios preços na KUBIKA.
        </p>
        <div className="mt-6">
          <SellerRegistrationForm />
        </div>
      </div>
    </main>
  );
}
