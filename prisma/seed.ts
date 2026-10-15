import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/db/client";

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

async function main() {
  console.log("A limpar todos os dados e produtos existentes da plataforma KUMBU...");

  // 1. Eliminar todos os dados transacionais
  await prisma.flag.deleteMany({});
  await prisma.priceConfirmation.deleteMany({});
  await prisma.priceReport.deleteMany({});
  await prisma.auditLog.deleteMany({});

  // 2. Eliminar todos os estabelecimentos/vendedores
  await prisma.seller.deleteMany({});

  // 3. Eliminar TODOS os produtos da base de dados (só haverá produtos quando um comerciante colocar)
  await prisma.product.deleteMany({});

  // 4. Eliminar todos os utilizadores fictícios, mantendo exclusivamente o Administrador
  await prisma.user.deleteMany({
    where: {
      email: {
        notIn: ["admin@kumbu.ao", "admin@sokowise.test"],
      },
    },
  });

  // 5. Garantir a conta oficial de Administrador do KUMBU
  const admin = await upsertUser({
    email: "admin@kumbu.ao",
    name: "Administrador KUMBU",
    systemRole: "ADMIN",
    phone: "+244 923 000 001",
  });

  await upsertUser({
    email: "admin@sokowise.test",
    name: "Administrador KUMBU (Demo)",
    systemRole: "ADMIN",
    phone: "+244 923 000 001",
  });

  // 6. Registar no log de auditoria
  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: "PURGED_ALL_PRODUCTS_AND_DATA",
      entityType: "System",
      entityId: "clean-slate",
      metadata: { note: "Todos os produtos eliminados. A plataforma agora só terá produtos cadastrados diretamente por comerciantes." },
    },
  });

  console.log("--------------------------------------------------");
  console.log("✅ Todos os produtos anteriores foram excluídos!");
  console.log("📦 Total de produtos no banco: 0 (Apenas comerciantes podem adicionar).");
  console.log("👤 Administrador oficial configurado: admin@kumbu.ao");
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
