import { defineConfig } from 'drizzle-kit'
import { isProduction } from '../shared/utils/constraint';

const config = defineConfig({
  schema: ["./modules/db/schemas/*.ts"],
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
    //ssl: isProduction ? 'verify-full' : false
  },
  strict: true, // Enable strict mode for better type safety
  verbose: true, // Enable verbose logging for better insights during development
  breakpoints: true, // Enable breakpoints for better debugging
  migrations: {
    table: "drizzle_migrations", // Optional: specify a custom name for the migrations table
    schema: "drizzle" // Optional: specify a custom schema for the migrations table
  }
})


export default config; 