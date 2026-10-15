import EmbeddedPostgres from "embedded-postgres";
import fs from "fs";
import net from "net";
import path from "path";

const DB_DIR = path.resolve(process.cwd(), ".local-db");
const PORT = 5437;
const USER = "sokowise";
const PASSWORD = "sokowise";
const DATABASE_NAME = "sokowise";

function isPortOpen(port: number, host = "127.0.0.1"): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = net.createConnection({ port, host });
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("error", () => {
      resolve(false);
    });
  });
}

async function main() {
  console.log("--------------------------------------------------");
  console.log("🐘 Verificando PostgreSQL local (porta 5437)...");
  console.log("--------------------------------------------------");

  const alreadyRunning = await isPortOpen(PORT);
  if (alreadyRunning) {
    console.log(`✅ PostgreSQL já está ativo e aceitando conexões na porta ${PORT}!`);
    console.log("--------------------------------------------------");
    return;
  }

  const pg = new EmbeddedPostgres({
    databaseDir: DB_DIR,
    port: PORT,
    user: USER,
    password: PASSWORD,
    persistent: true,
  });

  if (!fs.existsSync(DB_DIR)) {
    console.log("📦 Inicializando cluster de dados em .local-db...");
    await pg.initialise();
  }

  await pg.start();
  console.log(`✅ PostgreSQL iniciado com sucesso em 127.0.0.1:${PORT}`);

  try {
    await pg.createDatabase(DATABASE_NAME);
    console.log(`✅ Base de dados '${DATABASE_NAME}' pronta!`);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (!message.includes("already exists")) {
      console.log(`Nota: ${message}`);
    }
  }

  console.log("--------------------------------------------------");
  console.log(`🔗 DATABASE_URL="postgresql://${USER}:${PASSWORD}@localhost:${PORT}/${DATABASE_NAME}"`);
  console.log("🚀 Pronto para conexões Prisma / Next.js!");
  console.log("Pressione Ctrl+C para encerrar o banco de dados.");
  console.log("--------------------------------------------------");

  const shutdown = async () => {
    console.log("\n🛑 Encerrando PostgreSQL local...");
    try {
      await pg.stop();
      console.log("✅ PostgreSQL parado com sucesso.");
    } catch {
      // Ignorar erros no encerramento
    }
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  // Mantém o processo vivo se iniciou o servidor
  await new Promise(() => {});
}

main().catch((err) => {
  console.error("❌ Falha ao iniciar PostgreSQL local:", err);
  process.exit(1);
});
