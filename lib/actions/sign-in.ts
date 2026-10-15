"use server";

import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth";
import { signInSchema } from "@/lib/validation/auth";
import type { ActionState } from "@/lib/actions/types";

function safeRedirectTarget(from: FormDataEntryValue | null): string {
  const value = typeof from === "string" ? from : "";
  return value.startsWith("/") ? value : "/";
}

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

  revalidatePath("/", "layout");
  redirect(safeRedirectTarget(formData.get("from")));
}
