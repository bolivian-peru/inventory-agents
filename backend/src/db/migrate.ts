import { readdir, readFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import postgres from "postgres";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function runMigrations() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }

  const sql = postgres(databaseUrl);
  const migrationsDir = join(__dirname, "migrations");

  console.log("Running migrations...");

  try {
    // Get all .sql files sorted by name
    const files = (await readdir(migrationsDir))
      .filter((f) => f.endsWith(".sql"))
      .sort();

    for (const file of files) {
      console.log(`  → ${file}`);
      const sqlContent = await readFile(join(migrationsDir, file), "utf-8");

      try {
        await sql.unsafe(sqlContent);
        console.log(`    ✓ Applied`);
      } catch (e: unknown) {
        const error = e as { message?: string };
        // Ignore "already exists" errors for idempotency
        if (error.message?.includes("already exists")) {
          console.log(`    ⊘ Already applied`);
        } else {
          throw e;
        }
      }
    }

    console.log("\n✓ All migrations complete");
  } catch (e) {
    console.error("Migration failed:", e);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

runMigrations();
