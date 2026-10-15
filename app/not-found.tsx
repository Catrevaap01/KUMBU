import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-amber-500/10 text-2xl font-bold text-amber-600 mb-4">
        404
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
        Produto ou Página Não Encontrada
      </h1>
      <p className="mt-3 max-w-md text-base text-slate-600">
        O produto ou endereço que tentou aceder não existe ou foi atualizado após a última atualização do catálogo.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button href="/search" variant="primary">
          Pesquisar Produtos
        </Button>
        <Button href="/" variant="secondary">
          Voltar à Página Inicial
        </Button>
      </div>
    </main>
  );
}
