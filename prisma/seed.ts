import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/db/client";
import { normalizeProductName } from "../lib/search/normalize";
import type { CountryCode } from "../lib/validation/country";

const DEMO_PASSWORD = process.env.SEED_DEMO_PASSWORD;
if (!DEMO_PASSWORD) {
  throw new Error("SEED_DEMO_PASSWORD must be set before seeding (see .env.example).");
}

const hoursAgo = (h: number) => new Date(Date.now() - h * 60 * 60 * 1000);

async function upsertUser(input: {
  email: string;
  name: string;
  systemRole?: "USER" | "ADMIN";
  phone?: string;
}) {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD!, 10);
  return prisma.user.upsert({
    where: { email: input.email },
    update: { name: input.name, systemRole: input.systemRole ?? "USER", phone: input.phone },
    create: {
      email: input.email,
      name: input.name,
      passwordHash,
      systemRole: input.systemRole ?? "USER",
      phone: input.phone,
    },
  });
}

async function upsertSeller(input: {
  userId?: string;
  businessName: string;
  sellerType:
    | "SUPERMARKET"
    | "GROCERY"
    | "WHOLESALER"
    | "MARKET_SELLER"
    | "INDEPENDENT_RETAILER";
  country?: CountryCode;
  location: string;
  city?: string;
  verificationStatus?: "UNVERIFIED" | "VERIFIED" | "SUSPENDED";
  contactPhone?: string;
}) {
  const existing = await prisma.seller.findFirst({ where: { businessName: input.businessName } });
  if (existing) {
    return prisma.seller.update({
      where: { id: existing.id },
      data: {
        sellerType: input.sellerType,
        country: input.country ?? "ANGOLA",
        location: input.location,
        city: input.city ?? "Luanda",
        verificationStatus: input.verificationStatus ?? "UNVERIFIED",
        contactPhone: input.contactPhone,
      },
    });
  }
  return prisma.seller.create({
    data: {
      userId: input.userId,
      businessName: input.businessName,
      sellerType: input.sellerType,
      country: input.country ?? "ANGOLA",
      location: input.location,
      city: input.city ?? "Luanda",
      verificationStatus: input.verificationStatus ?? "UNVERIFIED",
      contactPhone: input.contactPhone,
    },
  });
}

async function upsertProduct(input: {
  name: string;
  category: string;
  unit: string;
  brand?: string;
}) {
  const normalizedName = normalizeProductName(input.name);
  const existing = await prisma.product.findFirst({ where: { name: input.name } });
  if (existing) {
    return prisma.product.update({
      where: { id: existing.id },
      data: { normalizedName, category: input.category, unit: input.unit, brand: input.brand },
    });
  }
  return prisma.product.create({
    data: {
      name: input.name,
      normalizedName,
      category: input.category,
      unit: input.unit,
      brand: input.brand,
    },
  });
}

async function createPriceReport(input: {
  productId: string;
  sellerId: string;
  sourceType: "SELLER" | "COMMUNITY";
  price: number;
  currency?: string;
  submittedById: string;
  ageHours: number;
  notes?: string;
  confirmedBy?: string[];
  flaggedBy?: { userId: string; reason: "OUTDATED" | "INCORRECT_PRICE" | "SELLER_NOT_FOUND" | "SUSPICIOUS" | "OTHER" }[];
}) {
  const submittedAt = hoursAgo(input.ageHours);

  const report = await prisma.priceReport.create({
    data: {
      productId: input.productId,
      sellerId: input.sellerId,
      sourceType: input.sourceType,
      price: input.price,
      currency: input.currency ?? "AOA",
      submittedById: input.submittedById,
      submittedAt,
      lastVerifiedAt: submittedAt,
      notes: input.notes,
    },
  });

  for (const userId of input.confirmedBy ?? []) {
    await prisma.priceConfirmation.create({
      data: { priceReportId: report.id, userId, confirmationType: "STILL_ACCURATE" },
    });
  }

  for (const flag of input.flaggedBy ?? []) {
    await prisma.flag.create({
      data: { priceReportId: report.id, userId: flag.userId, reason: flag.reason },
    });
  }

  return report;
}

async function main() {
  console.log("Iniciando seed adaptado à realidade de Angola (Kz / AOA)...");

  // Limpeza de tabelas para seed fresco e consistente
  await prisma.flag.deleteMany({});
  await prisma.priceConfirmation.deleteMany({});
  await prisma.priceReport.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.seller.deleteMany({});
  await prisma.product.deleteMany({});

  // --- Utilizadores -----------------------------------------------------------
  const admin = await upsertUser({
    email: "admin@sokowise.test",
    name: "Administrador SokoWise",
    systemRole: "ADMIN",
    phone: "+244 923 000 001",
  });

  // Vendedores em Angola
  const sellerUserCandando = await upsertUser({
    email: "candando@sokowise.test",
    name: "Armindo Candando",
    phone: "+244 923 111 222",
  });
  const sellerUserKero = await upsertUser({
    email: "kero@sokowise.test",
    name: "Nzinga Kero",
    phone: "+244 924 333 444",
  });
  const sellerUserMaxi = await upsertUser({
    email: "maxi@sokowise.test",
    name: "Mateus Maxi",
    phone: "+244 925 555 666",
  });
  const sellerUserDeskontao = await upsertUser({
    email: "deskontao@sokowise.test",
    name: "Deskontão Comercial",
    phone: "+244 926 777 888",
  });

  // Utilizadores de compatibilidade com o README original
  const sellerUserSunrise = await upsertUser({
    email: "sunrise@sokowise.test",
    name: "Sunrise Supermercado",
    phone: "+244 922 100 200",
  });

  // Membros da comunidade e consumidores em Luanda
  const community1 = await upsertUser({
    email: "antonio@sokowise.test",
    name: "António Sebastião",
    phone: "+244 931 100 200",
  });
  const community2 = await upsertUser({
    email: "mariana@sokowise.test",
    name: "Mariana da Costa",
    phone: "+244 932 200 300",
  });
  const consumer1 = await upsertUser({
    email: "manuel@sokowise.test",
    name: "Manuel Domingos",
    phone: "+244 933 300 400",
  });
  const consumerTendai = await upsertUser({
    email: "tendai@sokowise.test",
    name: "Tendai Mukamuri",
    phone: "+244 934 400 500",
  });
  const consumerFarai = await upsertUser({
    email: "farai@sokowise.test",
    name: "Farai Nogueira",
    phone: "+244 935 500 600",
  });

  // --- Vendedores / Estabelecimentos Comerciais em Angola --------------------
  const candando = await upsertSeller({
    userId: sellerUserCandando.id,
    businessName: "Supermercado Candando",
    sellerType: "SUPERMARKET",
    country: "ANGOLA",
    location: "Talatona",
    city: "Luanda",
    verificationStatus: "VERIFIED",
    contactPhone: "+244 923 111 222",
  });

  const kero = await upsertSeller({
    userId: sellerUserKero.id,
    businessName: "Kero Kilamba",
    sellerType: "SUPERMARKET",
    country: "ANGOLA",
    location: "Centralidade do Kilamba",
    city: "Luanda",
    verificationStatus: "VERIFIED",
    contactPhone: "+244 924 333 444",
  });

  const maxi = await upsertSeller({
    userId: sellerUserMaxi.id,
    businessName: "Maxi Cacuaco",
    sellerType: "SUPERMARKET",
    country: "ANGOLA",
    location: "Estrada de Cacuaco",
    city: "Luanda",
    verificationStatus: "VERIFIED",
    contactPhone: "+244 925 555 666",
  });

  const deskontao = await upsertSeller({
    userId: sellerUserDeskontao.id,
    businessName: "Deskontão Alvalade",
    sellerType: "SUPERMARKET",
    country: "ANGOLA",
    location: "Bairro Alvalade",
    city: "Luanda",
    verificationStatus: "VERIFIED",
    contactPhone: "+244 926 777 888",
  });

  const sunrise = await upsertSeller({
    userId: sellerUserSunrise.id,
    businessName: "Sunrise Supermercado",
    sellerType: "SUPERMARKET",
    country: "ANGOLA",
    location: "Maianga",
    city: "Luanda",
    verificationStatus: "VERIFIED",
    contactPhone: "+244 922 100 200",
  });

  // Vendedores informais / Bancadas de Mercados (cenário central da plataforma)
  const saoPauloStall = await upsertSeller({
    businessName: "Mercado do São Paulo - Bancada 14",
    sellerType: "MARKET_SELLER",
    country: "ANGOLA",
    location: "Mercado do São Paulo, Rangel",
    city: "Luanda",
    verificationStatus: "UNVERIFIED",
  });

  const kikoloWholesale = await upsertSeller({
    businessName: "Mercado do Kikolo - Armazém 3",
    sellerType: "WHOLESALER",
    country: "ANGOLA",
    location: "Kikolo Grossista",
    city: "Luanda",
    verificationStatus: "UNVERIFIED",
  });

  const congolensesShop = await upsertSeller({
    businessName: "Mercado dos Congolenses - Barraca 8",
    sellerType: "MARKET_SELLER",
    country: "ANGOLA",
    location: "Congolenses, Rangel",
    city: "Luanda",
    verificationStatus: "UNVERIFIED",
  });

  // Outras províncias de Angola
  const lobitoFrescos = await upsertSeller({
    businessName: "Frescos do Lobito",
    sellerType: "GROCERY",
    country: "ANGOLA",
    location: "Zona Comercial do Compão",
    city: "Benguela",
    verificationStatus: "VERIFIED",
    contactPhone: "+244 912 345 678",
  });

  const huamboCentral = await upsertSeller({
    businessName: "Armazéns Huambo Central",
    sellerType: "WHOLESALER",
    country: "ANGOLA",
    location: "Cidade Alta",
    city: "Huambo",
    verificationStatus: "UNVERIFIED",
    contactPhone: "+244 913 456 789",
  });

  // --- Produtos da Cesta Básica Angolana ------------------------------------
  const oleoAlimentar = await upsertProduct({
    name: "Óleo Alimentar 5L",
    category: "Óleos e Gorduras",
    unit: "5L",
    brand: "Solange / Palanca",
  });

  const fubaMilho = await upsertProduct({
    name: "Farinha de Milho 25kg (Fuba)",
    category: "Cereais e Farinhas",
    unit: "25kg",
    brand: "Gingante",
  });

  const arroz = await upsertProduct({
    name: "Arroz Agulha 5kg",
    category: "Cereais e Farinhas",
    unit: "5kg",
    brand: "Tio Lucas",
  });

  const feijao = await upsertProduct({
    name: "Feijão Castanho 1kg",
    category: "Leguminosas",
    unit: "1kg",
    brand: "Nacional",
  });

  const acucar = await upsertProduct({
    name: "Açúcar Branco 1kg",
    category: "Mercearia",
    unit: "1kg",
    brand: "Doce Mel",
  });

  const massa = await upsertProduct({
    name: "Massa Esparguete 500g",
    category: "Massas",
    unit: "500g",
    brand: "Gallo",
  });

  const sabao = await upsertProduct({
    name: "Sabão em Barra 1kg",
    category: "Higiene e Limpeza",
    unit: "1kg",
    brand: "Azul e Branco",
  });

  // Produto intencionalmente sem relatos (demonstra o estado vazio honesto)
  await upsertProduct({
    name: "Leite em Pó Nido 900g",
    category: "Laticínios",
    unit: "900g",
    brand: "Nestlé",
  });

  // --- Relatos de Preço (Cesta Básica em Kwanzas - AOA) --------------------

  // 1. Óleo Alimentar 5L: cobre todos os estados de confiança
  // ★ MELHOR VALOR: Preço justo (14.500 Kz), fresco (5h atrás), 3 confirmações
  await createPriceReport({
    productId: oleoAlimentar.id,
    sellerId: sunrise.id,
    sourceType: "SELLER",
    price: 14500,
    currency: "AOA",
    submittedById: sellerUserSunrise.id,
    ageHours: 5,
    notes: "Promoção especial da semana na loja.",
    confirmedBy: [consumer1.id, community1.id, community2.id],
  });

  // MENOR PREÇO: Vendedor informal do Mercado do São Paulo (13.200 Kz), 1 confirmação
  await createPriceReport({
    productId: oleoAlimentar.id,
    sellerId: saoPauloStall.id,
    sourceType: "COMMUNITY",
    price: 13200,
    currency: "AOA",
    submittedById: community1.id,
    ageHours: 2,
    notes: "Bancada logo na entrada principal do mercado.",
    confirmedBy: [consumer1.id],
  });

  // SINALIZADO PARA REVISÃO: Preço suspeitamente baixo no Kikolo (9.500 Kz)
  await createPriceReport({
    productId: oleoAlimentar.id,
    sellerId: kikoloWholesale.id,
    sourceType: "COMMUNITY",
    price: 9500,
    currency: "AOA",
    submittedById: consumerTendai.id,
    ageHours: 10,
    notes: "Valor reportado muito abaixo do mercado.",
    flaggedBy: [{ userId: consumer1.id, reason: "SUSPICIOUS" }],
  });

  // POSSIVELMENTE DESATUALIZADO: > 72h no Mercado dos Congolenses (15.800 Kz)
  await createPriceReport({
    productId: oleoAlimentar.id,
    sellerId: congolensesShop.id,
    sourceType: "COMMUNITY",
    price: 15800,
    currency: "AOA",
    submittedById: community2.id,
    ageHours: 96,
  });

  // NOVO REGISTO: Relato recente no Candando (15.200 Kz)
  await createPriceReport({
    productId: oleoAlimentar.id,
    sellerId: candando.id,
    sourceType: "SELLER",
    price: 15200,
    currency: "AOA",
    submittedById: sellerUserCandando.id,
    ageHours: 0.5,
  });

  // 2. Farinha de Milho 25kg: Preços divergentes (> 50% de diferença) para ativar o aviso de divergência
  await createPriceReport({
    productId: fubaMilho.id,
    sellerId: candando.id,
    sourceType: "SELLER",
    price: 28000,
    currency: "AOA",
    submittedById: sellerUserCandando.id,
    ageHours: 4,
    confirmedBy: [community1.id],
  });

  await createPriceReport({
    productId: fubaMilho.id,
    sellerId: saoPauloStall.id,
    sourceType: "COMMUNITY",
    price: 45000,
    currency: "AOA",
    submittedById: community2.id,
    ageHours: 1,
    notes: "Preço cobrado na bancada ontem à tarde.",
  });

  // 3. Arroz Agulha 5kg
  await createPriceReport({
    productId: arroz.id,
    sellerId: kero.id,
    sourceType: "SELLER",
    price: 6800,
    currency: "AOA",
    submittedById: sellerUserKero.id,
    ageHours: 3,
    confirmedBy: [consumer1.id],
  });

  await createPriceReport({
    productId: arroz.id,
    sellerId: maxi.id,
    sourceType: "SELLER",
    price: 6500,
    currency: "AOA",
    submittedById: sellerUserMaxi.id,
    ageHours: 7,
    confirmedBy: [community1.id],
  });

  // 4. Feijão Castanho 1kg
  await createPriceReport({
    productId: feijao.id,
    sellerId: deskontao.id,
    sourceType: "SELLER",
    price: 2400,
    currency: "AOA",
    submittedById: sellerUserDeskontao.id,
    ageHours: 12,
  });

  await createPriceReport({
    productId: feijao.id,
    sellerId: lobitoFrescos.id,
    sourceType: "SELLER",
    price: 2100,
    currency: "AOA",
    submittedById: consumerFarai.id,
    ageHours: 8,
    confirmedBy: [consumer1.id],
  });

  // 5. Massa Esparguete 500g
  await createPriceReport({
    productId: massa.id,
    sellerId: maxi.id,
    sourceType: "SELLER",
    price: 650,
    currency: "AOA",
    submittedById: sellerUserMaxi.id,
    ageHours: 6,
  });

  // 6. Açúcar Branco 1kg
  await createPriceReport({
    productId: acucar.id,
    sellerId: candando.id,
    sourceType: "SELLER",
    price: 1200,
    currency: "AOA",
    submittedById: sellerUserCandando.id,
    ageHours: 15,
  });

  // 7. Sabão em Barra 1kg
  await createPriceReport({
    productId: sabao.id,
    sellerId: huamboCentral.id,
    sourceType: "COMMUNITY",
    price: 900,
    currency: "AOA",
    submittedById: community1.id,
    ageHours: 24,
    confirmedBy: [consumer1.id],
  });

  // --- Audit Log ------------------------------------------------------------
  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: "SEED_DATA_INITIALIZED",
      entityType: "System",
      entityId: "seed-angola",
      metadata: { note: "Dados de demonstração para a realidade angolana (Kz / Luanda / Benguela / Huambo)." },
    },
  });

  console.log("--------------------------------------------------");
  console.log("✅ Seed para Angola concluído com sucesso!");
  console.log(`🔑 Senha de demonstração para todas as contas: ${DEMO_PASSWORD}`);
  console.log("--------------------------------------------------");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
