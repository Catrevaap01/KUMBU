"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/client";
import { isUniqueConstraintError } from "@/lib/db/errors";
import { requireUser } from "@/lib/auth/session";
import { capabilities, requireCapability } from "@/lib/rbac";
import { sellerPriceSchema, sellerRegistrationSchema } from "@/lib/validation/seller";
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

export async function registerSellerAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser("/sellers/register");
  if (!capabilities.canRegisterSeller(user)) {
    return { error: "A sua conta já possui um perfil de comerciante registado." };
  }

  const parsed = sellerRegistrationSchema.safeParse({
    businessName: formData.get("businessName"),
    sellerType: formData.get("sellerType"),
    country: formData.get("country") || "ANGOLA",
    location: formData.get("location"),
    city: formData.get("city"),
    contactPhone: formData.get("contactPhone") || undefined,
    contactWhatsapp: formData.get("contactWhatsapp") || undefined,
  });

  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  }

  try {
    await prisma.seller.create({
      data: {
        userId: user.id,
        businessName: parsed.data.businessName,
        sellerType: parsed.data.sellerType,
        country: parsed.data.country,
        city: parsed.data.city,
        location: parsed.data.location,
        contactPhone: parsed.data.contactPhone || null,
        contactWhatsapp: parsed.data.contactWhatsapp || null,
      },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { error: "Esta conta já possui um comerciante registado." };
    }
    console.error("Erro ao criar comerciante:", error);
    return { error: "Ocorreu um erro ao registar o comerciante. Por favor, tente novamente." };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard/seller");
}

export async function submitSellerPriceAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser("/dashboard/seller/prices/new");
  requireCapability(
    capabilities.canManageSellerListings(user),
    "Deve registar-se como vendedor antes de submeter preços.",
  );

  const parsed = sellerPriceSchema.safeParse({
    productId: formData.get("productId") || undefined,
    productName: formData.get("productName") || undefined,
    productCategory: formData.get("productCategory") || undefined,
    productUnit: formData.get("productUnit") || undefined,
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

  // Resolved fresh from the DB (never trusted from the session) so the
  // currency always matches the seller's actual, current country.
  const seller = await prisma.seller.findUnique({ where: { id: user.sellerId! } });
  if (!seller) {
    return { error: "Perfil de vendedor não encontrado. Contacte o suporte." };
  }
  const currency = CURRENCY_BY_COUNTRY[seller.country];

  await prisma.$transaction(async (tx) => {
    await supersedePriorActiveReports(tx, { productId: product.id, sellerId: user.sellerId! });
    await tx.priceReport.create({
      data: {
        productId: product.id,
        sellerId: user.sellerId!,
        sourceType: "SELLER",
        price: parsed.data.price,
        currency,
        availability: parsed.data.availability,
        submittedById: user.id,
        notes: parsed.data.notes || null,
      },
    });
  });

  revalidatePath("/dashboard/seller");
  revalidatePath(`/products/${product.id}`);
  redirect("/dashboard/seller");
}

export async function removeSellerListingAction(priceReportId: string): Promise<void> {
  const user = await requireUser("/dashboard/seller");
  requireCapability(capabilities.canManageSellerListings(user), "Deve ser um vendedor registado.");

  const report = await prisma.priceReport.findUnique({ where: { id: priceReportId } });
  if (!report || report.sellerId !== user.sellerId) {
    throw new Error("Este anúncio não lhe pertence.");
  }

  await prisma.priceReport.update({
    where: { id: priceReportId },
    data: { moderationStatus: "REMOVED" },
  });

  revalidatePath("/dashboard/seller");
  revalidatePath(`/products/${report.productId}`);
}
