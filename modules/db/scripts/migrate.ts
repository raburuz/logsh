import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "../db";

const runMigrations = async () => {
  try {
    console.log("Starting migrations...");
    
    await migrate(db, {
      migrationsFolder: "drizzle",
    });

    console.log("✓ Migrations completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error(
      "✗ Error during migration:",
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
};

runMigrations();