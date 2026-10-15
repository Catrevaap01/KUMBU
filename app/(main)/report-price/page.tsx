import type { Metadata } from "next";
import { prisma } from "@/lib/db/client";
import { requireUser } from "@/lib/auth/session";
import { ReportPriceForm, ReportPriceCancelLink } from "@/components/priceReports/ReportPriceForm";

export const metadata: Metadata = { title: "Reportar um Preço" };

export default async function ReportPricePage({
  searchParams,
}: {
  searchParams: Promise<{ productId?: string }>;
}) {
  const { productId } = await searchParams;
  await requireUser(productId ? `/report-price?productId=${productId}` : "/report-price");

  const [product, allProducts, sellers] = await Promise.all([
    productId ? prisma.product.findUnique({ where: { id: productId } }) : Promise.resolve(null),
    prisma.product.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, unit: true },
    }),
    prisma.seller.findMany({
      orderBy: { businessName: "asc" },
      select: { id: true, businessName: true, location: true, country: true },
    }),
  ]);

  return (
    <main className="container-page flex justify-center py-10">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-white p-6 shadow-sm shadow-ink-900/5 sm:p-8">
        <h1 className="text-xl font-bold text-ink-900">Reportar um preço</h1>
        <p className="mt-1 text-sm text-slate-600">
          {product
            ? `${product.name} · ${product.category} · ${product.unit}`
            : "Partilhe o preço de um produto observado no mercado para ajudar outros consumidores."}
        </p>

        <div className="mt-6">
          <ReportPriceForm
            productId={product?.id}
            productInfo={product ?? undefined}
            products={allProducts}
            sellers={sellers}
          />
        </div>
        <div className="mt-3">
          {product ? (
            <ReportPriceCancelLink productId={product.id} />
          ) : (
            <ReportPriceCancelLink productId="" />
          )}
        </div>
      </div>
    </main>
  );
}
