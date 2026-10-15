"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/client";
import { isUniqueConstraintError } from "@/lib/db/errors";
import { signIn } from "@/lib/auth";
import { signUpSchema } from "@/lib/validation/auth";
import type { ActionState } from "@/lib/actions/types";



export async function signUpAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    phone: formData.get("phone") || undefined,
    accountType: formData.get("accountType") || "CONSUMER",
    businessName: formData.get("businessName") || undefined,
    sellerType: formData.get("sellerType") || undefined,
    country: formData.get("country") || "ANGOLA",
    city: formData.get("city") || undefined,
    location: formData.get("location") || undefined,
    contactPhone: formData.get("contactPhone") || undefined,
    contactWhatsapp: formData.get("contactWhatsapp") || undefined,
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { fieldErrors };
  }

  const {
    name,
    email,
    password,
    phone,
    accountType,
    businessName,
    sellerType,
    country,
    city,
    location,
    contactPhone,
    contactWhatsapp,
  } = parsed.data;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { fieldErrors: { email: "Já existe uma conta com este e-mail." } };
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
          phone: contactPhone || phone || null,
        },
      });

      if (accountType === "SELLER" && businessName && sellerType && city && location) {
        await tx.seller.create({
          data: {
            userId: user.id,
            businessName,
            sellerType,
            country: country ?? "ANGOLA",
            city,
            location,
            contactPhone: contactPhone || phone || null,
            contactWhatsapp: contactWhatsapp || contactPhone || phone || null,
            verificationStatus: "UNVERIFIED",
          },
        });
      }
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { fieldErrors: { email: "Já existe uma conta com este e-mail." } };
    }
    console.error("Erro ao criar utilizador:", error);
    return { error: "Ocorreu um erro ao criar a conta. Tente novamente." };
  }

  const defaultRedirect = accountType === "SELLER" ? "/dashboard/seller" : "/dashboard/consumer";
  const fromParam = formData.get("from");
  const redirectTarget = fromParam && typeof fromParam === "string" && fromParam.startsWith("/")
    ? fromParam
    : defaultRedirect;

  try {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res && typeof res === "string" && res.includes("error=")) {
      redirect(`/sign-in?from=${encodeURIComponent(redirectTarget)}`);
    }
  } catch (error) {
    if (error instanceof AuthError) {
      redirect(`/sign-in?from=${encodeURIComponent(redirectTarget)}`);
    }
    throw error;
  }

  revalidatePath("/", "layout");
  redirect(redirectTarget);
}
