"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/client";
import { isUniqueConstraintError } from "@/lib/db/errors";
import { requireUser } from "@/lib/auth/session";
import { capabilities, requireCapability } from "@/lib/rbac";
import type { ActionState } from "@/lib/actions/types";

export async function confirmReportAction(
  priceReportId: string,
  redirectPath: string,
  _prevState: ActionState,
  _formData: FormData,
): Promise<ActionState> {
  const user = await requireUser(redirectPath);
  requireCapability(capabilities.canConfirmOrFlag(user), "Deve iniciar sessão para confirmar um preço.");

  try {
    await prisma.priceConfirmation.create({
      data: { priceReportId, userId: user.id },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { error: "Já confirmou este preço anteriormente." };
    }
    throw error;
  }

  revalidatePath(redirectPath);
  return { success: true };
}
