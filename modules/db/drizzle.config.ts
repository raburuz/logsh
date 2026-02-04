import { defineConfig } from 'drizzle-kit'

const config = defineConfig({
  schema: ["./modules/db/schemas/*.ts"],
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  }
})


export default config; 