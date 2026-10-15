import { z } from "zod";
import { sellerTypes } from "@/lib/validation/priceReport";
import { countries } from "@/lib/validation/country";

const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("Introduza um endereço de e-mail válido."));

export const signUpSchema = z
  .object({
    name: z.string().trim().min(2, "Introduza o seu nome."),
    email: emailField,
    password: z.string().min(8, "A palavra-passe deve ter pelo menos 8 caracteres."),
    phone: z.string().trim().optional(),
    accountType: z.enum(["CONSUMER", "SELLER"]).default("CONSUMER"),
    // Campos específicos para Vendedor / Comerciante
    businessName: z.string().trim().optional(),
    sellerType: z.enum(sellerTypes).optional(),
    country: z.enum(countries).default("ANGOLA").optional(),
    city: z.string().trim().optional(),
    location: z.string().trim().optional(),
    contactPhone: z.string().trim().optional(),
    contactWhatsapp: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.accountType === "SELLER") {
      if (!data.businessName || data.businessName.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Introduza o nome da sua loja, armazém ou bancada comercial.",
          path: ["businessName"],
        });
      }
      if (!data.sellerType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Selecione o tipo de estabelecimento comercial.",
          path: ["sellerType"],
        });
      }
      if (!data.city || data.city.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Selecione ou introduza a cidade/província do seu negócio.",
          path: ["city"],
        });
      }
      if (!data.location || data.location.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Introduza o bairro ou mercado onde se localiza.",
          path: ["location"],
        });
      }
    }
  });

export type SignUpInput = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Introduza a sua palavra-passe."),
});

export type SignInInput = z.infer<typeof signInSchema>;
