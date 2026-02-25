import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "../db";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("✗ DATABASE_URL environment variable is not set.");
  process.exit(1);
}

const runMigrations = async () => {
  try {
    console.log("Starting migrations...");
    
    await migrate(db, {
      migrationsFolder: "drizzle",      
      migrationsSchema: "public", // Optional: specify a custom schema for the migrations table
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