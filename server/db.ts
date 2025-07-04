import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "../shared/schema";
import dotenv from "dotenv";

dotenv.config();

// Buat koneksi pool ke MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Export db instance
export const db = drizzle(pool, {
  schema,
  mode: "default", // <== WAJIB kalau pakai schema
});
