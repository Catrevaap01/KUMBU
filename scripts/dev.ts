import EmbeddedPostgres from "embedded-postgres";
import fs from "fs";
import net from "net";
import path from "path";
import { spawn, execSync } from "child_process";

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

function freePort(port: number) {
  try {
    const output = execSync(`netstat -ano | findstr LISTENING | findstr :${port}`, {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "ignore"],
    });
    const lines = output.trim().split("\n");
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && pid !== "0" && pid !== String(process.pid)) {
        console.log(`🧹 Libertando porta ${port} ocupada pelo processo PID ${pid}...`);
        try {
          execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
        } catch {}
      }
    }
  } catch {
    // Porta já está livre
  }
}

async function startDatabaseIfNeeded() {
  const dbRunning = await isPortOpen(PORT);
  if (dbRunning) {
    console.log(`✅ Base de dados PostgreSQL já está ativa na porta ${PORT}.`);
    return null;
  }

  console.log(`🐘 A iniciar base de dados PostgreSQL local (porta ${PORT})...`);
  const pg = new EmbeddedPostgres({
    databaseDir: DB_DIR,
    port: PORT,
    user: USER,
    password: PASSWORD,
    persistent: true,
  });

  if (!fs.existsSync(DB_DIR)) {
    console.log("📦 A inicializar cluster de dados em .local-db...");
    await pg.initialise();
  }

  await pg.start();

  try {
    await pg.createDatabase(DATABASE_NAME);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (!message.includes("already exists")) {
      console.log(`Nota DB: ${message}`);
    }
  }

  console.log(`✅ PostgreSQL iniciado com sucesso em 127.0.0.1:${PORT}`);
  return pg;
}

async function main() {
  console.log("==================================================");
  console.log("🚀 A preparar ambiente de desenvolvimento KUBIKA...");
  console.log("==================================================");

  // 1. Libertar porta 3000 de processos órfãos se existirem
  freePort(3000);

  // 2. Garantir que o banco de dados está a correr
  let pgInstance: any = null;
  try {
    pgInstance = await startDatabaseIfNeeded();
  } catch (err) {
    console.warn("⚠️ Aviso ao verificar banco local:", err);
  }

  console.log("==================================================");
  console.log("▲ A iniciar servidor Next.js...");
  console.log("==================================================\n");

  // 3. Iniciar Next.js
  const nextDev = spawn("npx", ["next", "dev"], {
    stdio: "inherit",
    shell: true,
  });

  const cleanup = async () => {
    console.log("\n🛑 A encerrar servidor de desenvolvimento...");
    try {
      nextDev.kill();
    } catch {}
    if (pgInstance) {
      try {
        console.log("🛑 A encerrar PostgreSQL...");
        await pgInstance.stop();
      } catch {}
    }
    process.exit(0);
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);

  nextDev.on("close", (code) => {
    if (pgInstance) {
      pgInstance.stop().finally(() => process.exit(code ?? 0));
    } else {
      process.exit(code ?? 0);
    }
  });
}

main().catch((err) => {
  console.error("❌ Erro ao iniciar:", err);
  process.exit(1);
});
