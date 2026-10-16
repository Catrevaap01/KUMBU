"use server";

import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth";
import { prisma } from "@/lib/db/client";
import { signInSchema } from "@/lib/validation/auth";
import type { ActionState } from "@/lib/actions/types";

export async function signInAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Introduza um e-mail e palavra-passe válidos." };
  }

  try {
    const res = await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
    if (res && typeof res === "string" && res.includes("error=")) {
      return { error: "E-mail ou palavra-passe incorretos." };
    }
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "E-mail ou palavra-passe incorretos." };
    }
    throw error;
  }

  // Obter o perfil do utilizador para redirecionar diretamente para o seu painel específico
  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: {
      systemRole: true,
      seller: { select: { id: true } },
    },
  });

  let targetDashboard = "/dashboard/consumer";
  if (user?.systemRole === "ADMIN") {
    targetDashboard = "/admin";
  } else if (user?.seller?.id) {
    targetDashboard = "/dashboard/seller";
  } else {
    targetDashboard = "/dashboard/consumer";
  }

  const fromParam = formData.get("from");
  const fromStr = typeof fromParam === "string" ? fromParam : "";

  // Se o utilizador tentava aceder a uma sub-página específica permitida ao seu papel, preserva;
  // Caso contrário, redireciona diretamente ao painel principal do seu perfil
  let finalTarget = targetDashboard;
  if (fromStr.startsWith("/admin") && user?.systemRole === "ADMIN") {
    finalTarget = fromStr;
  } else if (fromStr.startsWith("/dashboard/seller") && user?.seller?.id) {
    finalTarget = fromStr;
  } else if (
    fromStr.startsWith("/dashboard/consumer") &&
    !user?.seller?.id &&
    user?.systemRole !== "ADMIN"
  ) {
    finalTarget = fromStr;
  }

  revalidatePath("/", "layout");
  redirect(finalTarget);
}
