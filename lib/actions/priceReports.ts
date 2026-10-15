"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/client";
import { requireUser } from "@/lib/auth/session";
import { capabilities, requireCapability } from "@/lib/rbac";
import { priceReportSchema } from "@/lib/validation/priceReport";
import { supersedePriorActiveReports } from "@/lib/priceReports/supersede";
import { CURRENCY_BY_COUNTRY } from "@/lib/validation/country";
import { normalizeProductName } from "@/lib/search/normalize";
import type { ActionState } from "@/lib/actions/types";

function fieldErrorsFrom(issues: { path: PropertyKey[]; message: string }[]) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0]);
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

export async function submitPriceReportAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const rawProductId = formData.get("productId") ? String(formData.get("productId")) : undefined;
  const user = await requireUser(rawProductId ? `/report-price?productId=${rawProductId}` : "/report-price");
  requireCapability(
    capabilities.canSubmitCommunityReport(user),
    "Deve iniciar sessão para reportar um preço.",
  );

  const parsed = priceReportSchema.safeParse({
    productId: rawProductId,
    productName: formData.get("productName") || undefined,
    productCategory: formData.get("productCategory") || undefined,
    productUnit: formData.get("productUnit") || undefined,
    sellerId: formData.get("sellerId") || undefined,
    newSellerName: formData.get("newSellerName") || undefined,
    newSellerType: formData.get("newSellerType") || undefined,
    newSellerCountry: formData.get("newSellerCountry") || "ANGOLA",
    newSellerCity: formData.get("newSellerCity") || "Luanda",
    newSellerLocation: formData.get("newSellerLocation") || undefined,
    price: formData.get("price"),
    availability: formData.get("availability") || undefined,
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  }

  let product = null;
  if (parsed.data.productId) {
    product = await prisma.product.findUnique({ where: { id: parsed.data.productId } });
  } else if (parsed.data.productName) {
    const rawName = parsed.data.productName;
    const normalizedName = normalizeProductName(rawName);
    product = await prisma.product.findFirst({
      where: {
        OR: [
          { normalizedName },
          { name: { equals: rawName, mode: "insensitive" } },
        ],
      },
    });

    if (!product) {
      product = await prisma.product.create({
        data: {
          name: rawName,
          normalizedName,
          category: parsed.data.productCategory || "Mercearia",
          unit: parsed.data.productUnit || "1 un",
        },
      });
    }
  }

  if (!product) {
    return { error: "Produto não especificado ou não encontrado. Tente novamente." };
  }

  let sellerId = parsed.data.sellerId;
  let currency: string;
  if (!sellerId) {
    // A community member reporting a price for a seller who isn't in the
    // system yet — exactly the "sellers with no online presence" scenario
    // the product exists to address (spec §1). No linked user account.
    const seller = await prisma.seller.create({
      data: {
        businessName: parsed.data.newSellerName!,
        sellerType: parsed.data.newSellerType!,
        country: parsed.data.newSellerCountry!,
        city: parsed.data.newSellerCity || "Luanda",
        location: parsed.data.newSellerLocation!,
      },
    });
    sellerId = seller.id;
    currency = CURRENCY_BY_COUNTRY[seller.country];
  } else {
    const seller = await prisma.seller.findUnique({ where: { id: sellerId } });
    if (!seller) {
      return { error: "Comerciante não encontrado. Tente novamente." };
    }
    currency = CURRENCY_BY_COUNTRY[seller.country];
  }

  await prisma.$transaction(async (tx) => {
    await supersedePriorActiveReports(tx, { productId: product.id, sellerId });
    await tx.priceReport.create({
      data: {
        productId: product.id,
        sellerId,
        sourceType: "COMMUNITY",
        price: parsed.data.price,
        currency,
        availability: parsed.data.availability,
        submittedById: user.id,
        notes: parsed.data.notes || null,
      },
    });
  });

  revalidatePath(`/products/${product.id}`);
  return { success: true };
}
