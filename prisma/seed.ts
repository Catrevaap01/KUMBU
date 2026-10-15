import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/db/client";
import { normalizeProductName } from "../lib/search/normalize";

const DEMO_PASSWORD = process.env.SEED_DEMO_PASSWORD || "Demo1234!";

async function upsertUser(input: {
  email: string;
  name: string;
  systemRole?: "USER" | "ADMIN";
  phone?: string;
}) {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
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

async function main() {
  console.log("A limpar todos os dados fictícios da plataforma KUMBU...");

  // 1. Eliminar todos os dados transacionais fictícios
  await prisma.flag.deleteMany({});
  await prisma.priceConfirmation.deleteMany({});
  await prisma.priceReport.deleteMany({});
  await prisma.auditLog.deleteMany({});

  // 2. Eliminar todos os estabelecimentos/vendedores fictícios
  await prisma.seller.deleteMany({});

  // 3. Eliminar todos os utilizadores fictícios / de teste
  await prisma.user.deleteMany({
    where: {
      email: {
        notIn: ["admin@kumbu.ao", "admin@sokowise.test"],
      },
    },
  });

  // 4. Garantir a conta de Administrador Oficial do KUMBU
  const admin = await upsertUser({
    email: "admin@kumbu.ao",
    name: "Administrador KUMBU",
    systemRole: "ADMIN",
    phone: "+244 923 000 001",
  });

  // Conta de compatibilidade de admin
  await upsertUser({
    email: "admin@sokowise.test",
    name: "Administrador KUMBU (Acesso Alternativo)",
    systemRole: "ADMIN",
    phone: "+244 923 000 001",
  });

  // 5. Manter apenas o Catálogo Oficial de Produtos Reais da Cesta Básica Angolana
  // (Sem preços e sem vendedores vinculados – apenas a lista padrão para pesquisa e registo)
  const produtosCestaBasica = [
    { name: "Óleo Alimentar 5L", category: "Óleos e Gorduras", unit: "5L", brand: "Solange / Palanca" },
    { name: "Farinha de Milho 25kg (Fuba)", category: "Cereais e Farinhas", unit: "25kg", brand: "Gingante" },
    { name: "Arroz Agulha 5kg", category: "Cereais e Farinhas", unit: "5kg", brand: "Tio Lucas" },
    { name: "Feijão Castanho 1kg", category: "Leguminosas", unit: "1kg", brand: "Nacional" },
    { name: "Açúcar Branco 1kg", category: "Mercearia", unit: "1kg", brand: "Doce Mel" },
    { name: "Massa Esparguete 500g", category: "Massas", unit: "500g", brand: "Gallo" },
    { name: "Sabão em Barra 1kg", category: "Higiene e Limpeza", unit: "1kg", brand: "Azul e Branco" },
    { name: "Leite em Pó 900g", category: "Laticínios", unit: "900g", brand: "Nido" },
    { name: "Sal Iodado 1kg", category: "Condimentos", unit: "1kg", brand: "Sal do Lobito" },
    { name: "Farinha de Trigo 1kg", category: "Cereais e Farinhas", unit: "1kg", brand: "Trigo Dourado" },
    { name: "Peixe Carapau Congelado 1kg", category: "Congelados e Peixes", unit: "1kg", brand: "Pesca Nacional" },
    { name: "Frango Congelado Inteiro 1kg", category: "Aves e Carnes", unit: "1kg", brand: "Nacional" },
  ];

  for (const prod of produtosCestaBasica) {
    await upsertProduct(prod);
  }

  // Registar no log de auditoria a limpeza dos dados fictícios
  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: "CLEANED_FICTITIOUS_DATA",
      entityType: "System",
      entityId: "system-cleanup",
      metadata: { note: "Eliminados todos os utilizadores, vendedores e preços fictícios. Mantido apenas o Admin e o Catálogo Base." },
    },
  });

  console.log("--------------------------------------------------");
  console.log("✅ Todos os dados fictícios foram eliminados com sucesso!");
  console.log("👤 Utilizador Administrador oficial configurado: admin@kumbu.ao");
  console.log("📦 Catálogo Oficial da Cesta Básica Angolana carregado (sem preços fictícios).");
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
