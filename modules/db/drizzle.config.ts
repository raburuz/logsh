import { defineConfig } from 'drizzle-kit'

const config = defineConfig({
  schema: ["./modules/db/schemas/*.ts"],
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
  strict: true, // Enable strict mode for better type safety
  verbose: true, // Enable verbose logging for better insights during development
  breakpoints: true, // Enable breakpoints for better debugging
})


export default config; 