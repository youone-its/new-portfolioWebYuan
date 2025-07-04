import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/*.ts",       // glob pattern bener
  dialect: "mysql",             // ← ganti ini!
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
