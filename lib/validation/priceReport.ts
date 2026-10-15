import { z } from "zod";
import { countries } from "@/lib/validation/country";

export const sellerTypes = [
  "SUPERMARKET",
  "GROCERY",
  "WHOLESALER",
  "MARKET_SELLER",
  "INDEPENDENT_RETAILER",
] as const;

export const SELLER_TYPE_LABEL: Record<(typeof sellerTypes)[number], string> = {
  SUPERMARKET: "Supermercado",
  GROCERY: "Mini-mercado / Mercearia",
  WHOLESALER: "Armazém Grossista",
  MARKET_SELLER: "Bancada de Mercado / Vendedor Informal",
  INDEPENDENT_RETAILER: "Retalhista Independente / Cantina",
};

export const priceReportSchema = z
  .object({
    productId: z.string().optional(),
    productName: z.string().trim().min(2, "Introduza o nome do produto com pelo menos 2 caracteres.").optional(),
    productCategory: z.string().trim().default("Mercearia").optional(),
    productUnit: z.string().trim().default("1 un").optional(),
    sellerId: z.string().optional(),
    newSellerName: z.string().trim().min(2, "Introduza o nome do comerciante ou bancada.").optional(),
    newSellerType: z.enum(sellerTypes).optional(),
    newSellerCountry: z.enum(countries).optional(),
    newSellerCity: z.string().trim().optional(),
    newSellerLocation: z.string().trim().min(2, "Introduza a localização do comerciante.").optional(),
    price: z.coerce.number().positive("Introduza um preço superior a zero."),
    availability: z.enum(["IN_STOCK", "OUT_OF_STOCK", "UNKNOWN"]).default("UNKNOWN"),
    notes: z.string().trim().max(280, "As notas devem ter no máximo 280 caracteres.").optional(),
  })
  .refine(
    (data) => Boolean(data.productId || data.productName),
    { message: "Selecione um produto existente ou introduza o nome do produto.", path: ["productId"] }
  )
  .refine(
    (data) =>
      Boolean(data.sellerId) ||
      Boolean(data.newSellerName && data.newSellerType && data.newSellerLocation),
    { message: "Selecione um comerciante existente ou preencha os dados de um novo.", path: ["sellerId"] },
  );

export type PriceReportInput = z.infer<typeof priceReportSchema>;
