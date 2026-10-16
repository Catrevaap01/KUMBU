"use client";

import Link from "next/link";
import { KubikaLogo } from "@/components/ui/KubikaLogo";
import { Button } from "@/components/ui/Button";

export default function OfflinePage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center bg-white rounded-3xl border border-border p-8 shadow-sm">
        <div className="flex justify-center mb-6">
          <KubikaLogo size="md" />
        </div>

        <div className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold mb-4 border border-amber-200">
          Modo Offline
        </div>

        <h1 className="text-xl font-bold text-ink-950 mb-3">
          Sem Ligação à Internet
        </h1>

        <p className="text-sm text-slate-600 mb-8 leading-relaxed">
          Não foi possível carregar esta página no momento. Verifique os seus dados móveis ou ligação Wi-Fi para continuar a pesquisar e cotar os melhores preços.
        </p>

        <div className="flex flex-col gap-3">
          <Button
            type="button"
            className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white py-2.5 text-sm font-semibold rounded-xl"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.location.reload();
              }
            }}
          >
            Tentar Novamente
          </Button>

          <Link
            href="/"
            className="w-full inline-flex items-center justify-center border border-border bg-mist hover:bg-mist-200 text-ink-900 py-2.5 text-sm font-semibold rounded-xl transition"
          >
            Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  );
}
