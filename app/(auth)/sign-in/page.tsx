import type { Metadata } from "next";
import { SignInForm } from "@/components/auth/SignInForm";

export const metadata: Metadata = { title: "Entrar" };

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;

  return (
    <>
      <h1 className="text-xl font-bold text-ink-900">Bem-vindo de volta</h1>
      <p className="mt-1 text-sm text-slate-600">Inicie sessão para reportar, confirmar ou sinalizar preços.</p>
      <div className="mt-6">
        <SignInForm from={from} />
      </div>
    </>
  );
}
