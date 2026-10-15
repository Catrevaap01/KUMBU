import { z } from "zod";
import { sellerTypes } from "@/lib/validation/priceReport";
import { countries } from "@/lib/validation/country";

export const sellerRegistrationSchema = z.object({
  businessName: z.string().trim().min(2, "Introduza o nome do seu negócio ou bancada."),
  sellerType: z.enum(sellerTypes),
  country: z.enum(countries),
  location: z.string().trim().min(2, "Introduza o seu bairro ou localização."),
  city: z.string().trim().min(2, "Introduza a sua cidade / província."),
  contactPhone: z.string().trim().optional(),
  contactWhatsapp: z.string().trim().optional(),
});

export type SellerRegistrationInput = z.infer<typeof sellerRegistrationSchema>;

export const sellerPriceSchema = z
  .object({
    productId: z.string().optional(),
    productName: z.string().trim().min(2, "Introduza o nome do produto com pelo menos 2 caracteres.").optional(),
    productCategory: z.string().trim().default("Mercearia").optional(),
    productUnit: z.string().trim().default("1 un").optional(),
    price: z.coerce.number().positive("Introduza um preço superior a zero."),
    availability: z.enum(["IN_STOCK", "OUT_OF_STOCK", "UNKNOWN"]).default("UNKNOWN"),
    notes: z.string().trim().max(280, "As notas devem ter no máximo 280 caracteres.").optional(),
  })
  .refine((data) => Boolean(data.productId || data.productName), {
    message: "Selecione um produto existente ou introduza o nome de um novo produto.",
    path: ["productId"],
  });

export type SellerPriceInput = z.infer<typeof sellerPriceSchema>;

