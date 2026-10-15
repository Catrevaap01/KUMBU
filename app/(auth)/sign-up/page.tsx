import type { Metadata } from "next";
import { SignUpForm } from "@/components/auth/SignUpForm";

export const metadata: Metadata = { title: "Criar Conta" };

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;

  return (
    <>
      <h1 className="text-xl font-bold text-ink-900">Junte-se ao KUMBU</h1>
      <p className="mt-1 text-sm text-slate-600">
        Crie uma conta para reportar preços, confirmar publicações e sinalizar informações incorretas.
      </p>
      <div className="mt-6">
        <SignUpForm from={from} />
      </div>
    </>
  );
}
