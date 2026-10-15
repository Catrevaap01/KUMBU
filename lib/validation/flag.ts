import { z } from "zod";

export const flagReasons = [
  "OUTDATED",
  "INCORRECT_PRICE",
  "SELLER_NOT_FOUND",
  "SUSPICIOUS",
  "OTHER",
] as const;

export const flagSchema = z.object({
  reason: z.enum(flagReasons),
  comment: z.string().trim().max(280, "Máximo de 280 caracteres.").optional(),
});

export type FlagInput = z.infer<typeof flagSchema>;

export const FLAG_REASON_LABEL: Record<(typeof flagReasons)[number], string> = {
  OUTDATED: "Preço desatualizado",
  INCORRECT_PRICE: "Preço incorreto",
  SELLER_NOT_FOUND: "Comerciante não encontrado neste local",
  SUSPICIOUS: "Preço suspeito ou duvidoso",
  OTHER: "Outro motivo",
};
